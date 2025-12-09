import { Box, Table } from "@mui/material";
import { findWorkingBaseUrl } from "../../urlDB";
import listaDinamic from "../Dinamics/Listas/listaDinamic";
import ListaDinamic from "../Dinamics/Listas/listaDinamic";

function Ordenes(){
    const BACKEND = findWorkingBaseUrl().replace(/\/$/, "");
    
    return (
        <ListaDinamic />
    )
}

export default Ordenes;