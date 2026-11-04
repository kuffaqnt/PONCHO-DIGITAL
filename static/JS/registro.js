// ACA SOLO HAY LOGICA PARA REGISTRO_ARTESANO.HTML
// Nota: la gestion del equipo del stand (1 a 10 integrantes) ahora vive en paneldeartesanos.js

// evento.target es el input donde se escribio
function validarDniEnVivo(evento) {
    const input = evento.target;
    mostrarError(input, validarDNI(input.value));
}

// al enviar se valida el DNI del titular, si esta bien el form va a Django
function enviarRegistro(evento) {
    const inputDniTitular = document.getElementById('dni');
    const errorDni = validarDNI(inputDniTitular.value);
    mostrarError(inputDniTitular, errorDni);

    if (errorDni) {
        evento.preventDefault();
        alert(errorDni);
    }
}

function iniciarRegistro() {
    const inputDniTitular = document.getElementById('dni');
    if (!inputDniTitular) return;

    const formRegistro = inputDniTitular.closest('form');
    if (!formRegistro) return;

    inputDniTitular.addEventListener('input', validarDniEnVivo);
    formRegistro.addEventListener('submit', enviarRegistro);
}

document.addEventListener('DOMContentLoaded', iniciarRegistro);
