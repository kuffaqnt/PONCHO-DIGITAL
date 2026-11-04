from django.contrib.auth.models import Group, Permission

# RU-10, qué puede hacer cada perfil (codename de cada permiso)
PERMISOS_ARTESANOS = [
    'add_producto', 'change_producto', 'delete_producto', 'view_producto',
]
PERMISOS_ADMINISTRADORES = [
    'evaluar_solicitud', 'ver_reportes', 'view_artesano', 'change_artesano',
    'add_stand', 'change_stand', 'delete_stand', 'view_stand', 'view_producto',
]


def crear_grupos(sender, **kwargs):
    grupo, creado = Group.objects.get_or_create(name='Artesanos')
    grupo.permissions.set(Permission.objects.filter(codename__in=PERMISOS_ARTESANOS))

    grupo, creado = Group.objects.get_or_create(name='Administradores')
    grupo.permissions.set(Permission.objects.filter(codename__in=PERMISOS_ADMINISTRADORES))
