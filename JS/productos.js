// ACA SOLO HAY LOGICA PARA GESTION-PRODUCTOS.HTML

document.addEventListener('DOMContentLoaded', () => {
    const formProducto = document.getElementById('form-producto');
    const inputPrecio = document.getElementById('precio');
    const inputStock = document.getElementById('stock');

    if (!formProducto || !inputPrecio || !inputStock) return;

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

    formProducto.addEventListener('submit', (e) => {
        e.preventDefault();

        const errorPrecio = validarPrecio(inputPrecio.value);
        const errorStock = validarStock(inputStock.value);
        mostrarError(inputPrecio, errorPrecio);
        mostrarError(inputStock, errorStock);

        if (errorPrecio === '' && errorStock === '') {
            alert('¡Producto validado y guardado correctamente!');
            formProducto.reset();
        }
    });

    inputPrecio.addEventListener('input', () => {
        mostrarError(inputPrecio, validarPrecio(inputPrecio.value) ? 'Debe ser mayor a 0' : '');
    });

    inputStock.addEventListener('input', () => {
        mostrarError(inputStock, validarStock(inputStock.value) ? 'Debe ser entero positivo' : '');
    });
});
