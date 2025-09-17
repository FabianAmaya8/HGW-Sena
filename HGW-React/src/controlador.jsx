import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useTheme, useMediaQuery, createTheme, ThemeProvider, Backdrop } from '@mui/material'
import "./font.module.scss"
import './index.scss'
import { createContext, useMemo, useState, useEffect } from 'react'
import Navbar from './Navbar.jsx'
import Home from './Administrador/Home/Home.jsx'
import Dinamics from './Administrador/Dinamics/formularios/Dinamics.jsx'
import ListaDinamics from './Administrador/Dinamics/Listas/listaDinamic.jsx'
import Secure from './Administrador/Services/guardia.jsx'
import NoPermiss from './Administrador/Services/noPermiss.jsx'
import Nofound from './Administrador/Services/no-found.jsx'
import CircularProgress from '@mui/material/CircularProgress';
import CreacionVistas from './Administrador/ModulosGestionVista/Creacion.jsx'
import EditarModulo from './Administrador/ModulosGestionVista/Edicion.jsx'
import { findWorkingBaseUrl } from './urlDB.js'

const BACKEND = findWorkingBaseUrl()
const tema = createTheme({
  palette: {
    primary: { main: "#29293D", contrastText: 'rgba(255, 255, 255, 0.88)' },
    secondary: { main: "#59732F" },
    background: { main: "#f0f0f0" },
    barra: { main: "#29293D" },
  },
  typography: { fontFamily: "Arial" }
})

export const AppContext = createContext()

const Controlador = () => {
  const [render, setRender] = useState(false)
  const [form, setForm] = useState([])
  useEffect(() => {
    fetch(BACKEND + "/consultaTabla", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ table: "modulosAdmin" })
    })
      .then(r => r.json())
      .then(setForm)
  }, [])
  const moviles = useMediaQuery(tema.breakpoints.down("sm"))
  const tablets = useMediaQuery(tema.breakpoints.between("sm", "md"))
  const medidas = moviles ? "movil" : tablets ? "tablet" : "pc"
  const [estadoDrawer, setEstadoDrawer] = useState(false)
  const objetoDrawer = useMemo(() => ({ isOpen: estadoDrawer, setIsOpen: setEstadoDrawer, ancho: { open: "31", close: "9" } }), [estadoDrawer])
  const [imagenes, setImagenes] = useState(false)
  const [alerta, setAlerta] = useState({ estado: false, valor: { title: "", content: "" } })
  const ctx = useMemo(() => ({ imagenes: { estado: imagenes, setImagenes, file: "" }, alerta: { value: alerta, setAlerta }, medidas, anchoDrawer: objetoDrawer }), [imagenes, alerta, medidas, objetoDrawer])
  const navImgs = useMemo(() => ({ imagenes, setImagenes }), [imagenes])
  const padre = useMemo(() => ({ setRender, render }), [render])
  const menu = useMemo(() => {
    if (!Array.isArray(form?.filas)) return []
    try { return JSON.parse(form.filas[0].navbar) } catch { return [] }
  }, [form.filas])
  const drawerItems = useMemo(() => {
    if (!Array.isArray(form?.filas)) return []
    try {
      let valoresDrawer = JSON.parse(form.filas[0].vistas)
      valoresDrawer.push({
        "id": 16,
        "value": "Modulos",
        "icon": "<SettingsIcon />",
        "colorText": "white",
        "childs": [
          {
            "id": 17,
            "value": "Crear",
            "colorText": "white",
            "click": "/Administrador/GestionVistas/Crear"
          },
          {
            "id": 18,
            "value": "Editar",
            "colorText": "white",
            "click": "/Administrador/GestionVistas/Editar"
          }
        ]
      })
      return valoresDrawer
    } catch { return [] }
  }, [form.filas])
  const rutas = useMemo(() => menu.flatMap(datos => {
    const llave = datos[0].path
    const consulta = "tableC" in datos[0] ? datos[0].tableC : undefined
    return [
      <Route key={llave + "/Crear"} path={llave + "/Crear"} element={<Secure><Dinamics key={datos[0].req.table} form={datos} consultas={consulta} edit={{ estado: false, datos: "" }} /></Secure>} />,
      <Route key={llave + "/Lista"} path={llave + "/Lista"} element={<Secure><ListaDinamics form={datos} consultas={consulta} datos={datos[0].req} padre={padre} /></Secure>} />
    ]
  }), [menu, padre])

  // después de const rutas = useMemo(...)
  console.log('<------------------------->');
console.log('RUTAS REGISTRADAS POR CONTROLADOR:', rutas.map(r => r.props.path));
console.log('MENU (navbar paths):', menu.map(m => m[0]?.path));
console.log('DRAWER ITEMS (vistas tal cual):', drawerItems);
console.log('<------------------------->');
  return (
    <ThemeProvider theme={tema}>
      <AppContext.Provider value={ctx}>
        <Navbar objeto={drawerItems} imagenes={navImgs} alerta={alerta} setAlerta={setAlerta} />
        {
          Array.isArray(form?.filas) ?
            <Routes>
              <Route path="*" element={<Nofound />} />
              <Route index element={<Navigate to="Home" replace />} />
              {rutas}
              <Route path="GestionVistas/Crear" element={<Secure><CreacionVistas /></Secure>} />
              <Route path="GestionVistas/Editar" element={<Secure><EditarModulo vistas={menu} /></Secure>} />
              <Route path="Home" element={<Secure><Home /></Secure>} />
              <Route path="no-autorizado" element={<NoPermiss />} />
            </Routes> :
            <Backdrop
              sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
              open={open}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
        }
      </AppContext.Provider>
    </ThemeProvider>
  )
}

export default Controlador
