from django.contrib.auth.models import User, Group
from django.db import models
from django.db.models import Sum
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .taxonomic_hierarchy import TaxonomicHierarchy
from .serializers import (
    UserSerializer,
    NoteSerializer,
    NewsSerializer,
    AnimalSerializer,
    VolunteerProfileSerializer,
    MessageSerializer,
    DonationSerializer,
    ExpensesSerializer,
)
from .models import (
    Note,
    StrictPermissions,
    News,
    Animal,
    VolunteerProfile,
    NewsType,
    AnimalStatus,
    UserStatus,
    Message,
    Donation,
    Expenses,
)
from django.utils import timezone
from dateutil.relativedelta import relativedelta
from django.db.models.functions import TruncMonth
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth.hashers import check_password


class eUserRoles:
    CEO, _ = Group.objects.get_or_create(name="ceo")
    BOARD, _ = Group.objects.get_or_create(name="board")
    HR, _ = Group.objects.get_or_create(name="hr")
    HEAD_CAREGIVER, _ = Group.objects.get_or_create(name="head caregiver")
    CAREGIVER, _ = Group.objects.get_or_create(name="caregiver")
    VOLUNTEER, _ = Group.objects.get_or_create(name="volunteer")


# View to get user roles
class UserRolesView(APIView):
    """API endpoint that returns the roles (groups) of the authenticated user."""

    def get(self, request):
        """Get all group names for the authenticated user."""
        user = request.user
        roles = [group.name for group in user.groups.all()]
        return Response({"roles": roles})


class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer

    # Checks for authentication AND permissions
    permission_classes = [StrictPermissions]

    def get_queryset(self):
        """
        Gets notes user has permission to view.
        """
        user = self.request.user
        queryset = Note.objects.none()

        for note in Note.objects.all():
            if not note.boards:
                if user.has_perm("api.view_note"):
                    queryset |= Note.objects.filter(id=note.id)
            elif Note.check_board_permissions(user, "view", note.boards):
                queryset |= Note.objects.filter(id=note.id)

        return queryset.distinct()

    def perform_create(self, serializer):
        if not serializer.is_valid():
            print(serializer.errors)
            return

        boards = serializer.validated_data.get("boards", [])
        if boards and not Note.check_board_permissions(
            self.request.user, "add", boards
        ):
            raise PermissionError(
                "You don't have permission to post to one or more of these boards"
            )

        serializer.save(author=self.request.user)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [StrictPermissions]

    def get_queryset(self):
        """
        Gets notes the user has permission to delete.
        """
        user = self.request.user
        queryset = Note.objects.none()

        for note in Note.objects.all():
            if not note.boards:
                if user.has_perm("api.delete_note"):
                    queryset |= Note.objects.filter(id=note.id)
            elif Note.check_board_permissions(user, "delete", note.boards):
                queryset |= Note.objects.filter(id=note.id)

        return queryset.distinct()


class CreateUserView(generics.CreateAPIView):
    # List of all User objects so that we don't create duplicate users
    queryset = User.objects.all()
    serializer_class = UserSerializer

    # Anyone can register as a Volunteer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        response = self.create(request, *args, **kwargs)
        return response

    def perform_create(self, serializer):
        user = serializer.save()
        user.groups.set([eUserRoles.VOLUNTEER])
        return user


