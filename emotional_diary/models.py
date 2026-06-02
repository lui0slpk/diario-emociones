from unittest.util import _MAX_LENGTH
from django.db.models import CASCADE
from django.template.defaultfilters import default
from django.db import models

# Create your models here.

class Diary(models.Model):
    user = models.ForeignKey('user_auth.User', on_delete=models.PROTECT)
    date = models.DateField(auto_now_add=True)
    visibility = models.CharField(max_length=45, default='yo-psicologo')
    last_update = models.DateField(auto_now=True)

class Emotion(models.Model):
    name = models.CharField(max_length=45)
    state = models.CharField(max_length=45)

class DiaryEntry(models.Model):
    diary = models.ForeignKey(Diary, on_delete=CASCADE)
    date = models.DateField(auto_now_add=True)
    description = models.TextField()
    emotion = models.ForeignKey(Emotion, on_delete=models.PROTECT)

class Objetive(models.Model):
    user = models.ForeignKey('user_auth.User', on_delete=CASCADE)
    name = models.CharField(max_length=45)
    description = models.TextField()
    state = models.CharField(max_length=45)
    created_at = models.DateField(auto_now_add=True)
    last_update = models.DateField(auto_now=True)
    
