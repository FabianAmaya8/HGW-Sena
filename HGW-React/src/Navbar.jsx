import { useState, useEffect, useMemo, useRef, useCallback, useContext, memo, useLayoutEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import JsxParser from 'react-jsx-parser';
import "./font.module.scss"
import {
  Box, Button, Dialog, Alert, AlertTitle, Drawer,
  Typography, Accordion, AccordionSummary, AccordionDetails,
  SpeedDial, SpeedDialAction,
  SnackbarContent,
  ButtonBase
} from '@mui/material';
import { objectSpeedDial } from './Administrador/Objects/objects'
import Snackbar from '@mui/material/Snackbar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import AppsIcon from '@mui/icons-material/Apps';
import CloseIcon from '@mui/icons-material/Close';
import { AppContext } from './controlador';
import Style from './App.module.scss';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout';
import CategoryIcon from '@mui/icons-material/Category'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import PeopleIcon from '@mui/icons-material/People'
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import SettingsIcon from '@mui/icons-material/Settings';
import { findWorkingBaseUrl } from './urlDB';
import { User2Icon } from 'lucide-react';

const BACKEND = findWorkingBaseUrl().replace(/\/$/, "");

const iconComponents = {
  AccountCircleIcon,
  LogoutIcon,
  HomeIcon,
  SchoolIcon,
  AppsIcon,
  CategoryIcon,
  Inventory2Icon,
  PeopleIcon,
  CardMembershipIcon,
  CardGiftcardIcon,
  SettingsIcon
};

const IconRenderer = memo(({ jsx }) => <JsxParser components={iconComponents} jsx={jsx} />);

const DespliegeNavbar = memo(({datos, navegar})=>{
  const [ancho, setAncho] = useState(0);
  const [activo, setActivo] = useState(false);

  useEffect(()=>{
    const a = datos.reduce((acc, v) => acc + (v.arialLabel ? v.arialLabel.length * 0.734 : 0), 0);
    setAncho(a);
  }, [datos]);

  const hijosMemo = useMemo(() => {
    return datos.map((v, i) => (
      <Button key={"navbutton"+i} sx={{color: "black", textWrap: "nowrap", height: "100%", display: 'flex', alignItems: "center", justifyContent: "center"}} onClick={()=>{
          navegar(v.rute);
          if(v.arialLabel == "Cerrar Sesion"){
            localStorage.removeItem("token");
          }
        }}>
        {v.arialLabel}
      </Button>
    ));
  }, [datos, navegar]);

  return (
    <Box sx={{height: "100%", display: 'flex'}}>
      <Button sx={{height: "100%", borderRadius: 0}} onClick={()=>setActivo(!activo)}>
        <User2Icon></User2Icon>
      </Button>
      <Box sx={{transition: "350ms", height: "100%", width: activo ? ancho+"rem": 0, overflow: "hidden", flexDirection: "row", display: 'flex'}}>
        <Box sx={{width: ancho+"rem", height: "100%", flexDirection: "row", display: 'flex'}}>
          { hijosMemo }
        </Box>
      </Box>
    </Box>
  )
})

const Arboles = memo(({ elementos, hoverDrawer }) => {
  const { medidas: dispositivo, anchoDrawer } = useContext(AppContext);
  const navigate = useNavigate();

  const descendantsMap = useMemo(() => {
    const map = {};
    const collect = item => {
      const children = item.childs || [];
      let ids = [];
      for (let i = 0; i < children.length; i++) {
        ids.push(children[i].id);
        ids = ids.concat(collect(children[i]));
      }
      map[item.id] = ids;
      return ids;
    };
    elementos.forEach(collect);
    return map;
  }, [elementos]);

  const initial = useMemo(() => {
    const state = {};
    const collect = el => {
      state[el.id] = false;
      el.childs?.forEach(collect);
    };
    elementos.forEach(collect);
    return state;
  }, [elementos]);

  const [expandedMap, setExpandedMap] = useState(initial);

  useEffect(() => {
    setExpandedMap(initial);
  }, [initial]);

  const handleChange = useCallback((id, siblingIds) => (_e, isOpen) => {
    setExpandedMap(prev => {
      const next = { ...prev };
      if (isOpen) {
        siblingIds.forEach(sib => {
          if (sib !== id) {
            next[sib] = false;
            descendantsMap[sib]?.forEach(d => (next[d] = false));
          }
        });
        next[id] = true;
      } else {
        next[id] = false;
        descendantsMap[id]?.forEach(d => (next[d] = false));
      }
      return next;
    });
  }, [descendantsMap]);

  const renderItems = useCallback(items => {
    const siblingIds = items.map(i => i.id);
    return items.map(el => {
      const open = !!expandedMap[el.id];
      if (el.childs) {
        return (
          <Accordion
            key={el.id}
            expanded={open}
            onChange={handleChange(el.id, siblingIds)}
            disableGutters
            sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}
          >
            <AccordionSummary
              className={Style.butonNavbar}
              expandIcon={
                <ExpandMoreIcon sx={{
                  opacity: anchoDrawer.isOpen || hoverDrawer ? 1 : 0,
                  color: 'primary.contrastText',
                  transition: '350ms'
                }} />
              }
              sx={{ transition: '360ms', width: '100%', justifyContent: 'center', color: 'text.primary' }}
            >
              <Box className={Style.boxElementsNavbar} sx={{
                color: 'primary.contrastText',
                backgroundColor: 'transparent',
                gap: anchoDrawer.isOpen ? '1rem' : '1.2rem',
                transition: 'gap 450ms'
              }}>
                {"icon" in el && <IconRenderer jsx={el.icon} />}
                <Typography variant="body1" noWrap>{el.value}</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{
              display: anchoDrawer.isOpen || hoverDrawer ? 'block' : 'none',
              position: 'relative',
              '&::before': {
                borderLeft: '3px solid',
                borderLeftColor: 'primary.contrastText',
                content: '""',
                height: '100%',
                position: 'absolute',
                top: 0
              }
            }}>
              {renderItems(el.childs)}
            </AccordionDetails>
          </Accordion>
        );
      }
      return (
        <Button
          key={el.id}
          onClick={() => navigate(el.click)}
          className={Style.butonNavbar}
          sx={{ color: 'primary.contrastText', width: '100%', textTransform: 'none', whiteSpace: 'nowrap' }}
        >
          <Box className={Style.boxElementsNavbar}>
            {"icon" in el ? <IconRenderer jsx={el.icon} /> : null}
            <Typography variant="body1" noWrap>{el.value}</Typography>
          </Box>
        </Button>
      );
    });
  }, [expandedMap, anchoDrawer.isOpen, hoverDrawer, handleChange, navigate]);

  return renderItems(elementos);
});

