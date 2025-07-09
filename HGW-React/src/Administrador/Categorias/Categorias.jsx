import { useMemo } from 'react'
import DinamicForm from '../Dinamics/formularios/Dinamics'

const Categorias = ({edit, padre})=>{
    const form = useMemo(()=>[
        { title: edit && edit.estado ? "Editar Categoria" : "Crear Categoria", req: {table: "categorias"}},
        { id: "nombre_categoria", type: "input", label: "Nombre Categoria", dependency: "", requirements: {
            maxLength: 9, minLength: 1, value: []
        }},
        { id: "img_categoria", type: "img", label: "", dependency: "", childs: ["anoche", "ayer", "hoy"], requirements: {minLength: 5}},
        { variant: "contained", type: "submit", label: edit && edit.estado ? "Editar Categoria" : "Crear Categoria", click: "", submit: "categorias"},
    ], [])
    return (
        <DinamicForm form={form} edit={edit} padre={padre} />
    )
}

export default Categorias;