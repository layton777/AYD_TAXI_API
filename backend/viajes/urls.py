from django.urls import path
from . import views

urlpatterns = [
    path('', views.ViajeListView.as_view(), name='viaje-list'),
    path('solicitar/', views.solicitar_viaje, name='solicitar-viaje'),
    path('activos/', views.viajes_activos, name='viajes-activos'),
    path('pendientes/', views.viajes_pendientes, name='viajes-pendientes'),
    path('historial/', views.historial_viajes, name='historial-viajes'),
    path('<int:id_viaje>/', views.ViajeDetailView.as_view(), name='viaje-detail'),
    path('<int:id_viaje>/aceptar/', views.aceptar_viaje, name='aceptar-viaje'),
    path('<int:id_viaje>/iniciar/', views.iniciar_viaje, name='iniciar-viaje'),
    path('<int:id_viaje>/completar/', views.completar_viaje, name='completar-viaje'),
    path('<int:id_viaje>/cancelar/', views.cancelar_viaje, name='cancelar-viaje'),
]
