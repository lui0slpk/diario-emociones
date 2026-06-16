from rest_framework import serializers
from .models import (Diary, DiaryEntry, Emotion)

class DiarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Diary
        fields = ['id', 'user', 'date', 'visibility', 'last_update']

        read_only_fields = ['user']

class EmotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Emotion
        fields = '__all__'

class DiaryEntrySerializer(serializers.ModelSerializer):
    # Usaremos emotion detail para poder obtener el objeto completo en lugar de su simple ID
    emotion_detail = EmotionSerializer(source='emotion', read_only = True)

    class Meta:
        model = DiaryEntry
        fields = ['id', 'diary', 'date', 'description', 'emotion', 'emotion_detail']
        # 'emotion' para poder hacer POST y 'emotion_detail' para GET