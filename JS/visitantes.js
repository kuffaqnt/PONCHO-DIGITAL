// ACA UNICAMENTE HAY LOGICA PARA VISITANTES:HTML

document.addEventListener('DOMContentLoaded', () => {
    const btnFiltrar = document.getElementById('btn-filtrar');
    const btnLimpiar = document.getElementById('btn-limpiar');
    const inputBuscar = document.getElementById('buscar');
    const selectRubro = document.getElementById('filtro-rubro');
    const selectLocalidad = document.getElementById('filtro-localidad');
    const tarjetas = document.querySelectorAll('.tarjeta-item');
    const cajaEdificio = document.getElementById('caja-edificio');
    const textoEdificio = document.getElementById('texto-edificio');

    if (!btnFiltrar) return; 

    function filtrarArtesanos() {
        let texto = inputBuscar.value.toLowerCase().trim();
        let rubro = selectRubro.value;
        let localidad = selectLocalidad.value;
        let edificios = [];
        let visibles = 0;

        tarjetas.forEach(tarjeta => {
            let dTexto = tarjeta.dataset.texto.toLowerCase();
            let dRubro = tarjeta.dataset.rubro;
            let dLocalidad = tarjeta.dataset.localidad;
            let edificio = tarjeta.dataset.edificio;

            let matchTexto = texto === '' || dTexto.includes(texto);
            let matchRubro = rubro === '' || dRubro === rubro;
            let matchLocalidad = localidad === '' || dLocalidad === localidad;

            if (matchTexto && matchRubro && matchLocalidad) {
                tarjeta.classList.remove('d-none');
                visibles++;
                if (!edificios.includes(edificio)) edificios.push(edificio);
            } else {
                tarjeta.classList.add('d-none');
            }
        });

        if (visibles > 0 && (texto !== '' || rubro !== '' || localidad !== '')) {
            cajaEdificio.classList.remove('d-none');
            textoEdificio.textContent = 'Encontrado en: ' + edificios.join(', ');
        } else if (visibles === 0) {
            cajaEdificio.classList.remove('d-none');
            textoEdificio.textContent = 'No se encontraron artesanos con ese criterio.';
        } else {
            cajaEdificio.classList.add('d-none');
        }
    }

    btnFiltrar.addEventListener('click', filtrarArtesanos);
    inputBuscar.addEventListener('keyup', filtrarArtesanos);
    btnLimpiar.addEventListener('click', () => {
        inputBuscar.value = '';
        selectRubro.value = '';
        selectLocalidad.value = '';
        tarjetas.forEach(t => t.classList.remove('d-none'));
        cajaEdificio.classList.add('d-none');
    });
});