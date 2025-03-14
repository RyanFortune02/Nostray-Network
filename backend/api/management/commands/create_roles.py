from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from ...models import Note, VolunteerProfile, Animal, News, Message


class Command(BaseCommand):
    """
    Command to create roles and assign permissions to them.
    If you want to modify the permissions, this is the best
    place to do it.

    Usage:
        python manage.py create_roles
    """

    def handle(self, *args, **options):

        # Profile permissions
        profile_content_type = ContentType.objects.get_for_model(VolunteerProfile)
        view_profile = Permission.objects.get(
            codename="view_volunteerprofile",
            content_type=profile_content_type,
        )
        add_profile = Permission.objects.get(
            codename="add_volunteerprofile",
            content_type=profile_content_type,
        )
        change_profile = Permission.objects.get(
            codename="change_volunteerprofile",
            content_type=profile_content_type,
        )
        delete_profile = Permission.objects.get(
            codename="delete_volunteerprofile",
            content_type=profile_content_type,
        )

        # Note permissions
        note_content_type = ContentType.objects.get_for_model(Note)
        view_note = Permission.objects.get(
            codename="view_note",
            content_type=note_content_type,
        )
        add_note = Permission.objects.get(
            codename="add_note",
            content_type=note_content_type,
        )
        change_note = Permission.objects.get(
            codename="change_note",
            content_type=note_content_type,
        )
        delete_note = Permission.objects.get(
            codename="delete_note",
            content_type=note_content_type,
        )

        # Note permissions by board
        ## CEO
        ceo_view_note = Permission.objects.get(
            codename="ceo_view_note", content_type=note_content_type
        )
        ceo_add_note = Permission.objects.get(
            codename="ceo_add_note", content_type=note_content_type
        )
        ceo_delete_note = Permission.objects.get(
            codename="ceo_delete_note", content_type=note_content_type
        )

        ## HR
        hr_view_note = Permission.objects.get(
            codename="hr_view_note", content_type=note_content_type
        )
        hr_add_note = Permission.objects.get(
            codename="hr_add_note", content_type=note_content_type
        )
        hr_delete_note = Permission.objects.get(
            codename="hr_delete_note", content_type=note_content_type
        )

        ## Board of Directors
        board_view_note = Permission.objects.get(
            codename="board_view_note", content_type=note_content_type
        )
        board_add_note = Permission.objects.get(
            codename="board_add_note", content_type=note_content_type
        )
        board_delete_note = Permission.objects.get(
            codename="board_delete_note", content_type=note_content_type
        )

        ## Volunteers
        volunteer_view_note = Permission.objects.get(
            codename="volunteer_view_note", content_type=note_content_type
        )
        volunteer_add_note = Permission.objects.get(
            codename="volunteer_add_note", content_type=note_content_type
        )
        volunteer_delete_note = Permission.objects.get(
            codename="volunteer_delete_note", content_type=note_content_type
        )

        # Animal permissions
        animal_content_type = ContentType.objects.get_for_model(Animal)
        view_animal = Permission.objects.get(
            codename="view_animal",
            content_type=animal_content_type,
        )
        add_animal = Permission.objects.get(
            codename="add_animal",
            content_type=animal_content_type,
        )
        change_animal = Permission.objects.get(
            codename="change_animal",
            content_type=animal_content_type,
        )
        delete_animal = Permission.objects.get(
            codename="delete_animal",
            content_type=animal_content_type,
        )

        # News permissions
        news_content_type = ContentType.objects.get_for_model(News)
        view_news = Permission.objects.get(
            codename="view_news", content_type=news_content_type
        )
        add_news = Permission.objects.get(
            codename="add_news", content_type=news_content_type
        )
        change_news = Permission.objects.get(
            codename="change_news", content_type=news_content_type
        )
        delete_news = Permission.objects.get(
            codename="delete_news", content_type=news_content_type
        )

        # Message permissions
        message_content_type = ContentType.objects.get_for_model(Message)
        view_message = Permission.objects.get(
            codename="view_message", content_type=message_content_type
        )
        add_message = Permission.objects.get(
            codename="add_message", content_type=message_content_type
        )
        change_message = Permission.objects.get(
            codename="change_message", content_type=message_content_type
        )
        delete_message = Permission.objects.get(
            codename="delete_message", content_type=message_content_type
        )

        # Set permissions per role
        CEO, _ = Group.objects.get_or_create(name="ceo")
        CEO.permissions.set(
            [
                # General note permissions
                view_note,
                add_note,
                change_note,
                delete_note,
                
                # Board-specific note permissions for CEO
                ceo_view_note,
                ceo_add_note,
                ceo_delete_note,
                hr_view_note,
                hr_add_note,
                hr_delete_note,
                board_view_note,
                board_add_note,
                board_delete_note,
                volunteer_view_note,
                volunteer_add_note,
                volunteer_delete_note,
                
                # Other model permissions
                view_animal,
                add_animal,
                change_animal,
                delete_animal,
                view_news,
                add_news,
                change_news,
                delete_news,
                view_message,
                add_message,
                change_message,
                delete_message,
            ]
        )

        BOARD, _ = Group.objects.get_or_create(name="board")
        BOARD.permissions.set(
            [
                view_note,
                delete_note,
                # Board-specific permissions
                board_view_note,
                board_add_note,
                board_delete_note,
                # Other permissions
                view_animal,
                view_news,
                add_news,
                view_message,
                add_message,
            ]
        )

        HR, _ = Group.objects.get_or_create(name="hr")
        HR.permissions.set(
            [
                view_note,
                add_note,  # Added general note creation permission
                # HR-specific permissions
                hr_view_note,
                hr_add_note,
                hr_delete_note,
                # Other permissions
                view_animal,
                view_news,
                view_message,
                add_message,
            ]
        )

        HEAD_CAREGIVER, _ = Group.objects.get_or_create(name="head caregiver")
        HEAD_CAREGIVER.permissions.set(
            [
                view_note,
                # Animal care permissions
                view_animal,
                add_animal,
                change_animal,
                view_news,
                add_news,
                change_news,
                view_message,
                add_message,
            ]
        )

        CAREGIVER, _ = Group.objects.get_or_create(name="caregiver")
        CAREGIVER.permissions.set(
            [
                view_note,
                view_animal,
                change_animal,
                view_news,
                add_news,
                view_message,
                add_message,
            ]
        )

        VOLUNTEER, _ = Group.objects.get_or_create(name="volunteer")
        VOLUNTEER.permissions.set(
            [
                view_note,
                # Volunteer-specific permissions
                volunteer_view_note,
                volunteer_add_note,
                volunteer_delete_note,
                # Profile permissions
                view_profile,
                add_profile,
                change_profile,
                # Other permissions
                view_animal,
                view_news,
                view_message,
                add_message,
                change_message,
                delete_message,
            ]
        )
