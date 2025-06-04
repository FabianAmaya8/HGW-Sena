import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

// Importa tu router centralizado
import router from './router.jsx'

// Estilos y librerías (todo esto se queda igual)
import 'bootstrap/dist/js/bootstrap.min.js'
import 'boxicons/css/boxicons.min.css'
import 'sweetalert2/dist/sweetalert2.min.css'
import './assets/css/fijos/index.css'
import './assets/css/fijos/style.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
