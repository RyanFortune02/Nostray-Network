from django.contrib.auth.models import User, Group
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer, NoteSerializer
from .models import Note, StrictPermissions


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
        Gets all notes by the user (if they are allowed to).
        """
        user = self.request.user
        return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            # default serializer will not include author as it is read only
            # SO we need to manually add the author to the serializer
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [StrictPermissions]

    def get_queryset(self):
        """
        Gets all notes by the user (if they are allowed to).
        """
        user = self.request.user
        return Note.objects.filter(author=user)


class CreateUserView(generics.CreateAPIView):
    # List of all User objects so that we don't create duplicate users
    queryset = User.objects.all()
    serializer_class = UserSerializer

    # Anyone can register as a Volunteer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        response = self.create(request, *args, **kwargs)
        new_user = User.objects.get_by_natural_key(response.data["username"])
        new_user.groups.set([eUserRoles.VOLUNTEER])
        return response
