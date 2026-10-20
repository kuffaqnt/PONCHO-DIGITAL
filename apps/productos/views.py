from django.shortcuts import render

# HU-08 a 10, alta/edición/baja de productos
def gestion_productos(request):
    return render(request, 'HTML/gestion-productos.html')
