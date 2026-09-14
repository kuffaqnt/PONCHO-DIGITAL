// ACA SOLO HAY LOGICA PARA LOGIN.HTML

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
    const inputCorreo = document.getElementById('correo');
    const inputContrasenia = document.getElementById('contrasenia');

    const errorCorreo = validarCorreo(inputCorreo.value.trim());
    const errorContrasenia = validarContrasenia(inputContrasenia.value);
    mostrarError(inputCorreo, errorCorreo);
    mostrarError(inputContrasenia, errorContrasenia);

    if (errorCorreo !== '' || errorContrasenia !== '') {
        evento.preventDefault();
    }
}

function iniciarLogin() {
    const formLogin = document.getElementById('form-login');
    const inputCorreo = document.getElementById('correo');
    const inputContrasenia = document.getElementById('contrasenia');

    if (!formLogin || !inputCorreo || !inputContrasenia) return;

    inputCorreo.addEventListener('blur', validarCorreoAlSalir);
    inputContrasenia.addEventListener('blur', validarContraseniaAlSalir);
    formLogin.addEventListener('submit', enviarLogin);
}

document.addEventListener('DOMContentLoaded', iniciarLogin);
