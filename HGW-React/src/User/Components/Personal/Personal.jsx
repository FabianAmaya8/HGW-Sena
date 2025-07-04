import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 
import { Infinity } from 'ldrs/react'
import '../../../assets/css/personal/personal.css';
import '../../../assets/css/personal/rangohonor.css';
import useMembrecias from '../../Hooks/personal/useMembrecias';
import NivelMiembros from './NivelMiembros';
import usePersonal from '../../Hooks/personal/usePersonal';
import { useImageUrl } from '../../Hooks/useImgUrl';

export default function Personal() {
  // Hook para obtener las membresías
  const { membresias, loading: loadingMembresias, error: errorMembresias } = useMembrecias();
  // Hook para obtener información del usuario
  const { personal, loading: loadingPersonal, error: errorPersonal } = usePersonal();
  const [level, setLevel] = useState();
  
  
  useEffect(() => {
    setLevel(personal?.membresia?.membresia);
  }, [personal]); 

  const imgUrl = useImageUrl(personal?.url_foto_perfil)

  const opcionesPedidos = [
    { icon: 'bx bx-envelope-open', label: 'Todo', to: '/admin/pedidos' },
    { icon: 'bx bx-envelope-open', label: 'Reservado', to: '/admin/pedidos' },
    { icon: 'bx bxs-truck', label: 'Seguimiento de pedidos', to: '/seg-pedidos' },
    { icon: 'bx bx-send', label: 'Pendiente de envío', to: '/admin/pedidos' },
    { icon: 'bx bx-send', label: 'Enviado', to: '/admin/pedidos' },
    { icon: 'bx bx-check-circle', label: 'Completado', to: '/admin/pedidos' }
  ]

    const opcionesInformacion = [
    { icon: 'bx bx-user-circle', label: 'Información Personal', to: '/informacion-personal' },
    { icon: 'bx bx-credit-card', label: 'Información Financiera', to: '#' },
    ...(level === 5 ? [{ icon: 'bx bx-trophy', label: 'Rango Honor', to: '/usuario/personal/rangohonor' }] : [])
  ];

  const opcionesFinancieras = [
    { icon: 'bx bx-user-circle', label: 'Transferencias', to: '/transferencias' },
    { icon: 'bx bx-credit-card', label: 'Retiros', to: '/retiros' },
    { icon: 'bx bx-credit-card', label: 'Historial Financiero', to: '#' }
  ];

  const opcionesRed = [
    { icon: 'bx bxs-user-badge', label: 'Consulta Venta Personal de la Red', to: '#' },
    { icon: 'bx bxs-user-plus', label: 'Genealogía', to: '/usuario/personal/arbol' },
    { icon: 'bx bxs-user-account', label: 'Líneas Directas', to: '#' }
  ];

  const opcionesAyuda = [
    { icon: 'bx bx-info-circle', label: 'Ayuda General', to: '#' },
    { icon: 'bx bx-help-circle', label: 'Preguntas Frecuentes', to: '#' },
    { icon: 'bx bx-phone', label: 'Servicio al Cliente', to: '#' }
  ]

  if (loadingPersonal) {
    return <div className="cargando"> 
      <Infinity
          size="150"
          stroke="10"
          strokeLength="0.15"
          bgOpacity="0.3"
          speed="1.3"
          color="#47BF26" 
      />
    </div>;
  }

  if (errorPersonal) {
    return <div className="cargando"> 
      <i className="bx bx-error"></i>
      <p>Error: {errorPersonal}</p>
    </div>;
  }

  return (
    <main className="contenido">
      {/* Profile Section */}
      <div className="conten-item">
        <div className="perfil">
          <div className="img-perfil">
            {personal && personal.url_foto_perfil
              ? <img src={imgUrl} alt="Foto de perfil" />
              : <i className='bx bx-user'></i>
            }
          </div>
          <div className="info-perfil">
            <h3>{personal?.nombre_usuario}</h3>
            <TablaMenbresias 
              personal={personal} 
              membresias={membresias} 
              loadingMembresias={loadingMembresias} 
              errorMembresias={errorMembresias}  
            />
          </div>
        </div>
      </div>
      {/* Membership Level Section */}
      <NivelMiembros level={level} membresias={membresias} />

      {/* Options Sections */}
      <OpcionesSeccion titulo="Información" opciones={opcionesInformacion} />
      <OpcionesSeccion titulo="Administración Financiera" opciones={opcionesFinancieras} />
      <OpcionesSeccion titulo="Mi Red" opciones={opcionesRed} />
      <OpcionesSeccion titulo="Ayuda" opciones={opcionesAyuda} />
    </main>
  );
}

function TablaMenbresias({personal , membresias , loadingMembresias, errorMembresias}) {
  return (
    <div className="membresias">
      <details>
        <summary>Membresía {personal?.membresia.nombre_membresia}</summary>
        {loadingMembresias ? (
          <div>Cargando membresías...</div>
        ) : errorMembresias ? (
          <div>Error: {errorMembresias}</div>
        ) : (
          <table className="table-striped">
            <thead>
              <tr>
                <th scope="col">Membresía</th>
                <th scope="col">BV</th>
                <th scope="col">Costo</th>
              </tr>
            </thead>
            <tbody>
              {membresias.map((item) => (
                <tr key={item.id_membresia}>
                  <td>{item.nombre_membresia}</td>
                  <td>{item.bv ?? '-'}</td>
                  <td>{item.precio_membresia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </details>
    </div>
  );
}

function OpcionesSeccion({ titulo, opciones }) {
  return (
    <div className="conten-item">
      <div className="ayuda">
        <h2>{titulo}</h2>
        <div className="ayuda-content">
          {opciones.map((item) => (
            <div className="ayuda-item" key={item.label}>
              <Link to={item.to} className="a-content">
                <i className={item.icon}></i>
                {item.label}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
