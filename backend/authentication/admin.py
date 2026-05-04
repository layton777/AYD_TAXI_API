from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuariopropio, CodigoRecuperacion, SolicitudAdministrador

@admin.register(Usuariopropio)
class UsuariopropioAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'rol', 'disponible', 'calificacion_promedio', 'is_active')
    list_filter = ('rol', 'disponible', 'is_active', 'is_staff')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'licencia')
    
    fieldsets = UserAdmin.fieldsets + (
        ('AYD TAXI', {'fields': ('telefono', 'codigo_pais', 'direccion', 'rol', 'foto_url', 
                                  'calificacion_promedio', 'licencia', 'disponible', 'latitud', 'longitud')}),
    )

@admin.register(CodigoRecuperacion)
class CodigoRecuperacionAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'codigo', 'usado', 'fecha_creacion', 'fecha_expiracion')
    list_filter = ('usado',)

@admin.register(SolicitudAdministrador)
class SolicitudAdministradorAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'codigo_verificacion', 'verificado', 'fecha_solicitud')
    list_filter = ('verificado',)