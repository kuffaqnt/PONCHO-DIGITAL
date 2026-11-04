from django.contrib.auth.models import User
from django.core.mail import send_mail


# RU-11, avisa al postulante cómo quedó su solicitud
def avisar_estado(artesano):
    mensaje = f'Hola {artesano.nombre}, tu solicitud para {artesano.nombre_taller} quedó en estado: {artesano.get_estado_display()}.'
    if artesano.observaciones:
        mensaje += f'\n\nObservaciones: {artesano.observaciones}'
    send_mail('Estado de tu solicitud - Poncho Digital', mensaje, None, [artesano.email], fail_silently=True)


# CU-01, avisa a los administradores que hay una solicitud para evaluar
def avisar_nueva_solicitud(artesano):
    correos = []
    for usuario in User.objects.filter(is_staff=True).exclude(email=''):
        correos.append(usuario.email)
    if correos:
        mensaje = f'{artesano.nombre_taller} envió una solicitud y está pendiente de evaluación.'
        send_mail('Nueva solicitud - Poncho Digital', mensaje, None, correos, fail_silently=True)
