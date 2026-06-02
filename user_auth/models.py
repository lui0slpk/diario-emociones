from django.forms import PasswordInput
import email
from enum import unique
from xml.dom.minidom import Document
from unicodedata import name
from enum import nonmember
from django.db import models

# Create your models here.

class Rol(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class User(models.Model):
    document = models.IntegerField()
    doc_type = models.CharField(max_length=50)
    names = models.CharField(max_length=100)
    last_names = models.CharField(max_length=100)
    birth_date = models.DateField()
    email = models.EmailField(max_length=100, unique=True)
    password = models.CharField(max_length=255)
    rol = models.ForeignKey(Rol, on_delete=models.PROTECT)
    last_update = models.DateField(auto_now=True)
    created_at = models.DateField(auto_now_add=True)

