from django.core.paginator import Paginator
from django.db.models import Q
from django.shortcuts import get_object_or_404, render
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


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.select_related("repository").all()
    serializer_class = ProjectSerializer


class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.select_related("project").all()
    serializer_class = ResourceSerializer


class ResourceVersionViewSet(viewsets.ModelViewSet):
    queryset = ResourceVersion.objects.select_related("resource").all()
    serializer_class = ResourceVersionSerializer

def repository_detail(request, owner, slug):
    repository = get_object_or_404(
        Repository.objects.select_related("owner").prefetch_related("projects"),
        owner__username=owner,
        slug=slug,
    )

    return render(
        request,
        "repositories/repository_detail.html",
        {
            "repository": repository,
        },
    )

def repository_list(request):
    queryset = Repository.objects.select_related("owner")

    search = (request.GET.get("search") or "").strip()
    visibility = request.GET.get("visibility")
    ordering = request.GET.get("ordering") or "-updated_at"

    allowed_ordering = {
        "-updated_at": "Más recientes",
        "updated_at": "Más antiguos",
        "name": "Nombre A-Z",
        "-name": "Nombre Z-A",
    }

    if ordering not in allowed_ordering:
        ordering = "-updated_at"

    if search:
        queryset = queryset.filter(
            Q(name__icontains=search)
            | Q(description__icontains=search)
            | Q(owner__username__icontains=search)
        )

    if visibility:
        queryset = queryset.filter(visibility=visibility)

    repositories = queryset.order_by(ordering)

    paginator = Paginator(repositories, 10)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    return render(
        request,
        "repositories/repository_list.html",
        {
            "page_obj": page_obj,
            "repositories": page_obj.object_list,
            "search": search,
            "visibility": visibility,
            "ordering": ordering,
            "allowed_ordering": allowed_ordering,
            "visibility_choices": Repository.Visibility.choices,
        },
    )