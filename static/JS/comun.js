// cACA ESTAN TODAS LAS FUNCIONES COMUNES DEL PROYECTO

function mostrarError(input, mensaje) {
    let small = input.parentElement.querySelector('.error-js');
    if (!small) {
        small = document.createElement('small');
        small.className = 'error-js text-danger d-block mt-1';
        input.parentElement.appendChild(small);
    }
    small.textContent = mensaje;
    input.classList.toggle('is-invalid', mensaje !== '');
    input.classList.toggle('is-valid', mensaje === '' && input.value !== '');
}

function validarDNI(dni) {
    if (!/^[0-9]{7,8}$/.test(String(dni).trim())) {
        return 'El DNI debe tener 7 u 8 números.';
    }
    return '';
}

function validarFechaNacimiento(fechaStr) {
    if (!fechaStr) return 'Debe ingresar la fecha de nacimiento.';
    let hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    let fecha = new Date(fechaStr + 'T00:00:00');
    
    if (isNaN(fecha.getTime())) return 'Fecha inválida.';
    if (fecha > hoy) return 'La fecha no puede ser futura.';
    return '';
}

function validarEmail(email) {
    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) return 'Ingrese un correo electrónico válido.';
    return '';
}

// Sesion demo del artesano (localStorage para que persista en la demo)
const CLAVE_SESION = 'ponchoUser';

function obtenerSesion() {
    try {
        const raw = localStorage.getItem(CLAVE_SESION);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

function guardarSesion(usuario) {
    localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
}

function cerrarSesion() {
    localStorage.removeItem(CLAVE_SESION);
    location.href = 'login.html';
}

function exigirSesion() {
    const sesion = obtenerSesion();
    if (!sesion) {
        location.href = 'login.html';
        return null;
    }
    return sesion;
}