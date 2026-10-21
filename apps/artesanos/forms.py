from django import forms
from .models import Artesano


# HU-01 y 02, los datos que manda el postulante (el estado lo pone el modelo)
class PostulacionForm(forms.ModelForm):
    class Meta:
        model = Artesano
        fields = [
            'nombre', 'dni', 'telefono', 'email', 'localidad',
            'nombre_taller', 'rubro', 'anios_trayectoria', 'descripcion',
        ]
        error_messages = {
            'dni': {'unique': 'Ya hay una solicitud con ese DNI.'},
            'email': {'unique': 'Ya hay una solicitud con ese correo.'},
        }
