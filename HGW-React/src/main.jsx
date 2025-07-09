import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { useMemo, useState } from "react";
import { ThemeProvider, createTheme, useMediaQuery } from "@mui/material";

import router from "./router.jsx";
import { AppContext } from "./admin/context.jsx";

import { AuthProvider } from "./pages/Context/AuthContext.jsx";
import { CartProvider } from "./pages/Context/CartContext.jsx";

import "ldrs/react/Infinity.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "boxicons/css/boxicons.min.css";
import "sweetalert2/dist/sweetalert2.min.css";
import "./assets/css/fijos/index.css";
import "./assets/css/fijos/style.css";

// Tema MUI personalizado
const tema = createTheme({
  palette: {
    primary: { main: "#9BCC4B" },
    secondary: { main: "#59732F" },
    background: { main: "#f0f0f0" },
  },
  typography: {
    fontFamily: "Arial",
  },
});

// AppWrapper con lógica del contexto admin
const AppWrapper = () => {
  const moviles = useMediaQuery(tema.breakpoints.down("sm"));
  const tablets = useMediaQuery(tema.breakpoints.between("sm", "md"));

  const [estadoDrawer, setEstadoDrawer] = useState(false);
  const [imagenes, setImagenes] = useState(false);
  const [alerta, setAlerta] = useState({
    estado: false,
    valor: { title: "", content: "" },
  });

  const medidas = moviles ? "movil" : tablets ? "tablet" : "pc";

  const objetoDrawer = useMemo(() => ({
    isOpen: estadoDrawer,
    setIsOpen: setEstadoDrawer,
    ancho: { open: "31", close: "9" },
  }), [estadoDrawer]);

  const ctx = useMemo(() => ({
    imagenes: { estado: imagenes, setImagenes, file: "" },
    alerta: { value: alerta, setAlerta },
    medidas,
    anchoDrawer: objetoDrawer,
  }), [imagenes, alerta, medidas, objetoDrawer]);

  return (
    <ThemeProvider theme={tema}>
      <AppContext.Provider value={ctx}>
        <RouterProvider router={router} />
      </AppContext.Provider>
    </ThemeProvider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>
      <AuthProvider>
        <AppWrapper />
      </AuthProvider>
    </CartProvider>
  </StrictMode>
);