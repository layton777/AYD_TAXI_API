from django.urls import path
from . import views

urlpatterns = [
    path('', views.TarifaListCreateView.as_view(), name='tarifa-list-create'),
    path('calcular/', views.calcular_tarifa, name='calcular-tarifa'),
    path('zonas/', views.zonas_disponibles, name='zonas-disponibles'),
    path('<int:id_tarifa>/', views.TarifaDetailView.as_view(), name='tarifa-detail'),
]
