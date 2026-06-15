from rest_framework import serializers
from .models import User, Rol

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'document', 'doc_type', 'names', 'last_names', 'birth_date', 'email', 'password', 'rol')
        extra_kwargs = {
            # Hacemos que la contraseña sea de "solo escritura". 
            # Para que cuando se listen usuarios, la contraseña JAMÁS se enviará en el JSON por seguridad.
            'password': {'write_only' : True}
        }

    # validamos el email para que se normalice y pase automáticamente en minúsculas al validador.
    def validate_email(self, value):
        return value.lower().strip() if value else value
    
    # validamos que el documento no tenga espacios en blanco para evitar errores accidentales
    def validate_document(self, value):
        return str(value).strip() if value else value

    def create(self, validated_data):

        # obtenemos el usuario que hace la petición
        request = self.context.get('request')
        request_user = request.user if request else None
        
        #definimos quién es admin
        is_admin = request_user and request_user.is_superuser

        # si el que hace la petición NO está logeado, o está logeado pero NO admin
        if not is_admin:
            # buscamos el rol de aprendiz y lo asignamos
            rol_aprendiz, _ = Rol.objects.get_or_create(name='Aprendiz')
            
            # y aquí forzamos que el rol sea aprendiz, con esto evitamos que haya una petición manipulada desde una app como Postman
            validated_data['rol'] = rol_aprendiz

            # además de que no se puedan modificar los permisos
            validated_data['is_staff'] = False
            validated_data['is_superuser'] = False
    
        # Usamos el método create_user del UserManager para que la contraseña se guarde con Hash
        return User.objects.create_user(**validated_data)
    
    def perform_create(self, serializer):
        # Al crear el diario, Django le inyecta automáticamente el usuario logueado
        serializer.save(user=self.request.user)