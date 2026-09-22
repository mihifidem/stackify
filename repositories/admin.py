from django.contrib import admin

from .models import (
    Project,
    Repository,
    Resource,
    ResourceVersion,
)


@admin.register(Repository)
class RepositoryAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "owner",
        "visibility",
        "created_at",
        "updated_at",
    )

    list_filter = (
        "visibility",
        "created_at",
    )

    search_fields = (
        "name",
        "description",
        "owner__username",
    )

    prepopulated_fields = {
        "slug": ("name",),
    }


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "repository",
        "project_type",
        "created_at",
        "updated_at",
    )

    list_filter = (
        "project_type",
        "created_at",
    )

    search_fields = (
        "title",
        "description",
        "repository__name",
    )

    prepopulated_fields = {
        "slug": ("title",),
    }


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "project",
        "resource_type",
        "created_at",
        "updated_at",
    )

    list_filter = (
        "resource_type",
        "created_at",
    )

    search_fields = (
        "name",
        "description",
        "project__title",
    )

    prepopulated_fields = {
        "slug": ("name",),
    }


@admin.register(ResourceVersion)
class ResourceVersionAdmin(admin.ModelAdmin):
    list_display = (
        "resource",
        "version_number",
        "original_filename",
        "created_at",
    )

    search_fields = (
        "resource__name",
        "original_filename",
        "notes",
    )

    list_filter = (
        "created_at",
    )