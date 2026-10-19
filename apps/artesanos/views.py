from django.shortcuts import render
from django.db.models import Count, Sum
from .models import Artesano, Stand

def inicio(request):
    return render(request, 'HTML/index.html')

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
