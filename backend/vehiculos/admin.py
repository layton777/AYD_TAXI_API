from django.contrib import admin
from .models import Vehiculo

@admin.register(Vehiculo)
class VehiculoAdmin(admin.ModelAdmin):
    list_display = ('placa', 'marca', 'modelo', 'color', 'conductor', 'activo')
    list_filter = ('tipo', 'activo', 'marca')
    search_fields = ('placa', 'marca', 'modelo', 'conductor__username')
