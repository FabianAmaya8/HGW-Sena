export function carritoNavegacion() {
    document.addEventListener('DOMContentLoaded', () => {
        const pasos = ['i1', 'i2', 'i3'];
        let pasoActual = 0;

        const btnSiguiente = document.getElementById('btnSiguiente');
        const btnCancelar = document.getElementById('btnCancelar');
        const btnFinalizar = document.getElementById('btnFinalizar');

        const mostrarPaso = (index) => {
            document.querySelectorAll('.conten-item').forEach(seccion => seccion.classList.remove('active'));
            document.querySelector(`.${pasos[index]}`).classList.add('active');

            if (index === 1) cargarDatosEnvio();

            if (index === pasos.length - 1) {
                btnSiguiente.classList.add('d-none');
                btnFinalizar.classList.remove('d-none');
            } else {
                btnSiguiente.classList.remove('d-none');
                btnFinalizar.classList.add('d-none');
            }
        };

        btnSiguiente.addEventListener('click', () => {
            if (pasoActual < pasos.length - 1) {
                pasoActual++;
                mostrarPaso(pasoActual);
            }
        });

        btnCancelar.addEventListener('click', () => {
            if (pasoActual > 0) {
                pasoActual--;
                mostrarPaso(pasoActual);
            }
        });

        document.querySelectorAll('.secciones button').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.target;
                pasoActual = pasos.indexOf(target);
                mostrarPaso(pasoActual);
            });
        });

        mostrarPaso(pasoActual);
    });

    async function cargarDatosEnvio() {
    try {
        const res = await fetch('/api/envio');
        const data = await res.json();

        if (data) {
            document.getElementById('nombre').value = data.nombre || '';
            document.getElementById('direccion').value = data.direccion || '';

            const paisSelect = document.getElementById('pais');
            const ciudadSelect = document.getElementById('ciudad');

            // Asignar el país y la ciudad
            paisSelect.value = data.pais;
            ciudadSelect.value = data.ciudad;
        }
    } catch (error) {
        console.error('Error al cargar datos de envío:', error);
    }
}

}