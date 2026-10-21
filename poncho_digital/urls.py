"""
URL configuration for poncho_digital project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from apps.artesanos.views import *
from apps.productos.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', inicio, name='inicio'),
    path('visitantes/', visitantes, name='visitantes'),
    path('reportes/', reportes, name='reportes'),
    path('registro/', registro_artesano, name='registro_artesano'),
    path('login/', iniciar_sesion, name='login'),
    path('panel/', panel_artesano, name='panel_artesano'),
    path('gestion-productos/', gestion_productos, name='gestion_productos'),
    path('stand/<int:artesano_id>/', detalle_stand, name='detalle_stand'),
    path('panel-admin/', panel_admin, name='panel_admin'),
    path('panel-admin/solicitud/<int:artesano_id>/', detalle_solicitud, name='detalle_solicitud'),
]
