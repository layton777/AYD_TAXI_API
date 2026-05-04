from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from authentication.views import LoginPersonalizadoView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
    path('api/token/', LoginPersonalizadoView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/vehiculos/', include('vehiculos.urls')),
    path('api/viajes/', include('viajes.urls')),
    path('api/tarifas/', include('tarifas.urls')),
    path('api/calificaciones/', include('calificaciones.urls')),
    path('api/dashboard/', include('dashboard.urls')),
]