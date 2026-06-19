from rest_framework.permissions import BasePermission, SAFE_METHODS

class UserResourcePermission(BasePermission):
    def has_permission(self, request, view):
        # registro público (cualquiera puede crear un usuario)
        if view.action == 'create':
            return True
        
        # con esto nos aseguramos que nadie podrá acceder a la lista de todos los usuarios excepto el admin y el psicólogo
        if view.action == 'list': # Esto se refiere a un (/users/), mientras que en has_object_permission es como un (users/<id>)
            return request.user.is_superuser or (request.user.rol and request.user.rol.name in ["Admin", "Psicologo"])
        
        # para hacer cualquier otra acción, el usuario debe estar logeado
        return request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # definimos que el dueño de la cuenta sea el objeto en cuestión
        is_owner = obj == request.user
        
        # y aquí validamos el rol
        is_admin_or_psycho = request.user.is_superuser or (request.user.rol and request.user.rol.name in ["Admin", "Psicologo"])
        is_admin = request.user.is_superuser or (request.user.rol and request.user.rol.name in ['Admin'])

        # Damos permisos de lectura a los roles
        if request.method in SAFE_METHODS:
            return is_admin_or_psycho or is_owner
        
        # Aquí decimos que para otra acción (put, delete) el usuario debe ser admin o ser el dueño del usuario
        return is_admin or is_owner
