from django.db import models
from django.conf import settings

class Vehiculo(models.Model):
    TIPOS = [
        ('sedan', 'Sedán'),
        ('camioneta', 'Camioneta'),
        ('van', 'Van'),
        ('suv', 'SUV'),
    ]

    id_vehiculo = models.AutoField(primary_key=True, editable=False)
    conductor = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='vehiculos',
        limit_choices_to={'rol': 'conductor'}
    )
    placa = models.CharField(max_length=10, unique=True)
    marca = models.CharField(max_length=50)
    modelo = models.CharField(max_length=50)
    color = models.CharField(max_length=30)
    anio = models.IntegerField(verbose_name='Año')
    tipo = models.CharField(max_length=20, choices=TIPOS, default='sedan')
    foto_url = models.URLField(max_length=500, blank=True, null=True)
    activo = models.BooleanField(default=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.placa} - {self.marca} {self.modelo} ({self.color})"
    
    class Meta:
        db_table = 'T002Vehiculo'
        verbose_name = 'Vehículo'
        verbose_name_plural = 'Vehículos'
        ordering = ['-fecha_registro']
