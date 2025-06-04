import { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { urlDB } from '../../urlDB';


export const useRegistro = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nombres: '',
    apellido: '',
    patrocinador: '',
    usuario: '',
    contrasena: '',
    confirmarContrasena: '',
    telefono: '',
    correo: '',
    direccion: '',
    codigo_postal: '',
    lugar_entrega: '',
    pais: '',
    ciudad: '',
    fotoPerfil: null,
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paises, setPaises] = useState([]);
  const [ciudades, setCiudades] = useState([]);

  // Fetch countries on mount
  useEffect(() => {
    const endpoint = 'api/ubicacion/paises';

    const fetchPaises = async () => {      
      try{
        const urlFetch = await urlDB(endpoint);;
        const res = await fetch(urlFetch);
        const data = await res.json();
        setPaises(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchPaises();

  }, []);

  // Fetch cities when country changes
  useEffect(() => {
    if (!formData.pais) return;
    const endpoint = `api/ubicacion/ciudades?paisId=${formData.pais}`;

    const fetchCiudades = async () => {
      try{
        const urlFetch = await urlDB(endpoint);
        const res = await fetch(urlFetch);
        const data = await res.json();
        setCiudades(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchCiudades();
  }, [formData.pais]);

  const handleInputChange = useCallback(e => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      const file = files[0];

      // ⛔ tipo de archivo
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Archivo no válido',
          text: 'Solo se permiten imágenes (JPG, PNG, etc).',
        });
        return;
      }
      // ⛔ tamaño máximo (2MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'Imagen demasiado grande',
          text: 'La imagen no puede superar los 5MB.',
        });
        return;
      }

      // ✅ Guardar archivo e imagen preview
      setFormData(prev => ({ ...prev, [name]: file }));

      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, fotoPreview: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      // Inputs normales
      setFormData(prev => ({
        ...prev,
        [name]: value,
        ...(name === 'pais' ? { ciudad: '' } : {})
      }));
    }

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }, [errors]);


  // Validation logic omitted for brevity; reuse your validateStep
  const validateStep = useCallback(step => {
    const newErrors = {};
    // ... implement per-step validations
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const goToStep = useCallback(step => {
    if (step < currentStep) return setCurrentStep(step);
    for (let i = 1; i < step; i++) {
      if (!validateStep(i)) return setCurrentStep(i);
    }
    setCurrentStep(step);
  }, [currentStep, validateStep]);

  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) setCurrentStep(s => Math.min(s + 1, 3));
  }, [currentStep, validateStep]);

  const prevStep = useCallback(() => setCurrentStep(s => Math.max(s - 1, 1)), []);

  const handleSubmit = useCallback(async e => {
    e.preventDefault();
    if (![1,2,3].every(step => validateStep(step))) return;
    setIsLoading(true);
    try {
      const submitData = new FormData();
        submitData.append('nombres',             formData.nombres);
        submitData.append('apellido',            formData.apellido);
        submitData.append('patrocinador',        formData.patrocinador);
        submitData.append('usuario',             formData.usuario);
        submitData.append('contrasena',          formData.contrasena);
        submitData.append('confirmar_contrasena', formData.confirmarContrasena);
        submitData.append('correo',              formData.correo);
        submitData.append('telefono',            formData.telefono);
        submitData.append('direccion',           formData.direccion);
        submitData.append('codigo_postal',       formData.codigo_postal);
        submitData.append('lugar_entrega',       formData.lugar_entrega);
        submitData.append('ciudad',              formData.ciudad);
        
        if (formData.fotoPerfil) {
          submitData.append('foto_perfil', formData.fotoPerfil);
        }

      const endpoint = 'api/register';
      const urlFetch = await urlDB(endpoint);
      
      const res = await fetch(urlFetch, { method: 'POST', body: submitData });

      const result = await res.json();
      if (!res.ok){
        throw new Error(result.message || 'Error de registro');
      }

      // alesta de envio exitoso
      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: result.message || "Bienvenido",
        confirmButtonText: "Ingresar"
      })
      .then(() => {
        window.location.href = result.redirect || "/login";
      });
    } catch (err) {
      //alerta de error
      Swal.fire({
        icon: "error",
        title: "Error de registro",
        text: err.message || "Error de registro",
        confirmButtonText: "Reintentar"
      })
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateStep]);

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };


  return {
    currentStep,
    formData,
    errors,
    imagePreview,
    isLoading,
    paises,
    ciudades,
    handleInputChange,
    goToStep,
    nextStep,
    prevStep,
    handleSubmit,
    handleBack,
  };
};