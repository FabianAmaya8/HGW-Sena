import React, { useState, useEffect, useContext } from 'react';
import {
  Box, Typography, Avatar, keyframes, Paper, Fade, Grow
} from '@mui/material';
import HandshakeIcon from '@mui/icons-material/Handshake';
import { findWorkingBaseUrl } from '../../urlDB';
import { AppContext } from '../../controlador';
import Style from './Home.module.scss';
import { datosToken } from '../../auth';

const BACKEND = (findWorkingBaseUrl() || "").replace(/\/$/, "");

const wave = keyframes`
  0% { transform: rotate(0deg); }
  15% { transform: rotate(14deg); }
  30% { transform: rotate(-8deg); }
  45% { transform: rotate(14deg); }
  60% { transform: rotate(-4deg); }
  75% { transform: rotate(10deg); }
  100% { transform: rotate(0deg); }
`;

const bgGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const frases = [
  "Cargando datos...",
  "Verificando credenciales...",
  "Todo listo ✨"
];

export default function Home() {
  const { medidas, anchoDrawer } = useContext(AppContext);
  const [show, setShow] = useState(false);
  const [usuario, setUsuario] = useState({});
  const [fraseIndex, setFraseIndex] = useState(0);
  const [terminoCarga, setTerminoCarga] = useState(false);
  const token = datosToken()
  useEffect(()=>{
    fetch(BACKEND+"/consultaFilas", {
      method: "POST",
      headers: {"content-type": "application/json"},
      body: JSON.stringify({id_usuario: token.id, table: "usuarios"}),
    }).then((stream)=>stream.json()).then((res)=>setUsuario(res));
  }, []);
  useEffect(() => {
    setShow(true);

    let fraseTimer;
    if (!terminoCarga) {
      fraseTimer = setInterval(() => {
        setFraseIndex(prev => {
          if (prev === frases.length - 1) {
            clearInterval(fraseTimer);
            setTimeout(() => setTerminoCarga(true), 1000);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }

    return () => clearInterval(fraseTimer);
  }, [terminoCarga]);

  const width = medidas === 'movil'
    ? '100%'
    : `calc(100% - ${anchoDrawer.isOpen ? anchoDrawer.ancho.open - 15 : anchoDrawer.ancho.close - 4}rem)`;

  return (
    <Box className="box-contenidos" sx={{ width, transition: '450ms' }}>
      <Box
        className={Style.formulario}
        sx={{
          width: '100%',
          height: '80vh',
          mt: medidas === 'movil' ? 0 : '3%',
          px: medidas === 'movil' ? 3 : 0,         
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          backgroundSize: '400% 400%',
          animation: `${bgGradient} 18s ease infinite`
        }}
      >
        <Fade in={show} timeout={1000}>
          <Paper
            elevation={6}
            sx={{
              px: medidas === 'movil' ? 3 : 6,    
              py: 5,
              borderRadius: 4,
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255,255,255,0.85)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              width: '100%',
              maxWidth: 480                  
            }}
          >
            <Grow in={show} timeout={800}>
              <Avatar sx={{
                bgcolor: 'primary.main',
                width: 80,
                height: 80,
                mb: 1,
                animation: `${wave} 2s infinite`
              }}>
                <HandshakeIcon sx={{ fontSize: 40, color: 'white' }} />
              </Avatar>
            </Grow>

            <Typography variant="h3" sx={{ fontWeight: 700, fontSize: medidas === 'movil' ? '2rem' : '3rem' }}>
              Bienvenido, {usuario.nombre?.replace(/\b\w/g, (l)=> l.toUpperCase())}
            </Typography>

            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{
                height: '24px',
                transition: 'opacity 0.5s ease-in-out',
                fontStyle: 'italic',
                userSelect: 'none',
                fontSize: medidas === 'movil' ? '1rem' : '1.25rem'
              }}
            >
              {!terminoCarga ? frases[fraseIndex] : `Bienvenido ${!usuario.ultimo_acceso ? "por primera vez" : "de nuevo"}!`}
            </Typography>
          </Paper>
        </Fade>
      </Box>
    </Box>
  );
}