from django.db.models import Model
from enum import Enum
from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from ...models import Note, VolunteerProfile, Animal, News, Message


class ePermissionType(Enum):
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

        # Set permissions per role
        CEO, _ = Group.objects.get_or_create(name="ceo")
        CEO.permissions.set(
            [
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
                
                # Other model permissions
                animal_permissions[ePermissionType.VIEW.value],
                animal_permissions[ePermissionType.ADD.value],
                animal_permissions[ePermissionType.CHANGE.value],
                animal_permissions[ePermissionType.DELETE.value],
                news_permissions[ePermissionType.VIEW.value],
                news_permissions[ePermissionType.ADD.value],
                news_permissions[ePermissionType.CHANGE.value],
                news_permissions[ePermissionType.DELETE.value],
                message_permissions[ePermissionType.VIEW.value],
                message_permissions[ePermissionType.ADD.value],
                message_permissions[ePermissionType.CHANGE.value],
                message_permissions[ePermissionType.DELETE.value],
            ]
        )

        BOARD, _ = Group.objects.get_or_create(name="board")
        BOARD.permissions.set(
            [
                note_permissions[ePermissionType.VIEW.value],
                note_permissions[ePermissionType.DELETE.value],
                note_permissions[ePermissionType.ADD.value],
                note_permissions[ePermissionType.CHANGE.value],
                board_note_permissions[ePermissionType.VIEW.value],
                board_note_permissions[ePermissionType.ADD.value],
                board_note_permissions[ePermissionType.DELETE.value],
                animal_permissions[ePermissionType.VIEW.value],
                news_permissions[ePermissionType.VIEW.value],
                news_permissions[ePermissionType.ADD.value],
                message_permissions[ePermissionType.VIEW.value],
                message_permissions[ePermissionType.ADD.value],
            ]
        )

        HR, _ = Group.objects.get_or_create(name="hr")
        HR.permissions.set(
            [
                note_permissions[ePermissionType.VIEW.value],
                hr_note_permissions[ePermissionType.VIEW.value],
                hr_note_permissions[ePermissionType.ADD.value],
                hr_note_permissions[ePermissionType.DELETE.value],
                animal_permissions[ePermissionType.VIEW.value],
                news_permissions[ePermissionType.VIEW.value],
                message_permissions[ePermissionType.VIEW.value],
                message_permissions[ePermissionType.ADD.value],
            ]
        )

        HEAD_CAREGIVER, _ = Group.objects.get_or_create(name="head caregiver")
        HEAD_CAREGIVER.permissions.set(
            [
                note_permissions[ePermissionType.VIEW.value],
                volunteer_note_permissions[ePermissionType.VIEW.value],
                volunteer_note_permissions[ePermissionType.ADD.value],
                volunteer_note_permissions[ePermissionType.DELETE.value],
                animal_permissions[ePermissionType.VIEW.value],
                animal_permissions[ePermissionType.ADD.value],
                animal_permissions[ePermissionType.CHANGE.value],
                news_permissions[ePermissionType.VIEW.value],
                news_permissions[ePermissionType.ADD.value],
                news_permissions[ePermissionType.CHANGE.value],
                message_permissions[ePermissionType.VIEW.value],
                message_permissions[ePermissionType.ADD.value],
            ]
        )

        CAREGIVER, _ = Group.objects.get_or_create(name="caregiver")
        CAREGIVER.permissions.set(
            [
                note_permissions[ePermissionType.VIEW.value],
                volunteer_note_permissions[ePermissionType.VIEW.value],
                volunteer_note_permissions[ePermissionType.ADD.value],
                animal_permissions[ePermissionType.VIEW.value],
                animal_permissions[ePermissionType.CHANGE.value],
                news_permissions[ePermissionType.VIEW.value],
                news_permissions[ePermissionType.ADD.value],
                message_permissions[ePermissionType.VIEW.value],
                message_permissions[ePermissionType.ADD.value],
            ]
        )

        VOLUNTEER, _ = Group.objects.get_or_create(name="volunteer")
        VOLUNTEER.permissions.set(
            [
                note_permissions[ePermissionType.VIEW.value],
                volunteer_note_permissions[ePermissionType.VIEW.value],
                volunteer_note_permissions[ePermissionType.ADD.value],
                profile_permissions[ePermissionType.VIEW.value],
                profile_permissions[ePermissionType.ADD.value],
                profile_permissions[ePermissionType.CHANGE.value],
                animal_permissions[ePermissionType.VIEW.value],
                news_permissions[ePermissionType.VIEW.value],
                message_permissions[ePermissionType.VIEW.value],
                message_permissions[ePermissionType.ADD.value],
                message_permissions[ePermissionType.CHANGE.value],
                message_permissions[ePermissionType.DELETE.value],
            ]
        )
