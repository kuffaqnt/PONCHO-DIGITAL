from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, permission_required
from django.contrib import messages
from django.core.exceptions import PermissionDenied
from django.db.models import Q
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


# HU-11 y RU-12, catálogo público con filtros
def catalogo(request):
    productos = Producto.objects.filter(visible=True, artesano__estado='aprobada').select_related('artesano')

    rubro = request.GET.get('rubro', '')
    localidad = request.GET.get('localidad', '')
    busqueda = request.GET.get('q', '').strip()

    if rubro:
        productos = productos.filter(artesano__rubro=rubro)
    if localidad:
        productos = productos.filter(artesano__localidad=localidad)
    if busqueda:
        productos = productos.filter(Q(nombre__icontains=busqueda) | Q(descripcion__icontains=busqueda))

    context = {
        'productos': productos,
        'rubros': Artesano.RUBRO_CHOICES,
        'localidades': Artesano.LOCALIDAD_CHOICES,
        'rubro_seleccionado': rubro,
        'localidad_seleccionada': localidad,
        'busqueda': busqueda,
    }
    return render(request, 'productos/catalogo.html', context)


# HU-11, ficha del producto con los datos del artesano
def ficha_producto(request, producto_id):
    producto = get_object_or_404(
        Producto.objects.select_related('artesano'),
        id=producto_id, visible=True, artesano__estado='aprobada',
    )
    return render(request, 'productos/ficha-producto.html', {'producto': producto})
