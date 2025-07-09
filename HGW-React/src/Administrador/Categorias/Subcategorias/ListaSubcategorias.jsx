import { useMemo, useState } from 'react'
import ListaDinamic from '../../Dinamics/Listas/listaDinamic';

const ListaSubcategorias = ()=>{
    const[render, setRender] = useState(false);
    let data = useMemo(()=>{return {table: "subcategoria"}}, [render])
    return (
        <ListaDinamic datos={data} padre={useMemo(()=>{return {setRender: setRender, render: render}}, [render])} />
    )
}

export default ListaSubcategorias;