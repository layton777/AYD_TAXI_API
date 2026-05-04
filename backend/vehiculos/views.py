from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Vehiculo
from .serializers import VehiculoSerializer
from authentication.permissions import EsAdministradorPermission

class VehiculoListCreateView(generics.ListCreateAPIView):
    serializer_class = VehiculoSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.es_administrador():
            return Vehiculo.objects.filter(activo=True)
        elif user.es_conductor():
            return Vehiculo.objects.filter(conductor=user, activo=True)
        return Vehiculo.objects.none()
    
    def perform_create(self, serializer):
        if not self.request.user.es_conductor() and not self.request.user.es_administrador():
            raise permissions.PermissionDenied("Solo conductores pueden registrar vehículos")
        # Si es conductor, asignar automáticamente
        if self.request.user.es_conductor():
            serializer.save(conductor=self.request.user)
        else:
            serializer.save()

class VehiculoDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = VehiculoSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id_vehiculo'
    
    def get_queryset(self):
        user = self.request.user
        if user.es_administrador():
            return Vehiculo.objects.all()
        elif user.es_conductor():
            return Vehiculo.objects.filter(conductor=user)
        return Vehiculo.objects.none()
    
    def perform_destroy(self, instance):
        instance.activo = False
        instance.save()
