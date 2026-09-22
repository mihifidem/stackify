from rest_framework.routers import DefaultRouter

from .views import (
    ProjectViewSet,
    RepositoryViewSet,
    ResourceViewSet,
    ResourceVersionViewSet,
)


router = DefaultRouter()

router.register(
    "repositories",
    RepositoryViewSet,
    basename="repository",
)

router.register(
    "projects",
    ProjectViewSet,
    basename="project",
)

router.register(
    "resources",
    ResourceViewSet,
    basename="resource",
)

router.register(
    "resource-versions",
    ResourceVersionViewSet,
    basename="resource-version",
)


urlpatterns = router.urls