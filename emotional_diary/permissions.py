from rest_framework.permissions import BasePermission, SAFE_METHODS

class ObjectiveResourcePermission(BasePermission):

    # Definimos los permisos iniciales
    def has_permission(self, request, view):
        # Definimos quién es aprendiz
        is_apprentice = request.user.is_authenticated and (request.user.rol and request.user.rol.name in ['Aprendiz'])
        # Si es aprendiz, retornará True y seguirá de lo contrario tirará 403
        return is_apprentice
    
    def has_object_permission(self, request, view, obj):
        # Definimos el owner del objetivo        
        is_owner = obj.user == request.user        
        
        # Aquí solo puede pasar si el objetivo es del propio usuario que hace request
        if view.action == 'destroy':
            return is_owner        

        # Uso este is_owner porque si alguien manda un cambio que no es suyo saldrá None, para evitar que eso pase, usamos eso para verificar
        return is_owner
    

class EmotionResourcePermission(BasePermission):
    def has_permission(self, request, view):

        # Verificamos que para acceder a modificaciones de emociones, debe estar logueado
        if not request.user.is_authenticated:
            return False

        # Solo el admin y el psicólogo pueden crear una emoción
        if view.action == 'create':
            return request.user.is_superuser or (request.user.rol and request.user.rol.name in ['Admin', 'Psicologo'])
        
        return True
    
    def has_object_permission(self, request, view, obj):
        is_admin_or_psycho = request.user.is_superuser or (request.user.rol and request.user.rol.name in ['Admin', 'Psicologo'])

        # Solo los administradores y los psicólogos pueden modificar, eliminar y crear emociones
        if request.method not in SAFE_METHODS:
            return is_admin_or_psycho
        
        # En caso de querer hacer otras acciones, el usuario deberá estar logueado
        return request.user.is_authenticated
        
        