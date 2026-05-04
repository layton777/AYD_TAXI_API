from django.urls import path
from . import views

urlpatterns = [
    path('', views.CalificacionListView.as_view(), name='calificacion-list'),
    path('crear/', views.crear_calificacion, name='crear-calificacion'),
    path('mis-calificaciones/', views.mis_calificaciones, name='mis-calificaciones'),
    path('usuario/<int:user_id>/', views.calificaciones_usuario, name='calificaciones-usuario'),
]
