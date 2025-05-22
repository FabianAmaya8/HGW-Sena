export function mostrarCompraCompletada() {
    Swal.fire({
        title: '¡Compra completada!',
        text: 'Gracias por tu compra. ¡Tu pedido ha sido procesado exitosamente!',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    }).then(() => {
        // Redirigir al usuario a index.html
        window.location.href = '../../Index.html';
    });
}

// Alerta para campos faltantes
export function mostrarCamposFaltantes() {
    Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos obligatorios antes de continuar.',
        icon: 'warning',
        confirmButtonText: 'Entendido'
    });
}

// Alerta para errores específicos de validación
export function mostrarErrorValidacion(mensaje) {
    Swal.fire({
        title: 'Error de validación',
        text: mensaje,
        icon: 'error',
        confirmButtonText: 'Corregir'
    });
}
