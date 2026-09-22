from django.db import models
from django.conf import settings

class Repository(models.Model):
    class Visibility(models.TextChoices):
        PUBLIC = 'public', 'Public'
        PRIVATE = 'private', 'Private'
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    visibility = models.CharField(
        max_length=190,
        choices=Visibility.choices,
        default=Visibility.PUBLIC,
    )
    slug = models.SlugField(max_length=190, unique=True)
    description = models.TextField(blank=True)
    visibility = models.CharField(
        max_length=10,
        choices=Visibility.choices,
        default=Visibility.PRIVATE,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        constraints = [
            models.UniqueConstraint(fields=['owner', 'slug'], 
            name='unique_owner_name')
        ]   
    def __str__(self):
        return f"{self.owner.username}/{self.name}"


class Project(models.Model):
    class ProjectType(models.TextChoices):
        BOOK = 'libro', 'Libro'
        MAGAZINE = 'revista', 'Revista'
        COMIC = 'comic', 'Comic'
        COURSE = 'course', 'Course'
        OTHER = 'other', 'Other'
    
    repository = models.ForeignKey(Repository, 
                                   on_delete=models.CASCADE,
                                   related_name='projects')
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    project_type = models.CharField(
        max_length=20,
        choices=ProjectType.choices,
        default=ProjectType.BOOK,
    )
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        constraints = [
            models.UniqueConstraint(fields=['repository', 'slug'], 
            name='unique_repository_slug_per_repository')
        ]

    def __str__(self):
        return f"{self.repository.owner.username}/{self.repository.name}/{self.title}"

class Resource(models.Model):
    class ResourceType(models.TextChoices):
        DOCUMENT = "document", "Documento"
        IMAGE = "image", "Imagen"
        AUDIO = "audio", "Audio"
        VIDEO = "video", "Vídeo"
        FONT = "font", "Fuente"
        ARCHIVE = "archive", "Archivo comprimido"
        DATA = "data", "Datos"
        OTHER = "other", "Otro"
    project = models.ForeignKey(Project, 
                                on_delete=models.CASCADE,
                                related_name='resources')
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    resource_type = models.CharField(
        max_length=20,
        choices=ResourceType.choices,
        default=ResourceType.DOCUMENT,
        blank=True
    )
    description = models.TextField(blank=True)      
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        constraints = [
            models.UniqueConstraint(fields=['project', 'slug'], 
            name='unique_project_slug_per_project')
        ]

    def __str__(self):
        return f"{self.project.repository.owner.username}/{self.project.repository.name}/{self.project.title}/{self.name}"
# Create your models here.




class ResourceVersion(models.Model):

    resource = models.ForeignKey(
        Resource,
        on_delete=models.CASCADE,
        related_name="versions",
    )

    version_number = models.PositiveIntegerField()

    file = models.FileField(
        upload_to="resources/%Y/%m/%d/",
    )

    original_filename = models.CharField(
        max_length=255,
        blank=True,
    )

    notes = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["-version_number"]

        constraints = [
            models.UniqueConstraint(
                fields=["resource", "version_number"],
                name="unique_version_number_per_resource",
            )
        ]

    def __str__(self):
        return f"{self.resource.name} - v{self.version_number}"