const MyDrawer = memo(({ switch: { isOpen, setIsOpen }, data }) => {
  const [hoverDrawer, setHoverDrawer] = useState(false);
  const { medidas: dispositivo, anchoDrawer } = useContext(AppContext);

  return (
    <Drawer
      onMouseEnter={() => setHoverDrawer(true)}
      onMouseLeave={() => setHoverDrawer(false)}
      variant={dispositivo === 'pc' ? 'permanent' : 'temporary'}
      open={isOpen}
      onClose={() => setIsOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: dispositivo === 'movil' ? '70vw' : (anchoDrawer.isOpen || hoverDrawer ? '15rem' : '4rem'),
          transition: 'width 450ms',
          height: '100vh',
          padding: '2rem 0rem',
          background: '#1E1E2F',
          boxSizing: 'border-box',
          '&::-webkit-scrollbar': { width: '7px' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: 'white', borderRadius: '5px' }
        }
      }}
      className={Style.drawer}
    >
      <Arboles elementos={data} hoverDrawer={hoverDrawer} />
    </Drawer>
  );
});

const App = memo(({objeto}) => {
  const { medidas: dispositivo, anchoDrawer } = useContext(AppContext);
  const { isOpen, setIsOpen } = anchoDrawer;
  const navigate = useNavigate();
  const posicionScroll = useRef(0);
  const [hiddenNavbar, setHiddenNavbar] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    function scrollNavbar() {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (window.scrollY > posicionScroll.current && posicionScroll.current > 125) {
          setHiddenNavbar(true);
        } else {
          setHiddenNavbar(false);
        }
        posicionScroll.current = window.scrollY;
      });
    }
    document.addEventListener('scroll', scrollNavbar, { passive: true });
    return () => {
      document.removeEventListener('scroll', scrollNavbar);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const objetoEstado = useMemo(() => ({ isOpen, setIsOpen }), [isOpen, setIsOpen]);
  const anchoNavbar = anchoDrawer.isOpen
    ? `calc(100% - ${(anchoDrawer.ancho.open) - 14}rem)`
    : `calc(100% - ${(anchoDrawer.ancho.close) - 3}rem)`;

  const pintarSpeedDial = useCallback(() => {
    return objectSpeedDial.map((el, i) => (
      <SpeedDialAction
        key={`speedDial_${el.rute}_${i}`}
        tooltipTitle={el.arialLabel}
        icon={el.icon}
        onClick={() => navigate(el.rute)}
      />
    ));
  }, [navigate]);

  return (
    <>
      <Box className={Style.navbar} sx={{
        ...(dispositivo === 'movil' ? { left: 0, right: 0 } : { right: '1rem', left: 'auto' }),
        width: dispositivo === 'movil' ? 'auto' : anchoNavbar,
        height: hiddenNavbar ? '0px' : '75px',
        transition: 'width 450ms'
      }}>
        <Button sx={{'&:hover': {boxShadow: "none", backgroundColor: 'transparent',}}} disableTouchRipple onClick={() => setIsOpen(!isOpen)}>
          {dispositivo === 'movil' ? (
            <HomeIcon sx={{ color: 'black', fontSize: '25px' }} />
          ) : (
            <Box sx={{
              width: 45, height: 45, position: 'relative', cursor: 'pointer',
              '& .icon': {
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                transition: 'transform 0.5s ease, opacity 0.4s ease'
              },
              '& .iconApps': {
                transform: 'rotate(0deg) scale(1)', opacity: 1
              },
              '& .iconClose': {
                transform: 'rotate(-180deg) scale(0.5)', opacity: 0
              },
              '&:hover .iconApps': {
                transform: 'rotate(180deg) scale(0.5)', opacity: 0
              },
              '&:hover .iconClose': {
                transform: 'rotate(0deg) scale(1)', opacity: 1
              }
            }}>
              <AppsIcon className="icon iconApps" sx={{ fontSize: 45, color: 'black' }} />
              <CloseIcon className="icon iconClose" sx={{ fontSize: 45, color: 'black' }} />
            </Box>
          )}
        </Button>
        <Box sx={{display: "flex", alignItems: "space-between", gap: 1, alignItems: "center", height: "100%"}}>
          { dispositivo != "movil" && <DespliegeNavbar datos = {objectSpeedDial} navegar = {navigate} /> }
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', padding: 0, margin: 0 }}>
            <Typography variant="h4" sx={{fontWeight: 600, padding: 0, margin: 0}}>HGW|</Typography>
            <Typography variant='p' sx={{ fontWeight: 600 , padding: 0, margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '65%' }}>Admin</Typography>
          </Box>
        </Box>
      </Box>
      <MyDrawer switch={objetoEstado} data={objeto} />
      {dispositivo === 'movil' && (
        <SpeedDial ariaLabel="Opciones" icon={<SpeedDialIcon />} sx={{ position: 'fixed', bottom: '2rem', left: '2rem' }}>
          {pintarSpeedDial()}
        </SpeedDial>
      )}
    </>
  );
});

