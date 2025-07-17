import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTheme, useMediaQuery } from '@mui/material'
import { Navigate } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material'
import './index.scss'
import { createContext, useMemo, useState, useEffect } from 'react'
import Navbar from './Navbar.jsx'
import Home from './Administrador/Home/Home.jsx'
import Categorias from './Administrador/Categorias/Categorias.jsx'
import Subcategorias from './Administrador/Categorias/Subcategorias/Subcategorias.jsx'
import ListaCategorias from './Administrador/Categorias/ListaCategorias.jsx'
import CrearProducto from './Administrador/Productos/CrearProducto.jsx'
import ListaSubcategorias from './Administrador/Categorias/Subcategorias/ListaSubcategorias.jsx'
import ListaProductos from './Administrador/Productos/ListaProductos.jsx'
import Usuarios from './Administrador/Usuarios/Usuarios.jsx'
import ListaUsuarios from './Administrador/Usuarios/ListaUsuarios.jsx'
import Secure from './Administrador/Services/guardia.jsx'
import Membresias from './Administrador/Membresias/Membresias.jsx'
import ListaMembresias from './Administrador/Membresias/ListaMembresias.jsx'
import Bonos from './Administrador/Bonos/Bonos.jsx'
import ListaBonos from './Administrador/Bonos/ListaBonos.jsx'
import NoPermiss from './Administrador/Services/noPermiss.jsx'
import Nofound from './Administrador/Services/no-found.jsx'

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

const Controlador = () => {
  const moviles = useMediaQuery(tema.breakpoints.down("sm"))
  const tablets = useMediaQuery(tema.breakpoints.between("sm", "md"))
  const [estadoDrawer, setEstadoDrawer] = useState(false)
  const objetoDrawer = useMemo(() => ({ isOpen: estadoDrawer, setIsOpen: setEstadoDrawer, ancho: { open: "31", close: "9" } }), [estadoDrawer])
  const [imagenes, setImagenes] = useState(false)
  const [alerta, setAlerta] = useState({ estado: false, valor: { title: "", content: "" } })
  const medidas = moviles ? "movil" : tablets ? "tablet" : "pc"
  const ctx = useMemo(() => ({ imagenes: { estado: imagenes, setImagenes, file: "" }, alerta: { value: alerta, setAlerta }, medidas, anchoDrawer: objetoDrawer }), [imagenes, alerta, medidas, objetoDrawer])
  const navImgs = useMemo(() => ({ imagenes, setImagenes }), [imagenes, setImagenes])
  return (
    <ThemeProvider theme={tema}>
      <AppContext.Provider value={ctx}>
          <Routes>
            <Route path='/' element={<Navbar imagenes={navImgs} alerta={alerta} setAlerta={setAlerta} />}>
              <Route path="*" element={<Nofound />} />
              <Route index element={<Navigate to="Home" replace />} />
              <Route path="Home" element={<Secure><Home /></Secure>} />
              <Route path="Categorias/Crear" element={<Secure><Categorias /></Secure>} />
              <Route path="Categorias/Lista" element={<Secure><ListaCategorias /></Secure>} />
              <Route path="Categorias/Subcategorias/Crear" element={<Secure><Subcategorias /></Secure>} />
              <Route path="Categorias/Subcategorias/Lista" element={<Secure><ListaSubcategorias /></Secure>} />
              <Route path="Productos/Crear" element={<Secure><CrearProducto /></Secure>} />
              <Route path="Productos/Lista" element={<Secure><ListaProductos /></Secure>} />
              <Route path="Usuarios/Lista" element={<Secure><ListaUsuarios /></Secure>} />
              <Route path="Usuarios/Crear" element={<Secure><Usuarios /></Secure>} />
              <Route path="Membresias/Crear" element={<Secure><Membresias /></Secure>} />
              <Route path="Membresias/Lista" element={<Secure><ListaMembresias /></Secure>} />
              <Route path="Bonos/Crear" element={<Secure><Bonos /></Secure>} />
              <Route path="Bonos/Lista" element={<Secure><ListaBonos /></Secure>} />
              <Route path="no-autorizado" element={<NoPermiss />} />
            </Route>
          </Routes>
      </AppContext.Provider>
    </ThemeProvider>
  )
}

export default Controlador;