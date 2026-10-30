from django.contrib import admin

from .models import Producto


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'artesano', 'stock', 'visible')
    search_fields = ('nombre', 'artesano__nombre_taller')
