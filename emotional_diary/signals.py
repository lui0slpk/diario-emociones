from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import Diary

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_diary(sender, instance, created, **kwargs):
    if created and instance.rol.name == "Aprendiz":
        Diary.objects.create(user=instance)