from django.db import models
from django.conf import settings

# Create your models here.

class Diary(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    visibility = models.CharField(max_length=50, default='yo-psicologo')
    last_update = models.DateField(auto_now=True)

    def __str__(self):
        return f"Diario de {self.user.names}"

class Emotion(models.Model):
    name = models.CharField(max_length=45)
    category = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class DiaryEntry(models.Model):
    diary = models.ForeignKey(Diary, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    description = models.TextField()
    emotion = models.ForeignKey(Emotion, on_delete=models.PROTECT)

class Objective(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    description = models.TextField()
    state = models.CharField(max_length=50, default="En progreso")
    created_at = models.DateField(auto_now_add=True)
    last_update = models.DateField(auto_now=True)
    
