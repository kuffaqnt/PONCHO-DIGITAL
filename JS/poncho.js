// PONCHO DIGITAL - Programación del lado del Cliente
// Todo el práctico está adaptado a Stands de la Fiesta del Poncho.
// Archivo único: validaciones + constructor + clase + tabla dinámica + generador.

document.addEventListener('DOMContentLoaded', function () {

  // ============================================================
  // EJERCICIO Nº 3.1 - Función constructora Stand
  // Adaptación: antes "Actividad deportiva", ahora "Stand del Poncho".
  // Guarda: nombre, tipo, pabellon, responsable, cupo, estado.
  // Tipos válidos: Gastronómico, Artesanías, Productos Regionales,
  // Diseño, Ropa, Jardinería, Arte y Cultura.
  // ============================================================
  function Stand(nombre, tipo, pabellon, responsable, cupo, estado) {
    this.nombre = nombre;
    this.tipo = tipo;
    this.pabellon = pabellon;
    this.responsable = responsable;
    this.cupo = cupo;
    this.estado = estado; // "disponible" o "completo"
  }

  // ============================================================
  // EJERCICIO Nº 3.2 - Clase SistemaFeria
  // Array interno + agregarStand() + listarStands().
  // ============================================================
  class SistemaFeria {
    constructor() {
      this.stands = [];
    }
    agregarStand(stand) {
      this.stands.push(stand);
    }
    listarStands() {
      return this.stands;
    }
  }

  // ============================================================
  // EJERCICIO Nº 3.3 - Cargar stands (mínimo cuatro)
  // ============================================================
  var sistema = new SistemaFeria();
  sistema.agregarStand(new Stand('Sabores de Catamarca', 'Gastronómico', 'Pabellón Regional', 'Flia. Carrizo', 25, 'disponible'));
  sistema.agregarStand(new Stand('Telares del Ambato', 'Artesanías', 'Pabellón Artesanías', 'María Quiroga', 0, 'completo'));
  sistema.agregarStand(new Stand('Dulces y Nueces', 'Productos Regionales', 'Pabellón Regional', 'Coop. El Rodeo', 12, 'disponible'));
  sistema.agregarStand(new Stand('Diseño Catamarqueño', 'Diseño', 'Pabellón Diseño', 'Taller Abierto', 8, 'disponible'));
  sistema.agregarStand(new Stand('Poncho Urbano', 'Ropa', 'Pabellón Diseño', 'Emprend. Valle Viejo', 10, 'disponible'));
  sistema.agregarStand(new Stand('Verde Nativo', 'Jardinería', 'Patio Ferial', 'Vivero Belén', 6, 'disponible'));
  sistema.agregarStand(new Stand('Cultura Viva', 'Arte y Cultura', 'Pabellón Institucional', 'Elencos Municipales', 0, 'completo'));

  // ============================================================
  // EJERCICIO Nº 4 - Mostrar stands en tabla dinámica
  // 1. Obtener tabla con getElementById
  // 2. Recorrer array, 3. Crear filas/celdas, 4. Agregar al tbody
  // Si la tabla no existe en el HTML, se crea 100% por JS.
  // ============================================================
  function renderTablaStands() {
    var main = document.querySelector('main.container');
    if (!main) return;

    // Si no existe la tabla, la creamos (para no tocar el HTML).
    var tabla = document.getElementById('tablaStands');
    if (!tabla) {
      // Solo la mostramos en el inicio (página con tarjeta de info del evento).
      if (!document.querySelector('.tarjeta-info-evento')) return;

      var section = document.createElement('section');
      section.className = 'mb-5';
      section.id = 'seccionStands';

      var h2 = document.createElement('h2');
      h2.textContent = 'Stands de la Feria';
      section.appendChild(h2);

      var p = document.createElement('p');
      p.className = 'text-center mx-auto mb-4';
      p.style.maxWidth = '700px';
      p.textContent = 'Listado de stands cargados por el sistema. Visitantes y artesanos pueden consultar tipo, pabellón y disponibilidad.';
      section.appendChild(p);

      var divResp = document.createElement('div');
      divResp.className = 'table-responsive';

      tabla = document.createElement('table');
      tabla.id = 'tablaStands';
      tabla.className = 'table table-striped table-hover';

      var caption = document.createElement('caption');
      caption.textContent = 'Listado de stands del Predio Ferial';
      tabla.appendChild(caption);

      var thead = document.createElement('thead');
      var trHead = document.createElement('tr');
      ['Stand', 'Tipo', 'Pabellón', 'Responsable', 'Cupo', 'Estado'].forEach(function (texto) {
        var th = document.createElement('th');
        th.setAttribute('scope', 'col');
        th.textContent = texto;
        trHead.appendChild(th);
      });
      thead.appendChild(trHead);
      tabla.appendChild(thead);

      var tbody = document.createElement('tbody');
      tbody.id = 'cuerpoTabla';
      tabla.appendChild(tbody);

      divResp.appendChild(tabla);
      section.appendChild(divResp);

      // Insertarla antes de la tarjeta de info del evento.
      var info = document.querySelector('.tarjeta-info-evento');
      main.insertBefore(section, info);
    }

    // 1. Obtener el tbody mediante getElementById().
    var cuerpo = document.getElementById('cuerpoTabla');
    if (!cuerpo) return;
    cuerpo.innerHTML = '';

    // 2. Recorrer el array de stands.
    var lista = sistema.listarStands();
    lista.forEach(function (s) {
      // 3. Crear dinámicamente una fila y sus celdas.
      var tr = document.createElement('tr');

      var tdNombre = document.createElement('td');
      tdNombre.textContent = s.nombre;
      tr.appendChild(tdNombre);

      var tdTipo = document.createElement('td');
      tdTipo.textContent = s.tipo;
      tr.appendChild(tdTipo);

      var tdPab = document.createElement('td');
      tdPab.textContent = s.pabellon;
      tr.appendChild(tdPab);

      var tdResp = document.createElement('td');
      tdResp.textContent = s.responsable;
      tr.appendChild(tdResp);

      var tdCupo = document.createElement('td');
      tdCupo.textContent = s.cupo;
      tr.appendChild(tdCupo);

      var tdEstado = document.createElement('td');
      var badge = document.createElement('span');
      badge.textContent = s.estado;
      badge.className = s.estado === 'disponible' ? 'badge bg-success' : 'badge bg-danger';
      tdEstado.appendChild(badge);
      tr.appendChild(tdEstado);

      // 4. Incorporar la fila al <tbody>.
      cuerpo.appendChild(tr);
    });
  }

  renderTablaStands();

  // ============================================================
  // REGISTRO ARTESANO: inyectar fecha nacimiento + validaciones
  // Todo por JS para no tocar el HTML.
  // ============================================================
  var inputDniTitular = document.getElementById('dni');
  var formRegistro = inputDniTitular ? inputDniTitular.closest('form') : null;

  if (formRegistro) {
    // -- Crear campo Fecha de nacimiento si no existe --
    var inputFechaTitular = document.getElementById('fechaNacimiento');
    if (!inputFechaTitular) {
      var fieldset = inputDniTitular.closest('fieldset');
      var divCol = document.createElement('div');
      divCol.className = 'col-md-6 mb-3';

      var label = document.createElement('label');
      label.setAttribute('for', 'fechaNacimiento');
      label.className = 'form-label';
      label.textContent = 'Fecha de nacimiento';
      divCol.appendChild(label);

      inputFechaTitular = document.createElement('input');
      inputFechaTitular.type = 'date';
      inputFechaTitular.id = 'fechaNacimiento';
      inputFechaTitular.name = 'fechaNacimiento';
      inputFechaTitular.required = true;
      inputFechaTitular.className = 'form-control';
      divCol.appendChild(inputFechaTitular);

      // Insertar después de la localidad (o al final del fieldset).
      var localidad = document.getElementById('localidad');
      if (localidad && localidad.parentElement.parentElement) {
        localidad.parentElement.parentElement.appendChild(divCol);
      } else {
        fieldset.appendChild(divCol);
      }

      // Validación en vivo.
      inputFechaTitular.addEventListener('input', function () {
        mostrarError(inputFechaTitular, validarFechaNacimiento(inputFechaTitular.value));
      });
    }

    // Validación en vivo del DNI titular.
    inputDniTitular.addEventListener('input', function () {
      mostrarError(inputDniTitular, validarDNI(inputDniTitular.value));
    });

    // ============================================================
    // EJERCICIO Nº 5 - Generar integrantes del stand
    // input cantidad (1-10) + botón, crea un bloque por integrante.
    // ============================================================
    var seccion = formRegistro.parentElement; // <section>
    var bloqueGen = document.createElement('div');
    bloqueGen.id = 'seccionIntegrantes';
    bloqueGen.className = 'tarjeta-formulario mt-4 p-4';

    var h3 = document.createElement('h3');
    h3.textContent = 'Integrantes del stand';
    h3.style.color = 'var(--poncho-dark)';
    bloqueGen.appendChild(h3);

    var desc = document.createElement('p');
    desc.textContent = 'Si el stand lo atienden varias personas, indicá cuántas son (1 a 10) y generá sus fichas.';
    bloqueGen.appendChild(desc);

    var rowGen = document.createElement('div');
    rowGen.className = 'd-flex flex-wrap gap-2 align-items-end';

    var divCant = document.createElement('div');
    var labelCant = document.createElement('label');
    labelCant.setAttribute('for', 'cantidadIntegrantes');
    labelCant.className = 'form-label';
    labelCant.textContent = 'Cantidad de integrantes';
    divCant.appendChild(labelCant);

    var inputCant = document.createElement('input');
    inputCant.type = 'number';
    inputCant.id = 'cantidadIntegrantes';
    inputCant.min = '1';
    inputCant.max = '10';
    inputCant.value = '1';
    inputCant.className = 'form-control';
    inputCant.style.maxWidth = '140px';
    divCant.appendChild(inputCant);
    rowGen.appendChild(divCant);

    var btnGen = document.createElement('button');
    btnGen.type = 'button';
    btnGen.id = 'btnGenerar';
    btnGen.className = 'btn-poncho-principal';
    btnGen.textContent = 'Generar integrantes';
    rowGen.appendChild(btnGen);
    bloqueGen.appendChild(rowGen);

    var contenedor = document.createElement('div');
    contenedor.id = 'contenedorIntegrantes';
    contenedor.className = 'row g-3 mt-3';
    bloqueGen.appendChild(contenedor);

    seccion.appendChild(bloqueGen);

    // Crear un bloque de integrante.
    function crearBloqueIntegrante(i) {
      var col = document.createElement('div');
      col.className = 'col-12 col-md-6';

      var card = document.createElement('div');
      card.className = 'p-3 border rounded bg-white h-100';

      var titulo = document.createElement('h5');
      titulo.textContent = 'Integrante ' + i;
      titulo.style.color = 'var(--poncho)';
      card.appendChild(titulo);

      // Apellido y Nombre
      var d1 = document.createElement('div');
      d1.className = 'mb-2';
      var l1 = document.createElement('label');
      l1.className = 'form-label';
      l1.textContent = 'Apellido y Nombre';
      var in1 = document.createElement('input');
      in1.type = 'text';
      in1.className = 'form-control';
      in1.name = 'integrante_nombre_' + i;
      in1.placeholder = 'Ej.: Juan Pérez';
      in1.required = true;
      d1.appendChild(l1);
      d1.appendChild(in1);
      card.appendChild(d1);

      // DNI
      var d2 = document.createElement('div');
      d2.className = 'mb-2';
      var l2 = document.createElement('label');
      l2.className = 'form-label';
      l2.textContent = 'DNI';
      var in2 = document.createElement('input');
      in2.type = 'text';
      in2.className = 'form-control';
      in2.name = 'integrante_dni_' + i;
      in2.maxLength = 8;
      in2.inputMode = 'numeric';
      in2.placeholder = '8 dígitos';
      in2.required = true;
      d2.appendChild(l2);
      d2.appendChild(in2);
      card.appendChild(d2);
      in2.addEventListener('input', function () {
        mostrarError(in2, validarDNI(in2.value));
      });

      // Fecha nacimiento
      var d3 = document.createElement('div');
      d3.className = 'mb-2';
      var l3 = document.createElement('label');
      l3.className = 'form-label';
      l3.textContent = 'Fecha de nacimiento';
      var in3 = document.createElement('input');
      in3.type = 'date';
      in3.className = 'form-control';
      in3.name = 'integrante_fecha_' + i;
      in3.required = true;
      d3.appendChild(l3);
      d3.appendChild(in3);
      card.appendChild(d3);
      in3.addEventListener('input', function () {
        mostrarError(in3, validarFechaNacimiento(in3.value));
      });

      // Sexo
      var d4 = document.createElement('div');
      d4.className = 'mb-2';
      var l4 = document.createElement('label');
      l4.className = 'form-label';
      l4.textContent = 'Sexo';
      var s4 = document.createElement('select');
      s4.className = 'form-select';
      s4.name = 'integrante_sexo_' + i;
      ['Femenino', 'Masculino', 'Otro'].forEach(function (op) {
        var o = document.createElement('option');
        o.value = op;
        o.textContent = op;
        s4.appendChild(o);
      });
      d4.appendChild(l4);
      d4.appendChild(s4);
      card.appendChild(d4);

      // Rol en el stand
      var d5 = document.createElement('div');
      d5.className = 'mb-2';
      var l5 = document.createElement('label');
      l5.className = 'form-label';
      l5.textContent = 'Rol en el stand';
      var s5 = document.createElement('select');
      s5.className = 'form-select';
      s5.name = 'integrante_rol_' + i;
      ['Titular', 'Colaborador', 'Vendedor'].forEach(function (op) {
        var o = document.createElement('option');
        o.value = op;
        o.textContent = op;
        s5.appendChild(o);
      });
      d5.appendChild(l5);
      d5.appendChild(s5);
      card.appendChild(d5);

      col.appendChild(card);
      return col;
    }

    btnGen.addEventListener('click', function () {
      var n = parseInt(inputCant.value, 10);
      if (isNaN(n) || n < 1 || n > 10) {
        alert('Ingresá un número entre 1 y 10.');
        return;
      }
      contenedor.innerHTML = '';
      for (var i = 1; i <= n; i++) {
        contenedor.appendChild(crearBloqueIntegrante(i));
      }
    });

    // Validar todo al enviar.
    formRegistro.addEventListener('submit', function (e) {
      var errores = [];
      var e1 = validarDNI(inputDniTitular.value);
      mostrarError(inputDniTitular, e1);
      if (e1) errores.push(e1);

      var f1 = validarFechaNacimiento(inputFechaTitular.value);
      mostrarError(inputFechaTitular, f1);
      if (f1) errores.push(f1);

      // Validar integrantes generados.
      var dnis = contenedor.querySelectorAll('input[name^="integrante_dni_"]');
      dnis.forEach(function (inp) {
        var err = validarDNI(inp.value);
        mostrarError(inp, err);
        if (err) errores.push(err);
      });
      var fechas = contenedor.querySelectorAll('input[name^="integrante_fecha_"]');
      fechas.forEach(function (inp) {
        var err = validarFechaNacimiento(inp.value);
        mostrarError(inp, err);
        if (err) errores.push(err);
      });

      if (errores.length > 0) {
        e.preventDefault();
        alert(errores[0]);
      } else {
        e.preventDefault(); // demo sin backend
        alert('Solicitud enviada con éxito. ¡Gracias por ser parte del Poncho!');
      }
    });
  }
});


