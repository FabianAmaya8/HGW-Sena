import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Controlador from './controlador';

const Main = () => {
  useEffect(() => {
    requestAnimationFrame(()=>{
      const pre = document.getElementById('preloader');
      if (!pre) return;
      pre.style.transition = 'opacity 300ms';
      pre.style.opacity = '0';
      setTimeout(() => pre.remove(), 300)
    })
  }, []);

  return <Controlador />;
};

createRoot(document.getElementById('root')).render(<Main />);