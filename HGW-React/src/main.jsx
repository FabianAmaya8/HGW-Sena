import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import router from './router.jsx';
import 'ldrs/react/Infinity.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'boxicons/css/boxicons.min.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import './assets/css/fijos/index.css';
import './assets/css/fijos/style.css';

import { AuthProvider, useAuth } from './pages/Context/AuthContext.jsx';
import { HeaderProvider } from './pages/Context/HeaderContext.jsx';
import { ProductsProvider } from './pages/Context/ProductsContext.jsx';
import { ModalProvider } from './pages/Context/ModalContext.jsx';

function ProvidersWrapper() {
  const { user } = useAuth();
  return (
    <HeaderProvider user={user}>
      <ProductsProvider>
        <ModalProvider>
          <RouterProvider router={router} />
        </ModalProvider>
      </ProductsProvider>
    </HeaderProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ProvidersWrapper />
    </AuthProvider>
  </StrictMode>
);
