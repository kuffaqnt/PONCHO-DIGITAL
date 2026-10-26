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

function iniciarProductos() {
    // Se eliminan exigirSesion() y handlers viejos de sesión

    const formProducto = document.getElementById('form-producto');
    const inputStock = document.getElementById('id_stock') || document.getElementById('stock');

    if (!formProducto || !inputStock) return;

    formProducto.addEventListener('submit', guardarProducto);
    inputStock.addEventListener('input', validarStockEnVivo);
}

document.addEventListener('DOMContentLoaded', iniciarProductos);
