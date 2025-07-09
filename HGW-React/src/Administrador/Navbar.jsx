import { useState, useReducer, useEffect, memo, useMemo, useRef, useCallback, useContext, createContext } from 'react'
import { Outlet } from 'react-router-dom'
import { useMediaQuery, Typography, useTheme, Box, Accordion, AccordionSummary, AccordionDetails, 
  Button, IconButton, Drawer, SpeedDial, SpeedDialAction, Select,
  Alert, AlertTitle,  
  Dialog,
  DialogContent} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import Style from './App.module.scss'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { objeto, objectSpeedDial } from './Objects/objects'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../admin/context.jsx'
import AppsIcon from '@mui/icons-material/Apps';
import CloseIcon from '@mui/icons-material/Close';


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
    for (let i = 0; i < elementos.length; i++) collect(elementos[i]);
    return map;
  }, [elementos]);
  const initial = useMemo(() => {
    const state = {};
    const collect = el => {
      state[el.id] = false;
      if (el.childs) for (let i = 0; i < el.childs.length; i++) collect(el.childs[i]);
    };
    for (let i = 0; i < elementos.length; i++) collect(elementos[i]);
    return state;
  }, [elementos]);
  const [expandedMap, setExpandedMap] = useState(initial);
  const handleChange = useCallback((id, siblingIds) => (_e, isOpen) => {
    setExpandedMap(prev => {
      const next = { ...prev };
      if (isOpen) {
        for (let i = 0; i < siblingIds.length; i++) {
          const sib = siblingIds[i];
          if (sib !== id) {
            next[sib] = false;
            for (let d of descendantsMap[sib]) next[d] = false;
          }
        }
        next[id] = true;
      } else {
        next[id] = false;
        for (let d of descendantsMap[id]) next[d] = false;
      }
      return next;
    });
  }, [descendantsMap]);
  const renderItems = useCallback(items => {
    const siblingIds = items.map(i => i.id);
    const out = new Array(items.length);
    for (let i = 0; i < items.length; i++) {
      const el = items[i];
      const open = !!expandedMap[el.id];
      if (el.childs) {
        out[i] = (
          <Accordion
            key={el.id}
            expanded={open}
            onChange={handleChange(el.id, siblingIds)}
            disableGutters
            sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}
          >
            <AccordionSummary
              disableRipple
              focusRipple={false}
              className={Style.butonNavbar}
              expandIcon={
                <ExpandMoreIcon
                  sx={{
                    ...(anchoDrawer.isOpen || hoverDrawer ? { opacity: 1 } : { opacity: 0 }),
                    color: el.colorText,
                    transition: '350ms'
                  }}
                />
              }
              sx={{
                transition: '360ms',
                width: '100%',
                justifyContent: 'center'
              }}
            >
              <Box
                className={Style.boxElementsNavbar}
                sx={{
                  color: el.colorText,
                  backgroundColor: 'transparent',
                  gap: anchoDrawer.isOpen ? '1rem' : '1.2rem',
                  transition: 'gap 450ms'
                }}
              >
                {el.icon}
                <Typography variant="body1" noWrap>
                  {el.value}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                display: anchoDrawer.isOpen || hoverDrawer ? 'block' : 'none',
                position: 'relative',
                '&::before': {
                  borderLeft: '3px solid white',
                  content: '""',
                  height: '100%',
                  position: 'absolute',
                  top: 0
                }
              }}
            >
              {renderItems(el.childs)}
            </AccordionDetails>
          </Accordion>
        );
      } else {
        out[i] = (
          <Button
            key={el.id}
            onClick={() => navigate(el.click)}
            className={Style.butonNavbar}
            sx={{ color: el.colorText, width: '100%', textTransform: 'none', whiteSpace: 'nowrap' }}
          >
            <Box className={Style.boxElementsNavbar}>
              {el.icon}
              <Typography variant="body1" noWrap>
                {el.value}
              </Typography>
            </Box>
          </Button>
        );
      }
    }
    return out;
  }, [expandedMap, anchoDrawer.isOpen, hoverDrawer, handleChange, navigate, dispositivo]);
  return renderItems(elementos);
});


