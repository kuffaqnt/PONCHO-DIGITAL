// ACA SOLO HAY LOGICA PARA GESTION-PRODUCTOS.HTML

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
    const inputStock = document.getElementById('stock');

    const errorStock = validarStock(inputStock.value);
    mostrarError(inputStock, errorStock);

    if (errorStock === '') {
        alert('¡Producto validado y guardado correctamente!');
        formProducto.reset();
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
    const sesion = exigirSesion();
    if (!sesion) return;

    const emailSesion = document.getElementById('email-sesion');
    if (emailSesion) emailSesion.textContent = sesion.email;
    const btnCerrar = document.getElementById('btn-cerrar-sesion');
    if (btnCerrar) btnCerrar.addEventListener('click', function (e) { e.preventDefault(); cerrarSesion(); });

    const formProducto = document.getElementById('form-producto');
    const inputStock = document.getElementById('stock');

    if (!formProducto || !inputStock) return;

    formProducto.addEventListener('submit', guardarProducto);
    inputStock.addEventListener('input', validarStockEnVivo);
}

document.addEventListener('DOMContentLoaded', iniciarProductos);
