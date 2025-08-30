import React, { useState, useContext, useMemo, useCallback } from 'react';
import {
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    useTheme,
    TextField,
    Select,
    MenuItem,
} from '@mui/material';
import { AccordeonMemo } from '../Dinamics/ComponenteMemoizados/components'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AppContext } from '../../controlador';

const MostrarSubacordeones = React.memo(({ modulo, indiceP, change }) => {
    let [activos, setActivos] = useState(null);
    const asignar = useCallback((activo)=>{
        setActivos((prev)=>prev == activo ? null: activo)
    }, [])
    return modulo.map((submodulo, idx) => {
        if (idx !== 0 && idx !== modulo.length - 1) {
            
            return (
                <AccordeonMemo key={"accordeonPadre"+indiceP+idx} asignar={asignar} indiceP={indiceP} idx={idx} activos={activos} submodulo={submodulo} change={change} />
            );
        }
        return null;
    });
});

const EditarModulo = React.memo(({ vistas }) => {
    const tema = useTheme();
    const [objeto, setObjeto] = useState(vistas);
    const { medidas, anchoDrawer } = useContext(AppContext);
    const [indiceAbierto, setIndiceAbierto] = useState(null);
    const change = useCallback((evento, ruta) => {
        setObjeto(prevObjeto => {
            const newObjeto = [...prevObjeto];
            newObjeto[ruta[0]] = [...prevObjeto[ruta[0]]];
            newObjeto[ruta[0]][ruta[1]] = {
                ...prevObjeto[ruta[0]][ruta[1]],
                [ruta[2]]: evento.target.value,
            };
            return newObjeto;
        });
    }, [])
    const contenidoWidth = useMemo(
    () =>
      anchoDrawer.isOpen
        ? `calc(100% - ${anchoDrawer.ancho.open - 15}rem)`
        : `calc(100% - ${anchoDrawer.ancho.close - 4}rem)`,
    [anchoDrawer])

    return (
        <Box
            className="box-contenidos"
            sx={{
                width: medidas === 'movil' ? '100%' : contenidoWidth,
                transition: '450ms',
            }}
        >
            <Box
                sx={{
                    backgroundColor: tema.palette.mode === 'light' ? '#fafafa' : '#1e1e1e',
                    borderRadius: 4,
                    width: medidas === 'movil' ? '90%' : '96.5%',
                    overflow: 'auto',
                    p: 4,
                    maxHeight: '80vh',
                    
                    mx: 'auto',
                    mt: '2rem',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                    '&::-webkit-scrollbar': { width: '2.5px', height: '9px' },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#7e9e4a',
                        borderRadius: '5px',
                    },
                    '& .MuiTableCell-stickyHeader': {
                        backgroundColor: '#9BCC4B',
                        color: 'white',
                    },
                    borderRadius: '10px 0 0 10px',
                    ...(medidas == "movil" ? {m: '3.5vh 1%'} :  {marginRight: "0.8%"}),
                    background: 'white',
                    height: '78.5vh',
                }}
            >
                {objeto.map((modulo, idx) => (
                    <Accordion
                        key={idx}
                        disableGutters
                        elevation={0}
                        square
                        expanded={indiceAbierto === idx}
                        onChange={(_, abierto) => setIndiceAbierto(abierto ? idx : null)}
                        sx={{
                            width: '100%',
                            border: `1px solid ${tema.palette.divider}`,
                            borderRadius: 2,
                            mb: 2,
                            boxShadow: '0 1px 6px rgba(0,0,0,0.03)',
                            transition: 'transform 0.2s ease, box-shadow 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.005)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.07)',
                            },
                            '&:before': {
                                display: 'none',
                            },
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                                py: 1,
                                px: 2,
                                '& .MuiTypography-root': {
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    color: tema.palette.text.primary,
                                },
                            }}
                        >
                            <Typography sx={{ textTransform: 'capitalize' }}>
                                {modulo[0]?.req?.table ?? 'Sección'}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails
                            sx={{
                                px: 2,
                                pb: 2,
                                color: tema.palette.text.secondary,
                                fontSize: '0.95rem',
                                lineHeight: 1.6,
                                wordWrap: 'break-word',
                            }}
                        >
                            {
                                indiceAbierto === idx &&
                                <MostrarSubacordeones change={change} modulo={modulo} indiceP={idx} />
                            }
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </Box>
    );
});

export default EditarModulo;