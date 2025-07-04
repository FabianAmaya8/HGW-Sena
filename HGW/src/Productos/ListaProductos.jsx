import { useMemo, useState } from 'react'
import ListaDinamic from '../Dinamics/Listas/listaDinamic'

const ListaProductos = ()=>{
    const[render, setRender] = useState(false);
    let data = useMemo(()=>{return {table: "productos"}}, [render])
    return (
        <ListaDinamic datos={data} padre={useMemo(()=>{return {setRender: setRender, render: render}}, [render])} />
    )
}

export default ListaProductos;