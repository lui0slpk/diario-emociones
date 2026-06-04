from rest_framework.viewsets import ModelViewSet
from .serializer import UserSerializer
from .models import User

# Create your views here.
class UserView(ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()