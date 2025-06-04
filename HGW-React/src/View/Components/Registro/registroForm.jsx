import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRegistro } from '../../hooks/useRegistro';
import { Sidebar } from './sidebar';
import { Paso1InformacionPersonal } from './paso1';
import { Paso2DatosEnvio } from './paso2';
import { Paso3FotoUsuario } from './paso3';
import '../../../assets/css/fijos/registro.css';

const RegistroForm = () => {
  const {
    currentStep,
    formData,
    errors,
    paises,
    ciudades,
    setIsLoading,
    handleInputChange,
    goToStep,
    nextStep,
    prevStep,
    handleSubmit,
    handleBack,
  } = useRegistro();

  return (
    <main className="container-fluid conten-item">
      <div className="row">
        <Sidebar currentStep={currentStep} goToStep={goToStep} />

        <div className="col-md-9 d-flex align-items-center">
          <div className="container py-3">
            <form id="registration-form" onSubmit={handleSubmit} encType="multipart/form-data">
              {currentStep === 1 && (
                <Paso1InformacionPersonal
                  formData={formData}
                  errors={errors}
                  handleInputChange={handleInputChange}
                />
              )}

              {currentStep === 2 && (
                <Paso2DatosEnvio
                  formData={formData}
                  errors={errors}
                  handleInputChange={handleInputChange}
                  ciudades={ciudades}
                  paises={paises}
                />
              )}

              {currentStep === 3 && (
                <Paso3FotoUsuario
                  formData={formData}
                  errors={errors}
                  handleInputChange={handleInputChange}
                  handlePrevStep={handleBack}
                />
              )}

              {/* Navegación paso a paso */}
              <div className="d-flex justify-content-between mt-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={prevStep}
                    id="btn-back-step"
                  >
                    <ArrowLeft size={20} /> Atrás
                  </button>
                )}
                {currentStep < 3 && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={nextStep}
                    id="btn-next-step"
                  >
                    Siguiente <ArrowRight size={20} />
                  </button>
                )}
                {currentStep === 3 && (
                  <button
                    type="submit"
                    disabled={setIsLoading}
                    className="btn btn-primary"
                    id="btn-finalizar-registro"
                  >
                    {setIsLoading ? 'Enviando...' : 'Finalizar'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RegistroForm;
