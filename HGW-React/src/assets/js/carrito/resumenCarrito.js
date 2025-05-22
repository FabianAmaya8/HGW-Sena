export function resumenCarrito() {

    // Función para formatear el precio con signo de pesos y separadores de miles
    function formatPrice(price) {
        return `$${price.toLocaleString()}`;
    }
    function recalcularTotales() {
        let precioCarritoTotal = 0;

        document.querySelectorAll('.item-carrito').forEach(item => {
            const precioTexto = item.querySelector('.precioModificado').textContent.replace('$', '');
            const precioUnitario = parseFloat(precioTexto);
            const cantidad = parseInt(item.querySelector('input').value, 10);
            precioCarritoTotal += precioUnitario * cantidad;
        });

        const totalCompra = precioCarritoTotal + 10000;

        document.querySelectorAll('.subtotal').forEach(el => {
            el.textContent = formatPrice(precioCarritoTotal);
        });

        document.querySelectorAll('.total').forEach(el => {
            el.textContent = formatPrice(totalCompra);
        });
    }

    function activarEscuchadores() {
        document.querySelectorAll('.item-carrito input[type="number"]').forEach(input => {
            input.addEventListener('change', recalcularTotales);
        });

        document.querySelectorAll('.menos, .mas').forEach(btn => {
            btn.addEventListener('click', recalcularTotales);
        });
    }

    // Espera a que el DOM cargue completamente
    window.addEventListener('load', () => {
        // Espera un poco a que carritoCart cree los ítems
        setTimeout(() => {
            recalcularTotales();
            activarEscuchadores();
        }, 500);
    });
}