document.addEventListener('DOMContentLoaded', function () {
    var btnFiltrar = document.getElementById('btn-filtrar');
    var btnLimpiar = document.getElementById('btn-limpiar');
    var inputBuscar = document.getElementById('buscar');
    var selectRubro = document.getElementById('filtro-rubro');
    var selectLocalidad = document.getElementById('filtro-localidad');

    var cajaEdificio = document.getElementById('caja-edificio');
    var textoEdificio = document.getElementById('texto-edificio');
    var tarjetas = document.querySelectorAll('.tarjeta-item');

    if (!btnFiltrar || !cajaEdificio) return;

    function filtrarArtesanos() {
        var texto = inputBuscar.value.toLowerCase().trim();
        var rubro = selectRubro.value;
        var localidad = selectLocalidad.value;

        var edificiosEncontrados = [];
        var visibles = 0;

        for (var i = 0; i < tarjetas.length; i++) {
            var tarjeta = tarjetas[i];
            var datosTexto = tarjeta.getAttribute('data-texto');
            var datosRubro = tarjeta.getAttribute('data-rubro');
            var datosLocalidad = tarjeta.getAttribute('data-localidad');
            var edificio = tarjeta.getAttribute('data-edificio');

            var coincideTexto = (texto === '' || datosTexto.indexOf(texto) !== -1);
            var coincideRubro = (rubro === '' || datosRubro === rubro);
            var coincideLocalidad = (localidad === '' || datosLocalidad === localidad);

            if (coincideTexto && coincideRubro && coincideLocalidad) {
                tarjeta.classList.remove('d-none');
                visibles++;
                if (edificiosEncontrados.indexOf(edificio) === -1) {
                    edificiosEncontrados.push(edificio);
                }
            } else {
                tarjeta.classList.add('d-none');
            }
        }

        if (visibles > 0 && (texto !== '' || rubro !== '' || localidad !== '')) {
            cajaEdificio.classList.remove('d-none');
            textoEdificio.textContent = 'Los resultados están ubicados en: ' + edificiosEncontrados.join(', ');
        } else if (visibles === 0) {
            cajaEdificio.classList.remove('d-none');
            textoEdificio.textContent = 'No se encontraron artesanos con ese criterio en el predio.';
        } else {
            cajaEdificio.classList.add('d-none');
        }
    }

    function limpiarFiltros() {
        inputBuscar.value = '';
        selectRubro.value = '';
        selectLocalidad.value = '';

        for (var i = 0; i < tarjetas.length; i++) {
            tarjetas[i].classList.remove('d-none');
        }
        cajaEdificio.classList.add('d-none');
    }

    btnFiltrar.addEventListener('click', filtrarArtesanos);
    btnLimpiar.addEventListener('click', limpiarFiltros);
    inputBuscar.addEventListener('keyup', filtrarArtesanos);
});


