from django.shortcuts import render
from apps.artesanos.models import Artesano
from .models import Producto

# HU-08 a 10, alta/edición/baja de productos
# por ahora lista todos, cuando haya login se filtra por el artesano logueado
def gestion_productos(request):
    context = {
        'productos': Producto.objects.select_related('artesano'),
        'rubros': Artesano.RUBRO_CHOICES,
    }
    return render(request, 'HTML/gestion-productos.html', context)
