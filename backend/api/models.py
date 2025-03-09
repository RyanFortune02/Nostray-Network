from django.db import models
from django.contrib.auth.models import User
from django.forms import ValidationError
from rest_framework.permissions import DjangoModelPermissions
from .taxonomic_hierarchy import TaxonomicHierarchy
from .taxonomic_classes import (
    eTaxonomicDomain,
    eTaxonomicKingdom,
    eTaxonomicPhylum,
    eTaxonomicClass,
    eTaxonomicOrder,
    eTaxonomicFamily,
    eTaxonomicGenus,
)


# Create your models here.
class StrictPermissions(DjangoModelPermissions):
    """
    An extension of the DjangoModelPermissions which requires users to be
    authenticated and have the appropriate permissions to perform actions on
    a given model.

    Permissions are required for GET, POST, PUT, PATCH, and DELETE actions.
    """

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


class UserStatus(models.TextChoices):
    ACTIVE = "active"
    INACTIVE = "inactive"
    TEMPORARY_LEAVE = "temporary leave"


class VolunteerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True, null=True)
    hobbies = models.TextField(blank=True, null=True)
    town = models.CharField(max_length=100, blank=True, null=True)
    image_url = models.URLField(max_length=255, blank=True, null=True)
    status = models.CharField(
        max_length=50, choices=UserStatus.choices, default=UserStatus.ACTIVE
    )


class AnimalStatus(models.TextChoices):
    HEALTHY = "healthy"
    SICK = "sick"
    ADOPTED = "adopted"


class TaxonomicRank(models.Model):
    domain = models.CharField(max_length=50, choices=eTaxonomicDomain.choices)
    kingdom = models.CharField(max_length=50, choices=eTaxonomicKingdom.choices)
    phylum = models.CharField(max_length=50, choices=eTaxonomicPhylum.choices)
    class_field = models.CharField(max_length=50, choices=eTaxonomicClass.choices)
    order = models.CharField(max_length=50, choices=eTaxonomicOrder.choices)
    family = models.CharField(max_length=50, choices=eTaxonomicFamily.choices)
    genus = models.CharField(max_length=50, choices=eTaxonomicGenus.choices)
    species = models.CharField(max_length=255)

    def clean(self):
        super().clean()
        valid_kingdoms = TaxonomicHierarchy().TAXONOMIC_HIERARCHY.get(self.domain, {})
        if self.kingdom not in valid_kingdoms:
            raise ValidationError(
                f"Kingdom must be one of {list(valid_kingdoms.keys())} for domain {self.domain}."
            )

        valid_phyla = valid_kingdoms.get(self.kingdom, {})
        if self.phylum not in valid_phyla:
            raise ValidationError(
                f"Phylum must be one of {list(valid_phyla.keys())} for kingdom {self.kingdom}."
            )

        valid_classes = valid_phyla.get(self.phylum, {})
        if self.class_field not in valid_classes:
            raise ValidationError(
                f"Class must be one of {list(valid_classes.keys())} for phylum {self.phylum}."
            )

        valid_orders = valid_classes.get(self.class_field, {})
        if self.order not in valid_orders:
            raise ValidationError(
                f"Order must be one of {list(valid_orders.keys())} for class {self.class_field}."
            )

        valid_families = valid_orders.get(self.order, {})
        if self.family not in valid_families:
            raise ValidationError(
                f"Family must be one of {list(valid_families.keys())} for order {self.order}."
            )

        valid_genera = valid_families.get(self.family, [])
        if self.genus not in valid_genera:
            raise ValidationError(
                f"Genus must be one of {valid_genera} for family {self.family}."
            )

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


class Animal(models.Model):
    name = models.CharField(max_length=255)
    type = models.ForeignKey(TaxonomicRank, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=50, choices=AnimalStatus.choices, default=AnimalStatus.HEALTHY
    )
    caregiver = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True
    )
    date_added = models.DateTimeField(auto_now_add=True)


class Message(models.Model):
    sender = models.ForeignKey(
        User, related_name="sent_messages", on_delete=models.CASCADE
    )
    receiver = models.ForeignKey(
        User, related_name="received_messages", on_delete=models.CASCADE
    )
    subject = models.CharField(max_length=255)
    body = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)


class NewsType(models.TextChoices):
    NEWS = "news"
    EVENT = "event"
    ANNOUNCEMENT = "announcement"
    BLOG = "blog"
    OTHER = "other"


class News(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    date_posted = models.DateTimeField(auto_now_add=True)
    type = models.CharField(
        max_length=50, choices=NewsType.choices, blank=True, null=True
    )
    animal = models.ForeignKey(Animal, on_delete=models.SET_NULL, null=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
