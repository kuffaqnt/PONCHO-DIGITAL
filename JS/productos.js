// ACA SOLO HAY LOGICA PARA GESTION-PRODUCTOS.HTML

function validarPrecio(valor) {
    const precio = parseFloat(valor);
    if (isNaN(precio) || precio <= 0) return 'El precio debe ser un número mayor a 0.';
    return '';
}

function validarStock(valor) {
    const stock = parseFloat(valor);
    if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
        return 'El stock debe ser un número entero mayor o igual a 0.';
    }
    return '';
}

function guardarProducto(evento) {
    evento.preventDefault();

    const formProducto = document.getElementById('form-producto');
    const inputPrecio = document.getElementById('precio');
    const inputStock = document.getElementById('stock');

    const errorPrecio = validarPrecio(inputPrecio.value);
    const errorStock = validarStock(inputStock.value);
    mostrarError(inputPrecio, errorPrecio);
    mostrarError(inputStock, errorStock);

    if (errorPrecio === '' && errorStock === '') {
        alert('¡Producto validado y guardado correctamente!');
        formProducto.reset();
    }
}

function validarPrecioEnVivo() {
    const inputPrecio = document.getElementById('precio');
    if (validarPrecio(inputPrecio.value) !== '') {
        mostrarError(inputPrecio, 'Debe ser mayor a 0');
    } else {
        mostrarError(inputPrecio, '');
    }
}

function validarStockEnVivo() {
    const inputStock = document.getElementById('stock');
    if (validarStock(inputStock.value) !== '') {
        mostrarError(inputStock, 'Debe ser entero positivo');
    } else {
        mostrarError(inputStock, '');
    }
}

function iniciarProductos() {
    const formProducto = document.getElementById('form-producto');
    const inputPrecio = document.getElementById('precio');
    const inputStock = document.getElementById('stock');

    if (!formProducto || !inputPrecio || !inputStock) return;

    formProducto.addEventListener('submit', guardarProducto);
    inputPrecio.addEventListener('input', validarPrecioEnVivo);
    inputStock.addEventListener('input', validarStockEnVivo);
}

document.addEventListener('DOMContentLoaded', iniciarProductos);
