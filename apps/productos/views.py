from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, permission_required
from django.contrib import messages
from django.core.exceptions import PermissionDenied
from apps.artesanos.models import Artesano
from .models import Producto
from .forms import ProductoForm

# HU-08 a 10, alta/edición/baja de productos
@login_required(login_url='login')
@permission_required('productos.add_producto', raise_exception=True)
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

    productos = Producto.objects.filter(artesano=artesano, visible=True)

    context = {
        'artesano': artesano,
        'productos': productos,
        'form': form,
    }
    return render(request, 'productos/gestion-productos.html', context)


# solo el dueño del producto o el superusuario
def puede_modificar(usuario, producto):
    return usuario.is_superuser or producto.artesano.email == usuario.username


# HU-09
@login_required(login_url='login')
@permission_required('productos.change_producto', raise_exception=True)
def editar_producto(request, producto_id):
    producto = get_object_or_404(Producto, id=producto_id, visible=True)
    if not puede_modificar(request.user, producto):
        raise PermissionDenied

    if request.method == 'POST':
        form = ProductoForm(request.POST, request.FILES, instance=producto)
        if form.is_valid():
            form.save()
            messages.success(request, f'Producto "{producto.nombre}" actualizado.')
            return redirect(volver_a(request.user, producto))
    else:
        form = ProductoForm(instance=producto)

    context = {'form': form, 'producto': producto}
    return render(request, 'productos/editar-producto.html', context)


@login_required(login_url='login')
@permission_required('productos.delete_producto', raise_exception=True)
def eliminar_producto(request, producto_id):
    producto = get_object_or_404(Producto, id=producto_id, visible=True)
    if not puede_modificar(request.user, producto):
        raise PermissionDenied

    if request.method == 'POST':
        nombre = producto.nombre
        producto.visible = False
        producto.save(update_fields=['visible'])
        messages.success(request, f'El producto "{nombre}" fue eliminado.')

    return redirect(volver_a(request.user, producto))


# el superusuario no tiene panel de artesano, vuelve al admin de Django
def volver_a(usuario, producto):
    if producto.artesano.email == usuario.username:
        return 'gestion_productos'
    return 'admin:productos_producto_changelist'
