import { Slide, Box } from '@mui/material'
import DinamicForm from '../../Dinamics/formularios/Dinamics';
import { useMemo } from 'react';

function Subcategorias({edit, padre}){
    const consultas = [
        {table: "categorias"},
    ];
    const form = useMemo(()=>[
      { title: edit && edit.estado ? "Editar Subcategoria" : "Crear Subcategoria", req: {table: "subcategoria"}},
      { id: "nombre_subcategoria", type: "input", label: "Nombre Subcategoria", dependency: "", requirements: {
        maxLength: 9, minLength: 1, value: []
      }},
      { id: "categoria", type: "select", label: "Eliga la Categoria", dependency: "", childs: {table: "categorias"}, requirements: {}},
      { variant: "contained", type: "submit", label: "Crear Categoria", click: "", submit: "subcategoria"},
    ], []);
    return (
      <DinamicForm form={form} consultas={consultas} edit={edit} padre={padre} />
    )
}

export default Subcategorias;