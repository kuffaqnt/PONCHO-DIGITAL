// ACA SOLO HAY LOGICA PARA INDEX.HTML

document.addEventListener('DOMContentLoaded', () => {
    
    const contenedorEstado = document.getElementById('estado-predio');
    if (contenedorEstado) {
        let horaActual = new Date().getHours();
        if (horaActual >= 14 && horaActual < 23) {
            contenedorEstado.className = 'alert alert-success d-inline-block px-4 py-2 my-2 fw-bold';
            contenedorEstado.textContent = '🟢 Predio Ferial Abierto (14:00 a 23:00 hs)';
        } else {
            contenedorEstado.className = 'alert alert-danger d-inline-block px-4 py-2 my-2 fw-bold';
            contenedorEstado.textContent = '🔴 Predio Cerrado. Apertura: 14:00 hs';
        }
    }

    
    class Stand {
        constructor(nombre, tipo, pabellon, estado) {
            this.nombre = nombre;
            this.tipo = tipo;
            this.pabellon = pabellon;
            this.estado = estado; 
        }
    }

    class SistemaFeria {
        constructor() {
            this.stands = [];
        }
        agregarStand(stand) {
            this.stands.push(stand);
        }
    }

    let sistema = new SistemaFeria();
    sistema.agregarStand(new Stand('Sabores de Catamarca', 'Gastronómico', 'Pabellón Regional', 'disponible'));
    sistema.agregarStand(new Stand('Telares del Ambato', 'Artesanías', 'Pabellón Artesanías', 'completo'));
    sistema.agregarStand(new Stand('Dulces y Nueces', 'Productos Regionales', 'Pabellón Regional', 'disponible'));

    let main = document.querySelector('main.container');
    let infoEvento = document.querySelector('.tarjeta-info-evento');
    
    
    if (main && infoEvento) {
        let section = document.createElement('section');
        section.className = 'mb-5';
        section.innerHTML = `
            <h2 class="titulo-principal">Stands de la Feria</h2>
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead class="table-dark">
                        <tr><th>Stand</th><th>Tipo</th><th>Pabellón</th><th>Estado</th></tr>
                    </thead>
                    <tbody id="cuerpoTabla"></tbody>
                </table>
            </div>
        `;
        main.insertBefore(section, infoEvento);

        let tbody = document.getElementById('cuerpoTabla');
        sistema.stands.forEach(s => {
            let tr = document.createElement('tr');
            let badge = s.estado === 'disponible' ? 'bg-success' : 'bg-danger';
            tr.innerHTML = `
                <td>${s.nombre}</td>
                <td>${s.tipo}</td>
                <td>${s.pabellon}</td>
                <td><span class="badge ${badge}">${s.estado}</span></td>
            `;
            tbody.appendChild(tr);
        });
    }
});