var contenedorEstado = document.getElementById('estado-predio');

if (contenedorEstado) {
    var horaActual = new Date().getHours();
    var horaApertura = 14;
    var horaCierre = 23;

    if (horaActual >= horaApertura && horaActual < horaCierre) {
        contenedorEstado.className = 'alert alert-success d-inline-block px-4 py-2 my-2 fw-bold';
        contenedorEstado.textContent = '🟢 Predio Ferial Abierto (Horario de visita: 14:00 a 23:00 hs)';
    } else {
        contenedorEstado.className = 'alert alert-danger d-inline-block px-4 py-2 my-2 fw-bold';
        contenedorEstado.textContent = '🔴 Predio Cerrado. Horario de apertura: 14:00 hs';
    }
}



document.addEventListener('DOMContentLoaded', function () {
    var formProducto = document.querySelector('form[action="#"]');
    var inputPrecio = document.getElementById('precio');
    var inputStock = document.getElementById('stock');

    if (inputPrecio && inputStock && formProducto) {
        
        formProducto.addEventListener('submit', function (e) {
            var errores = [];

            var precio = parseFloat(inputPrecio.value);
            if (isNaN(precio) || precio <= 0) {
                var errorPrecio = 'El precio debe ser un número mayor a 0.';
                mostrarError(inputPrecio, errorPrecio);
                errores.push(errorPrecio);
            } else {
                mostrarError(inputPrecio, '');
            }

            var stock = parseFloat(inputStock.value);
            if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
                var errorStock = 'El stock debe ser un número entero mayor o igual a 0.';
                mostrarError(inputStock, errorStock);
                errores.push(errorStock);
            } else {
                mostrarError(inputStock, '');
            }

            if (errores.length > 0) {
                e.preventDefault();
            } else {
                e.preventDefault();
                alert('¡Producto validado y guardado correctamente!');
                formProducto.reset();
            }
        });

        inputPrecio.addEventListener('input', function() {
            var val = parseFloat(this.value);
            if(isNaN(val) || val <= 0) mostrarError(this, 'Debe ser mayor a 0');
            else mostrarError(this, '');
        });

        inputStock.addEventListener('input', function() {
            var val = parseFloat(this.value);
            if(isNaN(val) || val < 0 || !Number.isInteger(val)) mostrarError(this, 'Debe ser entero positivo');
            else mostrarError(this, '');
        });
    }
});