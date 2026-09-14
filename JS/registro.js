// ACA SOLO HAY LOGICA PARA REGISTRO_ARTESANO.HTML

document.addEventListener('DOMContentLoaded', () => {
    const inputDniTitular = document.getElementById('dni');
    const formRegistro = inputDniTitular ? inputDniTitular.closest('form') : null;

    if (!formRegistro) return;

    // campo fecha de nacimiento, se crea por JS si no existe
    let inputFechaTitular = document.getElementById('fechaNacimiento');
    if (!inputFechaTitular) {
        const fieldset = inputDniTitular.closest('fieldset');
        const divCol = document.createElement('div');
        divCol.className = 'col-md-6 mb-3';

        const label = document.createElement('label');
        label.setAttribute('for', 'fechaNacimiento');
        label.className = 'form-label';
        label.textContent = 'Fecha de nacimiento';
        divCol.appendChild(label);

        inputFechaTitular = document.createElement('input');
        inputFechaTitular.type = 'date';
        inputFechaTitular.id = 'fechaNacimiento';
        inputFechaTitular.name = 'fechaNacimiento';
        inputFechaTitular.required = true;
        inputFechaTitular.className = 'form-control';
        divCol.appendChild(inputFechaTitular);

        const localidad = document.getElementById('localidad');
        if (localidad && localidad.parentElement.parentElement) {
            localidad.parentElement.parentElement.appendChild(divCol);
        } else {
            fieldset.appendChild(divCol);
        }

        inputFechaTitular.addEventListener('input', () => {
            mostrarError(inputFechaTitular, validarFechaNacimiento(inputFechaTitular.value));
        });
    }

    inputDniTitular.addEventListener('input', () => {
        mostrarError(inputDniTitular, validarDNI(inputDniTitular.value));
    });

    // generador de integrantes del stand (1 a 10)
    const seccion = formRegistro.parentElement;
    const bloqueGen = document.createElement('div');
    bloqueGen.id = 'seccionIntegrantes';
    bloqueGen.className = 'tarjeta-formulario mt-4 p-4';

    const h3 = document.createElement('h3');
    h3.textContent = 'Integrantes del stand';
    h3.style.color = 'var(--poncho-dark)';
    bloqueGen.appendChild(h3);

    const desc = document.createElement('p');
    desc.textContent = 'Si el stand lo atienden varias personas, indicá cuántas son (1 a 10) y generá sus fichas.';
    bloqueGen.appendChild(desc);

    const rowGen = document.createElement('div');
    rowGen.className = 'd-flex flex-wrap gap-2 align-items-end';

    const divCant = document.createElement('div');
    const labelCant = document.createElement('label');
    labelCant.setAttribute('for', 'cantidadIntegrantes');
    labelCant.className = 'form-label';
    labelCant.textContent = 'Cantidad de integrantes';
    divCant.appendChild(labelCant);

    const inputCant = document.createElement('input');
    inputCant.type = 'number';
    inputCant.id = 'cantidadIntegrantes';
    inputCant.min = '1';
    inputCant.max = '10';
    inputCant.value = '1';
    inputCant.className = 'form-control';
    inputCant.style.maxWidth = '140px';
    divCant.appendChild(inputCant);
    rowGen.appendChild(divCant);

    const btnGen = document.createElement('button');
    btnGen.type = 'button';
    btnGen.id = 'btnGenerar';
    btnGen.className = 'btn-poncho-principal';
    btnGen.textContent = 'Generar integrantes';
    rowGen.appendChild(btnGen);
    bloqueGen.appendChild(rowGen);

    const contenedor = document.createElement('div');
    contenedor.id = 'contenedorIntegrantes';
    contenedor.className = 'row g-3 mt-3';
    bloqueGen.appendChild(contenedor);

    seccion.appendChild(bloqueGen);

    function crearBloqueIntegrante(i) {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6';

        const card = document.createElement('div');
        card.className = 'p-3 border rounded bg-white h-100';

        const titulo = document.createElement('h5');
        titulo.textContent = 'Integrante ' + i;
        titulo.style.color = 'var(--poncho)';
        card.appendChild(titulo);

        const d1 = document.createElement('div');
        d1.className = 'mb-2';
        const l1 = document.createElement('label');
        l1.className = 'form-label';
        l1.textContent = 'Apellido y Nombre';
        const in1 = document.createElement('input');
        in1.type = 'text';
        in1.className = 'form-control';
        in1.name = 'integrante_nombre_' + i;
        in1.placeholder = 'Ej.: Juan Pérez';
        in1.required = true;
        d1.appendChild(l1);
        d1.appendChild(in1);
        card.appendChild(d1);

        const d2 = document.createElement('div');
        d2.className = 'mb-2';
        const l2 = document.createElement('label');
        l2.className = 'form-label';
        l2.textContent = 'DNI';
        const in2 = document.createElement('input');
        in2.type = 'text';
        in2.className = 'form-control';
        in2.name = 'integrante_dni_' + i;
        in2.maxLength = 8;
        in2.inputMode = 'numeric';
        in2.placeholder = '7 u 8 dígitos';
        in2.required = true;
        d2.appendChild(l2);
        d2.appendChild(in2);
        card.appendChild(d2);
        in2.addEventListener('input', () => {
            mostrarError(in2, validarDNI(in2.value));
        });

        const d3 = document.createElement('div');
        d3.className = 'mb-2';
        const l3 = document.createElement('label');
        l3.className = 'form-label';
        l3.textContent = 'Fecha de nacimiento';
        const in3 = document.createElement('input');
        in3.type = 'date';
        in3.className = 'form-control';
        in3.name = 'integrante_fecha_' + i;
        in3.required = true;
        d3.appendChild(l3);
        d3.appendChild(in3);
        card.appendChild(d3);
        in3.addEventListener('input', () => {
            mostrarError(in3, validarFechaNacimiento(in3.value));
        });

        const d4 = document.createElement('div');
        d4.className = 'mb-2';
        const l4 = document.createElement('label');
        l4.className = 'form-label';
        l4.textContent = 'Sexo';
        const s4 = document.createElement('select');
        s4.className = 'form-select';
        s4.name = 'integrante_sexo_' + i;
        ['Femenino', 'Masculino', 'Otro'].forEach(op => {
            const o = document.createElement('option');
            o.value = op;
            o.textContent = op;
            s4.appendChild(o);
        });
        d4.appendChild(l4);
        d4.appendChild(s4);
        card.appendChild(d4);

        const d5 = document.createElement('div');
        d5.className = 'mb-2';
        const l5 = document.createElement('label');
        l5.className = 'form-label';
        l5.textContent = 'Rol en el stand';
        const s5 = document.createElement('select');
        s5.className = 'form-select';
        s5.name = 'integrante_rol_' + i;
        ['Titular', 'Colaborador', 'Vendedor'].forEach(op => {
            const o = document.createElement('option');
            o.value = op;
            o.textContent = op;
            s5.appendChild(o);
        });
        d5.appendChild(l5);
        d5.appendChild(s5);
        card.appendChild(d5);

        col.appendChild(card);
        return col;
    }

    btnGen.addEventListener('click', () => {
        const n = parseInt(inputCant.value, 10);
        if (isNaN(n) || n < 1 || n > 10) {
            alert('Ingresá un número entre 1 y 10.');
            return;
        }
        contenedor.innerHTML = '';
        for (let i = 1; i <= n; i++) {
            contenedor.appendChild(crearBloqueIntegrante(i));
        }
    });

    // al enviar se valida el titular y todos los integrantes
    formRegistro.addEventListener('submit', (e) => {
        const errores = [];

        const errorDni = validarDNI(inputDniTitular.value);
        mostrarError(inputDniTitular, errorDni);
        if (errorDni) errores.push(errorDni);

        const errorFecha = validarFechaNacimiento(inputFechaTitular.value);
        mostrarError(inputFechaTitular, errorFecha);
        if (errorFecha) errores.push(errorFecha);

        contenedor.querySelectorAll('input[name^="integrante_dni_"]').forEach(inp => {
            const err = validarDNI(inp.value);
            mostrarError(inp, err);
            if (err) errores.push(err);
        });

        contenedor.querySelectorAll('input[name^="integrante_fecha_"]').forEach(inp => {
            const err = validarFechaNacimiento(inp.value);
            mostrarError(inp, err);
            if (err) errores.push(err);
        });

        e.preventDefault();
        if (errores.length > 0) {
            alert(errores[0]);
        } else {
            alert('Solicitud enviada con éxito. ¡Gracias por ser parte del Poncho!');
        }
    });
});
