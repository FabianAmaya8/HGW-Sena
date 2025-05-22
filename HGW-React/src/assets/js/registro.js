document.addEventListener('DOMContentLoaded', function () {
    // Pasos del formulario
    const stepPersonal = document.getElementById('step-personal');
    const stepEnvio = document.getElementById('step-envio');
    const stepFoto = document.getElementById('step-foto');
    
    const linkPersonal = document.getElementById('link-personal');
    const linkEnvio = document.getElementById('link-envio');
    const linkFoto = document.getElementById('link-foto');
    
    const btnToEnvio = document.getElementById('btn-to-envio');
    const btnBackIndex = document.getElementById('btn-back-index');
    const btnBackPersonal = document.getElementById('btn-back-personal');
    const btnToFoto = document.getElementById('btn-to-foto');
    const btnBackEnvio = document.getElementById('btn-back-envio');
    const btnFinalizar = document.getElementById('btn-finalizar');
    
    const currentStepIndicator = document.getElementById('current-step');
    const form = document.getElementById('registration-form');
    
    // Mostrar paso
    function showStep(step) {
        stepPersonal.classList.remove('active');
        stepEnvio.classList.remove('active');
        stepFoto.classList.remove('active');
        linkPersonal.classList.remove('active');
        linkEnvio.classList.remove('active');
        linkFoto.classList.remove('active');
        
        if (step === 'personal') {
            stepPersonal.classList.add('active');
            linkPersonal.classList.add('active');
            currentStepIndicator.textContent = '1';
        } else if (step === 'envio') {
            stepEnvio.classList.add('active');
            linkEnvio.classList.add('active');
            currentStepIndicator.textContent = '2';
        } else if (step === 'foto') {
            stepFoto.classList.add('active');
            linkFoto.classList.add('active');
            currentStepIndicator.textContent = '3';
        }
    }
    
    // Validar paso
    function validateStep(step) {
        let isValid = true;
        
        if (step === 'personal') {
            const requiredFields = ['nombres', 'apellido', 'patrocinador', 'usuario', 'contrasena', 'confirmar-contrasena', 'telefono', 'correo'];
            
            requiredFields.forEach(field => {
                const element = document.getElementById(field);
                
                if (!element.value) {
                    element.classList.add('is-invalid');
                    isValid = false;
                } else {
                    element.classList.remove('is-invalid');

                    if (field === 'confirmar-contrasena') {
                        const password = document.getElementById('contrasena').value;
                        if (element.value !== password) {
                            element.classList.add('is-invalid');
                            isValid = false;
                        }
                    } else if (field === 'correo') {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(element.value)) {
                            element.classList.add('is-invalid');
                            isValid = false;
                        }
                    } else if (field === 'telefono') {
                        const phoneRegex = /^\d{10,}$/;
                        if (!phoneRegex.test(element.value)) {
                            element.classList.add('is-invalid');
                            isValid = false;
                        }
                    }
                }
            });
        } else if (step === 'envio') {
            const requiredFields = ['direccion', 'codigo-postal', 'lugar-entrega', 'pais', 'ciudad'];
            requiredFields.forEach(field => {
                const element = document.getElementById(field);
                if (!element.value) {
                    element.classList.add('is-invalid');
                    isValid = false;
                } else {
                    element.classList.remove('is-invalid');
                }
            });
        } else if (step === 'foto') {
            const profilePic = document.getElementById('profile-pic');
            if (!profilePic.files || profilePic.files.length === 0) {
                profilePic.classList.add('is-invalid');
                isValid = false;
            } else {
                profilePic.classList.remove('is-invalid');
            }
        }
        
        return isValid;
    }
    
    // Navegación entre pasos
    btnToEnvio.addEventListener('click', function() {
        if (validateStep('personal')) {
            showStep('envio');
        }
    });
    
    btnBackIndex.addEventListener('click', function() {
        location.href = '/';
    });

    btnBackPersonal.addEventListener('click', function() {
        showStep('personal');
    });
    
    btnToFoto.addEventListener('click', function() {
        if (validateStep('envio')) {
            showStep('foto');
        }
    });
    
    btnBackEnvio.addEventListener('click', function() {
        showStep('envio');
    });
    
    linkPersonal.addEventListener('click', function(e) {
        e.preventDefault();
        showStep('personal');
    });
    
    linkEnvio.addEventListener('click', function(e) {
        e.preventDefault();
        if (validateStep('personal')) {
            showStep('envio');
        } else {
            showStep('personal');
        }
    });
    
    linkFoto.addEventListener('click', function(e) {
        e.preventDefault();
        if (validateStep('personal') && validateStep('envio')) {
            showStep('foto');
        } else if (validateStep('personal')) {
            showStep('envio');
        } else {
            showStep('personal');
        }
    });
    
    // Previsualización de la foto de perfil
    document.getElementById('profile-pic').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('preview-profile-pic').src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Envío del formulario
    form.addEventListener('submit', function (e) {
        if (validateStep('personal') && validateStep('envio') && validateStep('foto')) {
            // Si todo es válido, no hacemos preventDefault y se envía el formulario
        } else {
            e.preventDefault();  // Solo prevenimos si hay errores
            if (!validateStep('foto')) {
                showStep('foto');
            } else if (!validateStep('envio')) {
                showStep('envio');
            } else {
                showStep('personal');
            }
        }
    });
    

    // Filtrado de ciudades según el país
    const selectPais = document.getElementById('pais');
    const selectCiudad = document.getElementById('ciudad');
    const opcionesCiudad = Array.from(selectCiudad.options);

    function filtrarCiudades() {
        const idPaisSeleccionado = selectPais.value;

        // Limpiar el select de ciudad y dejar solo la opción por defecto
        selectCiudad.innerHTML = '<option value="">Selecciona una ciudad</option>';

        // Filtrar y agregar las ciudades que corresponden al país seleccionado
        const ciudadesFiltradas = opcionesCiudad.filter(opcion => {
            return opcion.dataset.pais === idPaisSeleccionado;
        });

        ciudadesFiltradas.forEach(ciudad => {
            selectCiudad.appendChild(ciudad);
        });
    }

    // Ocultar todas las ciudades al principio (excepto la opción por defecto)
    selectCiudad.innerHTML = '<option value="">Selecciona una ciudad</option>';

    // Evento cuando se cambia el país
    selectPais.addEventListener('change', filtrarCiudades);
});
