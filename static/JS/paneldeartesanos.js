

function validarDniEnVivo(evento) {
    const input = evento.target;
    mostrarError(input, validarDNI(input.value));
}

function validarFechaEnVivo(evento) {
    const input = evento.target;
    mostrarError(input, validarFechaNacimiento(input.value));
}

function crearBloqueIntegrante(i, datos) {
    datos = datos || {};
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
    in1.value = datos.nombre || '';
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
    in2.value = datos.dni || '';
    d2.appendChild(l2);
    d2.appendChild(in2);
    card.appendChild(d2);
    in2.addEventListener('input', validarDniEnVivo);

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
    in3.value = datos.fecha || '';
    d3.appendChild(l3);
    d3.appendChild(in3);
    card.appendChild(d3);
    in3.addEventListener('input', validarFechaEnVivo);

    const d4 = document.createElement('div');
    d4.className = 'mb-2';
    const l4 = document.createElement('label');
    l4.className = 'form-label';
    l4.textContent = 'Sexo';
    const s4 = document.createElement('select');
    s4.className = 'form-select';
    s4.name = 'integrante_sexo_' + i;
    const opcionesSexo = ['Femenino', 'Masculino', 'Otro'];
    for (let j = 0; j < opcionesSexo.length; j++) {
        const o = document.createElement('option');
        o.value = opcionesSexo[j];
        o.textContent = opcionesSexo[j];
        if (datos.sexo === opcionesSexo[j]) o.selected = true;
        s4.appendChild(o);
    }
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
    const opcionesRol = ['Titular', 'Colaborador', 'Vendedor'];
    for (let j = 0; j < opcionesRol.length; j++) {
        const o = document.createElement('option');
        o.value = opcionesRol[j];
        o.textContent = opcionesRol[j];
        if (datos.rol === opcionesRol[j]) o.selected = true;
        s5.appendChild(o);
    }
    d5.appendChild(l5);
    d5.appendChild(s5);
    card.appendChild(d5);

    col.appendChild(card);
    return col;
}

function generarIntegrantes() {
    const inputCant = document.getElementById('cantidadIntegrantes');
    const contenedor = document.getElementById('contenedorIntegrantes');

    const n = parseInt(inputCant.value, 10);
    if (isNaN(n) || n < 1 || n > 10) {
        alert('Ingresá un número entre 1 y 10.');
        return;
    }
    contenedor.innerHTML = '';
    for (let i = 1; i <= n; i++) {
        contenedor.appendChild(crearBloqueIntegrante(i));
    }
    document.getElementById('mensaje-equipo').textContent = '';
}

function guardarEquipo() {
    const contenedor = document.getElementById('contenedorIntegrantes');
    const dnis = contenedor.querySelectorAll('input[name^="integrante_dni_"]');
    const fechas = contenedor.querySelectorAll('input[name^="integrante_fecha_"]');
    const errores = [];

    for (let i = 0; i < dnis.length; i++) {
        const err = validarDNI(dnis[i].value);
        mostrarError(dnis[i], err);
        if (err) errores.push(err);
    }
    for (let i = 0; i < fechas.length; i++) {
        const err = validarFechaNacimiento(fechas[i].value);
        mostrarError(fechas[i], err);
        if (err) errores.push(err);
    }

    const mensaje = document.getElementById('mensaje-equipo');
    if (dnis.length === 0) {
        alert('Primero generá los integrantes.');
        return;
    }
    if (errores.length > 0) {
        alert(errores[0]);
        return;
    }

    const equipo = [];
    const tarjetas = contenedor.querySelectorAll('.col-12');
    for (let i = 0; i < tarjetas.length; i++) {
        equipo.push({
            nombre: tarjetas[i].querySelector('input[name^="integrante_nombre_"]').value,
            dni: tarjetas[i].querySelector('input[name^="integrante_dni_"]').value,
            fecha: tarjetas[i].querySelector('input[name^="integrante_fecha_"]').value,
            sexo: tarjetas[i].querySelector('select[name^="integrante_sexo_"]').value,
            rol: tarjetas[i].querySelector('select[name^="integrante_rol_"]').value
        });
    }
    localStorage.setItem('ponchoEquipo', JSON.stringify(equipo));
    mensaje.textContent = 'Equipo guardado: ' + equipo.length + ' integrante(s).';
}

function cargarEquipoGuardado() {
    try {
        const raw = localStorage.getItem('ponchoEquipo');
        if (!raw) return;
        const equipo = JSON.parse(raw);
        if (!Array.isArray(equipo) || equipo.length === 0) return;
        const inputCant = document.getElementById('cantidadIntegrantes');
        const contenedor = document.getElementById('contenedorIntegrantes');
        inputCant.value = equipo.length;
        contenedor.innerHTML = '';
        for (let i = 0; i < equipo.length; i++) {
            contenedor.appendChild(crearBloqueIntegrante(i + 1, equipo[i]));
        }
    } catch (e) { /* sin equipo previo */ }
}

function iniciarPanel() {
    const sesion = exigirSesion();
    if (!sesion) return;

    const titulo = document.getElementById('titulo-bienvenida');
    const emailSesion = document.getElementById('email-sesion');
    const tallerNombre = document.getElementById('taller-nombre');
    if (titulo) titulo.textContent = 'Hola, ' + sesion.nombre;
    if (emailSesion) emailSesion.textContent = sesion.email;
    if (tallerNombre && sesion.taller) tallerNombre.textContent = sesion.taller;

    const btnCerrar1 = document.getElementById('btn-cerrar-sesion');
    const btnCerrar2 = document.getElementById('btn-cerrar-sesion-2');
    if (btnCerrar1) btnCerrar1.addEventListener('click', function (e) { e.preventDefault(); cerrarSesion(); });
    if (btnCerrar2) btnCerrar2.addEventListener('click', cerrarSesion);

    const btnGen = document.getElementById('btnGenerar');
    const btnGuardar = document.getElementById('btnGuardarEquipo');
    if (btnGen) btnGen.addEventListener('click', generarIntegrantes);
    if (btnGuardar) btnGuardar.addEventListener('click', guardarEquipo);

    cargarEquipoGuardado();
}

document.addEventListener('DOMContentLoaded', iniciarPanel);
