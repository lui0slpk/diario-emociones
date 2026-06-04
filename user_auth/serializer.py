from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'document', 'doc_type', 'names', 'last_names', 'birth_date', 'email', 'password', 'rol')
        extra_kwargs = {
            # Hacemos que la contraseña sea de "solo escritura". 
            # Para que cuando se listen usuarios, la contraseña JAMÁS se enviará en el JSON por seguridad.
            'password': {'write_only' : True}
        }
    
    def create(self, validated_data):

        # Usamos el método create_user del UserManager para que la contraseña se guarde con Hash
        return User.objects.create_user(**validated_data)
    
    def perform_create(self, serializer):
        # Al crear el diario, Django le inyecta automáticamente el usuario logueado
        serializer.save(user=self.request.user)