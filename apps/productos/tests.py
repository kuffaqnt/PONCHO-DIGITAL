from django.contrib.auth.models import Group, User
from django.test import TestCase
from django.urls import reverse

from apps.artesanos.models import Artesano
from .models import Producto


def crear_dueno(email, dni):
    artesano = Artesano.objects.create(
        nombre='Rosa Quiroga', dni=dni, email=email, nombre_taller='Taller ' + dni,
        rubro='textil', localidad='belen', estado='aprobada',
    )
    usuario = User.objects.create_user(email, email, 'clave-segura-1')
    usuario.groups.add(Group.objects.get(name='Artesanos'))
    return artesano, usuario


class ProductosTests(TestCase):
    def setUp(self):
        self.artesano, self.dueno = crear_dueno('rosa@correo.com', '30111222')
        self.otro_artesano, self.otro = crear_dueno('ana@correo.com', '30111333')
        self.producto = Producto.objects.create(artesano=self.artesano, nombre="Mate d'Oro", stock=3)
        self.editar = reverse('editar_producto', args=[self.producto.id])
        self.eliminar = reverse('eliminar_producto', args=[self.producto.id])
        self.datos = {'nombre': 'Poncho', 'descripcion': '', 'stock': 5}

    def test_el_dueno_edita(self):
        self.client.force_login(self.dueno)
        self.assertRedirects(self.client.post(self.editar, self.datos), reverse('gestion_productos'))
        self.producto.refresh_from_db()
        self.assertEqual(self.producto.stock, 5)

    def test_otro_artesano_no_edita_ni_elimina(self):
        self.client.force_login(self.otro)
        self.assertEqual(self.client.post(self.editar, self.datos).status_code, 403)
        self.assertEqual(self.client.post(self.eliminar).status_code, 403)
        self.producto.refresh_from_db()
        self.assertEqual(self.producto.stock, 3)
        self.assertTrue(self.producto.visible)

    def test_el_superusuario_edita(self):
        self.client.force_login(User.objects.create_superuser('root', password='clave-segura-1'))
        self.assertEqual(self.client.post(self.editar, self.datos).status_code, 302)
        self.producto.refresh_from_db()
        self.assertEqual(self.producto.stock, 5)

    def test_postulante_sin_aprobar_no_gestiona(self):
        self.client.force_login(User.objects.create_user('nuevo@correo.com', password='x'))
        self.assertEqual(self.client.get(reverse('gestion_productos')).status_code, 403)

    def test_eliminar_oculta_el_producto(self):
        self.client.force_login(self.dueno)
        self.client.post(self.eliminar)
        self.producto.refresh_from_db()
        self.assertFalse(self.producto.visible)
        self.assertNotContains(self.client.get(reverse('catalogo')), 'Oro')
        self.assertEqual(self.client.get(reverse('ficha_producto', args=[self.producto.id])).status_code, 404)

    def test_catalogo_filtra(self):
        pendiente = Artesano.objects.create(
            nombre='Luis', dni='30111444', email='luis@correo.com', nombre_taller='Otro',
            rubro='cuero', localidad='capital',
        )
        Producto.objects.create(artesano=pendiente, nombre='Cinto escondido')
        url = reverse('catalogo')
        self.assertNotContains(self.client.get(url), 'Cinto escondido')
        self.assertContains(self.client.get(url, {'rubro': 'textil'}), 'Taller 30111222')
        self.assertNotContains(self.client.get(url, {'rubro': 'cuero'}), 'Taller 30111222')
        self.assertNotContains(self.client.get(url, {'q': 'poncho'}), 'Taller 30111222')
