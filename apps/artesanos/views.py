from django.contrib import messages
from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render, redirect, get_object_or_404
from django.db.models import Count, Sum
from .forms import PostulacionForm
from .models import Artesano, Stand

def inicio(request):
    return render(request, 'HTML/index.html')

# HU-01 a 03, acá se postula el artesano y queda pendiente
def registro_artesano(request):
    if request.method == 'POST':
        form = PostulacionForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Solicitud enviada. Queda pendiente hasta que la revise un administrador.')
            return redirect('registro_artesano')
    else:
        form = PostulacionForm()

    context = {
        'form': form,
        'localidades': Artesano.LOCALIDAD_CHOICES,
        'rubros': Artesano.RUBRO_CHOICES,
    }
    return render(request, 'HTML/registro_artesano.html', context)

# RU-10, por ahora solo muestra el login
def iniciar_sesion(request):
    return render(request, 'HTML/login.html')

# HU-03 y 07, el panel donde ve cómo va su solicitud
def panel_artesano(request):
    return render(request, 'HTML/paneldeartesanos.html')

def visitantes(request):
    artesanos = Artesano.objects.filter(stand__isnull = False).select_related('stand')

    rubro = request.GET.get('rubro','')
    localidad = request.GET.get('localidad','')
    busqueda = request.GET.get('q','')

    if rubro: 
        artesanos = artesanos.filter(rubro=rubro)
    if localidad:
        artesanos = artesanos.filter(localidad=localidad)
    if busqueda:
        artesanos = artesanos.filter(nombre_taller__icontains = busqueda)
    
    context = { 
        'artesanos': artesanos, 
        'rubros': Artesano.RUBRO_CHOICES,
        'localidades': Artesano.LOCALIDAD_CHOICES,
        'rubro_seleccionado': rubro,
        'localidad_seleccionada': localidad,
        'busqueda': busqueda,
    }
    return render (request, 'HTML/visitantes.html', context)





@staff_member_required
def reportes (request):
    # HU19: Ocupación de Stands
    total_stands = Stand.objects.count()
    stands_ocupados = Stand.objects.filter(estado='ocupado').count()
    stands_disponibles = Stand.objects.filter(estado='disponible').count()
    porcentaje_ocupacion = (
        round((stands_ocupados / total_stands) * 100, 1) if total_stands > 0 else 0
    )

    # HU17: Distribución por Localidad
    artesanos_por_localidad = (
        Artesano.objects.values('localidad')
        .annotate(total=Count('id'))
        .order_by('-total')
    )
    # Mapear las claves de localidad a sus etiquetas legibles
    localidad_dict = dict(Artesano.LOCALIDAD_CHOICES)
    reporte_localidades = [
        {'nombre': localidad_dict.get(item['localidad'], item['localidad']), 'total': item['total']}
        for item in artesanos_por_localidad
    ]

    # HU18: Distribución por Rubro
    artesanos_por_rubro = (
        Artesano.objects.values('rubro')
        .annotate(total=Count('id'))
        .order_by('-total')
    )
    rubro_dict = dict(Artesano.RUBRO_CHOICES)
    reporte_rubros = [
        {'nombre': rubro_dict.get(item['rubro'], item['rubro']), 'total': item['total']}
        for item in artesanos_por_rubro
    ]

    # HU20: Productos y Stock por Artesano
    artesanos_productos = (
        Artesano.objects.annotate(
            total_productos=Count('productos'),
            total_stock=Sum('productos__stock'),
        )
        .select_related('stand')
        .order_by('nombre_taller')
    )

    context = {
        'total_stands': total_stands,
        'stands_ocupados': stands_ocupados,
        'stands_disponibles': stands_disponibles,
        'porcentaje_ocupacion': porcentaje_ocupacion,
        'reporte_localidades': reporte_localidades,
        'reporte_rubros': reporte_rubros,
        'artesanos_productos': artesanos_productos,
    }

    return render (request, 'HTML/reportes.html',context)

def detalle_stand (request, artesano_id):
    artesano = get_object_or_404(
        Artesano.objects.select_related('stand').prefetch_related('productos'), pk=artesano_id,
    )
    return render (request, 'HTML/detalle_stand.html',{'artesano':artesano})


# HU-04, el admin ve las solicitudes (RNF-06, solo entra el staff)
@staff_member_required
def panel_admin(request):
    estado = request.GET.get('estado', 'pendiente')
    if estado not in dict(Artesano.ESTADO_CHOICES):
        estado = ''

    solicitudes = Artesano.objects.order_by('-fecha_solicitud')
    if estado:
        solicitudes = solicitudes.filter(estado=estado)

    conteo = dict(Artesano.objects.values_list('estado').annotate(total=Count('id')))
    estados = [
        {'clave': clave, 'nombre': nombre, 'total': conteo.get(clave, 0)}
        for clave, nombre in Artesano.ESTADO_CHOICES
    ]

    context = {
        'solicitudes': solicitudes,
        'estados': estados,
        'estado_seleccionado': estado,
        'total_solicitudes': sum(conteo.values()),
    }
    return render(request, 'HTML/panel_admin.html', context)


ACCIONES = {
    'aprobar': 'aprobada',        # HU-05
    'rechazar': 'rechazada',      # HU-06
    'modificacion': 'modificacion',  # HU-07
}


# HU-04 a 07, el detalle de la solicitud y lo que decide el admin
@staff_member_required
def detalle_solicitud(request, artesano_id):
    artesano = get_object_or_404(Artesano, pk=artesano_id)
    observaciones = artesano.observaciones

    if request.method == 'POST':
        nuevo_estado = ACCIONES.get(request.POST.get('accion'))
        observaciones = request.POST.get('observaciones', '').strip()

        if artesano.estado != 'pendiente':
            messages.error(request, 'Solo se pueden evaluar solicitudes pendientes.')
        elif nuevo_estado is None:
            messages.error(request, 'Acción no válida.')
        elif nuevo_estado == 'modificacion' and not observaciones:
            messages.error(request, 'Indicá qué tiene que modificar el postulante.')
        else:
            artesano.estado = nuevo_estado
            artesano.observaciones = observaciones
            artesano.save(update_fields=['estado', 'observaciones'])
            messages.success(request, f'Solicitud de {artesano.nombre_taller}: {artesano.get_estado_display()}.')
            return redirect('panel_admin')

    context = {'artesano': artesano, 'observaciones': observaciones}
    return render(request, 'HTML/detalle_solicitud.html', context)
