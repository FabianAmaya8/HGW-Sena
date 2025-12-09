import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useContext } from 'react';
import { AppContext } from '../../../controlador';
import { useState } from 'react';
import { findWorkingBaseUrl } from '../../../urlDB'
import {
  TableContainer, DialogTitle, DialogContent, DialogActions,
  Table, TableHead, TableRow, TableCell, TableBody,
  Button, Box, Dialog, Slide, IconButton, Typography, Divider, Pagination, Toolbar
} from '@mui/material';

const BACKEND = findWorkingBaseUrl().replace(/\/$/, "");

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
   '& .MuiDialogContent-root': {
     padding: theme.spacing(2),
   },
   '& .MuiDialogActions-root': {
     padding: theme.spacing(1),
   },
}));

const Transicion = React.forwardRef((props, ref)=>{
  return <Slide ref={ref} {...props} direction='up' />
});


const VistaLog = ({EstadoLog, setEstadoLog, idFila})=>{
    const { medidas } = useContext(AppContext);
    const [datos, setDatos] = useState([]);
    const tamaño = medidas == "movil" ? ["25%", "20%", "45%", "25%", "25%"] : ["10%", "20%", "40%", "10%", "20%"];
    useEffect(()=>{
        if(idFila){
            let id = Object.entries(idFila).find((par)=>par.some((data)=>data.startsWith("id")));
            let envio = {id: id[1], table: "registro_logs", table_log: idFila.table};
            fetch(BACKEND+"/consultaLog", {
                method: "POST",
                headers: {"content-type": "application/json"},
                body: JSON.stringify(envio)
            }).then((res)=>res.json()).then((res)=>setDatos(res));
        }
    }, [idFila])
    return (
        <BootstrapDialog
                disableRestoreFocus
                disableEnforceFocus
                slots={{
                  transition: Transicion
                }}
                onClose={()=>setEstadoLog(false)}
                aria-labelledby="customized-dialog-title"
                open={EstadoLog}
                PaperProps={{
                    sx: {width: "80vw"}
                }}
              >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                  Registro Log
                </DialogTitle>
                <IconButton
                  aria-label="close"
                  onClick={()=>setEstadoLog(false)}
                  sx={(theme) => ({
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                  })}
                >
                  <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <Box sx={{width: medidas == "movil" ? "max-content" : "100%", overflowX: "auto", px: "1vw"}}>
                        <Box sx={{display: "flex", alignItems: "center", flex: 1, width: "100%"}}>
                            {
                                datos[0] && Object.keys(datos[0]).map((nom, index)=>{
                                    return <Box key={index+nom} sx={{textAlign: 'center', marginBottom: "2.5%", pb: "3.5%",  borderBottom: "solid 1px gray", height: "60px", width: tamaño[index],display: "flex", justifyContent: "center", alignItems: "center"}}>{(nom.replace(/\b\w/g, (l)=>l.toUpperCase())).replace(/_/g, " ")}</Box>
                                })
                            }
                        </Box>
                        <Box sx={{width: "100%", flex: 1}}>
                            {
                                datos && datos.map((fila, index)=>{
                                    return <Box key={"fila"+index} sx={{py: "2.5vh",display: "flex", alignItems: "center", flex: 1, width: "100%"}}>
                                        {
                                            Object.values(fila).map((val, index)=>{
                                                return <Box key={val+index} sx={{textAlign: 'center', width: tamaño[index], display: "flex", justifyContent: "center", alignItems: "center"}}>
                                                    {val}
                                                </Box>
                                            })
                                        }
                                    </Box>
                                })
                            }
                        </Box>
                    </Box>
                </DialogContent>
              </BootstrapDialog>
    )
}

export default VistaLog;