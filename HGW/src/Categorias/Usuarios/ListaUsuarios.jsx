import ListaDinamic from "../../Dinamics/Listas/listaDinamic"
import { useMemo, useState } from 'react'

const ListaUsuarios = ()=>{
    const[render, setRender] = useState(false);
    let data = useMemo(()=>{return {table: "usuarios"}}, [render])
    return (
        <ListaDinamic datos={data} padre={useMemo(()=>{return {setRender: setRender, render: render}}, [render])} />
    )
}

export default ListaUsuarios