import { useState } from "react";
import Carrito from "./CarritoCompleto";
import PasoEnvio from "./PasoEnvio";
import PasoPago from "./PasoPago";

export default function CarritoMultistep() {
    const [currentStep, setCurrentStep] = useState(1);

    const goToStep = (step) => setCurrentStep(step);
    const nextStep = () => setCurrentStep((prev) => prev + 1);
    const prevStep = () => setCurrentStep((prev) => prev - 1);

    return (
        <div className="contenedor-pasos">

            {currentStep === 1 && <Carrito onNext={nextStep} />}
            {currentStep === 2 && <PasoEnvio onNext={nextStep} onBack={prevStep} />}
            {currentStep === 3 && <PasoPago onBack={prevStep} />}
        </div>
    );
}
