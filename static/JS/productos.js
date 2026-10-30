// ACA SOLO HAY LOGICA PARA GESTION-PRODUCTOS.HTML

function validarStock(valor) {
    const stock = parseFloat(valor);
    if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
        return 'El stock debe ser un número entero mayor o igual a 0.';
    }
    return '';
}

function guardarProducto(evento) {
    const inputStock = document.getElementById('id_stock') || document.getElementById('stock');
    if (!inputStock) return;

    const errorStock = validarStock(inputStock.value);
    if (typeof mostrarError === 'function') {
        mostrarError(inputStock, errorStock);
    }

    if (errorStock !== '') {
        evento.preventDefault(); // Solo frena el envío si hay error
    }
}

function validarStockEnVivo() {
    const inputStock = document.getElementById('id_stock') || document.getElementById('stock');
    if (!inputStock) return;
    const error = validarStock(inputStock.value) !== '' ? 'Debe ser entero positivo' : '';
    if (typeof mostrarError === 'function') {
        mostrarError(inputStock, error);
    }
}

// pide confirmacion antes de eliminar, el nombre sale del data-nombre del form
function confirmarEliminar(evento) {
    const nombre = evento.currentTarget.dataset.nombre;
    if (!confirm('¿Seguro que querés eliminar ' + nombre + '?')) {
        evento.preventDefault();
    }
}

function iniciarProductos() {
    const formProducto = document.getElementById('form-producto');
    const inputStock = document.getElementById('id_stock') || document.getElementById('stock');
    const formsEliminar = document.querySelectorAll('.form-eliminar');

    for (let i = 0; i < formsEliminar.length; i++) {
        formsEliminar[i].addEventListener('submit', confirmarEliminar);
    }

    if (!formProducto || !inputStock) return;

    formProducto.addEventListener('submit', guardarProducto);
    inputStock.addEventListener('input', validarStockEnVivo);
}

document.addEventListener('DOMContentLoaded', iniciarProductos);
