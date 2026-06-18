from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.permissions import IsAuthenticated # Esto lo usamos para poder proteger las rutas
# usaremos ValidationError para poder lanzar errores de validación
from rest_framework.exceptions import ValidationError
# además queremos poder traducir el texto que aparezca
from django.utils.translation import gettext_lazy as _
from .serializer import DiarySerializer, DiaryEntrySerializer, EmotionSerializer, ObjectiveSerializer
from .models import Diary, DiaryEntry, Objective, Emotion
from .permissions import ObjectiveResourcePermission, EmotionResourcePermission

# Create your views here.
class EmotionView(ModelViewSet):
    serializer_class = EmotionSerializer
    queryset = Emotion.objects.all()
    permission_classes = [EmotionResourcePermission]

class DiaryView(ReadOnlyModelViewSet): # Es un modelo de solo vista, porque el diario se crea con el signals.py automáticamente
    serializer_class = DiarySerializer
    permission_classes = [IsAuthenticated] # Nadie puede ver un diario sin estar logueado

    # filtración de datos para que el paciente solo pueda ver su propio diario
    def get_queryset(self):
        user = self.request.user
        # Con esta verificación, hacemos que se muestren todos los diarios a los administradores y a los psicólogos
        if user.is_superuser or (user.rol and user.rol.name in ['Admin', 'Psicologo']):
            return Diary.objects.all()
        # Y al usuario, sólo el suyo
        return Diary.objects.filter(user=user)

class DiaryEntryView(ModelViewSet):
    serializer_class = DiaryEntrySerializer
    permission_classes = [IsAuthenticated]

    # con esto también hacemos que el usuario solo pueda ver sus propias entradas gracias a la consulta relacional del ORM de DJango parecido a un (diary_entry de INNER JOIN diary d ON de.diary_id = diary.id)
    def get_queryset(self):
        user = self.request.user
        # con esta verificación, hacemos que el admin pueda ver las entradas de un usuario específico
        if user.is_superuser or (user.rol and user.rol.name in ['Admin', 'Psicologo']):
            user_id = self.request.query_params.get('user_id')
            if user_id:
                return DiaryEntry.objects.filter(diary__user_id=user_id)
            
            # en caso de no dar un usuario, lanzar error
            raise ValidationError(_("Debe seleccionar un usuario para consultar las entradas del diario"), code="no_user_id_selected")

        # el __ en diary__user es el "INNER JOIN" que buscamos, así que filtramos utilizando el ORM de DJango
        return DiaryEntry.objects.filter(diary__user=user)
    
    
    # definimos qué hacer cuando se cree un nuevo registro
    def perform_create(self, serializer):
        # Con esto buscamos el diario del usuario que está logeado
        user_diary = self.request.user.diary
        # Validamos que este diario realmente exista
        if not user_diary:
            raise ValidationError(_("El usuario no tiene un diario asociado"), code='diary_does_not_exist')
        # Y con esto guardamos la entrada de diario sujeta a ese diario
        return serializer.save(diary=user_diary)

class ObjectiveView(ModelViewSet):
    serializer_class = ObjectiveSerializer
    permission_classes = [ObjectiveResourcePermission] # usamos permisos personalizados para limpiar el código

    # devolvemos los objetivos del usuario
    def get_queryset(self):        
        return Objective.objects.filter(user=self.request.user)
    
    # hacemos que al crear se guarde automáticamente relacionado al usuario
    def perform_create(self, serializer):
        return serializer.save(user = self.request.user)
    # lo mismo al actualizar
    def perform_update(self, serializer):
        return serializer.save(user = self.request.user)

