from django.urls import path

from .views import repository_detail, repository_list

app_name = "repositories"

urlpatterns = [
    path("repositories/", repository_list, name="repository_list"),
    path("repositories/<str:owner>/<slug:slug>/", repository_detail, name="repository_detail"),
]
