import { Box, Button } from '@mui/material'
import { findWorkingBaseUrl } from "../../urlDB"
import { jwtDecode } from 'jwt-decode';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';

const URL = findWorkingBaseUrl();

const Informes = ()=>{
    let token = localStorage.getItem("token");
    token = jwtDecode(token)
    console.log(token);
    function consultar(){
        fetch(URL+"consultasInformes", {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify(token)
        }).then((first)=>first.json()).then((res)=>console.log(res));
    }
    return (
        <Box className="box-contenidos">
            <Box>
                
            </Box>
        </Box>
    )
}

export default Informes;