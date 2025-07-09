import { createBrowserRouter, Navigate } from "react-router-dom";

// 🧑‍💼 Visitante
import InicioWrapper from "./pages/View/inicioWrapper";
import Buquedapage from "./pages/User/buqueda";
import LoginPege from "./pages/View/loginPage";
import RegistroPage from "./pages/View/registroPage";
import CatalogoPage from "./pages/View/catalogoPege";
import Carritopage from "./pages/User/carritopag";

// 👤 Usuario
import Inicio from "./pages/User/InicioPege";
import PersonalPage from "./pages/User/personalPage";
import InfoPersonalPege from "./pages/User/InfoPersonalPege";
import EducacionPage from "./pages/User/educacionPage";
import ProductoPag from "./pages/User/productopag";

// 🛠️ Admin
import Navbar from "./Administrador/Navbar.jsx";
import Home from "./Administrador/Home/Home.jsx";
import Categorias from "./Administrador/Categorias/Categorias.jsx";
import ListaCategorias from "./Administrador/Categorias/ListaCategorias.jsx";
import Subcategorias from "./Administrador/Categorias/Subcategorias/Subcategorias.jsx";
import ListaSubcategorias from "./Administrador/Categorias/Subcategorias/ListaSubcategorias.jsx";
import CrearProducto from "./Administrador/Productos/CrearProducto.jsx";
import ListaProductos from "./Administrador/Productos/ListaProductos.jsx";
import Usuarios from "./Administrador/Usuarios/Usuarios.jsx";
import ListaUsuarios from "./Administrador/Usuarios/ListaUsuarios.jsx";
import Membresias from "./Administrador/Membresias/Membresias.jsx";
import ListaMembresias from "./Administrador/Membresias/ListaMembresias.jsx";
import Bonos from "./Administrador/Bonos/Bonos.jsx";
import ListaBonos from "./Administrador/Bonos/ListaBonos.jsx";
import NoPermiss from "./Administrador/Services/noPermiss.jsx";
import Nofound from "./Administrador/Services/no-found.jsx";
import Secure from "./Administrador/Services/guardia.jsx";

const router = createBrowserRouter([
  // 📄 Rutas públicas
  { path: "/", element: <InicioWrapper /> },
  { path: "/search", element: <Buquedapage /> },
  { path: "/login", element: <LoginPege /> },
  { path: "/register", element: <RegistroPage /> },
  { path: "/Catalogo", element: <CatalogoPage /> },
  { path: "/carrito", element: <Carritopage /> },
  { path: "/inicio", element: <Inicio /> },
  { path: "/Personal", element: <PersonalPage /> },
  { path: "/informacion-personal", element: <InfoPersonalPege /> },
  { path: "/Educacion", element: <EducacionPage /> },
  { path: "/producto/:id", element: <ProductoPag /> },

  // 🔐 Rutas Admin (con Navbar y contexto en Controlador)
  {
    path: "/Administrador",
    element: <Controlador />,
    children: [
      { index: true, element: <Navigate to="Home" replace /> },
      { path: "Home", element: <Secure><Home /></Secure> },
      { path: "Categorias/Crear", element: <Secure><Categorias /></Secure> },
      { path: "Categorias/Lista", element: <Secure><ListaCategorias /></Secure> },
      { path: "Categorias/Subcategorias/Crear", element: <Secure><Subcategorias /></Secure> },
      { path: "Categorias/Subcategorias/Lista", element: <Secure><ListaSubcategorias /></Secure> },
      { path: "Productos/Crear", element: <Secure><CrearProducto /></Secure> },
      { path: "Productos/Lista", element: <Secure><ListaProductos /></Secure> },
      { path: "Usuarios/Lista", element: <Secure><ListaUsuarios /></Secure> },
      { path: "Usuarios/Crear", element: <Secure><Usuarios /></Secure> },
      { path: "Membresias/Crear", element: <Secure><Membresias /></Secure> },
      { path: "Membresias/Lista", element: <Secure><ListaMembresias /></Secure> },
      { path: "Bonos/Crear", element: <Secure><Bonos /></Secure> },
      { path: "Bonos/Lista", element: <Secure><ListaBonos /></Secure> },
      { path: "no-autorizado", element: <NoPermiss /> },
      { path: "*", element: <Nofound /> }, 
    ]
  },
]);

export default router;
