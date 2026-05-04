from rest_framework import serializers
from .models import Tarifa

class TarifaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarifa
        fields = ('id_tarifa', 'zona_origen', 'zona_destino', 'precio_base',
                  'precio_por_km', 'recargo_nocturno', 'recargo_festivo',
                  'activo', 'fecha_actualizacion')
        read_only_fields = ('id_tarifa', 'fecha_actualizacion')

class CalcularTarifaSerializer(serializers.Serializer):
    zona_origen = serializers.CharField(max_length=50)
    zona_destino = serializers.CharField(max_length=50)
    distancia_km = serializers.FloatField(required=False, default=0)
    es_nocturno = serializers.BooleanField(required=False, default=False)
    es_festivo = serializers.BooleanField(required=False, default=False)
