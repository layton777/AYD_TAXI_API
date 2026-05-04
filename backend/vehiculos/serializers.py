from rest_framework import serializers
from .models import Vehiculo

class VehiculoSerializer(serializers.ModelSerializer):
    conductor_nombre = serializers.SerializerMethodField()
    
    class Meta:
        model = Vehiculo
        fields = ('id_vehiculo', 'conductor', 'conductor_nombre', 'placa', 'marca', 
                  'modelo', 'color', 'anio', 'tipo', 'foto_url', 'activo', 'fecha_registro')
        read_only_fields = ('id_vehiculo', 'fecha_registro')
    
    def get_conductor_nombre(self, obj):
        return f"{obj.conductor.first_name} {obj.conductor.last_name}"
