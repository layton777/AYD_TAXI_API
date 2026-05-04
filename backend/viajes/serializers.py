from rest_framework import serializers
from .models import Viaje

class ViajeSerializer(serializers.ModelSerializer):
    pasajero_nombre = serializers.SerializerMethodField()
    conductor_nombre = serializers.SerializerMethodField()
    estado_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Viaje
        fields = ('id_viaje', 'pasajero', 'pasajero_nombre', 'conductor', 'conductor_nombre',
                  'origen_direccion', 'origen_lat', 'origen_lng',
                  'destino_direccion', 'destino_lat', 'destino_lng',
                  'estado', 'estado_display', 'tarifa_estimada', 'tarifa_final',
                  'distancia_km', 'duracion_min', 'metodo_pago',
                  'fecha_solicitud', 'fecha_aceptado', 'fecha_inicio', 'fecha_fin',
                  'observaciones', 'motivo_cancelacion')
        read_only_fields = ('id_viaje', 'fecha_solicitud', 'fecha_aceptado', 'fecha_inicio', 'fecha_fin')
    
    def get_pasajero_nombre(self, obj):
        return f"{obj.pasajero.first_name} {obj.pasajero.last_name}"
    
    def get_conductor_nombre(self, obj):
        if obj.conductor:
            return f"{obj.conductor.first_name} {obj.conductor.last_name}"
        return None
    
    def get_estado_display(self, obj):
        return obj.get_estado_display()

class SolicitarViajeSerializer(serializers.Serializer):
    origen_direccion = serializers.CharField(max_length=300)
    origen_lat = serializers.FloatField()
    origen_lng = serializers.FloatField()
    destino_direccion = serializers.CharField(max_length=300)
    destino_lat = serializers.FloatField()
    destino_lng = serializers.FloatField()
    metodo_pago = serializers.ChoiceField(choices=['efectivo', 'nequi', 'daviplata'], default='efectivo')
    observaciones = serializers.CharField(required=False, allow_blank=True, default='')
