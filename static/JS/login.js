// ACA SOLO HAY LOGICA PARA LOGIN.HTML

// Usuario generico de prueba para la demo del panel artesano
const USUARIOS = {
    artesano: {
    email: 'artesano@poncho.com',
    pass: '12345678',
    nombre: 'Artesano Demo',
    taller: 'Telares del Ambato',
    rol: 'artesano'
},
    admin: { 
    email: 'admin@poncho.com',
    pass: '987654321',
    nombre: 'Admin Demo',
    rol: 'admin'
}
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

    if (email === USUARIOS.admin.email && pass === USUARIOS.admin.pass) {
        guardarSesion({ email: USUARIOS.admin.email, nombre: USUARIOS.admin.nombre, rol:'admin' });
        location.href = '/panel-admin/';
        return;
    } 
    
    if (email === USUARIOS.artesano.email && pass === USUARIOS.artesano.pass) {
        guardarSesion({ email: USUARIOS.artesano.email, nombre: USUARIOS.artesano.nombre, taller: USUARIOS.artesano.taller, rol:'artesano' });
        location.href = '/panel/';
        return;
    } 
    
    else {
        mostrarError(inputContrasenia, 'Credenciales incorrectas. Probá con artesano@poncho.com / 12345678');
    }
}

function iniciarLogin() {
    const sesion = obtenerSesion();
    if (sesion) {
        if (sesion.rol === 'admin'){
            location.href='/panel-admin/';
        }
        else { 
            location.href = '/panel/';
        }
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
