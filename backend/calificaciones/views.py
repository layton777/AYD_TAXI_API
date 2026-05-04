from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Calificacion
from .serializers import CalificacionSerializer, CrearCalificacionSerializer
from viajes.models import Viaje

User = get_user_model()

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_calificacion(request):
    """Crear calificación después de un viaje completado"""
    serializer = CrearCalificacionSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        
        try:
            viaje = Viaje.objects.get(id_viaje=data['viaje_id'], estado='completado')
        except Viaje.DoesNotExist:
            return Response({'detail': 'Viaje no encontrado o no completado'}, status=404)
        
        # Determinar quién es el calificado
        if request.user == viaje.pasajero:
            calificado = viaje.conductor
        elif request.user == viaje.conductor:
            calificado = viaje.pasajero
        else:
            return Response({'detail': 'No participaste en este viaje'}, status=403)
        
        if not calificado:
            return Response({'detail': 'No se puede calificar: el viaje no tiene conductor asignado'}, status=400)
        
        # Verificar si ya calificó
        if Calificacion.objects.filter(viaje=viaje, calificador=request.user).exists():
            return Response({'detail': 'Ya calificaste este viaje'}, status=400)
        
        calificacion = Calificacion.objects.create(
            viaje=viaje,
            calificador=request.user,
            calificado=calificado,
            puntuacion=data['puntuacion'],
            comentario=data.get('comentario', '')
        )
        
        return Response(CalificacionSerializer(calificacion).data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def calificaciones_usuario(request, user_id):
    """Ver calificaciones de un usuario"""
    try:
        usuario = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'detail': 'Usuario no encontrado'}, status=404)
    
    calificaciones = Calificacion.objects.filter(calificado=usuario)
    serializer = CalificacionSerializer(calificaciones, many=True)
    
    return Response({
        'usuario': f"{usuario.first_name} {usuario.last_name}",
        'calificacion_promedio': usuario.calificacion_promedio,
        'total_calificaciones': calificaciones.count(),
        'calificaciones': serializer.data
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mis_calificaciones(request):
    """Ver mis calificaciones recibidas"""
    calificaciones = Calificacion.objects.filter(calificado=request.user)
    serializer = CalificacionSerializer(calificaciones, many=True)
    
    return Response({
        'calificacion_promedio': request.user.calificacion_promedio,
        'total_calificaciones': calificaciones.count(),
        'calificaciones': serializer.data
    })

class CalificacionListView(generics.ListAPIView):
    """Lista todas las calificaciones (admin)"""
    serializer_class = CalificacionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.es_administrador():
            return Calificacion.objects.all()
        return Calificacion.objects.filter(calificado=self.request.user)
