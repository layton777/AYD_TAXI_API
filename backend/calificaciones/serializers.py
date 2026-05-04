from rest_framework import serializers
from .models import Calificacion

class CalificacionSerializer(serializers.ModelSerializer):
    calificador_nombre = serializers.SerializerMethodField()
    calificado_nombre = serializers.SerializerMethodField()
    
    class Meta:
        model = Calificacion
        fields = ('id_calificacion', 'viaje', 'calificador', 'calificador_nombre',
                  'calificado', 'calificado_nombre', 'puntuacion', 'comentario', 'fecha')
        read_only_fields = ('id_calificacion', 'fecha', 'calificador')
    
    def get_calificador_nombre(self, obj):
        return f"{obj.calificador.first_name} {obj.calificador.last_name}"
    
    def get_calificado_nombre(self, obj):
        return f"{obj.calificado.first_name} {obj.calificado.last_name}"
    
    def validate_puntuacion(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("La puntuación debe ser entre 1 y 5")
        return value

class CrearCalificacionSerializer(serializers.Serializer):
    viaje_id = serializers.IntegerField()
    puntuacion = serializers.IntegerField(min_value=1, max_value=5)
    comentario = serializers.CharField(required=False, allow_blank=True, default='')
