from django.contrib.auth.models import Group, User
from django.core.validators import MaxValueValidator
from django.db import models
from django.db.models.signals import pre_delete
from django.dispatch import receiver


class Artesano(models.Model):
    RUBRO_CHOICES = [
        ('textil', 'Textil y telar'),
        ('ceramica', 'Cerámica y alfarería'),
        ('cuero', 'Talabartería y cuero'),
        ('madera', 'Trabajos en madera'),
        ('plateria', 'Platería y orfebrería'),
        ('regional', 'Productos regionales'),
        ('otro', 'Otro'),
    ]

    # los 16 departamentos de Catamarca, igual que en el form de registro
    LOCALIDAD_CHOICES = [
        ('ambato', 'Ambato'),
        ('ancasti', 'Ancasti'),
        ('andalgala', 'Andalgalá'),
        ('antofagasta', 'Antofagasta de la Sierra'),
        ('belen', 'Belén'),
        ('capayan', 'Capayán'),
        ('capital', 'Capital'),
        ('el_alto', 'El Alto'),
        ('fray_mamerto_esquiu', 'Fray Mamerto Esquiú'),
        ('la_paz', 'La Paz'),
        ('paclin', 'Paclín'),
        ('poman', 'Pomán'),
        ('santa_maria', 'Santa María'),
        ('santa_rosa', 'Santa Rosa'),
        ('tinogasta', 'Tinogasta'),
        ('valle_viejo', 'Valle Viejo'),
        ('buenos_aires', 'Buenos Aires'),
        ('caba', 'Ciudad Autónoma de Buenos Aires'),
        ('chaco', 'Chaco'),
        ('chubut', 'Chubut'),
        ('cordoba', 'Córdoba'),
        ('corrientes', 'Corrientes'),
        ('entre_rios', 'Entre Ríos'),
        ('formosa', 'Formosa'),
        ('jujuy', 'Jujuy'),
        ('la_pampa', 'La Pampa'),
        ('la_rioja', 'La Rioja'),
        ('mendoza', 'Mendoza'),
        ('misiones', 'Misiones'),
        ('neuquen', 'Neuquén'),
        ('rio_negro', 'Río Negro'),
        ('salta', 'Salta'),
        ('san_juan', 'San Juan'),
        ('san_luis', 'San Luis'),
        ('santa_cruz', 'Santa Cruz'),
        ('santa_fe', 'Santa Fe'),
        ('santiago_del_estero', 'Santiago del Estero'),
        ('tierra_del_fuego', 'Tierra del Fuego'),
        ('tucuman', 'Tucumán'),
    ]

    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente de evaluación'),
        ('aprobada', 'Aprobada'),
        ('rechazada', 'Rechazada'),
        ('modificacion', 'Requiere modificaciones'),
    ]

    nombre = models.CharField(max_length=120)
    dni = models.CharField(max_length=8, unique=True)
    email = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20, blank=True)
    nombre_taller = models.CharField(max_length=150)
    rubro = models.CharField(max_length=30, choices=RUBRO_CHOICES)
    localidad = models.CharField(max_length=50, choices=LOCALIDAD_CHOICES)
    # RU-02 / HU-12, el visitante ve la trayectoria
    anios_trayectoria = models.PositiveSmallIntegerField(default=0, validators=[MaxValueValidator(80)])
    descripcion = models.TextField(blank=True)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    # HU-06 y 07, el motivo que pone el admin al rechazar o pedir cambios
    observaciones = models.TextField(blank=True)
    fecha_solicitud = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Artesano'
        verbose_name_plural = 'Artesanos'
        ordering = ('nombre_taller',)
        # RU-10, permisos que Django no trae hechos
        permissions = [
            ('evaluar_solicitud', 'Puede evaluar solicitudes'),
            ('ver_reportes', 'Puede ver reportes'),
        ]

    def __str__(self):
        return f"{self.nombre_taller} ({self.nombre})"

    # HU-05, solo el artesano aprobado queda en el grupo con permisos de productos
    def actualizar_grupo(self):
        usuario = User.objects.filter(username=self.email).first()
        if usuario is None:
            return
        grupo = Group.objects.get(name='Artesanos')
        if self.estado == 'aprobada':
            usuario.groups.add(grupo)
        else:
            usuario.groups.remove(grupo)
    
    def delete(self, *args, **kwargs):
        if hasattr(self, 'stand') and self.stand:
            stand = self.stand
            stand.artesano = None
            stand.estado = 'disponible'
            stand.save(update_fields=['artesano', 'estado'])
        super().delete(*args, **kwargs)


class Stand(models.Model):
    ESTADO_STAND = [
        ('disponible', 'Disponible'),
        ('ocupado', 'Ocupado'),
    ]

    PABELLON_CHOICES = [
        ('pabellon_1', 'Pabellón de Artesanías I'),
        ('pabellon_2', 'Pabellón de Artesanías II'),
        ('regional', 'Pabellón de Productos Regionales'),
        ('institucional', 'Pabellón Institucional'),
    
    ]

    numero = models.PositiveIntegerField()
    pabellon = models.CharField(max_length=50, choices=PABELLON_CHOICES)
    estado = models.CharField(max_length=20, choices=ESTADO_STAND, default='disponible')
    dimensiones = models.CharField(max_length=30, blank=True)
    # HU-15, referencia para encontrarlo, por ejemplo "pasillo central, frente a la entrada"
    ubicacion = models.CharField(max_length=150, blank=True)
    # HU-16, posición en el plano, en porcentaje desde la izquierda y desde arriba
    plano_x = models.PositiveSmallIntegerField(null=True, blank=True, validators=[MaxValueValidator(100)], help_text='De 0 a 100, desde la izquierda de la imagen.')
    plano_y = models.PositiveSmallIntegerField(null=True, blank=True, validators=[MaxValueValidator(100)], help_text='De 0 a 100, desde arriba de la imagen.')

    artesano = models.OneToOneField(
        'Artesano',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='stand'
    )

    class Meta:
        verbose_name = 'Stand'
        verbose_name_plural = 'Stands'
        unique_together = ('numero', 'pabellon')
        ordering = ('pabellon', 'numero')

    def __str__(self):
        return f"{self.pabellon} - Stand {self.numero} ({self.estado})"
    