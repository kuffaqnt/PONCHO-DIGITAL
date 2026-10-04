// DATOS DE PRUEBA BASE (HU17 a HU20)
const STANDS_DEMO = [
    { id: 1, nombre: 'Pabellón Artesanías I - Stand 42', estado: 'ocupado' },
    { id: 2, nombre: 'Pabellón Artesanías II - Stand 15', estado: 'ocupado' },
    { id: 3, nombre: 'Pabellón Regional - Stand 08', estado: 'ocupado' },
    { id: 4, nombre: 'Pabellón Artesanías I - Stand 10', estado: 'disponible' },
    { id: 5, nombre: 'Pabellón Artesanías II - Stand 02', estado: 'disponible' },
    { id: 6, nombre: 'Pabellón Institucional - Stand 01', estado: 'disponible' }
];

const ARTESANOS_DEMO = [
    {
        nombre: 'Rosa Gutiérrez',
        taller: 'Telares de Belén',
        localidad: 'Belén',
        rubro: 'Textil y telar',
        ubicacion: 'Pabellón Artesanías I - Stand 42',
        productos: [
            { nombre: 'Poncho de vicuña', stock: 5 },
            { nombre: 'Manta de oveja', stock: 12 }
        ]
    },
    {
        nombre: 'Juan Carlos Mamaní',
        taller: 'Alfarería Calchaquí',
        localidad: 'Santa María',
        rubro: 'Cerámica y alfarería',
        ubicacion: 'Pabellón Artesanías II - Stand 15',
        productos: [
            { nombre: 'Jarrón cerámico', stock: 7 },
            { nombre: 'Cuenco utilitario', stock: 15 }
        ]
    },
    {
        nombre: 'Familia Carrizo',
        taller: 'Sabores del Ambato',
        localidad: 'El Rodeo',
        rubro: 'Productos regionales',
        ubicacion: 'Pabellón Regional - Stand 08',
        productos: [
            { nombre: 'Nuez confitada', stock: 25 },
            { nombre: 'Arrope de chañar', stock: 18 }
        ]
    },
    {
        nombre: 'Pedro Morales',
        taller: 'Maderas del Valle',
        localidad: 'Belén',
        rubro: 'Trabajos en madera',
        ubicacion: 'Sin asignar',
        productos: [
            { nombre: 'Mesa ratona', stock: 3 }
        ]
    }
];

function verificarAdmin() {
    let sesion = obtenerSesion();
    if (!sesion || sesion.rol !== 'admin') {
        alert('Acceso restringido. Debe iniciar sesión como administrador.');
        location.href = 'login.html';
        return false;
    }

    const spanAdmin = document.getElementById('admin-sesion');
    if (spanAdmin) {
        spanAdmin.textContent = sesion.email;
    }
    return true;
}

// HU19: OCUPACIÓN DE STANDS
function cargarReporteStands() {
    let total = STANDS_DEMO.length;
    let ocupados = 0;

    for (let i = 0; i < STANDS_DEMO.length; i++) {
        if (STANDS_DEMO[i].estado === 'ocupado') {
            ocupados++;
        }
    }

    let disponibles = total - ocupados;
    let porcentaje = total > 0 ? Math.round((ocupados / total) * 100) : 0;

    const elTotal = document.getElementById('total-stands');
    const elOcupados = document.getElementById('stands-ocupados');
    const elDisp = document.getElementById('stands-disponibles');
    const elPorc = document.getElementById('porcentaje-ocupacion');

    if (elTotal) elTotal.textContent = total;
    if (elOcupados) elOcupados.textContent = ocupados;
    if (elDisp) elDisp.textContent = disponibles;
    if (elPorc) elPorc.textContent = porcentaje + '% ocupado';
}

// HU17: ARTESANOS POR LOCALIDAD
function cargarReporteLocalidades() {
    const tbody = document.getElementById('tabla-localidades');
    if (!tbody) return;
    tbody.innerHTML = '';

    // Agrupar por localidad
    let conteo = {};
    for (let i = 0; i < ARTESANOS_DEMO.length; i++) {
        let loc = ARTESANOS_DEMO[i].localidad;
        if (conteo[loc]) {
            conteo[loc]++;
        } else {
            conteo[loc] = 1;
        }
    }

    // Dibujar cada fila en la tabla
    for (let loc in conteo) {
        let fila = document.createElement('tr');
        fila.innerHTML = `
            <td><strong>${loc}</strong></td>
            <td class="text-center"><span class="badge bg-secondary">${conteo[loc]}</span></td>
        `;
        tbody.appendChild(fila);
    }
}

// HU18: ARTESANOS POR RUBRO
function cargarReporteRubros() {
    const tbody = document.getElementById('tabla-rubros');
    if (!tbody) return;
    tbody.innerHTML = '';

    let conteo = {};
    for (let i = 0; i < ARTESANOS_DEMO.length; i++) {
        let rubro = ARTESANOS_DEMO[i].rubro;
        if (conteo[rubro]) {
            conteo[rubro]++;
        } else {
            conteo[rubro] = 1;
        }
    }

    for (let rubro in conteo) {
        let fila = document.createElement('tr');
        fila.innerHTML = `
            <td><strong>${rubro}</strong></td>
            <td class="text-center"><span class="badge bg-secondary">${conteo[rubro]}</span></td>
        `;
        tbody.appendChild(fila);
    }
}

// HU20: PRODUCTOS POR ARTESANO (COMPACTO)
function cargarReporteProductos() {
    const tbody = document.getElementById('tabla-productos-artesano');
    if (!tbody) return;
    tbody.innerHTML = '';

    for (let i = 0; i < ARTESANOS_DEMO.length; i++) {
        let art = ARTESANOS_DEMO[i];
        let nombresProductos = [];
        let stockTotal = 0;

        for (let j = 0; j < art.productos.length; j++) {
            let prod = art.productos[j];
            nombresProductos.push(`${prod.nombre} (${prod.stock}u)`);
            stockTotal += prod.stock;
        }

        let fila = document.createElement('tr');
        fila.innerHTML = `
            <td>
                <strong>${art.nombre}</strong><br>
                <small class="text-muted">${art.taller}</small>
            </td>
            <td><small>${art.ubicacion}</small></td>
            <td><small>${nombresProductos.join(', ')}</small></td>
            <td class="text-center fw-bold text-success">${stockTotal}</td>
        `;
        tbody.appendChild(fila);
    }
}

// EXPORTACIÓN A PDF
function exportarPDF() {
    const spanFecha = document.getElementById('fecha-impresion');
    if (spanFecha) {
        const ahora = new Date();
        spanFecha.textContent = 'Fecha: ' + ahora.toLocaleDateString() + ' - ' + ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' hs';
    }
    window.print();
}

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    if (!verificarAdmin()) return;

    cargarReporteStands();
    cargarReporteLocalidades();
    cargarReporteRubros();
    cargarReporteProductos();

    const btnPDF = document.getElementById('btn-imprimir-pdf');
    if (btnPDF) {
        btnPDF.addEventListener('click', exportarPDF);
    }

    const btnCerrar = document.getElementById('btn-cerrar-sesion');
    if (btnCerrar) {
        btnCerrar.addEventListener('click', (e) => {
            e.preventDefault();
            cerrarSesion();
        });
    }
});