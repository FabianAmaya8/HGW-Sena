import ListaDinamic from "../Dinamics/Listas/listaDinamic";
import { useMemo, useState } from 'react'

const ListaBonos = ()=>{
    const[render, setRender] = useState(false);
    let data = useMemo(()=>{return {table: "bonos"}}, [render])
    return (
        <ListaDinamic datos={data} padre={useMemo(()=>{return {setRender: setRender, render: render}}, [render])} />
    )
}

export default ListaBonos;