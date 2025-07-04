import { Box, Slide } from "@mui/material"
import { useState, useEffect } from 'react'
import Style from './Home.module.scss'
import { AppContext } from "../controlador";
import { useContext } from "react";

function Home(){
    const {medidas, anchoDrawer} = useContext(AppContext);
    const contenidoWidth = anchoDrawer.isOpen
    ? `calc(100% - ${anchoDrawer.ancho.open-15}rem)`
    : `calc(100% - ${anchoDrawer.ancho.close-4}rem)`;
    return (
            <Box className="box-contenidos" sx={{width: medidas == "movil" ? "100%": contenidoWidth, transition: "450ms"}}>
                <Slide direction="left" timeout={400} in={true}>
                    <Box className={Style.formulario}>
                        <h1>dsa</h1>
                    </Box>
                </Slide>
            </Box>
    )
}

export default Home;