from django.apps import AppConfig
from django.db.models.signals import post_migrate


class UsuarioConfig(AppConfig):
    name = 'apps.usuario'

    def ready(self):
        from .grupos import crear_grupos
        # los permisos recién existen después de migrar, por eso los grupos se arman acá
        post_migrate.connect(crear_grupos, sender=self)
