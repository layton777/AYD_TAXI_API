from django.contrib import admin
from .models import Viaje

@admin.register(Viaje)
class ViajeAdmin(admin.ModelAdmin):
    list_display = ('id_viaje', 'pasajero', 'conductor', 'origen_direccion', 'destino_direccion', 
                    'estado', 'tarifa_estimada', 'fecha_solicitud')
    list_filter = ('estado', 'metodo_pago', 'fecha_solicitud')
    search_fields = ('origen_direccion', 'destino_direccion', 'pasajero__username', 'conductor__username')
    readonly_fields = ('fecha_solicitud', 'fecha_aceptado', 'fecha_inicio', 'fecha_fin')
