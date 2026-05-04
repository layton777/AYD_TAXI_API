from django.urls import path
from . import views

urlpatterns = [
    path('stats/', views.get_stats, name='dashboard-stats'),
    path('activity/', views.get_activity_data, name='dashboard-activity'),
    path('conductores/', views.get_conductor_stats, name='dashboard-conductores'),
    path('zonas/', views.get_zonas_populares, name='dashboard-zonas'),
    path('viajes-recientes/', views.get_viajes_recientes, name='dashboard-viajes-recientes'),
]