from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.test_auth, name='test-auth'),
    path('registro/', views.RegistroUsuarioView.as_view(), name='registro'),
    path('perfil/', views.PerfilUsuarioView.as_view(), name='perfil'),
    path('usuarios/', views.ListaUsuariosView.as_view(), name='lista-usuarios'),
    path('usuarios/<int:pk>/', views.GestionUsuarioView.as_view(), name='gestion-usuario'),
    path('conductores/', views.ListaConductoresView.as_view(), name='lista-conductores'),
    path('conductores/disponibles/', views.conductores_disponibles, name='conductores-disponibles'),
    path('conductor/ubicacion/', views.actualizar_ubicacion_conductor, name='actualizar-ubicacion'),
    path('conductor/disponibilidad/', views.toggle_disponibilidad, name='toggle-disponibilidad'),
    path('recuperar-password/', views.enviar_codigo_recuperacion, name='recuperar-password'),
    path('verificar-codigo/', views.verificar_codigo_recuperacion, name='verificar-codigo'),
    path('cambiar-password/', views.cambiar_password_con_codigo, name='cambiar-password'),
    path('solicitar-admin/', views.solicitar_permisos_administrador, name='solicitar-admin'),
    path('verificar-admin/', views.verificar_codigo_administrador, name='verificar-admin'),
]