from django.contrib.auth.models import Group, User
from django.core import mail
from django.test import TestCase
from django.urls import reverse

from .models import Artesano, Stand


def crear_artesano(email='rosa@correo.com', dni='30111222', estado='pendiente'):
    return Artesano.objects.create(
        nombre='Rosa Quiroga', dni=dni, email=email, nombre_taller='Telares Rosa',
        rubro='textil', localidad='belen', estado=estado,
    )


def crear_admin():
    admin = User.objects.create_user('admin@correo.com', 'admin@correo.com', 'clave-segura-1', is_staff=True)
    admin.groups.add(Group.objects.get(name='Administradores'))
    return admin


class PostulacionTests(TestCase):
    def datos(self):
        return {
            'nombre': 'Rosa Quiroga', 'dni': '30111222', 'telefono': '3834123456',
            'email': 'Rosa@Correo.com', 'localidad': 'belen', 'nombre_taller': 'Telares Rosa',
            'rubro': 'textil', 'anios_trayectoria': 10, 'descripcion': 'Telar criollo',
            'contrasenia': 'clave-segura-1', 'repetir_contrasenia': 'clave-segura-1',
            'consentimiento': 'on',
        }

    def test_crea_solicitud_pendiente_y_usuario(self):
        crear_admin()
        respuesta = self.client.post(reverse('registro_artesano'), self.datos())
        self.assertRedirects(respuesta, reverse('login'))
        self.assertEqual(Artesano.objects.get().estado, 'pendiente')
        usuario = User.objects.get(username='rosa@correo.com')
        self.assertFalse(usuario.has_perm('productos.add_producto'))
        self.assertEqual(len(mail.outbox), 1)

    def test_sin_consentimiento_no_se_registra(self):
        datos = self.datos()
        del datos['consentimiento']
        self.client.post(reverse('registro_artesano'), datos)
        self.assertEqual(Artesano.objects.count(), 0)
        self.assertFalse(User.objects.filter(username='rosa@correo.com').exists())

    def test_contrasenias_distintas(self):
        datos = self.datos()
        datos['repetir_contrasenia'] = 'otra-clave-2'
        self.client.post(reverse('registro_artesano'), datos)
        self.assertEqual(Artesano.objects.count(), 0)

    def test_el_postulante_ve_su_estado_en_el_panel(self):
        self.client.post(reverse('registro_artesano'), self.datos())
        self.client.login(username='rosa@correo.com', password='clave-segura-1')
        respuesta = self.client.get(reverse('panel_artesano'))
        self.assertContains(respuesta, 'Pendiente de evaluación')
        self.assertNotContains(respuesta, 'Ir a Gestión de Productos')


class EvaluacionTests(TestCase):
    def setUp(self):
        self.artesano = crear_artesano()
        self.usuario = User.objects.create_user('rosa@correo.com', 'rosa@correo.com', 'clave-segura-1')
        self.client.force_login(crear_admin())
        self.url = reverse('detalle_solicitud', args=[self.artesano.id])

    def test_aprobar_da_permisos_y_avisa(self):
        self.client.post(self.url, {'accion': 'aprobar'})
        self.artesano.refresh_from_db()
        self.assertEqual(self.artesano.estado, 'aprobada')
        usuario = User.objects.get(pk=self.usuario.pk)
        self.assertTrue(usuario.has_perm('productos.add_producto'))
        self.assertEqual(mail.outbox[0].to, ['rosa@correo.com'])

    def test_modificacion_exige_observaciones(self):
        self.client.post(self.url, {'accion': 'modificacion', 'observaciones': ''})
        self.artesano.refresh_from_db()
        self.assertEqual(self.artesano.estado, 'pendiente')

    def test_corregir_vuelve_a_pendiente(self):
        self.client.post(self.url, {'accion': 'modificacion', 'observaciones': 'Falta el teléfono'})
        self.client.force_login(self.usuario)
        self.assertContains(self.client.get(reverse('panel_artesano')), 'Falta el teléfono')
        self.client.post(reverse('corregir_solicitud'), {
            'nombre': 'Rosa Quiroga', 'telefono': '3834123456', 'localidad': 'belen',
            'nombre_taller': 'Telares Rosa', 'rubro': 'textil', 'anios_trayectoria': 3,
            'descripcion': 'Telar',
        })
        self.artesano.refresh_from_db()
        self.assertEqual(self.artesano.estado, 'pendiente')
        self.assertEqual(self.artesano.telefono, '3834123456')

    def test_corregir_sin_pedido_da_404(self):
        self.client.force_login(self.usuario)
        self.assertEqual(self.client.get(reverse('corregir_solicitud')).status_code, 404)


class PermisosTests(TestCase):
    def test_paneles_de_admin(self):
        urls = [reverse('panel_admin'), reverse('reportes'), reverse('reportes_excel')]
        for url in urls:
            self.assertEqual(self.client.get(url).status_code, 302)

        self.client.force_login(User.objects.create_user('comun@correo.com', password='x'))
        for url in urls:
            self.assertEqual(self.client.get(url).status_code, 403)

        self.client.force_login(crear_admin())
        for url in urls:
            self.assertEqual(self.client.get(url).status_code, 200)

    def test_no_se_sirven_archivos_del_proyecto(self):
        self.assertEqual(self.client.get('/manage.py').status_code, 404)


class VisitantesTests(TestCase):
    def test_ficha_oculta_no_aprobados(self):
        pendiente = crear_artesano()
        aprobado = crear_artesano('ana@correo.com', '30111333', 'aprobada')
        self.assertEqual(self.client.get(reverse('detalle_stand', args=[pendiente.id])).status_code, 404)
        self.assertContains(self.client.get(reverse('detalle_stand', args=[aprobado.id])), 'Trayectoria')

    def test_localizar_stand(self):
        Stand.objects.create(numero=12, pabellon='pabellon_1', ubicacion='Pasillo central')
        url = reverse('visitantes')
        self.assertContains(self.client.get(url, {'stand': '12'}), 'Pasillo central')
        self.assertContains(self.client.get(url, {'stand': '99'}), 'No se encontró el stand solicitado')
        self.assertContains(self.client.get(url, {'stand': 'abc'}), 'No se encontró el stand solicitado')

    def test_marcador_en_el_plano(self):
        aprobado = crear_artesano(estado='aprobada')
        Stand.objects.create(numero=7, pabellon='pabellon_1', artesano=aprobado, estado='ocupado', plano_x=40, plano_y=25)
        Stand.objects.create(numero=8, pabellon='pabellon_1', plano_x=50, plano_y=25)
        respuesta = self.client.get(reverse('visitantes'))
        self.assertContains(respuesta, 'left: 40%')
        self.assertNotContains(respuesta, 'left: 50%')
