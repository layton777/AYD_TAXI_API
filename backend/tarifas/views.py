from decimal import Decimal
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Tarifa
from .serializers import TarifaSerializer, CalcularTarifaSerializer
from authentication.permissions import EsAdministradorPermission

class TarifaListCreateView(generics.ListCreateAPIView):
    serializer_class = TarifaSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [EsAdministradorPermission()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        queryset = Tarifa.objects.filter(activo=True)
        zona_origen = self.request.query_params.get('zona_origen')
        zona_destino = self.request.query_params.get('zona_destino')
        if zona_origen:
            queryset = queryset.filter(zona_origen=zona_origen)
        if zona_destino:
            queryset = queryset.filter(zona_destino=zona_destino)
        return queryset

class TarifaDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TarifaSerializer
    permission_classes = [EsAdministradorPermission]
    queryset = Tarifa.objects.all()
    lookup_field = 'id_tarifa'

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def calcular_tarifa(request):
    """Calcula la tarifa estimada para un viaje"""
    serializer = CalcularTarifaSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        
        # Buscar tarifa configurada
        try:
            tarifa = Tarifa.objects.get(
                zona_origen=data['zona_origen'],
                zona_destino=data['zona_destino'],
                activo=True
            )
            precio = tarifa.precio_base
            if data.get('distancia_km', 0) > 0:
                precio += tarifa.precio_por_km * Decimal(str(data['distancia_km']))
            
            if data.get('es_nocturno'):
                precio += precio * (tarifa.recargo_nocturno / 100)
            if data.get('es_festivo'):
                precio += precio * (tarifa.recargo_festivo / 100)
            
            return Response({
                'tarifa_estimada': round(precio, 2),
                'precio_base': tarifa.precio_base,
                'precio_por_km': tarifa.precio_por_km,
                'distancia_km': data.get('distancia_km', 0),
                'recargo_nocturno': tarifa.recargo_nocturno if data.get('es_nocturno') else 0,
                'recargo_festivo': tarifa.recargo_festivo if data.get('es_festivo') else 0,
            })
        except Tarifa.DoesNotExist:
            # Tarifa por defecto
            TARIFA_BASE = Decimal('4500')
            PRECIO_POR_KM = Decimal('1800')
            precio = TARIFA_BASE + PRECIO_POR_KM * Decimal(str(data.get('distancia_km', 0)))
            
            return Response({
                'tarifa_estimada': round(precio, 2),
                'precio_base': TARIFA_BASE,
                'precio_por_km': PRECIO_POR_KM,
                'distancia_km': data.get('distancia_km', 0),
                'nota': 'Tarifa por defecto (zona no configurada)'
            })
    return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def zonas_disponibles(request):
    """Lista las zonas disponibles para tarifas"""
    zonas = [z[0] for z in Tarifa.ZONAS]
    return Response({'zonas': zonas})
