from django.shortcuts import render, get_object_or_404
from django.db.models import Count, Sum
from .models import Artesano, Stand

def inicio(request):
    return render(request, 'HTML/index.html')

# HU-01 a 03, acá se postula el artesano
def registro_artesano(request):
    return render(request, 'HTML/registro_artesano.html')

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