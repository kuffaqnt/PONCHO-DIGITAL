// ACA SOLO HAY LOGICA PARA LOGIN.HTML

// Usuario generico de prueba para la demo del panel artesano
const USUARIO_DEMO = {
    email: 'artesano@poncho.com',
    pass: '12345678',
    nombre: 'Artesano Demo',
    taller: 'Telares del Ambato'
};

// primero se revisa que no este vacio y despues el formato con validarEmail de comun.js
function validarCorreo(correo) {
    if (correo === '') return 'Debe ingresar el correo electrónico.';
    return validarEmail(correo);
}

function validarContrasenia(contrasenia) {
    if (contrasenia === '') return 'Debe ingresar la contraseña.';
    if (contrasenia.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
    return '';
}

function validarCorreoAlSalir() {
    const inputCorreo = document.getElementById('correo');
    mostrarError(inputCorreo, validarCorreo(inputCorreo.value.trim()));
}

function validarContraseniaAlSalir() {
    const inputContrasenia = document.getElementById('contrasenia');
    mostrarError(inputContrasenia, validarContrasenia(inputContrasenia.value));
}

function enviarLogin(evento) {
    evento.preventDefault();

    const inputCorreo = document.getElementById('correo');
    const inputContrasenia = document.getElementById('contrasenia');

    const errorCorreo = validarCorreo(inputCorreo.value.trim());
    const errorContrasenia = validarContrasenia(inputContrasenia.value);
    mostrarError(inputCorreo, errorCorreo);
    mostrarError(inputContrasenia, errorContrasenia);

    if (errorCorreo !== '' || errorContrasenia !== '') {
        return;
    }

    const email = inputCorreo.value.trim().toLowerCase();
    const pass = inputContrasenia.value;

    if (email === USUARIO_DEMO.email && pass === USUARIO_DEMO.pass) {
        guardarSesion({ email: USUARIO_DEMO.email, nombre: USUARIO_DEMO.nombre, taller: USUARIO_DEMO.taller });
        location.href = 'paneldeartesanos.html';
    } else {
        mostrarError(inputContrasenia, 'Credenciales incorrectas. Probá con artesano@poncho.com / 12345678');
    }
}

function iniciarLogin() {
    // si ya hay sesion, ir directo al panel
    if (obtenerSesion()) {
        location.href = 'paneldeartesanos.html';
        return;
    }

    const formLogin = document.getElementById('form-login');
    const inputCorreo = document.getElementById('correo');
    const inputContrasenia = document.getElementById('contrasenia');

    if (!formLogin || !inputCorreo || !inputContrasenia) return;

    inputCorreo.addEventListener('blur', validarCorreoAlSalir);
    inputContrasenia.addEventListener('blur', validarContraseniaAlSalir);
    formLogin.addEventListener('submit', enviarLogin);
}

document.addEventListener('DOMContentLoaded', iniciarLogin);
