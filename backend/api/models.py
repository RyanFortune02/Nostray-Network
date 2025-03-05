from django.db import models
from django.contrib.auth.models import User
from rest_framework.permissions import DjangoModelPermissions


# Create your models here.
class StrictPermissions(DjangoModelPermissions):
    perms_map = {
        "GET": ["%(app_label)s.view_%(model_name)s"],
        "OPTIONS": [],
        "HEAD": [],
        "POST": ["%(app_label)s.add_%(model_name)s"],
        "PUT": ["%(app_label)s.change_%(model_name)s"],
        "PATCH": ["%(app_label)s.change_%(model_name)s"],
        "DELETE": ["%(app_label)s.delete_%(model_name)s"],
    }


class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)

    # sets time when note is created
    created_at = models.DateTimeField(auto_now_add=True)

    # links note to user under a collection of notes,
    # using User.notes.all() will return all notes by that user
    # on_delete=models.CASCADE means that if the user is deleted,
    # all notes by that user will also be deleted
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return self.title
