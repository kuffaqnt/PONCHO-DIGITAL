from django import forms
from django.contrib import admin

from .models import Artesano, Stand


# RNF-11, el admin gestiona artesanos y stands desde Django Admin
@admin.register(Artesano)
class ArtesanoAdmin(admin.ModelAdmin):
    list_display = ('nombre_taller', 'nombre', 'rubro', 'localidad', 'estado', 'fecha_solicitud')
    list_filter = ('estado', 'rubro', 'localidad')
    search_fields = ('nombre_taller', 'nombre', 'dni', 'email')


class StandForm(forms.ModelForm):
    class Meta:
        model = Stand
        fields = ('numero', 'pabellon', 'artesano')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # HU-14, solo se le asigna stand a un artesano habilitado
        aprobados = Artesano.objects.filter(estado='aprobada')
        if self.instance.artesano_id:
            aprobados = aprobados | Artesano.objects.filter(pk=self.instance.artesano_id)
        self.fields['artesano'].queryset = aprobados

    def clean_artesano(self):
        artesano = self.cleaned_data['artesano']
        # HU-14, si el stand ya está ocupado no se le pone otro artesano encima (primero hay que liberarlo)
        anterior = self.instance.artesano_id
        if anterior and artesano and artesano.pk != anterior:
            raise forms.ValidationError('El stand ya está ocupado. Liberalo antes de asignarlo a otro artesano.')
        return artesano


# HU-13 y 14, registrar stands y asignarlos
@admin.register(Stand)
class StandAdmin(admin.ModelAdmin):
    form = StandForm
    list_display = ('numero', 'pabellon', 'estado', 'artesano')
    list_filter = ('pabellon', 'estado')
    search_fields = ('artesano__nombre_taller',)

    def save_model(self, request, obj, form, change):
        # el estado sale solo según si tiene artesano o no
        obj.estado = 'ocupado' if obj.artesano else 'disponible'
        super().save_model(request, obj, form, change)
