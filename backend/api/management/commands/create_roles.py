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
        CEO, _ = Group.objects.get_or_create(name="ceo")
        CEO.permissions.set(
            [
                view_note,
                delete_note,
                add_note,
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
                view_animal,
                view_news,
                add_news,
                view_message,
                add_message,
            ]
        )

        HR, _ = Group.objects.get_or_create(name="hr")
        HR.permissions.set(
            [view_note, view_animal, view_news, view_message, add_message]
        )

        HEAD_CAREGIVER, _ = Group.objects.get_or_create(name="head caregiver")
        HEAD_CAREGIVER.permissions.set(
            [
                view_note,
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
                view_profile,
                add_profile,
                change_profile,
                view_animal,
                view_news,
                view_message,
                add_message,
                change_message,
                delete_message,
            ]
        )
