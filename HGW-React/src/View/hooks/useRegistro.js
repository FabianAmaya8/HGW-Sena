import { useState, useEffect } from "react";

export function useRegistro() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        nombres: "",
        apellido: "",
        patrocinador: "",
        usuario: "",
        contrasena: "",
        confirmarContrasena: "",
        telefono: "",
        correo: "",
        direccion: "",
        codigoPostal: "",
        lugarEntrega: "",
        pais: "",
        ciudad: "",
        fotoPerfil: null,
    });
    const [previewFoto, setPreviewFoto] = useState(null);
    const [ciudadesFiltradas, setCiudadesFiltradas] = useState([]);

    const allCiudades = [
        { value: "101", label: "Bogotá", pais: "1" },
        { value: "102", label: "Medellín", pais: "1" },
        { value: "201", label: "Lima", pais: "2" },
        { value: "202", label: "Cusco", pais: "2" },
    ];

    const validateStep = (stepNum) => {
        const data = formData;
        const required = (fields) => fields.every((f) => data[f]);

        if (stepNum === 1) {
            if (!required(["nombres", "apellido", "patrocinador", "usuario", "contrasena", "confirmarContrasena", "telefono", "correo"]))
                return false;
            if (data.contrasena !== data.confirmarContrasena) return false;
            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo);
            const phoneValid = /^\d{10,}$/.test(data.telefono);
            return emailValid && phoneValid;
        }

        if (stepNum === 2) {
            return required(["direccion", "codigoPostal", "lugarEntrega", "pais", "ciudad"]);
        }

        if (stepNum === 3) {
            return !!data.fotoPerfil;
        }

        return false;
    };


    const avanzar = () => {
        if (step === 1 && validateStep(1)) setStep(2);
        else if (step === 2 && validateStep(2)) setStep(3);
    };

    const retroceder = () => {
        if (step === 2) setStep(1);
        else if (step === 3) setStep(2);
    };


    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            const file = files[0];
            setFormData((prev) => ({ ...prev, [name]: file }));
            const reader = new FileReader();
            reader.onload = (evt) => setPreviewFoto(evt.target.result);
            reader.readAsDataURL(file);
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    useEffect(() => {
        setCiudadesFiltradas(
            allCiudades.filter((c) => c.pais === formData.pais)
        );
    }, [formData.pais]);

    return {
        step,
        formData,
        handleChange,
        avanzar,
        retroceder,
        validateStep,
        previewFoto,
        ciudadesFiltradas,
    };
}
