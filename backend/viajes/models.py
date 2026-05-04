from django.db import models
from django.conf import settings

class Viaje(models.Model):
    ESTADOS = [
        ('solicitado', 'Solicitado'),
        ('aceptado', 'Aceptado'),
        ('en_curso', 'En Curso'),
        ('completado', 'Completado'),
        ('cancelado', 'Cancelado'),
    ]
    
    METODOS_PAGO = [
        ('efectivo', 'Efectivo'),
        ('nequi', 'Nequi'),
        ('daviplata', 'Daviplata'),
    ]

    id_viaje = models.AutoField(primary_key=True, editable=False)
    pasajero = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='viajes_como_pasajero'
    )
    conductor = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, blank=True,
        related_name='viajes_como_conductor'
    )
    
    # Origen
    origen_direccion = models.CharField(max_length=300)
    origen_lat = models.FloatField()
    origen_lng = models.FloatField()
    
    # Destino
    destino_direccion = models.CharField(max_length=300)
    destino_lat = models.FloatField()
    destino_lng = models.FloatField()
    
    # Estado y seguimiento
    estado = models.CharField(max_length=20, choices=ESTADOS, default='solicitado')
    
    # Tarifa
    tarifa_estimada = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tarifa_final = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    distancia_km = models.FloatField(default=0)
    duracion_min = models.IntegerField(default=0)
    metodo_pago = models.CharField(max_length=20, choices=METODOS_PAGO, default='efectivo')
    
    # Timestamps
    fecha_solicitud = models.DateTimeField(auto_now_add=True)
    fecha_aceptado = models.DateTimeField(null=True, blank=True)
    fecha_inicio = models.DateTimeField(null=True, blank=True)
    fecha_fin = models.DateTimeField(null=True, blank=True)
    
    # Metadata
    observaciones = models.TextField(blank=True, null=True)
    motivo_cancelacion = models.TextField(blank=True, null=True)
    cancelado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='viajes_cancelados'
    )
    
    def __str__(self):
        return f"Viaje #{self.id_viaje} - {self.origen_direccion} → {self.destino_direccion} ({self.get_estado_display()})"
    
    class Meta:
        db_table = 'T003Viaje'
        verbose_name = 'Viaje'
        verbose_name_plural = 'Viajes'
        ordering = ['-fecha_solicitud']
