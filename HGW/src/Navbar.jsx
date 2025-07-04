import { useState, useReducer, useEffect, memo, useMemo, useRef, useCallback, useContext, createContext } from 'react'
import { Outlet } from 'react-router-dom'
import { useMediaQuery, Typography, useTheme, Box, Accordion, AccordionSummary, AccordionDetails, 
  Button, IconButton, Drawer, SpeedDial, SpeedDialAction, Select,
  Alert, AlertTitle,  
  Dialog} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import Style from './App.module.scss'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { objeto, objectSpeedDial } from './Objects/objects'
import { useNavigate } from 'react-router-dom'
import { AppContext } from './controlador'
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
      children.forEach(child => {
        ids.push(child.id);
        ids = ids.concat(collect(child));
      });
      map[item.id] = ids;
      return ids;
    };
    elementos.forEach(el => collect(el));
    return map;
  }, [elementos]);

  const initial = useMemo(() => {
    const state = {};
    elementos.forEach(function collect(el) {
      state[el.id] = false;
      (el.childs || []).forEach(child => collect(child));
    });
    return state;
  }, [elementos]);

  const [expandedMap, setExpandedMap] = useState(initial);

  const handleChange = useCallback(
    (id, siblingIds) => (_e, isOpen) => {
      setExpandedMap(prev => {
        const next = { ...prev };
        if (isOpen) {
          siblingIds.forEach(sib => {
            if (sib !== id) {
              next[sib] = false;
              descendantsMap[sib].forEach(d => (next[d] = false));
            }
          });
          next[id] = true;
        } else {
          next[id] = false;
          descendantsMap[id].forEach(d => (next[d] = false));
        }
        return next;
      });
    },
    [descendantsMap]
  );

  const renderItems = useCallback(
    items => {
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
        }
        return (
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
      });
    },
    [expandedMap, anchoDrawer.isOpen, hoverDrawer, handleChange, navigate, dispositivo]
  );

  return <>{renderItems(elementos)}</>;
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
  const pintarSpeedDial = useCallback((elementos)=>{
    return elementos.map((speedDial, index)=>{
      return <SpeedDialAction onClick={()=>navigate(speedDial.rute)} key={"seppedDial_"+speedDial.rute+index} tooltipTitle={speedDial.arialLabel} icon={speedDial.icon} />
    })
  }, [navigate]);
  const anchoNavbar = anchoDrawer.isOpen ? `calc(100% - ${(anchoDrawer.ancho.open)-14}rem)` : `calc(100% - ${(anchoDrawer.ancho.close)-3}rem)`;
  return (
    <>
      <Box className={Style.navbar} sx={{
        ...(dispositivo == "movil" ? {right: "0rem", left: "0rem"}: {right: "1rem", left: "auto"}),
        width: dispositivo == "movil" ? "auto": dispositivo == "pc" && anchoNavbar,
        height: hiddenNavbar ? "0px" : "75px", backgroundColor: "", transition: "width 450ms" }}>
        <Button onClick={() => {setIsOpen(!isOpen);}}>
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

const BACKEND = 'http://127.0.0.1:5000'

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

  if (alerta.estado) {
    setTimeout(() => {
      setAlerta({ ...alerta, estado: false })
    }, 4000)
  }

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
      {imagenes.imagenes.estado && (
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
