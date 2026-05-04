from datetime import timedelta
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from authentication.models import CodigoRecuperacion, SolicitudAdministrador

User = get_user_model()

class AuthenticationTests(APITestCase):
    def setUp(self):
        # Crear un usuario para las pruebas
        self.user_data = {
            'username': 'testuser',
            'password': 'testpass123',
            'email': 'test@example.com',
            'telefono': '1234567890',
            'direccion': 'Test Address'
        }
        self.user = User.objects.create_user(
            username=self.user_data['username'],
            password=self.user_data['password'],
            email=self.user_data['email']
        )
        
        # Crear un superusuario para las pruebas
        self.admin_data = {
            'username': 'admin',
            'password': 'admin123',
            'email': 'admin@example.com'
        }
        self.admin = User.objects.create_superuser(
            username=self.admin_data['username'],
            password=self.admin_data['password'],
            email=self.admin_data['email']
        )

    def test_registro_usuario(self):
        """Prueba el registro de un nuevo usuario"""
        url = reverse('registro_usuario')
        data = {
            'username': 'newuser',
            'password': 'newpass123',
            'password2': 'newpass123',
            'email': 'new@example.com',
            'telefono': '0987654321',
            'direccion': 'New Address'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_login_usuario(self):
        """Prueba el inicio de sesión de un usuario"""
        # Usamos la vista de token_obtain_pair de DRF Simple JWT
        url = '/api/token/'
        data = {
            'username': self.user_data['username'],
            'password': self.user_data['password']
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_refresh_token(self):
        """Prueba la renovación del token de acceso"""
        refresh = RefreshToken.for_user(self.user)
        url = '/api/token/refresh/'
        data = {'refresh': str(refresh)}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_perfil_usuario(self):
        """Prueba la vista del perfil de usuario"""
        url = reverse('perfil_usuario')
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user_data['username'])

    def test_actualizar_perfil(self):
        """Prueba la actualización del perfil de usuario"""
        url = reverse('perfil_usuario')
        self.client.force_authenticate(user=self.user)
        data = {
            'telefono': '1111111111',
            'direccion': 'Updated Address'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['telefono'], data['telefono'])
        self.assertEqual(response.data['direccion'], data['direccion'])

    def test_lista_usuarios_admin(self):
        """Prueba que solo los administradores pueden ver la lista de usuarios"""
        url = reverse('lista_usuarios')
        
        # Intento con usuario normal
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Intento con administrador
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_registro_password_no_coincide(self):
        """Prueba que el registro falla cuando las contraseñas no coinciden"""
        url = reverse('registro_usuario')
        data = {
            'username': 'newuser',
            'password': 'pass123',
            'password2': 'pass456',
            'email': 'new@example.com'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_registro_campos_requeridos(self):
        """Prueba que los campos requeridos son validados"""
        url = reverse('registro_usuario')
        response = self.client.post(url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)
        self.assertIn('password', response.data)
        self.assertIn('email', response.data)

    def test_login_credenciales_invalidas(self):
        """Prueba el inicio de sesión con credenciales inválidas"""
        url = reverse('token_obtain_pair')
        data = {
            'username': 'usuario_inexistente',
            'password': 'clave_incorrecta'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_actualizar_perfil_usuario_no_autenticado(self):
        """Prueba que no se puede actualizar el perfil sin autenticación"""
        url = reverse('perfil_usuario')
        data = {'first_name': 'NuevoNombre'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_obtener_perfil_usuario_no_autenticado(self):
        """Prueba que no se puede obtener el perfil sin autenticación"""
        url = reverse('perfil_usuario')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_refresh_token_invalido(self):
        """Prueba la renovación con un token de actualización inválido"""
        url = '/api/token/refresh/'
        data = {'refresh': 'token_invalido'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_codigo_recuperacion_creacion(self):
        """Prueba la creación de un código de recuperación"""
        codigo = CodigoRecuperacion.objects.create(
            usuario=self.user,
            codigo='123456',
            fecha_expiracion=timezone.now() + timedelta(hours=24)
        )
        self.assertIsNotNone(codigo)
        self.assertEqual(codigo.usuario, self.user)
        self.assertFalse(codigo.usado)

    def test_solicitud_administrador_creacion(self):
        """Prueba la creación de una solicitud de administrador"""
        solicitud = SolicitudAdministrador.objects.create(
            usuario=self.user,
            codigo_verificacion='ABCD1234',
            fecha_expiracion=timezone.now() + timedelta(hours=24),
            motivo='Necesito permisos de administrador'
        )
        self.assertIsNotNone(solicitud)
        self.assertEqual(solicitud.usuario, self.user)
        self.assertFalse(solicitud.verificado)

    def test_usuario_es_administrador(self):
        """Prueba el método es_administrador del modelo Usuario"""
        # Usuario normal no es administrador
        self.assertFalse(self.user.es_administrador())
        
        # Usuario con rol admin es administrador
        admin_user = User.objects.create_user(
            username='admin_test',
            password='testpass123',
            email='admin_test@example.com',
            rol='admin'
        )
        self.assertTrue(admin_user.es_administrador())
        
        # Superusuario siempre es administrador
        self.assertTrue(self.admin.es_administrador())

    def test_serializer_registro_valido(self):
        """Prueba que el serializador de registro valida correctamente"""
        from .serializers import RegistroUsuarioSerializer
        
        # Datos válidos
        data = {
            'username': 'test_serializer',
            'password': 'testpass123',
            'password2': 'testpass123',
            'email': 'test_serializer@example.com',
            'telefono': '1234567890',
            'codigo_pais': 'CO',
            'direccion': 'Test address'
        }
        
        serializer = RegistroUsuarioSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        
        # Guardar y verificar que se crea el usuario
        user = serializer.save()
        self.assertEqual(user.username, 'test_serializer')
        self.assertTrue(user.check_password('testpass123'))
        
        # Verificar que la contraseña no se devuelve en la respuesta
        self.assertNotIn('password', serializer.data)
        
        # Verificar que el rol por defecto es 'viewer'
        self.assertEqual(user.rol, 'viewer')

    def test_serializer_perfil_usuario(self):
        """Prueba el serializador de perfil de usuario"""
        from .serializers import PerfilUsuarioSerializer
        
        # Datos para actualizar
        data = {
            'first_name': 'Nuevo',
            'last_name': 'Usuario',
            'email': 'nuevo@example.com',
            'telefono': '9876543210',
            'codigo_pais': 'US',
            'direccion': 'Nueva dirección'
        }
        
        serializer = PerfilUsuarioSerializer(instance=self.user, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        
        # Actualizar el usuario
        user = serializer.save()
        self.assertEqual(user.first_name, 'Nuevo')
        self.assertEqual(user.last_name, 'Usuario')
        self.assertEqual(user.email, 'nuevo@example.com')
        self.assertEqual(user.telefono, '9876543210')
        self.assertEqual(user.codigo_pais, 'US')
        self.assertEqual(user.direccion, 'Nueva dirección')
        
        # Verificar que no se puede actualizar el rol
        data = {'rol': 'admin'}
        serializer = PerfilUsuarioSerializer(instance=self.user, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        # El rol no debería cambiar
        self.assertEqual(user.rol, 'viewer')