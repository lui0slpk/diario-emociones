from django.contrib import admin
from .models import (Diary, DiaryEntry, Emotion, Objective)

# Register your models here.
admin.site.register([Diary, DiaryEntry, Emotion, Objective])