from rest_framework import permissions

class EsAdministradorPermission(permissions.BasePermission):
    """
    Permiso personalizado que solo permite acceso a administradores
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Permitir a superusuarios y administradores
        return request.user.es_administrador()

class PuedeModificarPermission(permissions.BasePermission):
    """
    Permiso para operaciones de modificación (POST, PUT, PATCH, DELETE)
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Si es solo lectura (GET, HEAD, OPTIONS), permitir a todos
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Para modificaciones, solo administradores
        return request.user.puede_modificar()

class PuedeVisualizarPermission(permissions.BasePermission):
    """
    Permiso básico de visualización
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        return request.user.puede_visualizar()
