from django.contrib import admin
from .models import (User, Rol)

# Register your models here.
admin.site.register([User, Rol])
