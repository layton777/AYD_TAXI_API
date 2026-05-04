from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class RegistroUsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    email = serializers.EmailField(required=True)
    rol = serializers.ChoiceField(choices=['pasajero', 'conductor'], default='pasajero')

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name', 
                  'telefono', 'codigo_pais', 'direccion', 'rol', 'licencia', 'foto_url')

    def validate(self, attrs):
        # Si la licencia está presente pero vacía, se puede limpiar
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UsuarioSerializer(serializers.ModelSerializer):
    total_viajes = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'telefono', 
                  'codigo_pais', 'direccion', 'rol', 'is_superuser', 'fecha_creacion', 
                  'is_active', 'foto_url', 'calificacion_promedio', 'licencia',
                  'disponible', 'latitud', 'longitud', 'total_viajes')
        read_only_fields = ('id', 'fecha_creacion', 'total_viajes')
    
    def get_total_viajes(self, obj):
        if obj.es_conductor():
            return obj.viajes_como_conductor.filter(estado='completado').count()
        elif obj.es_pasajero():
            return obj.viajes_como_pasajero.filter(estado='completado').count()
        return 0

class PerfilUsuarioSerializer(serializers.ModelSerializer):
    """Serializer específico para edición de perfil propio"""
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'telefono', 
                  'codigo_pais', 'direccion', 'rol', 'is_superuser', 'fecha_creacion', 
                  'is_active', 'foto_url', 'calificacion_promedio', 'licencia',
                  'disponible', 'latitud', 'longitud')
        read_only_fields = ('id', 'username', 'rol', 'is_superuser', 'fecha_creacion', 
                           'is_active', 'calificacion_promedio')

class ConductorSerializer(serializers.ModelSerializer):
    """Serializer para listar conductores disponibles"""
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'telefono', 'foto_url',
                  'calificacion_promedio', 'disponible', 'latitud', 'longitud', 'licencia')
        read_only_fields = fields

class UbicacionConductorSerializer(serializers.Serializer):
    """Serializer para actualizar ubicación del conductor"""
    latitud = serializers.FloatField()
    longitud = serializers.FloatField()
    disponible = serializers.BooleanField(required=False)