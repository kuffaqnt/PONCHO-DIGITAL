from django.db import models


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

    LOCALIDAD_CHOICES = [
        ('belen', 'Belén'),
        ('santa_maria', 'Santa María'),
        ('tinogasta', 'Tinogasta'),
        ('andalgala', 'Andalgalá'),
        ('valle_central', 'San Fernando del Valle'),
        ('el_rodeo', 'El Rodeo'),
        ('poman', 'Pomán'),
        ('antofagasta', 'Antofagasta de la Sierra'),
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
    descripcion = models.TextField(blank=True)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    fecha_solicitud = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Artesano'
        verbose_name_plural = 'Artesanos'
        ordering = ('nombre_taller',)

    def __str__(self):
        return f"{self.nombre_taller} ({self.nombre})"


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