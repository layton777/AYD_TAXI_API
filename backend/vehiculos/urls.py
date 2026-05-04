from django.urls import path
from . import views

urlpatterns = [
    path('', views.VehiculoListCreateView.as_view(), name='vehiculo-list-create'),
    path('<int:id_vehiculo>/', views.VehiculoDetailView.as_view(), name='vehiculo-detail'),
]