function Navbar({ alerta, setAlerta, imagenes, objeto }) {
  const anchoAlert = useMemo(() => {
    if (alerta?.valor?.content?.length > 0) {
      return `-${9 * alerta.valor.content.length}px`;
    }
    return '-180px';
  }, [alerta]);

  const closeAlert = useCallback(() => {
    setAlerta({ estado: false, valor: { title: '', content: '' } });
  }, [setAlerta]);

  const safeSrc = useMemo(() => {
    const src = (imagenes.imagenes.file || '').trim();
    if (src.startsWith('http') || src.startsWith('data:image/')) return src;
    return `${BACKEND}/images/${src}`;
  }, [imagenes.imagenes.file]);

  return (
    <Box className={Style.padre}>
      <Snackbar onClose={closeAlert} autoHideDuration={6000} open={alerta.estado} sx={{zIndex: 9999}}   anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        message={alerta.valor.content}>
      </Snackbar>

      {imagenes.imagenes.estado && safeSrc && (
        <Dialog
          open
          onClose={() => imagenes.setImagenes({ estado: false, file: '' })}
          maxWidth={false}
          PaperProps={{
            sx: {
              backgroundColor: 'transparent',
              boxShadow: 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }
          }}
        >
          <Box
            onClick={() => imagenes.setImagenes({ estado: false, file: '' })}
            sx={{
              width: '80vw',
              height: '80vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Box component="img" src={safeSrc} sx={{ width: '80vw', height: '80vh', objectFit: 'contain' }} />
          </Box>
        </Dialog>
      )}
      <App objeto={objeto} />
      <Outlet />
    </Box>
  );
}

export default Navbar;