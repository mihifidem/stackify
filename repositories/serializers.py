from rest_framework import serializers

from .models import (
    Project,
    Repository,
    Resource,
    ResourceVersion,
)


class ResourceVersionSerializer(serializers.ModelSerializer):

    class Meta:
        model = ResourceVersion

        fields = [
            "id",
            "resource",
            "version_number",
            "file",
            "original_filename",
            "notes",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
        ]


class ResourceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Resource

        fields = [
            "id",
            "project",
            "name",
            "slug",
            "resource_type",
            "description",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]


class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project

        fields = [
            "id",
            "repository",
            "title",
            "slug",
            "project_type",
            "description",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]


class RepositorySerializer(serializers.ModelSerializer):

    owner_username = serializers.CharField(
        source="owner.username",
        read_only=True,
    )

    class Meta:
        model = Repository

        fields = [
            "id",
            "owner",
            "owner_username",
            "name",
            "slug",
            "description",
            "visibility",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]