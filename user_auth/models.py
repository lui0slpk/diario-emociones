from django.db import models
from django.contrib.auth.models import (AbstractBaseUser, PermissionsMixin, BaseUserManager)
from django.core.validators import RegexValidator

# Create your models here.


class Rol(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

# Usamos UserManager para poder que DJango cree usuarios con "document" en vez de "username"

class UserManager(BaseUserManager):
    def create_user(self, document, password=None, **extra_fields):
        if not document:
            raise ValueError("Document field is required")
        
        # Quitamos la comprobación del rol, porque ya se definió un usuario por default en el Modelo

        user = self.model(document=document, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, document, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        
        #Asignamos el rol de admin forzadamente debido a que usamos como referencia el create_user que tiene por defecto rol de aprendiz
        rol_admin, _ = Rol.objects.get_or_create(name="Admin")
        extra_fields["rol"] = rol_admin
        # con esto se reutiliza la función de 'create_user' para evitar repetir el código de guardado en la db
        return self.create_user(document, password, **extra_fields)

# ------- Regex para el modelo de user -----------

document_regex = RegexValidator(
    regex=r'\A\d{6,12}\Z',
    message="El documento debe contener entre 6 y 12 números, sin puntos ni espacios.",
    code="document_invalid",
)

names_regex= RegexValidator(
    regex=r"^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[ '-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$",
    message="El nombre solo puede contener letras y espacios.",
    code="names_invalid",
)

# El Regex de la contraseña está en validators.py para que pueda leer la contraseña en texto plano, antes de que en UserManager el create_user la hashee

# ------------------------------------------------

class User(AbstractBaseUser, PermissionsMixin):
    # El AbstractBaseUser aporta el campo de contraseña con hash, last_login, y métodos de autenticación
    # Y PermissionsMixin hace posible que el panel de (/admin) funcione bien, dejando claro qué usuario puede ver, crear, editar o borrar registros.

    document = models.CharField(max_length=20, unique=True, validators=[document_regex])
    doc_type = models.CharField(max_length=50)
    names = models.CharField(max_length=100, validators=[names_regex])
    last_names = models.CharField(max_length=100, validators=[names_regex])
    birth_date = models.DateField()
    email = models.EmailField(max_length=100, unique=True)
    # Ya no hace falta un password porque AbstractBaseUser ya nos lo da
    rol = models.ForeignKey(Rol, on_delete=models.PROTECT, default=3) # Aquí ponemos el rol por defecto
    last_update = models.DateField(auto_now=True)
    created_at = models.DateField(auto_now_add=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "document" # indica a Django que el login se hace con 'document' en vez de 'username'
    REQUIRED_FIELDS = ["names", "last_names", "email", "doc_type", "birth_date"] # Campos que se ejecutan al momento de crear un superuser

    def __str__(self):
        return f"{self.names} {self.last_names} ({self.document})"
    
    def get_full_name(self):
        return f"{self.names} {self.last_names}"
    

