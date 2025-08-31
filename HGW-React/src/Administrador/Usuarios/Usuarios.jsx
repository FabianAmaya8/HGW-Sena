import { useMemo } from 'react'
import DinamicForm from '../Dinamics/formularios/Dinamics'

const Usuarios = ({edit, padre})=>{
    const consultas = [
        {table: "membresias"},
        {table: "roles"}
    ];
    const form = useMemo(()=>[
            { title: edit && edit.estado ? "Editar Usuario" : "Crear Usuario", req: {table: "usuarios"}},
            { id: "nombre", type: "input", label: "ingrese el nombre", dependency: "", requirements: {
                maxLength: 50, minLength: 1, value: []
            }},
            { id: "apellido", type: "input", label: "ingrese el apellido", dependency: "", requirements: {
                maxLength: 50, minLength: 1, value: []
            }},
            { id: "nombre_usuario", type: "input", label: "ingrese el nombre de usuario", dependency: "", requirements: {
                maxLength: 25, minLength: 1, value: []
            }},
            { id: "pss", typeOf: "password", type: "input", label: "ingrese su contraseña", dependency: "", requirements: {
                maxLength: 25, minLength: 8, value: []
            }},
            { id: "rol", type: "select", label: "Eliga el rol", dependency: "", childs: {table: "roles"}, requirements: {}},
            { id: "correo_electronico", type: "input", label: "ingrese el correo electronico", dependency: "", requirements: {
                maxLength: 50, minLength: 5, value: []
            }},
            { id: "numero_telefono", typeOf: "number", type: "input", label: "ingrese el numero de telefono", dependency: "", requirements: {
                maxLength: 10, minLength: 1, value: []
            }},
            { id: "url_foto_perfil", type: "img", label: "", dependency: "", childs: ["anoche", "ayer", "hoy"], requirements: {minLength: 5}},
            { id: "patrocinador", typeOf: "string", type: "input", label: "ingrese el patrocinador", dependency: "", requirements: {
                maxLength: 50, minLength: 1, value: []
            }},
            { id: "membresia", type: "select", label: "Eliga la membresia", dependency: "", childs: {table: "membresias"}, requirements: {}},
            { variant: "contained", type: "submit", label: edit && edit.estado ? "Editar Usuario" : "Crear Usuario", click: "", submit: "usuarios"},
    ], [])
    return (
        <DinamicForm form={form} edit={edit} padre={padre} consultas={consultas} />
    )
}

export default Usuarios