const MyDrawer = memo(({switch: {isOpen, setIsOpen}, data}) => {
  const [hoverDrawer, setHoverDrawer] = useState(false);
  const {medidas: dispositivo, anchoDrawer} = useContext(AppContext);
 
  return (
    <>
      <Drawer onMouseLeave={()=>setHoverDrawer(false)} onMouseEnter={()=>setHoverDrawer(true)} variant={dispositivo == "pc" ? "permanent": dispositivo == "movil" && "temporary"} open={isOpen} onClose={()=>setIsOpen(false)} sx={{"& .MuiDrawer-paper": { 
        width: dispositivo == "movil" ? "70vw": dispositivo == "pc" && isOpen || hoverDrawer ? "15rem": "4rem" ,
        height: "100vh",
        "&::-webkit-scrollbar": {width: "7px"}, 
        "&::-webkit-scrollbar-thumb": {background: "#59732F", borderRadius: "5px"},  
        padding: "2rem 0rem",
        boxSizing: "border-box",
        background: "#9BCC4B", transition: "width 450ms" }}} className={Style.drawer}>
          {<Arboles elementos = {data} hoverDrawer = {hoverDrawer}/>}
      </Drawer>
    </>
  )
})

const App = memo(()=>{
  const {medidas: dispositivo, anchoDrawer} = useContext(AppContext);
  let {isOpen, setIsOpen} = anchoDrawer;
  const navigate = useNavigate();
  let posicionScroll = useRef(0);
  const [hiddenNavbar, setHiddenNavbar] = useState(false);
  useEffect(()=>{
    function scrollNavbar(){
      if(window.scrollY > posicionScroll.current && posicionScroll.current > 125){
        setHiddenNavbar(true);
        posicionScroll.current = window.scrollY;
      }
      else{
        setHiddenNavbar(false);
        posicionScroll.current = window.scrollY;
      }
    }
    document.addEventListener("scroll", scrollNavbar);
    return ()=> document.removeEventListener("scroll", scrollNavbar);
  }, []);
  let objetoElementos = objeto;
  const objetoEstado = useMemo(()=> ({isOpen: isOpen, setIsOpen: setIsOpen}), [isOpen]);
const pintarSpeedDial = useCallback(elementos => {
  const out = new Array(elementos.length);
  for (let i = 0; i < elementos.length; i++) {
    const speedDial = elementos[i];
    out[i] = <SpeedDialAction onClick={() => navigate(speedDial.rute)} key={"seppedDial_" + speedDial.rute + i} tooltipTitle={speedDial.arialLabel} icon={speedDial.icon} />
  }
  return out;
}, [navigate]);
  const anchoNavbar = anchoDrawer.isOpen ? `calc(100% - ${(anchoDrawer.ancho.open)-14}rem)` : `calc(100% - ${(anchoDrawer.ancho.close)-3}rem)`;
  return (
    <>
      <Box className={Style.navbar} sx={{
        ...(dispositivo == "movil" ? {right: "0rem", left: "0rem"}: {right: "1rem", left: "auto"}),
        width: dispositivo == "movil" ? "auto": dispositivo == "pc" && anchoNavbar,
        height: hiddenNavbar ? "0px" : "75px", backgroundColor: "", transition: "width 450ms" }}>
        <Button disableTouchRipple onClick={() => {setIsOpen(!isOpen);}}>
          {dispositivo == "movil" ?
          <HomeIcon sx={{color: "black", fontSize: "25px"}}/>:
          <Box
            sx={{
              width: 45,
              height: 45,
              position: "relative",
              cursor: "pointer",
                "& .icon": {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  transition: "transform 0.5s ease, opacity 0.4s ease",
                },
                "& .iconApps": {
                  transform: "rotate(0deg) scale(1)",
                  opacity: 1,
                },
                "& .iconClose": {
                  transform: "rotate(-180deg) scale(0.5)",
                  opacity: 0,
                },
                "&:hover .iconApps": {
                  transform: "rotate(180deg) scale(0.5)",
                  opacity: 0,
                },
                "&:hover .iconClose": {
                  transform: "rotate(0deg) scale(1)",
                  opacity: 1,
                },
              }}
            >
              <AppsIcon className="icon iconApps" sx={{ fontSize: 45, color: "black" }} />
              <CloseIcon className="icon iconClose" sx={{ fontSize: 45, color: "black" }} />
            </Box>
          }
        </Button>
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
          <h2>HGW|</h2><p style={{display: "flex", flexDirection: "column", justifyContent: 'flex-end', height: "40%"}}>Admin</p>
        </Box>
      </Box>
      <MyDrawer switch={objetoEstado} data={objetoElementos} />
      {dispositivo == "movil" && <SpeedDial ariaLabel="" icon={<SpeedDialIcon />} sx={{position: 'fixed', bottom: "2rem", left: "2rem"}}>
        {
          pintarSpeedDial(objectSpeedDial)
        }
      </SpeedDial>}
    </>
  )
});

