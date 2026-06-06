from django.apps import AppConfig


class EmotionalDiaryConfig(AppConfig):
    name = 'emotional_diary'

    def ready(self):
        import emotional_diary.signals
