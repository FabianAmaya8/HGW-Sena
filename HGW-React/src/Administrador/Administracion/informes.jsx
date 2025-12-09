import { Box, Button, styled, Typography } from '@mui/material'
import Style from "./informes.module.scss"
import { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '../../controlador';
import { findWorkingBaseUrl } from "../../urlDB";
import { ResponsiveContainer, Cell, PieChart, Pie, LineChart, XAxis, YAxis, Line, Legend, CartesianGrid, Bar, BarChart } from 'recharts';
import { jwtDecode } from 'jwt-decode';
import { replace } from 'react-router';
import { datosToken } from '../../auth';

const URL = findWorkingBaseUrl();
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFE", "#FE7FA2", "#7BD389"];

const Informes = ()=>{
    function convertirMoneda(valor){    
        let valorNuevo = Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
        }).format(valor);
        return valorNuevo
    }
    const { medidas, anchoDrawer, alerta } = useContext(AppContext)
    const [ informesDatos, setInformesDatos ] = useState({});
    let token = localStorage.getItem("token");
    const contenidoWidth = useMemo(() => anchoDrawer.isOpen
        ? `calc(100% - ${anchoDrawer.ancho.open - 15}rem)`
        : `calc(100% - ${anchoDrawer.ancho.close - 4}rem)`, [anchoDrawer.isOpen, anchoDrawer.ancho.open, anchoDrawer.ancho.close]);
    token = jwtDecode(token)
    //console.log(token);
    useEffect(()=>{
        fetch(URL+"consultasInformes", {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify(token)
        }).then((first)=>first.json()).then((res)=>setInformesDatos(res));
    }, []);
    console.log(informesDatos);
    const globalBox = {py: "2%", background: "white", width: "100%", borderRadius: "5px", display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center"};
    const anchoBox = "23%";
    const BoxGrande = {
                    width: '90%',
                    height: medidas == "movil" ? '600px' : '350px',
                    background: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    gap: '4%',
                    padding: medidas == "movil" ? '5%' : '3%',
                    borderRadius: '20px'
                };
    return (
        <Box className="box-contenidos" sx={{
                right: medidas === "movil" ? "0vw" : "0.6vw",
                marginLeft: "auto",
                width: medidas === "movil" ? "100%" : contenidoWidth,
                transition: "450ms"
        }}>
            <Box sx={{pt: "3%", width: "100%", display: "flex", gap: "2.5rem", flexDirection: "column", justifyContent: "space-between", alignItems: "center", paddingBottom: "2.5rem"}}>
                <Box sx={{width: "100%", px: "3%", height: "100%"}}>
                    <Box sx={{width: "100%", display: "flex", justifyContent: "center", flexWrap: "wrap", columnGap: "2.5%", rowGap: "2rem"}}>
                        <Box sx={{width: anchoBox}}>
                            <Box sx={globalBox}> <Typography>Ventas Hoy</Typography> </Box>
                            <Box className={Style.boxChildren}>{informesDatos["ventas_hoy"]}</Box>
                        </Box>
                        <Box sx={{width: anchoBox}}>
                            <Box sx={globalBox}> <Typography>Ventas Mes</Typography> </Box>
                            <Box className={Style.boxChildren}>{informesDatos["ventas_mes"]}</Box>
                        </Box>
                        <Box sx={{width: anchoBox}}>
                            <Box sx={globalBox}> <Typography>Usuarios Registrados</Typography> </Box>
                            <Box className={Style.boxChildren}>{informesDatos["total_clientes"]}</Box>
                        </Box>
                        <Box sx={{width: anchoBox}}>
                            <Box sx={globalBox}> <Typography>Ingresos Hoy</Typography> </Box>
                            <Box className={Style.boxChildren}>{convertirMoneda(parseInt(informesDatos["ingresos_hoy"]))}</Box>
                        </Box>
                        <Box sx={{width: anchoBox}}>
                            <Box sx={globalBox}> <Typography>Ingresos Este Mes</Typography> </Box>
                            <Box className={Style.boxChildren}>{convertirMoneda(parseInt(informesDatos["ingresos_mes"]))}</Box>
                        </Box>
                    </Box>
                </Box>
                <Box sx={BoxGrande} >
                    <Typography typography={"h5"}>Productos Mas Vendidos</Typography>
                    <ResponsiveContainer width="97%" height="100%">
                        <BarChart data={informesDatos["productos_destacados"]} margin={{ bottom: medidas == "movil" ? 120 : 0, right: 45 }} >
                            <XAxis tick={{ textAnchor: medidas == "movil" ? 'end' : 'middle' }} angle={medidas == "movil" ? -90 : 0} dataKey="nombre_producto" interval={0} />
                            <YAxis />
                            <Bar
                                type="monotone"                 
                                dataKey="cantidad_productos"    
                                fill="#8884d8"               
                                strokeWidth={3}                 
                                activeDot={{ r: 8 }}            
                                animationDuration={1500}     
                                barSize={80}   
                                name="Unidades vendidas"
                            />
                            <Legend verticalAlign="top" height={36} />
                            <CartesianGrid strokeDasharray="3 3" stroke="#00000048" />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
                <Box sx={{...BoxGrande, }} >
                    <Typography typography={"h5"}>Ingresos Ultimos Meses</Typography>
                    <ResponsiveContainer width="97%" height="100%">
                        <LineChart data={informesDatos["Ingresos Mes"]} margin={{ bottom: medidas == "movil" ? 80 : 0, right: 45 }} >
                            <XAxis tick={{ textAnchor: medidas == "movil" ? 'end' : 'middle' }} angle={medidas == "movil" ? -90 : 0} dataKey="mes" interval={0} />
                            <YAxis
                                width = {110}
                                tickFormatter={(value) =>
                                    convertirMoneda(value)
                                }
                             />
                            <Line
                                type="monotone"                 
                                dataKey="data"  
                                stroke="#8884d8"               
                                strokeWidth={3}                 
                                activeDot={{ r: 8 }}            
                                animationDuration={1500}     
                                barSize={80}   
                                name="Ingresos"
                            />
                            <Legend verticalAlign="top" height={medidas == "movil" ? 53 : 36} />
                            <CartesianGrid strokeDasharray="3 3" stroke="#00000048" />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
                <Box sx={{...BoxGrande, justifyContent: "space-between", gap: "4%", height: medidas == "movil" ? "380px" : "480px", py: medidas == "movil" ? '5%' : '3%'}} >
                    <Typography typography={"h5"}>Categorías mas Compradas</Typography>
                    <Box sx={{display: "flex", flexDirection: 'row', justifyContent: "space-between", height: "100%", width: "100%"}}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart margin={{ bottom: 0 }} >
                                <Pie 
                                    data={informesDatos["categorias_destacadas"]}              
                                    dataKey="cantidad_compras"  
                                    nameKey="nombre_categoria"
                                    outerRadius={100}  
                                    cx="50%"             
                                    cy="50%"              
                                    animationDuration={1500}     
                                    name="Ingresos"
                                >
                                    {
                                        informesDatos["categorias_destacadas"] && informesDatos["categorias_destacadas"].map((dato, index)=>{
                                            return <Cell key={index} fill={COLORS[index]} />
                                        })
                                    }
                                </Pie>
                                <Legend verticalAlign="top" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default Informes;