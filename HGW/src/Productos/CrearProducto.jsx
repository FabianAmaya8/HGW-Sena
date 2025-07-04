import { useMemo } from "react";
import DinamicForm from "../Dinamics/formularios/Dinamics"

const CrearProducto = ({edit, padre})=>{
    const consultas = useMemo(()=>[
        {table: "categorias"},
        {table: "subcategoria"}
    ], []);
    const form = useMemo(()=>[
        { title: edit && edit.estado ? "Editar Producto" : "Crear Producto", req: {table: "productos"}},
        { id: "nombre_producto", type: "input", label: "Nombre Producto", dependency: "", requirements: {
            maxLength: 9, minLength: 1, value: []
        }},
        { id: "precio_producto", typeOf: "number", type: "input", label: "Precio Producto", dependency: "", requirements: {
            maxLength: 19, minLength: 1, value: []
        }},
        { id: "stock", type: "input", label: "Stock", dependency: "", requirements: {
            maxLength: 100, minLength: 1, value: []
        }},
        { id: "descripcion", typeOf: "string", type: "input", label: "Descripción", dependency: "", requirements: {
            maxLength: 19, minLength: 1, value: []
        }},
        { id: "imagen_producto", type: "img", label: "", dependency: "", childs: [], requirements: {minLength: 5}},
        { id: "categoria", type: "select", label: "Eliga la Categoria", changeTable: {table: "subcategoria", columnDependency: "categoria"}, childs: {table: "categorias"}, requirements: {}},
        { id: "subcategoria", type: "select", label: "Eliga la Subcategoria", dependency: {elemento: "categoria"}, childs: {table: "subcategoria"}, requirements: {}},
        { variant: "contained", type: "submit", label: "Crear Producto", click: "", submit: "productos"},
    ], []);
    return (
        <DinamicForm form={form} consultas={consultas} edit={edit} padre={padre} />
    )
}

export default CrearProducto;