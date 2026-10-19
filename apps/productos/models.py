from django.db import models

class Producto(models.Model):
    artesano = models.ForeignKey(
        'artesanos.Artesano',
        on_delete=models.CASCADE,
        related_name='productos'
    )
    nombre = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    imagen = models.ImageField(upload_to='productos/', blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'
        ordering = ('-fecha_creacion',)

    def __str__(self):
        return f"{self.nombre} - ${self.precio}"