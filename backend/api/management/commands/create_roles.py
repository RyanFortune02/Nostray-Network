from django.db.models import Model
from enum import Enum
from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission, User
from django.contrib.contenttypes.models import ContentType
from ...models import Note, VolunteerProfile, Animal, News, Message, Expenses


class ePermissionType(Enum):
    """
    Standard Django model permission types.

    This enum maps to Django's default permission types that are automatically
    created for each model. The values correspond to indices in permission lists
    returned by _get_permissions().

    Attributes:
        VIEW (0): Permission to view/read model instances
        ADD (1): Permission to create new model instances
        CHANGE (2): Permission to modify existing model instances
        DELETE (3): Permission to remove model instances

    Usage:
        permissions[ePermissionType.VIEW.value]  # Gets view permission from list
    """

    VIEW = 0
    ADD = 1
    CHANGE = 2
    DELETE = 3


class Command(BaseCommand):
    """
    Command to create roles and assign permissions to them.
    If you want to modify the permissions, this is the best
    place to do it.

    Usage:
        python manage.py create_roles
    """

    def handle(self, *args, **options):
        def _get_permissions(model: type[Model], prefix: str = "") -> list[Permission]:
            """
            Gets Django model permissions with optional prefix.

            Retrieves the standard Django permissions (view, add, change, delete) for a model.
            When a prefix is provided, it looks for custom permissions defined in the model's
            Meta class that start with that prefix.

            The standard permissions are created automatically by Django for all models.
            Custom prefixed permissions (e.g. "ceo_view_note") must be explicitly defined
            in the model's Meta class permissions list.

            Args:
                model: The model class to get permissions for
                prefix: Optional prefix for custom model permissions (e.g. "ceo" for "ceo_view_note")

            Returns:
                list: Permission objects in order [view, add, change, delete], with None for
                    any permissions that don't exist

            Example:
                >>> _get_permissions(Note, "ceo")
                [<Permission: api.ceo_view_note>, <Permission: api.ceo_add_note>, ...]
            """
            content_type: ContentType = ContentType.objects.get_for_model(model)

            if prefix != "" and prefix[-1] != "_":
                prefix = prefix + "_"

            permissions: list[Permission] = [None, None, None, None]

            for permission_type in ePermissionType:
                codename: str = (
                    prefix + permission_type.name.lower() + "_" + model._meta.model_name
                )

                try:
                    permission: Permission = Permission.objects.get(
                        codename=codename,
                        content_type=content_type,
                    )
                    permissions[permission_type.value] = permission
                    print(f"Found permission: {codename}")
                except Permission.DoesNotExist:
                    print(f"Permission {codename} does not exist - skipping")
                    continue
            return permissions

        # Profile permissions
        profile_permissions = _get_permissions(VolunteerProfile)

        # Note permissions
        note_permissions = _get_permissions(Note)

        # Note permissions by board
        ## CEO
        ceo_note_permissions = _get_permissions(Note, "ceo")

        ## HR
        hr_note_permissions = _get_permissions(Note, "hr")

        ## Board of Directors
        board_note_permissions = _get_permissions(Note, "board")

        ## Volunteers
        volunteer_note_permissions = _get_permissions(Note, "volunteer")

        # Animal permissions
        animal_permissions = _get_permissions(Animal)

        # News permissions
        news_permissions = _get_permissions(News)

        # Message permissions
        message_permissions = _get_permissions(Message)

        # Expense permissions
        expense_permissions = _get_permissions(Expenses)

        # Add User model permissions
        user_permissions = _get_permissions(User)

        # Set permissions per role
        CEO, _ = Group.objects.get_or_create(name="ceo")
        CEO.permissions.set(
            [
                # User management permissions
                user_permissions[ePermissionType.VIEW.value],
                user_permissions[ePermissionType.ADD.value],
                user_permissions[ePermissionType.CHANGE.value],
                user_permissions[ePermissionType.DELETE.value],
                # General note permissions
                note_permissions[ePermissionType.VIEW.value],
                note_permissions[ePermissionType.ADD.value],
                note_permissions[ePermissionType.CHANGE.value],
                note_permissions[ePermissionType.DELETE.value],
                # Board-specific note permissions for CEO
                ceo_note_permissions[ePermissionType.VIEW.value],
                ceo_note_permissions[ePermissionType.ADD.value],
                ceo_note_permissions[ePermissionType.DELETE.value],
                hr_note_permissions[ePermissionType.VIEW.value],
                hr_note_permissions[ePermissionType.ADD.value],
                hr_note_permissions[ePermissionType.DELETE.value],
                board_note_permissions[ePermissionType.VIEW.value],
                board_note_permissions[ePermissionType.ADD.value],
                board_note_permissions[ePermissionType.DELETE.value],
                volunteer_note_permissions[ePermissionType.VIEW.value],
                volunteer_note_permissions[ePermissionType.ADD.value],
                volunteer_note_permissions[ePermissionType.DELETE.value],
                # Animal permissions
                animal_permissions[ePermissionType.VIEW.value],
                animal_permissions[ePermissionType.ADD.value],
                animal_permissions[ePermissionType.CHANGE.value],
                animal_permissions[ePermissionType.DELETE.value],
                # News permissions
                news_permissions[ePermissionType.VIEW.value],
                news_permissions[ePermissionType.ADD.value],
                news_permissions[ePermissionType.CHANGE.value],
                news_permissions[ePermissionType.DELETE.value],
                # Message permissions
                message_permissions[ePermissionType.VIEW.value],
                message_permissions[ePermissionType.ADD.value],
                message_permissions[ePermissionType.CHANGE.value],
                message_permissions[ePermissionType.DELETE.value],
                # Expense permissions
                expense_permissions[ePermissionType.VIEW.value],
                expense_permissions[ePermissionType.ADD.value],
                expense_permissions[ePermissionType.CHANGE.value],
                expense_permissions[ePermissionType.DELETE.value],
            ]
        )

        BOARD, _ = Group.objects.get_or_create(name="board")
        BOARD.permissions.set(
            [
                # General note permissions
                note_permissions[ePermissionType.VIEW.value],
                note_permissions[ePermissionType.DELETE.value],
                note_permissions[ePermissionType.ADD.value],
                note_permissions[ePermissionType.CHANGE.value],
                # Board-specific note permissions
                board_note_permissions[ePermissionType.VIEW.value],
                board_note_permissions[ePermissionType.ADD.value],
                board_note_permissions[ePermissionType.DELETE.value],
                # Animal permissions
                animal_permissions[ePermissionType.VIEW.value],
                # News permissions
                news_permissions[ePermissionType.VIEW.value],
                news_permissions[ePermissionType.ADD.value],
                # Message permissions
                message_permissions[ePermissionType.VIEW.value],
                message_permissions[ePermissionType.ADD.value],
            ]
        )

        HR, _ = Group.objects.get_or_create(name="hr")
        HR.permissions.set(
            [
                # User management permissions
                user_permissions[ePermissionType.VIEW.value],
                user_permissions[ePermissionType.ADD.value],
                user_permissions[ePermissionType.CHANGE.value],
                user_permissions[ePermissionType.DELETE.value],
                # General note permissions
                note_permissions[ePermissionType.VIEW.value],
                note_permissions[ePermissionType.ADD.value],
                note_permissions[ePermissionType.CHANGE.value],
                note_permissions[ePermissionType.DELETE.value],
                # HR-specific note permissions
                hr_note_permissions[ePermissionType.VIEW.value],
                hr_note_permissions[ePermissionType.ADD.value],
                hr_note_permissions[ePermissionType.DELETE.value],
                # Animal permissions
                animal_permissions[ePermissionType.VIEW.value],
                # News permissions
                news_permissions[ePermissionType.VIEW.value],
                # Message permissions
                message_permissions[ePermissionType.VIEW.value],
                message_permissions[ePermissionType.ADD.value],
            ]
        )

        HEAD_CAREGIVER, _ = Group.objects.get_or_create(name="head caregiver")
        HEAD_CAREGIVER.permissions.set(
            [
                # General note permissions
                note_permissions[ePermissionType.VIEW.value],
                note_permissions[ePermissionType.ADD.value],
                note_permissions[ePermissionType.CHANGE.value],
                note_permissions[ePermissionType.DELETE.value],
                # Volunteer board note permissions
                volunteer_note_permissions[ePermissionType.VIEW.value],
                volunteer_note_permissions[ePermissionType.ADD.value],
                volunteer_note_permissions[ePermissionType.DELETE.value],
                # Animal permissions
                animal_permissions[ePermissionType.VIEW.value],
                animal_permissions[ePermissionType.ADD.value],
                animal_permissions[ePermissionType.CHANGE.value],
                # News permissions
                news_permissions[ePermissionType.VIEW.value],
                news_permissions[ePermissionType.ADD.value],
                news_permissions[ePermissionType.CHANGE.value],
                # Message permissions
                message_permissions[ePermissionType.VIEW.value],
                message_permissions[ePermissionType.ADD.value],
            ]
        )

        CAREGIVER, _ = Group.objects.get_or_create(name="caregiver")
        CAREGIVER.permissions.set(
            [
                # General note permissions
                note_permissions[ePermissionType.VIEW.value],
                note_permissions[ePermissionType.ADD.value],
                note_permissions[ePermissionType.CHANGE.value],
                note_permissions[ePermissionType.DELETE.value],
                # Volunteer board note permissions
                volunteer_note_permissions[ePermissionType.VIEW.value],
                volunteer_note_permissions[ePermissionType.ADD.value],
                # Animal permissions
                animal_permissions[ePermissionType.VIEW.value],
                animal_permissions[ePermissionType.CHANGE.value],
                # News permissions
                news_permissions[ePermissionType.VIEW.value],
                news_permissions[ePermissionType.ADD.value],
                # Message permissions
                message_permissions[ePermissionType.VIEW.value],
                message_permissions[ePermissionType.ADD.value],
            ]
        )

        VOLUNTEER, _ = Group.objects.get_or_create(name="volunteer")
        VOLUNTEER.permissions.set(
            [
                # General note permissions
                note_permissions[ePermissionType.VIEW.value],
                note_permissions[ePermissionType.ADD.value],
                note_permissions[ePermissionType.CHANGE.value],
                note_permissions[ePermissionType.DELETE.value],
                # Volunteer board note permissions
                volunteer_note_permissions[ePermissionType.VIEW.value],
                volunteer_note_permissions[ePermissionType.ADD.value],
                volunteer_note_permissions[ePermissionType.DELETE.value],
                # Profile permissions
                profile_permissions[ePermissionType.VIEW.value],
                profile_permissions[ePermissionType.ADD.value],
                profile_permissions[ePermissionType.CHANGE.value],
                # Animal permissions
                animal_permissions[ePermissionType.VIEW.value],
                # News permissions
                news_permissions[ePermissionType.VIEW.value],
                # Message permissions
                message_permissions[ePermissionType.VIEW.value],
                message_permissions[ePermissionType.ADD.value],
                message_permissions[ePermissionType.CHANGE.value],
                message_permissions[ePermissionType.DELETE.value],
            ]
        )
