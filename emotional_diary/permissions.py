from rest_framework.permissions import BasePermission, SAFE_METHODS

class UserResourceObjectivePermission(BasePermission):

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