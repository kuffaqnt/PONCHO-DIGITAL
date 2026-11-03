// ACA SOLO HAY LOGICA PARA REPORTES.HTML
// los datos de los reportes (HU-17 a 20) ya vienen de Django, aca solo se pone la fecha para el PDF

// RU-13, antes de imprimir o guardar como PDF se completa la fecha de la cabecera
function ponerFechaImpresion() {
    const spanFecha = document.getElementById('fecha-impresion');
    if (!spanFecha) return;
    const ahora = new Date();
    spanFecha.textContent = 'Fecha: ' + ahora.toLocaleDateString() + ' - ' + ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' hs';
}

window.addEventListener('beforeprint', ponerFechaImpresion);
