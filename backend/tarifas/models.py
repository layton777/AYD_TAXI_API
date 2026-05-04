from django.db import models

class Tarifa(models.Model):
    ZONAS = [
        ('Ubaté', 'Ubaté'),
        ('Cucunubá', 'Cucunubá'),
        ('Sutatausa', 'Sutatausa'),
        ('Tausa', 'Tausa'),
        ('Fúquene', 'Fúquene'),
        ('Susa', 'Susa'),
        ('Simijaca', 'Simijaca'),
        ('Carmen de Carupa', 'Carmen de Carupa'),
        ('Guachetá', 'Guachetá'),
        ('Lenguazaque', 'Lenguazaque'),
    ]

    id_tarifa = models.AutoField(primary_key=True, editable=False)
    zona_origen = models.CharField(max_length=50, choices=ZONAS)
    zona_destino = models.CharField(max_length=50, choices=ZONAS)
    precio_base = models.DecimalField(max_digits=10, decimal_places=2, help_text='Precio base en COP')
    precio_por_km = models.DecimalField(max_digits=10, decimal_places=2, default=1800, help_text='Precio por kilómetro en COP')
    recargo_nocturno = models.DecimalField(max_digits=5, decimal_places=2, default=20, help_text='Porcentaje de recargo nocturno')
    recargo_festivo = models.DecimalField(max_digits=5, decimal_places=2, default=15, help_text='Porcentaje de recargo en festivos')
    activo = models.BooleanField(default=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.zona_origen} → {self.zona_destino}: ${self.precio_base}"
    
    class Meta:
        db_table = 'T004Tarifa'
        verbose_name = 'Tarifa'
        verbose_name_plural = 'Tarifas'
        unique_together = ('zona_origen', 'zona_destino')
        ordering = ['zona_origen', 'zona_destino']
