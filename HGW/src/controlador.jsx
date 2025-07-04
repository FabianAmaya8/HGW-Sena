import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTheme, useMediaQuery } from '@mui/material'
import { Navigate } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material'
import './index.scss'
import { createContext, useMemo, useState, useEffect } from 'react'
import Navbar from './Navbar.jsx'
import Home from './Home/Home.jsx';
import Categorias from './Categorias/Categorias.jsx'
import Subcategorias from './Categorias/Subcategorias/Subcategorias.jsx'
import ListaCategorias from './Categorias/ListaCategorias.jsx'
import EditarDinamic from './Dinamics/formularios/editar/editarDinamic.jsx'
import CrearProducto from './Productos/CrearProducto.jsx'
import ListaSubcategorias from './Categorias/Subcategorias/ListaSubcategorias.jsx'
import ListaProductos from './Productos/ListaProductos.jsx'
import Usuarios from './Categorias/Usuarios/Usuarios.jsx'
import ListaUsuarios from './Categorias/Usuarios/ListaUsuarios.jsx'
import Secure from './Services/guardia.jsx'
import NoPermiss from './Services/noPermiss.jsx'
import Nofound from './Services/no-found.jsx'

const tema = createTheme({
  palette: {
    primary: {
      main: "#9BCC4B"
    },
    secondary: {
      main: "#59732F"
    },
    background: {
      main: "#f0f0f0"
    }
  },
  typography: {
    fontFamily: "Arial"
  }
});

export const AppContext = createContext();

const Controlador = ()=>{
    const pagina = useTheme();
    const [estadoDrawer, setEstadoDrawer] = useState(false);
    const objetoDrawer = useMemo(()=>({isOpen: estadoDrawer, setIsOpen: setEstadoDrawer, ancho: {open: "31", close: "9"}}), [estadoDrawer]);
    const moviles = useMediaQuery(tema.breakpoints.down("sm"));
    const tablets = useMediaQuery(tema.breakpoints.between("sm", "md"));
    const pc = useMediaQuery(tema.breakpoints.up("md"));
    const [imagenes, setImagenes] = useState(false);
    const [alerta, setAlerta] = useState({estado: false, valor: {title: "", content: ""}});
    return(
          <ThemeProvider theme={tema}>
            <AppContext.Provider value={{imagenes: {estado: imagenes, setImagenes: setImagenes, file: ""}, alerta: {value: alerta, setAlerta: setAlerta}, medidas: moviles ? "movil": tablets ? "tablet": pc && "pc", anchoDrawer: objetoDrawer}}>
              <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Navbar imagenes={useMemo(()=>({imagenes: imagenes, setImagenes: setImagenes}),[imagenes])} alerta={alerta} setAlerta={setAlerta} />}>
                      <Route path="*" element={<Nofound />} />
                      <Route index element={<Navigate to="home" replace />} />
                      <Route path="home" element={<Secure><Home /></Secure>} />
                      <Route path="Categorias/Crear" element={<Secure><Categorias /></Secure>} />
                      <Route path="Categorias/Lista" element={<Secure><ListaCategorias /></Secure>} />
                      <Route path="Categorias/Subcategorias/Crear" element={<Secure><Subcategorias /></Secure>} />
                      <Route path="Categorias/Subcategorias/Lista" element={<Secure><ListaSubcategorias /></Secure>} />
                      <Route path='Categorias/Editar' element={<Secure><EditarDinamic /></Secure>} />
                      <Route path="Productos/Crear" element={<Secure><CrearProducto /></Secure>} />
                      <Route path="Productos/Lista" element={<Secure><ListaProductos /></Secure>} />
                      <Route path="Usuarios/Lista" element={<Secure><ListaUsuarios /></Secure>} />
                      <Route path="Usuarios/Crear" element={<Secure><Usuarios /></Secure>} />
                      <Route path="no-autorizado" element={<NoPermiss />} />
                    </Route>
                </Routes>
              </BrowserRouter>
            </AppContext.Provider>
          </ThemeProvider>
    )
}

export default Controlador;