from rest_framework import viewsets

from .models import (
    Project,
    Repository,
    Resource,
    ResourceVersion,
)

from .serializers import (
    ProjectSerializer,
    RepositorySerializer,
    ResourceSerializer,
    ResourceVersionSerializer,
)


class RepositoryViewSet(viewsets.ModelViewSet):
    queryset = Repository.objects.select_related("owner").all()
    serializer_class = RepositorySerializer

    filterset_fields = [
        "owner",
        "visibility",
    ]

    search_fields = [
        "name",
        "description",
        "owner__username",
    ]

    ordering_fields = [
        "name",
        "created_at",
        "updated_at",
    ]

    ordering = [
        "-updated_at",
    ]


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.select_related("repository").all()
    serializer_class = ProjectSerializer

    filterset_fields = [
        "repository",
        "project_type",
    ]

    search_fields = [
        "title",
        "description",
        "repository__name",
    ]

    ordering_fields = [
        "title",
        "created_at",
        "updated_at",
    ]

    ordering = [
        "-updated_at",
    ]


class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.select_related("project").all()
    serializer_class = ResourceSerializer

    filterset_fields = [
        "project",
        "resource_type",
    ]

    search_fields = [
        "name",
        "description",
        "project__title",
    ]

    ordering_fields = [
        "name",
        "resource_type",
        "created_at",
        "updated_at",
    ]

    ordering = [
        "-updated_at",
    ]


class ResourceVersionViewSet(viewsets.ModelViewSet):
    queryset = ResourceVersion.objects.select_related("resource").all()
    serializer_class = ResourceVersionSerializer

    filterset_fields = [
        "resource",
        "version_number",
    ]

    search_fields = [
        "original_filename",
        "notes",
        "resource__name",
    ]

    ordering_fields = [
        "version_number",
        "created_at",
        "original_filename",
    ]

    ordering = [
        "-created_at",
    ]