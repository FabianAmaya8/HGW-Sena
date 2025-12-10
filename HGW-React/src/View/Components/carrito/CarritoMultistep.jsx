import { useState, useEffect } from "react";
import { Infinity } from 'ldrs/react'
import Carrito from "./CarritoCompleto";
import PasoEnvio from "./PasoEnvio";
import PasoPago from "./PasoPago";
import { useCarrito } from "../../hooks/useCarrito";

export default function CarritoMultistep() {
    const [currentStep, setCurrentStep] = useState(1);
    const [direccionSeleccionada, setDireccionSeleccionada] = useState(null);
    const {
        carrito,
        direccion,
        cargando,
        error,
        obtenerCarritoDesdeAPI,
        obtenerDirecciones,
        actualizarCantidad,
        aumentarCantidad,
        disminuirCantidad,
        quitarDelCarrito,
        clearCart
    } = useCarrito();

    useEffect(() => {
        obtenerCarritoDesdeAPI();
        obtenerDirecciones();
    }, []);

    useEffect(() => {
        if (direccion.length > 0) {
            setDireccionSeleccionada(direccion[0]); // usar primera dirección
        }
    }, [direccion]);

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    if (cargando) {
        return (
            <div className="cargando">
                <Infinity
                    size="150"
                    stroke="10"
                    strokeLength="0.15"
                    bgOpacity="0.3"
                    speed="1.3"
                    color="#47BF26"
                />
            </div>
        );
    }
    if (error) {
        return (
            <div className="cargando">
                <i className="bx bx-error"></i>
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="contenedor-pasos">
            {currentStep === 1 && (
                <Carrito
                    carrito={carrito}
                    actualizarCantidad={actualizarCantidad}
                    aumentarCantidad={aumentarCantidad}
                    disminuirCantidad={disminuirCantidad}
                    quitarDelCarrito={quitarDelCarrito}
                    onNext={nextStep}
                />
            )}
            {currentStep === 2 && (
                <PasoEnvio
                    carrito={carrito}
                    direcciones={direccion}
                    direccionSeleccionada={direccionSeleccionada}
                    setDireccionSeleccionada={setDireccionSeleccionada}
                    onNext={nextStep}
                    onBack={prevStep}
                />
            )}
            {currentStep === 3 && (
                <PasoPago
                    carrito={carrito}
                    direccionSeleccionada={direccionSeleccionada}
                    clearCart={clearCart}
                    actualizarCantidad={actualizarCantidad}
                    onBack={prevStep}
                />
            )}
        </div>
    );
}
