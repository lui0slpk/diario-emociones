import re
from django.core.validators import ValidationError
from django.utils.translation import gettext_lazy as _

class CustomPasswordValidator:
    def validate(self, password, user=None):
        #regex: ((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{5,})
        # separaremos el código con la finalidad de poder tener UX/UI
        # verificación de longitud
        if len(password) < 8:
            raise ValidationError(_("La contraseña es demasiado corta. Debe tener mínimo 8 caracteres."), code="password_too_short")
        
        if not re.search(r'\d', password):
            raise ValidationError(_("La contraseña debe contener al menos un número"), code="password_no_number")
        
        if not re.search(r'[a-z]', password):
            raise ValidationError(_("La contraseña debe contener al menos una letra minúscula."), code="password_no_lower")
        
        if not re.search(r'[A-Z]', password):
            raise ValidationError(_("La contraseña debe contener al menos una letra mayúscula."), code="password_no_upper")
        
        if not re.search(r'[\W_]', password):
            raise ValidationError(_("La contraseña debe contener al menos un carácter especial (ej: @, #, $, _, etc.)."), code="password_no_symbol")
    
    def get_help_text(self):
        return _("Tu contraseña debe tener al menos 8 caracteres, incluir números, mayúsculas, minúsculas y un caracter especial.")