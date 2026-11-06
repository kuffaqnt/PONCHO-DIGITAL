from openpyxl import Workbook
from django.contrib import messages
from django.http import HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, permission_required
from django.db.models import Count, Q, Sum
from .forms import CorreccionForm, PostulacionForm
from .models import Artesano, Stand
from .notificaciones import avisar_estado, avisar_nueva_solicitud

def inicio(request):
    return render(request, 'index.html')

# HU-01 a 03, acá se postula el artesano y queda pendiente
def registro_artesano(request):
    if request.method == 'POST':
        form = PostulacionForm(request.POST)
        if form.is_valid():
            artesano = form.save()
            avisar_nueva_solicitud(artesano)
            messages.success(request, 'Solicitud enviada. Ingresá con tu correo y contraseña para ver cómo va.')
            return redirect('login')
    else:
        form = PostulacionForm()

    context = {
        'form': form,
        'localidades': Artesano.LOCALIDAD_CHOICES,
        'rubros': Artesano.RUBRO_CHOICES,
    }
    return render(request, 'artesanos/registro_artesano.html', context)

# HU-03 y 07, el panel donde ve cómo va su solicitud
@login_required(login_url='login')
def panel_artesano(request):
    artesano=Artesano.objects.filter(email=request.user.username).first()
    if artesano is None:
        return redirect('inicio')
    return render(request, 'artesanos/paneldeartesanos.html',{'artesano':artesano})


# HU-07, el postulante corrige lo que le pidieron y vuelve a quedar pendiente
@login_required(login_url='login')
def corregir_solicitud(request):
    artesano = get_object_or_404(Artesano, email=request.user.username, estado='modificacion')

    if request.method == 'POST':
        form = CorreccionForm(request.POST, instance=artesano)
        if form.is_valid():
            artesano = form.save(commit=False)
            artesano.estado = 'pendiente'
            artesano.save()
            avisar_nueva_solicitud(artesano)
            messages.success(request, 'Solicitud corregida. Queda pendiente de evaluación.')
            return redirect('panel_artesano')
    else:
        form = CorreccionForm(instance=artesano)

    return render(request, 'artesanos/corregir_solicitud.html', {'form': form, 'artesano': artesano})

def visitantes(request):
    artesanos = Artesano.objects.filter(estado='aprobada').select_related('stand').prefetch_related('productos')

    rubro = request.GET.get('rubro','')
    localidad = request.GET.get('localidad','')
    busqueda = request.GET.get('q') or request.GET.get('buscar','')
    busqueda = busqueda.strip()

    if rubro: 
        artesanos = artesanos.filter(rubro=rubro)
    if localidad:
        artesanos = artesanos.filter(localidad=localidad)
    if busqueda:
        artesanos = artesanos.filter(nombre_taller__icontains = busqueda)
    
    # HU-15, buscar un stand por número
    numero_stand = request.GET.get('stand', '').strip()
    stands_encontrados = []
    if numero_stand.isdigit():
        stands_encontrados = Stand.objects.filter(numero=numero_stand).select_related('artesano')

    context = { 
        'artesanos': artesanos, 
        # HU-16, los stands asignados que tienen lugar marcado en el plano
        'stands_plano': Stand.objects.filter(
            artesano__estado='aprobada', plano_x__isnull=False, plano_y__isnull=False,
        ).select_related('artesano'),
        'numero_stand': numero_stand,
        'stands_encontrados': stands_encontrados,
        'rubros': Artesano.RUBRO_CHOICES,
        'localidades': Artesano.LOCALIDAD_CHOICES,
        'rubro_seleccionado': rubro,
        'localidad_seleccionada': localidad,
        'busqueda': busqueda,
    }
    return render (request, 'artesanos/visitantes.html', context)


def datos_reportes():
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
            total_productos=Count('productos', filter=Q(productos__visible=True)),
            total_stock=Sum('productos__stock', filter=Q(productos__visible=True)),
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
    return context


@login_required(login_url='login')
@permission_required('artesanos.ver_reportes', raise_exception=True)
def reportes (request):
    return render (request, 'usuario/reportes.html', datos_reportes())

# RU-13, descarga los mismos reportes en un Excel con una hoja por cada uno
@login_required(login_url='login')
@permission_required('artesanos.ver_reportes', raise_exception=True)
def reportes_excel(request):
    datos = datos_reportes()
    libro = Workbook()

    hoja = libro.active
    hoja.title = 'Ocupación'
    hoja.append(['Stands totales', datos['total_stands']])
    hoja.append(['Ocupados', datos['stands_ocupados']])
    hoja.append(['Disponibles', datos['stands_disponibles']])
    hoja.append(['Porcentaje de ocupación', datos['porcentaje_ocupacion']])

    hoja = libro.create_sheet('Localidades')
    hoja.append(['Localidad', 'Artesanos'])
    for fila in datos['reporte_localidades']:
        hoja.append([fila['nombre'], fila['total']])

    hoja = libro.create_sheet('Rubros')
    hoja.append(['Rubro', 'Artesanos'])
    for fila in datos['reporte_rubros']:
        hoja.append([fila['nombre'], fila['total']])

    hoja = libro.create_sheet('Productos')
    hoja.append(['Taller', 'Productos', 'Stock'])
    for artesano in datos['artesanos_productos']:
        hoja.append([artesano.nombre_taller, artesano.total_productos, artesano.total_stock or 0])

    respuesta = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    respuesta['Content-Disposition'] = 'attachment; filename="reportes_poncho.xlsx"'
    libro.save(respuesta)
    return respuesta


def detalle_stand (request, artesano_id):
    # HU-12, el visitante solo ve artesanos aprobados
    artesano = get_object_or_404(
        Artesano.objects.select_related('stand'), pk=artesano_id, estado='aprobada',
    )
    productos = artesano.productos.filter(visible=True)
    return render (request, 'artesanos/detalle_stand.html',{'artesano':artesano, 'productos':productos})


ACCIONES = {
    'aprobar': 'aprobada',        # HU-05
    'rechazar': 'rechazada',      # HU-06
    'modificacion': 'modificacion',  # HU-07
}

# HU-04 a 07, el detalle de la solicitud y lo que decide el admin
@login_required(login_url='login')
@permission_required('artesanos.evaluar_solicitud', raise_exception=True)
def detalle_solicitud(request, artesano_id):
    artesano = get_object_or_404(Artesano, pk=artesano_id)
    observaciones = artesano.observaciones
    stands_disponibles = Stand.objects.filter(estado__iexact='disponible', artesano__isnull=True)

    if request.method == 'POST':
        nuevo_estado = ACCIONES.get(request.POST.get('accion'))
        observaciones = request.POST.get('observaciones', '').strip()
        stand_id = request.POST.get('stand_id')

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
            artesano.actualizar_grupo()

            if nuevo_estado == 'aprobada' and stand_id: 
                stand = Stand.objects.filter(id=stand_id, estado='disponible').first()
                if stand: 
                    stand.artesano = artesano
                    stand.estado = 'ocupado'
                    stand.save(update_fields=['artesano','estado'])

            avisar_estado(artesano)
            messages.success(request, f'Solicitud de {artesano.nombre_taller}: {artesano.get_estado_display()}.')
            return redirect('panel_admin')

    context = {'artesano': artesano, 'observaciones': observaciones, 'stands_disponibles':stands_disponibles,}
    return render(request, 'artesanos/detalle_solicitud.html', context)
