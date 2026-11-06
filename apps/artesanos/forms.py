from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from .models import Artesano, Stand


# HU-01 y 02, los datos que manda el postulante (el estado lo pone el modelo)
class PostulacionForm(forms.ModelForm):
    # CU-01, la cuenta se crea al postularse para que pueda ver su solicitud
    contrasenia = forms.CharField(label='Contraseña', widget=forms.PasswordInput)
    repetir_contrasenia = forms.CharField(label='Repetir contraseña', widget=forms.PasswordInput)
    # RNF-13, consentimiento de la Ley 25.326
    consentimiento = forms.BooleanField(label='Consentimiento de datos personales')

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

    def clean_email(self):
        email = self.cleaned_data['email'].lower()
        if User.objects.filter(username=email).exists():
            raise forms.ValidationError('Ya hay una cuenta con ese correo.')
        return email

    def clean_contrasenia(self):
        contrasenia = self.cleaned_data['contrasenia']
        validate_password(contrasenia)
        return contrasenia

    def clean(self):
        datos = super().clean()
        if datos.get('contrasenia') != datos.get('repetir_contrasenia'):
            self.add_error('repetir_contrasenia', 'Las contraseñas no coinciden.')
        return datos

    def save(self, commit=True):
        # el artesano y su usuario se crean juntos o no se crea ninguno
        with transaction.atomic():
            artesano = super().save(commit=commit)
            User.objects.create_user(
                username=artesano.email,
                email=artesano.email,
                password=self.cleaned_data['contrasenia'],
                first_name=artesano.nombre.split()[0],
            )
        return artesano


# HU-07, el DNI y el correo no se cambian porque el correo es con lo que entra
class CorreccionForm(forms.ModelForm):
    class Meta:
        model = Artesano
        fields = [
            'nombre', 'telefono', 'localidad', 'nombre_taller',
            'rubro', 'anios_trayectoria', 'descripcion',
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for campo in self.fields.values():
            if isinstance(campo.widget, forms.Select):
                campo.widget.attrs['class'] = 'form-select'
            else:
                campo.widget.attrs['class'] = 'form-control'
class StandForm(forms.ModelForm):
    class Meta:
        model = Stand
        fields = ['numero', 'pabellon', 'dimensiones', 'ubicacion', 'plano_x', 'plano_y']
        widgets = {
            'numero': forms.NumberInput(attrs={'class': 'form-control form-control-sm', 'placeholder': 'Ej: 4'}),
            'pabellon': forms.Select(attrs={'class': 'form-select form-select-sm'}),
            'dimensiones': forms.TextInput(attrs={'class': 'form-control form-control-sm', 'placeholder': 'Ej: 3x3 mts'}),
            'ubicacion': forms.TextInput(attrs={'class': 'form-control form-control-sm', 'placeholder': 'Ej: Pasillo Central - Entrada A'}),
            'plano_x': forms.NumberInput(attrs={'class': 'form-control form-control-sm', 'placeholder': 'Porcentaje horizontal (0-100)'}),
            'plano_y': forms.NumberInput(attrs={'class': 'form-control form-control-sm', 'placeholder': 'Porcentaje vertical (0-100)'}),
        }

class PerfilArtesanoForm(forms.ModelForm):
    class Meta:
        model = Artesano
        fields = ['nombre', 'telefono', 'localidad', 'nombre_taller', 'rubro', 'anios_trayectoria', 'descripcion']
        widgets = {
            'nombre': forms.TextInput(attrs={'class': 'form-control form-control-sm'}),
            'telefono': forms.TextInput(attrs={'class': 'form-control form-control-sm'}),
            'localidad': forms.Select(attrs={'class': 'form-select form-select-sm'}),
            'nombre_taller': forms.TextInput(attrs={'class': 'form-control form-control-sm'}),
            'rubro': forms.Select(attrs={'class': 'form-select form-select-sm'}),
            'anios_trayectoria': forms.NumberInput(attrs={'class': 'form-control form-control-sm'}),
            'descripcion': forms.Textarea(attrs={'class': 'form-control form-control-sm', 'rows': 3}),
        }