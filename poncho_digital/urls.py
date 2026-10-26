from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

# Importamos las vistas de cada aplicación con alias claros
from apps.artesanos import views as artesanos_views
from apps.productos import views as productos_views
from apps.usuario import views as usuario_views

urlpatterns = [
    path('admin/', admin.site.urls),

    # App Artesanos
    path('', artesanos_views.inicio, name='inicio'),
    path('visitantes/', artesanos_views.visitantes, name='visitantes'),
    path('reportes/', artesanos_views.reportes, name='reportes'),
    path('registro/', artesanos_views.registro_artesano, name='registro_artesano'),
    path('panel/', artesanos_views.panel_artesano, name='panel_artesano'),
    path('stand/<int:artesano_id>/', artesanos_views.detalle_stand, name='detalle_stand'),
    path('panel-admin/solicitud/<int:artesano_id>/', artesanos_views.detalle_solicitud, name='detalle_solicitud'),

    # App Usuario
    path('login/', usuario_views.login_view, name='login'),
    path('logout/', usuario_views.logout_view, name='logout'),
    path('panel-admin/', usuario_views.panel_admin, name='panel_admin'),

    # App Productos
    path('gestion-productos/', productos_views.gestion_productos, name='gestion_productos'),
    path('gestion-productos/eliminar/<int:producto_id>/', productos_views.eliminar_producto, name='eliminar_producto'),
]

# Servir archivos estáticos e imágenes en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)