import ListaDinamic from "../Dinamics/Listas/listaDinamic";
import { useMemo, useState } from 'react'

const ListaMembresias = () => {
    const[render, setRender] = useState(false);
    let data = useMemo(()=>{return {table: "membresias"}}, [render])
    return (
        <ListaDinamic datos={data} padre={useMemo(()=>{return {setRender: setRender, render: render}}, [render])} />
    )
}

export default ListaMembresias;