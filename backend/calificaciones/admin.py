from django.contrib import admin
from .models import Calificacion

@admin.register(Calificacion)
class CalificacionAdmin(admin.ModelAdmin):
    list_display = ('id_calificacion', 'calificador', 'calificado', 'puntuacion', 'fecha')
    list_filter = ('puntuacion', 'fecha')
    search_fields = ('calificador__username', 'calificado__username', 'comentario')
