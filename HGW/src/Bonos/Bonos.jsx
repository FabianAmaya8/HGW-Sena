import { useMemo } from 'react'
import DinamicForm from '../Dinamics/formularios/Dinamics'

const Bonos = ({edit, padre})=>{
    const form = useMemo(()=>[
        { title: edit && edit.estado ? "Editar bono" : "Crear bono", req: {table: "bonos"}},
        { id: "nombre_bono", type: "input", label: "Nombre Bono", dependency: "", requirements: {
            maxLength: 20, minLength: 1, value: []
        }},
        { id: "porcentaje", typeOf: "number", type: "input", label: "Porcentaje Bono", dependency: "", requirements: {
            maxLength: 3, minLength: 1, value: []
        }},
        { id: "tipo", type: "input", label: "Tipo", dependency: "", requirements: {
            maxLength: 20, minLength: 1, value: []
        }},
        { id: "costo_activacion", typeOf: "number", type: "input", label: "Costo Activación", dependency: "", requirements: {
            maxLength: 6, minLength: 1, value: []
        }},
        { variant: "contained", type: "submit", label: edit && edit.estado ? "Editar bono" : "Crear bono", click: "", submit: "bonos"},
    ], [])
    return (
        <DinamicForm form={form} edit={edit} padre={padre} />
    )
}

export default Bonos;