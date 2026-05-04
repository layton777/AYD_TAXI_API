import math
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from .models import Viaje
from .serializers import ViajeSerializer, SolicitarViajeSerializer
from authentication.permissions import EsAdministradorPermission


def calcular_distancia_km(lat1, lng1, lat2, lng2):
    """Calcula distancia entre dos puntos usando la fórmula de Haversine"""
    R = 6371  # Radio de la Tierra en km
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng/2)**2
    c = 2 * math.asin(math.sqrt(a))
    return round(R * c, 2)


def calcular_tarifa(distancia_km):
    """Calcula tarifa estimada basada en distancia"""
    TARIFA_BASE = 4500  # COP
    PRECIO_POR_KM = 1800  # COP
    TARIFA_MINIMA = 5000  # COP
    tarifa = TARIFA_BASE + (distancia_km * PRECIO_POR_KM)
    return max(tarifa, TARIFA_MINIMA)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def solicitar_viaje(request):
    """Pasajero solicita un nuevo viaje"""
    if not request.user.es_pasajero() and not request.user.es_administrador():
        return Response({'detail': 'Solo pasajeros pueden solicitar viajes'}, status=403)
    
    # Verificar que no tenga un viaje activo
    viaje_activo = Viaje.objects.filter(
        pasajero=request.user,
        estado__in=['solicitado', 'aceptado', 'en_curso']
    ).first()
    if viaje_activo:
        return Response({'detail': 'Ya tienes un viaje activo', 'viaje_id': viaje_activo.id_viaje}, status=400)
    
    serializer = SolicitarViajeSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        distancia = calcular_distancia_km(
            data['origen_lat'], data['origen_lng'],
            data['destino_lat'], data['destino_lng']
        )
        tarifa = calcular_tarifa(distancia)
        
        viaje = Viaje.objects.create(
            pasajero=request.user,
            origen_direccion=data['origen_direccion'],
            origen_lat=data['origen_lat'],
            origen_lng=data['origen_lng'],
            destino_direccion=data['destino_direccion'],
            destino_lat=data['destino_lat'],
            destino_lng=data['destino_lng'],
            distancia_km=distancia,
            tarifa_estimada=tarifa,
            metodo_pago=data.get('metodo_pago', 'efectivo'),
            observaciones=data.get('observaciones', ''),
            estado='solicitado'
        )
        
        return Response(ViajeSerializer(viaje).data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def aceptar_viaje(request, id_viaje):
    """Conductor acepta un viaje solicitado"""
    if not request.user.es_conductor():
        return Response({'detail': 'Solo conductores pueden aceptar viajes'}, status=403)
    
    try:
        viaje = Viaje.objects.get(id_viaje=id_viaje, estado='solicitado')
    except Viaje.DoesNotExist:
        return Response({'detail': 'Viaje no encontrado o ya fue aceptado'}, status=404)
    
    # Verificar que el conductor no tenga otro viaje activo
    viaje_activo = Viaje.objects.filter(
        conductor=request.user,
        estado__in=['aceptado', 'en_curso']
    ).first()
    if viaje_activo:
        return Response({'detail': 'Ya tienes un viaje activo'}, status=400)
    
    viaje.conductor = request.user
    viaje.estado = 'aceptado'
    viaje.fecha_aceptado = timezone.now()
    viaje.save()
    
    # Marcar conductor como no disponible
    request.user.disponible = False
    request.user.save()
    
    return Response(ViajeSerializer(viaje).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def iniciar_viaje(request, id_viaje):
    """Conductor inicia el viaje (recogió al pasajero)"""
    try:
        viaje = Viaje.objects.get(id_viaje=id_viaje, conductor=request.user, estado='aceptado')
    except Viaje.DoesNotExist:
        return Response({'detail': 'Viaje no encontrado'}, status=404)
    
    viaje.estado = 'en_curso'
    viaje.fecha_inicio = timezone.now()
    viaje.save()
    
    return Response(ViajeSerializer(viaje).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def completar_viaje(request, id_viaje):
    """Conductor completa el viaje"""
    try:
        viaje = Viaje.objects.get(id_viaje=id_viaje, conductor=request.user, estado='en_curso')
    except Viaje.DoesNotExist:
        return Response({'detail': 'Viaje no encontrado'}, status=404)
    
    viaje.estado = 'completado'
    viaje.fecha_fin = timezone.now()
    
    # Calcular duración en minutos
    if viaje.fecha_inicio:
        duracion = (viaje.fecha_fin - viaje.fecha_inicio).total_seconds() / 60
        viaje.duracion_min = round(duracion)
    
    # La tarifa final puede ser diferente (ajustes de ruta, etc.)
    viaje.tarifa_final = request.data.get('tarifa_final', viaje.tarifa_estimada)
    viaje.save()
    
    # Marcar conductor como disponible nuevamente
    request.user.disponible = True
    request.user.save()
    
    return Response(ViajeSerializer(viaje).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancelar_viaje(request, id_viaje):
    """Cancelar un viaje (pasajero o conductor)"""
    try:
        viaje = Viaje.objects.get(
            id_viaje=id_viaje,
            estado__in=['solicitado', 'aceptado']
        )
    except Viaje.DoesNotExist:
        return Response({'detail': 'Viaje no encontrado o no se puede cancelar'}, status=404)
    
    # Verificar que sea participante del viaje o admin
    if viaje.pasajero != request.user and viaje.conductor != request.user and not request.user.es_administrador():
        return Response({'detail': 'No tienes permiso para cancelar este viaje'}, status=403)
    
    viaje.estado = 'cancelado'
    viaje.motivo_cancelacion = request.data.get('motivo', 'Sin motivo especificado')
    viaje.cancelado_por = request.user
    viaje.save()
    
    # Si tenía conductor, marcarlo como disponible
    if viaje.conductor:
        viaje.conductor.disponible = True
        viaje.conductor.save()
    
    return Response(ViajeSerializer(viaje).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def viajes_activos(request):
    """Viajes activos del usuario actual"""
    user = request.user
    if user.es_conductor():
        viajes = Viaje.objects.filter(
            conductor=user,
            estado__in=['aceptado', 'en_curso']
        )
    elif user.es_pasajero():
        viajes = Viaje.objects.filter(
            pasajero=user,
            estado__in=['solicitado', 'aceptado', 'en_curso']
        )
    else:
        viajes = Viaje.objects.filter(estado__in=['solicitado', 'aceptado', 'en_curso'])
    
    serializer = ViajeSerializer(viajes, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def viajes_pendientes(request):
    """Viajes pendientes de aceptar (para conductores)"""
    if not request.user.es_conductor():
        return Response({'detail': 'Solo conductores pueden ver viajes pendientes'}, status=403)
    
    viajes = Viaje.objects.filter(estado='solicitado').order_by('-fecha_solicitud')
    serializer = ViajeSerializer(viajes, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def historial_viajes(request):
    """Historial de viajes del usuario"""
    user = request.user
    if user.es_conductor():
        viajes = Viaje.objects.filter(conductor=user)
    elif user.es_pasajero():
        viajes = Viaje.objects.filter(pasajero=user)
    else:
        viajes = Viaje.objects.all()
    
    # Filtros opcionales
    estado = request.query_params.get('estado')
    if estado:
        viajes = viajes.filter(estado=estado)
    
    fecha_desde = request.query_params.get('fecha_desde')
    fecha_hasta = request.query_params.get('fecha_hasta')
    if fecha_desde and fecha_hasta:
        viajes = viajes.filter(fecha_solicitud__date__range=[fecha_desde, fecha_hasta])
    
    serializer = ViajeSerializer(viajes, many=True)
    return Response(serializer.data)


class ViajeListView(generics.ListAPIView):
    """Lista todos los viajes (solo admin)"""
    serializer_class = ViajeSerializer
    permission_classes = [EsAdministradorPermission]
    
    def get_queryset(self):
        queryset = Viaje.objects.all()
        estado = self.request.query_params.get('estado')
        if estado:
            queryset = queryset.filter(estado=estado)
        return queryset


class ViajeDetailView(generics.RetrieveAPIView):
    """Detalle de un viaje"""
    serializer_class = ViajeSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id_viaje'
    
    def get_queryset(self):
        user = self.request.user
        if user.es_administrador():
            return Viaje.objects.all()
        return Viaje.objects.filter(
            Q(pasajero=user) | Q(conductor=user)
        )
