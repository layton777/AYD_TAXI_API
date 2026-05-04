from django.contrib import admin
from .models import Tarifa

@admin.register(Tarifa)
class TarifaAdmin(admin.ModelAdmin):
    list_display = ('zona_origen', 'zona_destino', 'precio_base', 'precio_por_km', 'activo')
    list_filter = ('zona_origen', 'zona_destino', 'activo')
    search_fields = ('zona_origen', 'zona_destino')
