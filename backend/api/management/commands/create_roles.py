from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from ...models import Note


class Command(BaseCommand):
    def handle(self, *args, **options):
        note_content_type = ContentType.objects.get_for_model(Note)
        view_note = Permission.objects.get(
            codename="view_note",
            content_type=note_content_type,
        )

        delete_note = Permission.objects.get(
            codename="delete_note",
            content_type=note_content_type,
        )

        create_note = Permission.objects.get(
            codename="add_note",
            content_type=note_content_type,
        )

        CEO, _ = Group.objects.get_or_create(name="ceo")
        CEO.permissions.set([view_note, delete_note, create_note])

        BOARD, _ = Group.objects.get_or_create(name="board")
        BOARD.permissions.set([view_note, delete_note])

        HR, _ = Group.objects.get_or_create(name="hr")
        HR.permissions.set([view_note])

        HEAD_CAREGIVER, _ = Group.objects.get_or_create(name="head caregiver")
        HEAD_CAREGIVER.permissions.set([view_note])

        CAREGIVER, _ = Group.objects.get_or_create(name="caregiver")
        CAREGIVER.permissions.set([view_note])

        VOLUNTEER, _ = Group.objects.get_or_create(name="volunteer")
        VOLUNTEER.permissions.set([view_note])
