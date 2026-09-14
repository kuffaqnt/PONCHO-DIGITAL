// ACA SOLO HAY LOGICA PARA REGISTRO_ARTESANO.HTML
// Nota: la gestion del equipo del stand (1 a 10 integrantes) ahora vive en paneldeartesanos.js

// evento.target es el input donde se escribio
function validarDniEnVivo(evento) {
    const input = evento.target;
    mostrarError(input, validarDNI(input.value));
}

function validarFechaEnVivo(evento) {
    const input = evento.target;
    mostrarError(input, validarFechaNacimiento(input.value));
}

// al enviar se valida el titular (DNI + fecha de nacimiento)
function enviarRegistro(evento) {
    evento.preventDefault();

    const inputDniTitular = document.getElementById('dni');
    const inputFechaTitular = document.getElementById('fechaNacimiento');
    const errores = [];

    const errorDni = validarDNI(inputDniTitular.value);
    mostrarError(inputDniTitular, errorDni);
    if (errorDni) errores.push(errorDni);

    const errorFecha = validarFechaNacimiento(inputFechaTitular.value);
    mostrarError(inputFechaTitular, errorFecha);
    if (errorFecha) errores.push(errorFecha);

    if (errores.length > 0) {
        alert(errores[0]);
    } else {
        alert('Solicitud enviada con éxito. ¡Gracias por ser parte del Poncho!');
    }
}

function iniciarRegistro() {
    const inputDniTitular = document.getElementById('dni');
    if (!inputDniTitular) return;

    const formRegistro = inputDniTitular.closest('form');
    if (!formRegistro) return;

    // campo fecha de nacimiento, no esta en el HTML y se crea por JS
    const divCol = document.createElement('div');
    divCol.className = 'col-md-6 mb-3';

    const label = document.createElement('label');
    label.setAttribute('for', 'fechaNacimiento');
    label.className = 'form-label';
    label.textContent = 'Fecha de nacimiento';
    divCol.appendChild(label);

    const inputFechaTitular = document.createElement('input');
    inputFechaTitular.type = 'date';
    inputFechaTitular.id = 'fechaNacimiento';
    inputFechaTitular.name = 'fechaNacimiento';
    inputFechaTitular.required = true;
    inputFechaTitular.className = 'form-control';
    divCol.appendChild(inputFechaTitular);

    // se agrega en la misma fila que la localidad
    const localidad = document.getElementById('localidad');
    localidad.parentElement.parentElement.appendChild(divCol);

    inputFechaTitular.addEventListener('input', validarFechaEnVivo);
    inputDniTitular.addEventListener('input', validarDniEnVivo);

    formRegistro.addEventListener('submit', enviarRegistro);
}

document.addEventListener('DOMContentLoaded', iniciarRegistro);
