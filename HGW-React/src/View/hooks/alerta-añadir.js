import Swal from 'sweetalert2';

export function mostrarAlerta(nombre, irAlCarrito) {
    Swal.fire({
        title: '¡Producto añadido!',
        text: `Se ha añadido "${nombre}" al carrito.`,
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Ir al carrito',
        cancelButtonText: 'Seguir viendo',
        confirmButtonColor: '#03624c',
        cancelButtonColor: '#03624c'
    }).then((result) => {
        if (result.isConfirmed && typeof irAlCarrito === 'function') {
            irAlCarrito();
        }
    });
}

export function alertaView() {
    Swal.fire({
        title: '¡Atención!',
        text: 'Debes registrarte primero para agregar productos al carrito.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ir a registrarme',
        cancelButtonText: 'Ir a Login',
        confirmButtonColor: '#03624c',
        cancelButtonColor: '#03624c'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = '/register';
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            window.location.href = '/login';
        }
    });
}

