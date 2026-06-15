from rest_framework.viewsets import ModelViewSet
from .serializer import UserSerializer
from .models import User
from .permissions import UserResourcePermission

# Create your views here.
class UserView(ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    # aquí, referenciamos las "reglas" que debe tener la petición
    permission_classes = [UserResourcePermission]