class ManageUserView(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint for managing users. Only CEO and HR can manage users.
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [StrictPermissions]

    def get_queryset(self):
        """
        Only return users that can be managed by the current user.
        """

        perms_map = {
            "GET": ["auth.view_user"],
            "PUT": ["auth.change_user"],
            "PATCH": ["auth.change_user"],
            "DELETE": ["auth.delete_user"],
        }

        user = self.request.user
        if user.has_perms(perms_map[self.request.method]):
            return User.objects.all()
        return User.objects.none()


class TaxonomicRankChoicesView(APIView):
    """
    Returns valid choices for a specific taxonomic rank.
    """

    permission_classes = [AllowAny]
    RANK_ORDER = [
        "domain",
        "kingdom",
        "phylum",
        "class_field",
        "order",
        "family",
        "genus",
    ]

    def get(self, request):
        """
        Get valid choices for requested rank.
        """
        params = {}
        for rank in self.RANK_ORDER:
            value = request.query_params.get(rank)
            if value:
                params[rank] = value

        try:
            current = TaxonomicHierarchy().TAXONOMIC_HIERARCHY
            for rank in self.RANK_ORDER:
                if rank in params:
                    if params[rank] == "Other":
                        return Response({"choices": ["Other"]})
                    elif params[rank] not in current:
                        return Response({"choices": ["Other"]})
                    current = current[params[rank]]
                else:
                    if isinstance(current, (set, list)):
                        choices = list(current)
                        if not choices:
                            return Response({"choices": ["Other"]})
                        if "Other" not in choices:
                            choices.insert(0, "Other")
                        return Response({"choices": choices})

                    if isinstance(current, dict):
                        choices = list(current.keys())
                        if "Other" not in choices:
                            choices.insert(0, "Other")
                        return Response({"choices": choices})
                    return Response({"choices": ["Other"]})

            return Response({"choices": ["Other"]})

        except Exception as e:
            return Response({"error": str(e)}, status=500)


class NewsListCreate(generics.ListCreateAPIView):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    permission_classes = [StrictPermissions]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class NewsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    permission_classes = [StrictPermissions]


class AnimalListCreate(generics.ListCreateAPIView):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer
    permission_classes = [StrictPermissions]


class AnimalDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer
    permission_classes = [StrictPermissions]


class VolunteerProfileDetail(generics.RetrieveUpdateAPIView):
    serializer_class = VolunteerProfileSerializer
    permission_classes = [StrictPermissions]
    queryset = VolunteerProfile.objects.all()

    def get_object(self):
        user_id = self.kwargs.get('user_id')
        if user_id:
            return self.queryset.get(user_id=user_id)
        return self.queryset.get(user=self.request.user)


class VolunteerProfileList(generics.ListAPIView):
    """API endpoint that returns all volunteer profiles."""

    queryset = VolunteerProfile.objects.select_related("user").all()
    serializer_class = VolunteerProfileSerializer
    permission_classes = [StrictPermissions]


class ChoicesView(APIView):
    """
    Base view for returning model choices.
    """

    permission_classes = [StrictPermissions]
    choices = None

    def get(self, request):
        return Response({"choices": [value for _, value in self.choices.choices]})


class NewsTypeChoicesView(ChoicesView):
    choices = NewsType


class AnimalStatusChoicesView(ChoicesView):
    choices = AnimalStatus


class UserStatusChoicesView(ChoicesView):
    choices = UserStatus


class MessageListCreate(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [StrictPermissions]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(models.Q(sender=user) | models.Q(receiver=user))

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


class MessageDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MessageSerializer
    permission_classes = [StrictPermissions]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(models.Q(sender=user) | models.Q(receiver=user))


class DonationListCreate(generics.ListCreateAPIView):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        months = int(self.request.query_params.get("months", 1))
        start_date = timezone.now().replace(day=1) - relativedelta(months=months - 1)
        return Donation.objects.filter(timestamp__gte=start_date).order_by("-timestamp")


class ExpenseListCreate(generics.ListCreateAPIView):
    queryset = Expenses.objects.all()
    serializer_class = ExpensesSerializer
    permission_classes = [StrictPermissions]

    def get_queryset(self):
        months = int(self.request.query_params.get("months", 1))
        start_date = timezone.now().replace(day=1) - relativedelta(months=months - 1)
        return Expenses.objects.filter(timestamp__gte=start_date).order_by("-timestamp")


class FundsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Calculate total donations
        total_donations = Donation.objects.aggregate(total=Sum('usd_amount'))['total'] or 0
        
        # Calculate total expenses
        total_expenses = Expenses.objects.aggregate(total=Sum('usd_amount'))['total'] or 0
        
        # Calculate available funds
        available_funds = total_donations - total_expenses
        
        return Response({
            'total_donations': total_donations,
            'total_expenses': total_expenses,
            'available_funds': available_funds
        })


class ChangeOwnPasswordView(APIView):
    """
    View for users to change their own password after verifying current password.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        if not current_password or not new_password:
            return Response(
                {"error": "Both current_password and new_password are required"},
                status=400,
            )

        if not check_password(current_password, user.password):
            return Response({"error": "Current password is incorrect"}, status=400)

        user.set_password(new_password)
        user.save()
        return Response({"message": "Password changed successfully"})


class AdminChangePasswordView(APIView):
    """
    View for admins to change other users' passwords without verification.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        if not request.user.has_perm("auth.change_user"):
            raise PermissionDenied("You don't have permission to change user passwords")

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        new_password = request.data.get("new_password")
        if not new_password:
            return Response({"error": "new_password is required"}, status=400)

        user.set_password(new_password)
        user.save()
        return Response({"message": "Password changed successfully"})
