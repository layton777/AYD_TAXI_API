from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Sum, Avg, Q
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import get_user_model
from viajes.models import Viaje
from vehiculos.models import Vehiculo
from calificaciones.models import Calificacion

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_stats(request):
    """Estadísticas principales del dashboard"""
    start_date = request.query_params.get('start_date')
    end_date = request.query_params.get('end_date')

    viajes = Viaje.objects.all()
    if start_date and end_date:
        viajes = viajes.filter(fecha_solicitud__date__range=[start_date, end_date])

    viajes_completados = viajes.filter(estado='completado')
    
    stats = {
        # Viajes
        'total_viajes': viajes.count(),
        'viajes_completados': viajes_completados.count(),
        'viajes_en_curso': viajes.filter(estado='en_curso').count(),
        'viajes_pendientes': viajes.filter(estado='solicitado').count(),
        'viajes_cancelados': viajes.filter(estado='cancelado').count(),
        
        # Ingresos
        'ingresos_totales': float(viajes_completados.aggregate(
            total=Sum('tarifa_final'))['total'] or 0),
        'tarifa_promedio': float(viajes_completados.aggregate(
            promedio=Avg('tarifa_final'))['promedio'] or 0),
        
        # Usuarios
        'total_pasajeros': User.objects.filter(rol='pasajero', is_active=True).count(),
        'total_conductores': User.objects.filter(rol='conductor', is_active=True).count(),
        'conductores_disponibles': User.objects.filter(
            rol='conductor', disponible=True, is_active=True).count(),
        
        # Vehículos
        'total_vehiculos': Vehiculo.objects.filter(activo=True).count(),
        
        # Calificaciones
        'calificacion_promedio': float(Calificacion.objects.aggregate(
            promedio=Avg('puntuacion'))['promedio'] or 0),
        
        # Distancia
        'distancia_total_km': float(viajes_completados.aggregate(
            total=Sum('distancia_km'))['total'] or 0),
    }

    return Response(stats)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_activity_data(request):
    """Datos de actividad para gráficos"""
    start_date = request.query_params.get('start_date')
    end_date = request.query_params.get('end_date')

    if not start_date:
        end_dt = timezone.now()
        start_dt = end_dt - timedelta(days=7)
    else:
        start_dt = start_date
        end_dt = end_date

    viajes = Viaje.objects.filter(
        fecha_solicitud__date__range=[start_dt, end_dt] if isinstance(start_dt, str) else 
        [start_dt.date(), end_dt.date()]
    ).values('fecha_solicitud__date').annotate(
        total_viajes=Count('id_viaje'),
        completados=Count('id_viaje', filter=Q(estado='completado')),
        cancelados=Count('id_viaje', filter=Q(estado='cancelado')),
        ingresos=Sum('tarifa_final', filter=Q(estado='completado'))
    ).order_by('fecha_solicitud__date')

    activity_data = []
    for v in viajes:
        activity_data.append({
            'fecha': v['fecha_solicitud__date'].strftime('%Y-%m-%d'),
            'total_viajes': v['total_viajes'],
            'completados': v['completados'],
            'cancelados': v['cancelados'],
            'ingresos': float(v['ingresos'] or 0)
        })

    return Response(activity_data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_conductor_stats(request):
    """Estadísticas por conductor"""
    conductores = User.objects.filter(
        rol='conductor', is_active=True
    ).annotate(
        viajes_completados=Count('viajes_como_conductor', filter=Q(viajes_como_conductor__estado='completado')),
        ingresos=Sum('viajes_como_conductor__tarifa_final', filter=Q(viajes_como_conductor__estado='completado'))
    ).values(
        'id', 'first_name', 'last_name', 'disponible', 
        'calificacion_promedio', 'viajes_completados', 'ingresos'
    ).order_by('-viajes_completados')
    
    return Response(list(conductores))

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_zonas_populares(request):
    """Zonas más populares de origen y destino"""
    origenes = Viaje.objects.filter(
        estado='completado'
    ).values('origen_direccion').annotate(
        total=Count('id_viaje')
    ).order_by('-total')[:5]
    
    destinos = Viaje.objects.filter(
        estado='completado'
    ).values('destino_direccion').annotate(
        total=Count('id_viaje')
    ).order_by('-total')[:5]
    
    return Response({
        'origenes_populares': list(origenes),
        'destinos_populares': list(destinos)
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_viajes_recientes(request):
    """Últimos 10 viajes"""
    from viajes.serializers import ViajeSerializer
    viajes = Viaje.objects.all()[:10]
    serializer = ViajeSerializer(viajes, many=True)
    return Response(serializer.data)