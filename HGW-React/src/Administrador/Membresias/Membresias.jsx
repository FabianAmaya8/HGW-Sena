import { useMemo } from 'react'
import DinamicForm from '../Dinamics/formularios/Dinamics'

const Membresias = ({edit, padre})=>{
    const form = useMemo(()=>[
        { title: edit && edit.estado ? "Editar Membresia" : "Crear Membresia", req: {table: "membresias"}},
        { id: "nombre_membresia", type: "input", label: "Nombre Membresia", dependency: "", requirements: {
            maxLength: 9, minLength: 1, value: []
        }},
        { id: "precio_membresia", typeOf: "number", type: "input", label: "precio membresia", dependency: "", childs: ["anoche", "ayer", "hoy"], requirements: {minLength: 5}},
        { variant: "contained", type: "submit", label: edit && edit.estado ? "Editar Membresia" : "Crear Membresia", click: "", submit: "membresias"},
    ], [])
    return (
        <DinamicForm form={form} edit={edit} padre={padre} />
    )
}

export default Membresias;