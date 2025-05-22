import { mostrarCompraCompletada, mostrarCamposFaltantes, mostrarErrorValidacion } from './alerta.js';

// Configurar el formulario de envío
export function configurarFormularioEnvio() {
  const formularioEnvio = document.getElementById("miFormulario");

  formularioEnvio.addEventListener("submit", function (event) {
      event.preventDefault(); // Evita el comportamiento predeterminado de redirección del formulario

      // Realiza aquí la validación si es necesaria
      const nombre = document.getElementById("nombre").value.trim();
      const apellido = document.getElementById("apellido").value.trim();
      const direccion = document.getElementById("direccion").value.trim();
      const pais = document.getElementById("pais").value.trim();

      if (!nombre || !apellido || !direccion || pais === "Seleccione pais") {
          alert("Por favor, completa todos los campos obligatorios.");
          return;
      }

      // Si los datos son válidos, mostrar la siguiente sección (i3)
      mostrarDiv("i3"); // Cambia a la sección de Opciones de Pago
  });
}

// Configurar el formulario de pago
export function configurarFormularioPago() {
  const formularioPago = document.getElementById("formularioPago");

  formularioPago.addEventListener("submit", function (event) {
      event.preventDefault(); // Evita el envío predeterminado del formulario

      const metodoPago = document.querySelector('input[name="metodo-pago"]:checked').value;
      const nombreTitular = document.getElementById("input-name").value.trim();
      const numeroTarjeta = document.getElementById("input-number").value.trim();
      const mesExpiracion = document.getElementById("input-month").value.trim();
      const anioExpiracion = document.getElementById("input-year").value.trim();
      const cvv = document.getElementById("input-cvc").value.trim();

      // Validaciones
      if (metodoPago === "tarjeta-credito") {
          if (!nombreTitular || !numeroTarjeta || !mesExpiracion || !anioExpiracion || !cvv) {
              mostrarCamposFaltantes();
              return;
          }

          if (numeroTarjeta.length !== 16 || isNaN(numeroTarjeta)) {
              mostrarErrorValidacion("El número de tarjeta debe tener 16 dígitos numéricos.");
              return;
          }

          if (cvv.length !== 3 || isNaN(cvv)) {
              mostrarErrorValidacion("El CVV debe tener 3 dígitos numéricos.");
              return;
          }
      }

      // Si todo es válido, muestra la alerta de compra completada
      mostrarCompraCompletada();
  });
}