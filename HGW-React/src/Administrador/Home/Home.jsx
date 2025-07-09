import React, { useState, useEffect, useContext } from 'react';
import { Box, Container, Typography, Avatar, Slide, keyframes } from '@mui/material';
import HandshakeIcon from '@mui/icons-material/Handshake';
import { AppContext } from "../controlador";
import Style from './Home.module.scss';

const wave = keyframes`
  0% { transform: rotate(0deg); }
  15% { transform: rotate(14deg); }
  30% { transform: rotate(-8deg); }
  45% { transform: rotate(14deg); }
  60% { transform: rotate(-4deg); }
  75% { transform: rotate(10deg); }
  100% { transform: rotate(0deg); }
`;

const WelcomeLogo = () => (
    <Box
        sx={{
            display: 'inline-flex',
            alignItems: 'center',
            bgcolor: 'background.paper',
            p: 2,
            borderRadius: 2,
            boxShadow: 3
        }}
    >
        <HandshakeIcon
            sx={{
                fontSize: 64,
                color: 'primary.main',
                mr: 1,
                animation: `${wave} 2s infinite ease-in-out`
            }}
        />
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Bienvenido
        </Typography>
    </Box>
);

export default function Home() {
    const { medidas, anchoDrawer } = useContext(AppContext);
    const [show, setShow] = useState(false);
    useEffect(() => {
        setShow(true);
    }, []);
    const width = medidas === 'movil'
        ? '100%'
        : `calc(100% - ${anchoDrawer.isOpen ? anchoDrawer.ancho.open - 15 : anchoDrawer.ancho.close - 4}rem)`;

    return (
        <Box className="box-contenidos" sx={{ width, transition: '450ms' }}>
            <Box
                className={Style.formulario}
                sx={{
                    width: medidas === 'movil' ? '90%' : '98%',
                    height: '80vh',
                    mt: medidas === 'movil' ? 0 : '3%',
                    ml: medidas !== 'movil' ? '2.8vh' : 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'transparent',
                    textAlign: 'center'
                }}
            >
                <Slide direction="down" in={show} timeout={600}>
                    <Container
                        maxWidth="sm"
                        sx={{
                            bgcolor: 'white',
                            p: 4,
                            borderRadius: 2,
                            boxShadow: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <WelcomeLogo />
                        <Typography variant="h3" sx={{ fontWeight: 500, mb: 2, mt: 1 }}>
                            Bienvenido, admin
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            Tu panel de administración está listo.
                        </Typography>
                    </Container>
                </Slide>
            </Box>
        </Box>
    );
}
