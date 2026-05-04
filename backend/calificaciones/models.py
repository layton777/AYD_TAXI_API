from django.db import models
from django.conf import settings
from viajes.models import Viaje

class Calificacion(models.Model):
    id_calificacion = models.AutoField(primary_key=True, editable=False)
    viaje = models.ForeignKey(Viaje, on_delete=models.CASCADE, related_name='calificaciones')
    calificador = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='calificaciones_dadas'
    )
    calificado = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='calificaciones_recibidas'
    )
    puntuacion = models.IntegerField(help_text='Puntuación de 1 a 5')
    comentario = models.TextField(blank=True, null=True)
    fecha = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Actualizar calificación promedio del calificado
        promedio = Calificacion.objects.filter(
            calificado=self.calificado
        ).aggregate(models.Avg('puntuacion'))['puntuacion__avg']
        self.calificado.calificacion_promedio = round(promedio, 2) if promedio else 5.0
        self.calificado.save()
    
    def __str__(self):
        return f"Calificación {self.puntuacion}⭐ de {self.calificador} a {self.calificado}"
    
    class Meta:
        db_table = 'T005Calificacion'
        verbose_name = 'Calificación'
        verbose_name_plural = 'Calificaciones'
        unique_together = ('viaje', 'calificador')
        ordering = ['-fecha']
