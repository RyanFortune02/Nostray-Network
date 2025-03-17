from django.contrib.auth.models import User
from rest_framework import serializers
from .models import (
    Note,
    News,
    Animal,
    VolunteerProfile,
    UserStatus,
    TaxonomicRank,
    Message,
    Donation,
    Expenses,
)

# Uses an ORM (Object RelationalMapping)- maps python objects to corresponding code that needs to be executed in the database
# JSON eqauals JavaScript Object Notation
# Serializers are used to convert complex data types, such as querysets and model instances, to native Python datatypes that can then be
# easily rendered into JSON, XML or other content types.


class UserBasicSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "roles", "date_joined"]

    def get_roles(self, obj):
        return [group.name for group in obj.groups.all()]


class VolunteerProfileSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer()

    class Meta:
        model = VolunteerProfile
        fields = ["user", "bio", "hobbies", "town", "image_url", "status"]


class UserSerializer(serializers.ModelSerializer):
    # Nested profile data
    bio = serializers.CharField(write_only=True)
    hobbies = serializers.CharField(write_only=True)
    town = serializers.CharField(write_only=True)
    image_url = serializers.URLField(write_only=True, required=False)
    status = serializers.CharField(write_only=True, default=UserStatus.ACTIVE)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "bio",
            "hobbies",
            "town",
            "image_url",
            "status",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": True},
        }  # Want to accept password but not return it

    def create(self, validated_data):
        profile_fields = {
            "bio": validated_data.pop("bio"),
            "hobbies": validated_data.pop("hobbies"),
            "town": validated_data.pop("town"),
            "image_url": validated_data.pop("image_url", None),
            "status": validated_data.pop("status", UserStatus.ACTIVE),
        }

        user = User.objects.create_user(**validated_data)

        VolunteerProfile.objects.create(user=user, **profile_fields)
        return user


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "author", "boards", "created_at"]
        extra_kwargs = {
            "author": {"read_only": True}
        }  # should be able to read author but not write it (based on account/user)


class NewsSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source="author.username")

    class Meta:
        model = News
        fields = ["id", "title", "content", "date_posted", "type", "animal", "author"]


class TaxonomicRankSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxonomicRank
        fields = [
            "domain",
            "kingdom",
            "phylum",
            "class_field",
            "order",
            "family",
            "genus",
            "species",
        ]


class AnimalSerializer(serializers.ModelSerializer):
    type = TaxonomicRankSerializer()

    class Meta:
        model = Animal
        fields = [
            "id",
            "name",
            "type",
            "status",
            "caregiver",
            "date_added",
            "needs_review",
        ]

    def create(self, validated_data):
        type_data = validated_data.pop("type")
        taxonomic_rank, _ = TaxonomicRank.objects.get_or_create(**type_data)
        animal = Animal.objects.create(type=taxonomic_rank, **validated_data)
        return animal

    def update(self, instance, validated_data):
        if "type" in validated_data:
            type_data = validated_data.pop("type")
            taxonomic_rank, _ = TaxonomicRank.objects.get_or_create(**type_data)
            instance.type = taxonomic_rank
        return super().update(instance, validated_data)


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.ReadOnlyField(source="sender.username")
    receiver = UserBasicSerializer()

    class Meta:
        model = Message
        fields = ["id", "sender", "receiver", "subject", "body", "timestamp"]
        extra_kwargs = {"timestamp": {"read_only": True}}


class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = ["id", "donor_name", "usd_amount", "timestamp"]
        extra_kwargs = {"timestamp": {"read_only": True}}


class ExpensesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expenses
        fields = ["id", "usd_amount", "timestamp"]
        extra_kwargs = {"timestamp": {"read_only": True}}


class MonthlyFundsSerializer(serializers.Serializer):
    month = serializers.DateTimeField(source="month")
    total = serializers.IntegerField()
