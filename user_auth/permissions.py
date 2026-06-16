from rest_framework.permissions import BasePermission

class UserResourcePermission(BasePermission):
    def has_permission(self, request, view):
        # registro público (cualquiera puede crear un usuario)
        if view.action == 'create':
            return True
        # para hacer cualquier otro cambio, el usuario debe estar logeado
        if not request.user.is_authenticated:
            return False
        
        # validamos el rol o si es super usuario
        if view.action == 'list':
            return request.user.is_superuser or (request.user.rol and request.user.rol.name in ["Admin", "Psicólogo"])
        
        return True
    
    def has_object_permission(self, request, view, obj):
        # definimos que el dueño de la cuenta sea el objeto en cuestión
        is_owner = obj == request.user

        if view.action == 'destroy':
            # con esto, sólo el admin y el propio usuario, pueden eliminar la cuenta
            return request.user.is_superuser or is_owner
        
        # y aquí validamos el rol: admin o psicólogo
        is_admin_or_psycho = request.user.is_superuser or (request.user.rol and request.user.rol.name in ["Admin", "Psicólogo"])

        return is_admin_or_psycho or is_owner
