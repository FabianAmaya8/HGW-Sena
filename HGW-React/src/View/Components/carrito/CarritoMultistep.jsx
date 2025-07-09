import { useState, useEffect } from "react";
import { Infinity } from 'ldrs/react'
import Carrito from "./CarritoCompleto";
import PasoEnvio from "./PasoEnvio";
import PasoPago from "./PasoPago";
import { useCarrito } from "../../hooks/useCarrito";

export default function CarritoMultistep() {
    const [currentStep, setCurrentStep] = useState(1);
    const {
        carrito,
        cargando,
        error,
        obtenerCarritoDesdeAPI,
        agregarProductoAlCarrito,
        aumentarCantidad,
        disminuirCantidad,
        quitarDelCarrito,
        clearCart
    } = useCarrito();

    useEffect(() => {
        obtenerCarritoDesdeAPI();
    }, []);

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    if (cargando) {
        return <div className="cargando"> 
            <Infinity
                size="150"
                stroke="10"
                strokeLength="0.15"
                bgOpacity="0.3"
                speed="1.3"
                color="#47BF26" 
            />
        </div>;
    }
    if (error) {
        return <div className="cargando"> 
            <i className="bx bx-error"></i>
            <p>Error: {error}</p>
        </div>;
    }

    return (
        <div className="contenedor-pasos">
            {currentStep === 1 && (
                <Carrito
                    carrito={carrito}
                    aumentarCantidad={aumentarCantidad}
                    disminuirCantidad={disminuirCantidad}
                    quitarDelCarrito={quitarDelCarrito}
                    onNext={nextStep}
                />
            )}
            {currentStep === 2 && (
                <PasoEnvio
                    carrito={carrito}
                    onNext={nextStep}
                    onBack={prevStep}
                />
            )}
            {currentStep === 3 && (
                <PasoPago
                    carrito={carrito}
                    clearCart={clearCart}
                    onBack={prevStep}
                />
            )}
        </div>
    );
}
