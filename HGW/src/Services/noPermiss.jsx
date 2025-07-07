import { Box, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Style from '../Dinamics/Listas/ListaDinamic.module.scss'
import { useContext } from 'react';
import { AppContext } from '../controlador';

const NoPermiss = ()=>{
    const { medidas, anchoDrawer, alerta } = useContext(AppContext);
    const contenidoWidth = anchoDrawer.isOpen
    ? `calc(100% - ${anchoDrawer.ancho.open - 15}rem)`
    : `calc(100% - ${anchoDrawer.ancho.close - 4}rem)`;
    return(
        <Box className="box-contenidos" sx={{ width: medidas == "movil" ? "100%" : contenidoWidth, transition: "450ms" }}>
            <Box className={Style.formulario}
                sx={{
                    borderRadius: '10px', width: medidas === 'movil' ? '90%' : '98%', height: "80vh", marginTop: medidas == "movil" ? '0%' : '3%', marginLeft: medidas != "movil" ? "2.8vh": 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: "transparent",
                    textAlign: 'center',
                }}
            >
            <LockOutlinedIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h4" gutterBottom>
                Acceso Denegado
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center">
                No tienes permisos para ver esta página.
            </Typography>
            </Box>
        </Box>
    )
}

export default NoPermiss