const BACKEND = 'http://127.0.0.1:3000'

function Navbar({ alerta, setAlerta, imagenes }) {
  const tema = useTheme()
  const [anchoAlert, setAncho] = useState('-180px')
  useEffect(() => {
    const longitud = alerta.valor.content.length
    if (longitud > 0) {
      const ancho = 9 * longitud
      setAncho('-' + ancho.toString().concat('px'))
    }
  }, [alerta])
  useEffect(() => {
    if (!alerta.estado) return;
    const t = setTimeout(() => {
      setAlerta(a => ({ ...a, estado: false }))
    }, 4000);
    return () => clearTimeout(t);
  }, [alerta.estado]);
  const safeSrc = useMemo(() => {
    const s = (imagenes.imagenes.file || '').trim()
    if (s.startsWith('http') || s.startsWith('data:image/')) return s
    return `${BACKEND}/images/${s}`
  }, [imagenes.imagenes.file])

  return (
    <Box className={Style.padre}>
      <Alert
        sx={{
          position: 'fixed',
          zIndex: 9999,
          ...(
            !('lado' in alerta)
              ? { right: alerta.estado ? '1vw' : anchoAlert }
              : alerta.lado === 'izquierdo'
                ? { left: alerta.estado ? '1vw' : anchoAlert }
                : { right: alerta.estado ? '1vw' : anchoAlert }
          ),
          transition: '250ms',
        }}
      >
        <AlertTitle>{alerta.valor.title}</AlertTitle>
        {alerta.valor.content}
      </Alert>
      {imagenes.imagenes.estado && safeSrc && safeSrc !== `${BACKEND}/images/` && (
        <Dialog
          maxWidth={false}
          onClose={() => imagenes.setImagenes({ estado: false, file: '' })}
          open
          PaperProps={{
            sx: {
              backgroundColor: 'transparent',
              padding: 0,
              margin: 0,
              boxShadow: 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
          }}
          sx={{
            '& .MuiDialog-container': {
              p: 0,
              m: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
          }}
        >
          <Box
            onClick={() => imagenes.setImagenes({ estado: false, file: '' })}
            sx={{
              background: 'transparent',
              display: 'flex',
              width: '80vw',
              height: '80vh',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <Box
              component="img"
              src={safeSrc}
              sx={{ width: '80vw', height: '80vh', objectFit: 'contain' }}
              onError={(e) => console.error(e.target.src)}
            />
          </Box>
        </Dialog>
      )}
      <App />
      <Outlet />
    </Box>
  )
}

export default Navbar;
