import { Outlet } from "react-router-dom";
import Navbar from './Navbar.jsx';

const Controlador = ({ imagenes, alerta, setAlerta }) => {
  return (
    <Navbar imagenes={imagenes} alerta={alerta} setAlerta={setAlerta}>
      <Outlet />
    </Navbar>
  );
};

export default Controlador;