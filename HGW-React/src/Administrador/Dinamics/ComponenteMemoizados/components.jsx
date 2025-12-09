import { TextField, Select, MenuItem, Box, Accordion, AccordionSummary, AccordionDetails, Typography, useTheme } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react'

export const TextFieldMemo = React.memo(({ value, change, indiceP, idx }) => {
    return (
        <TextField value={value} onChange={(e) => change(e, [indiceP, idx, "label"])} />
    )
})

export const SelectMemo = React.memo(({ value, change, indiceP, idx }) => {
    return (
        <Select value={value} onChange={(e) => change(e, [indiceP, idx, "type"])} >
            <MenuItem key={"menuitem" + indiceP + idx + "input"} value={"input"} > Input </MenuItem>
            <MenuItem key={"menuitem" + indiceP + idx + "select"} value={"select"} > Select </MenuItem>
            <MenuItem key={"menuitem" + indiceP + idx + "img"} value={"img"} > Imagen </MenuItem>
        </Select>
    )
})

const SubAcordeon = React.memo(({indiceP, idx, valueI, valueS, change, submodulo})=>{

    return (
        <Box key={"box" + indiceP + idx}>
            {"label" in submodulo &&
                <>
                    <TextFieldMemo value={valueI} change={change} indiceP={indiceP} idx={idx} />
                    <SelectMemo value={valueS} change={change} indiceP={indiceP} idx={idx} />
                </>
            }
        </Box>
    )
})

export const AccordeonMemo = React.memo(({indiceP, idx, activos, submodulo, change, asignar}) => {
    const tema = useTheme();
    let valueI = submodulo?.label ?? "";
    let valueS = submodulo?.type ?? "";
    return (
        <Accordion
            key={idx}
            disableGutters
            elevation={0}
            square
            expanded={activos == idx}
            onChange={() => {
                asignar(idx)
            }}
            sx={{
                width: '100%',
                border: `1px solid ${tema.palette.divider}`,
                borderRadius: 2,
                mb: 1.5,
                boxShadow: '0 1px 5px rgba(0,0,0,0.03)',
                backgroundColor: tema.palette.background.paper,
                transition: 'transform 0.2s ease, box-shadow 0.3s ease',
                '&:hover': {
                    transform: 'scale(1.003)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
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
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        color: tema.palette.text.primary,
                    },
                }}
            >
                <Typography sx={{ textTransform: 'capitalize' }}>
                    {submodulo.id.replace("_", " ")}
                </Typography>
            </AccordionSummary>
            <AccordionDetails
                sx={{
                    px: 2,
                    pb: 2,
                    color: tema.palette.text.secondary,
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    wordWrap: 'break-word',
                }}
            >
                {
                    activos == idx &&
                    <SubAcordeon indiceP={indiceP} idx={idx} valueI={valueI} valueS={valueS} change={change} submodulo={submodulo} />
                }
            </AccordionDetails>
        </Accordion>
    )
})