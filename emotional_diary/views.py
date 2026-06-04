from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated # Esto lo usamos para poder proteger las rutas
from .serializer import DiarySerializer, DiaryEntrySerializer, EmotionSerializer
from .models import Diary, DiaryEntry, Emotion

# Create your views here.
class EmotionView(ModelViewSet):
    serializer_class = EmotionSerializer
    queryset = Emotion.objects.all()

class DiaryView(ModelViewSet):
    serializer_class = DiarySerializer
    permission_classes = [IsAuthenticated] # Nadie puede ver un diario sin estar logueado

    # filtración de datos para que el paciente solo pueda ver su propio diario
    def get_queryset(self):
        return Diary.objects.filter(user=self.request.user)
    
    # Con el perform_create, definimos cómo se guarda un nuevo registro en la base de datos
    # En este caso, hacemos que se ponga el usuario logeado al diario
    def perform_create(self, serializer):
        return serializer.save(user = self.request.user)

class DiaryEntryView(ModelViewSet):
    serializer_class = DiaryEntrySerializer
    permission_classes = [IsAuthenticated]

    # con esto también hacemos que el usuario solo pueda ver sus propias entradas gracias a la consulta relacional del ORM de DJango parecido a un (diary_entry de INNER JOIN diary d ON de.diary_id = diary.id)
    def get_queryset(self):
        # el __ en diary__user es el INNER JOIN que buscamos
        return DiaryEntry.objects.filter(diary__user=self.request.user)
    
    # definimos qué hacer cuando se cree un nuevo registro
    def perform_create(self, serializer):
        # Con esto buscamos el diario del usuario que está logeado
        user_diary = Diary.objects.filter(user=self.request.user)
        # Y con esto guardamos la entrada de diario sujeta a ese diario automáticamente
        return serializer.save(diary=user_diary)
