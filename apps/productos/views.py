from django.shortcuts import render
from apps.artesanos.models import Artesano
from .models import Producto

# HU-08 a 10, alta/edición/baja de productos
# por ahora lista todos, cuando haya login se filtra por el artesano logueado
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from apps.artesanos.models import Artesano
from .models import Producto
from .forms import ProductoForm

@login_required(login_url='login')
def gestion_productos(request):
    artesano = Artesano.objects.filter(email=request.user.username).first()

    if not artesano:
        messages.error(request, 'No se encontró un perfil de artesano vinculado a tu cuenta.')
        return redirect('inicio')

    if request.method == 'POST':
        form = ProductoForm(request.POST, request.FILES)
        if form.is_valid():
            producto = form.save(commit=False)
            producto.artesano = artesano
            producto.save()
            messages.success(request, f'¡Producto "{producto.nombre}" guardado con éxito!')
            return redirect('gestion_productos')
    else:
        form = ProductoForm()

    productos = Producto.objects.filter(artesano=artesano)

    context = {
        'artesano': artesano,
        'productos': productos,
        'form': form,
    }
    return render(request, 'productos/gestion-productos.html', context)


@login_required(login_url='login')
def eliminar_producto(request, producto_id):
    artesano = Artesano.objects.filter(email=request.user.username).first()
    producto = get_object_or_404(Producto, id=producto_id, artesano=artesano)

    if request.method == 'POST':
        nombre = producto.nombre
        producto.delete()
        messages.success(request, f'El producto "{nombre}" fue eliminado.')

    return redirect('gestion_productos')