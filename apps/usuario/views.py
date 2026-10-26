from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib import messages
from apps.artesanos.models import Artesano
from django.db.models import Count

def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password) #si encuentra el usuario devuelve en user
        if user is not None: 
            login(request, user)
            if user.is_staff or user.is_superuser:
                return redirect('panel_admin')
            return redirect(("panel_artesano"))
        else:
            return render (request, "usuario/login.html",{"msj":"Credenciales incorrectas"})
    return render(request, "usuario/login.html")

def logout_view(request):
    logout(request)
    return redirect('login')

@staff_member_required(login_url='login')
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
    return render(request, 'usuario/panel_admin.html', context)

def estado_solicitud(request):
    return render (request, 'usuario/estado_solicitud.html')