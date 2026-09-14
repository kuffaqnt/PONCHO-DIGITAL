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