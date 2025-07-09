export default function OrderSummaryCard({
    carrito,
    taxRate = 0,
    loading,
    medioPago,
    dirSel,
    step,
    onNext,
    onBack,
    handleContinuar,
    onConfirm
    }) {
    // Cálculos básicos a partir del carrito
    const totalCantidad = carrito.reduce((sum, p) => sum + p.cantidad, 0);
    const subtotal = carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
    const impuestos = subtotal * taxRate;
    const envio = 0;
    const totalFinal = subtotal + envio + impuestos;

    return (
        <div className="col-md-6">
        <div className="card">
            <div className="card-header bg-success text-white">
            Detalle del Pedido
            </div>
            <div className="card-body">
            <p><strong>Productos:</strong> {totalCantidad}</p>
            <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
            <p><strong>Envío:</strong> ${envio.toFixed(2)}</p>
            <p><strong>Impuestos:</strong> ${impuestos.toFixed(2)}</p>
            <hr />
            <h5 className="text-success">Total: ${totalFinal.toFixed(2)}</h5>

            {/* Buttons logic based on current step */}
            {step === 'cart' && (
                <button
                className="btn btn-primary w-100 mt-3"
                onClick={onNext}
                disabled={loading}
                >
                {loading ? 'Procesando...' : 'Continuar con Envío'}
                </button>
            )}

            {step === 'shipping' && (
                <>
                <button className="btn w-100" onClick={handleContinuar}>
                    Continuar con Pago
                </button>
                <button
                    className="btn btn-outline-secondary w-100 mt-2"
                    onClick={onBack}
                    disabled={loading}
                >
                    Atrás al Carrito
                </button>
                </>
            )}

            {step === 'payment' && (
                <>
                <button
                    className="btn btn-primary w-100 mt-3"
                    onClick={onConfirm}
                    disabled={loading || !medioPago || !dirSel}
                >
                    {loading ? 'Procesando...' : 'Pagar'}
                </button>
                <button
                    className="btn btn-outline-secondary w-100 mt-2"
                    onClick={onBack}
                    disabled={loading}
                >
                    Atrás
                </button>
                </>
            )}
            </div>
        </div>
        </div>
    );
}
