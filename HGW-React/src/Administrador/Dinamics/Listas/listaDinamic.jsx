import { memo, useCallback, useEffect, useState, useContext, useMemo } from 'react'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { Fade, Stack } from '@mui/material';
import "../../../font.module.scss"
import { AppContext } from '../../../controlador';
import Style from './ListaDinamic.module.scss'
import SaveIcon from '@mui/icons-material/Save';
import {
  TableContainer, DialogTitle, DialogContent, DialogActions,
  Table, TableHead, TableRow, TableCell, TableBody,
  Button, Box, Dialog, Slide, IconButton, Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DinamicForm from '../formularios/Dinamics';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import Carga from '../../intermedias/carga';
import { findWorkingBaseUrl } from '../../../urlDB';

const BACKEND = findWorkingBaseUrl().replace(/\/$/, "");

const MyTable = memo(({ datos, editar, table, padre, imagenes }) => {
  const [confirmacion, setConfirmacion] = useState({ estado:false,table:"",filaDatos:null,columnas:[] })
  const columnas = useMemo(()=>[...datos.columnas.map(c=>c.field),"Editar/Eliminar"],[datos.columnas])
  const renderHeader = useCallback(()=>(
    <TableRow sx={{ background:"#9BCC4B" }}>
      {datos.columnas.map((c,i)=>
        <TableCell key={c.field+"_"+i} sx={{ minWidth:"80px" }}>
          <Typography sx={{ color:"white",textAlign:"center" }}>{c.name}</Typography>
        </TableCell>
      )}
      <TableCell key="editarEliminar_header">
        <Typography sx={{ color:"white",textAlign:"center" }}>Editar/Eliminar</Typography>
      </TableCell>
    </TableRow>
  ),[datos.columnas])
  const edit = useCallback(id=>{
    editar.setId(id);
    editar.setDialog(true)
  },[editar])
  const eliminar = useCallback(async(tbl,fila,cols)=>{
    await fetch(`${BACKEND}/eliminar`,{
      method:"POST",
      headers:{"content-type":"application/json"},
      body:JSON.stringify({ table:tbl,id:fila[cols[0]] })
    })
    padre.setRender(r=>!r)
  },[padre])
  const renderRows = useMemo(()=>datos.filas.map((fila,i)=>
    <TableRow key={"fila_"+i}>
      {columnas.map(col=>
        <TableCell key={i+"_"+col}>
          {col==="Editar/Eliminar"?
            <Box sx={{ display:"flex",gap:1,justifyContent:"center",alignItems:"center" }}>
              <Button onClick={()=>edit({ id:fila[columnas[0]],table })}>
                <EditIcon sx={{ color:"black" }}/>
              </Button>
              <Button sx={{ background:"red",borderRadius:"2rem" }} onClick={()=>setConfirmacion({ estado:true,table,filaDatos:fila,columnas })}>
                <DeleteIcon sx={{ color:"white" }}/>
              </Button>
            </Box>:
          col.toLowerCase().includes("img")||col.toLowerCase().includes("imagen")||col.toLowerCase().includes("foto")?
            <Box sx={{ display:"flex",gap:1,justifyContent:"center",alignItems:"center" }}>
              {fila[col]&&
                <Button onClick={()=>{
                  let file = fila[col];
                  if (typeof file === "string") {
                    file = file.trim();
                  }
                  if (!file) return;
                  if (file.startsWith("http")) {
                    imagenes.setImagenes({ estado: true, file });
                  } 
                  else {
                    imagenes.setImagenes({ estado: true, file: `${BACKEND}/uploads/${file}` });
                  }
                }}>Ver Imagen</Button>
              }
            </Box>:
            <Box sx={{ display:"flex",gap:1,justifyContent:"center",alignItems:"center" }}>
              {fila[col]?.value??fila[col]}
            </Box>
          }
        </TableCell>
      )}
    </TableRow>
  ),[datos.filas,columnas,edit,table,imagenes])
  return (
    <>
      <Dialog
        open={confirmacion.estado}
        disableRestoreFocus
        onClose={()=>setConfirmacion(s=>({...s,estado:false}))}
        TransitionComponent={Fade}
        PaperProps={{ sx:{ width:"100%",maxWidth:420,borderRadius:4,px:4,py:3,boxShadow:12,backdropFilter:"blur(12px)",backgroundColor:"rgba(255,255,255,0.85)",position:"relative",overflow:"visible" } }}
      >
        <Box sx={{ position:"absolute",top:-35,left:"50%",transform:"translateX(-50%) scale(1)",transition:"transform 0.4s ease" }}>
          <Box sx={{ animation:"scaleIn 0.5s ease-out","@keyframes scaleIn":{ "0%":{ transform:"scale(0)",opacity:0 },"100%":{ transform:"scale(1)",opacity:1 } } }}>
            <WarningAmberRoundedIcon sx={{ fontSize:64,color:"warning.main",background:"linear-gradient(135deg,#fff7e0,#ffe0b2)",borderRadius:"50%",p:2,boxShadow:4 }}/>
          </Box>
        </Box>
        <DialogTitle sx={{ mt:5,textAlign:"center",fontWeight:700,fontSize:"1.6rem",color:"text.primary" }}>
          ¿Eliminar registro?
        </DialogTitle>
        <DialogContent sx={{ textAlign:"center",mt:1 }}>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight:1.6 }}>
            Esta acción no se puede deshacer. <br/> ¿Estás completamente seguro?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent:"center",mt:3,gap:2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={()=>{
              setConfirmacion(s=>({...s,estado:false}))
              eliminar(confirmacion.table,confirmacion.filaDatos,confirmacion.columnas)
            }}
            sx={{ px:4,py:1.3,borderRadius:3,textTransform:"none",fontWeight:600,boxShadow:3,transition:"all 0.3s ease","&:hover":{ backgroundColor:"error.dark",transform:"scale(1.05)",boxShadow:6 } }}
          >
            Eliminar
          </Button>
          <Button
            variant="outlined"
            onClick={()=>setConfirmacion(s=>({...s,estado:false}))}
            sx={{ px:4,py:1.3,borderRadius:3,textTransform:"none",fontWeight:600,color:"text.primary",borderColor:"grey.400",transition:"all 0.3s ease","&:hover":{ backgroundColor:"action.hover",borderColor:"grey.600",transform:"scale(1.03)" } }}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      <Slide direction="left" in timeout={400}>
        <TableContainer
          className={Style.formulario}
          sx={{
            position:"relative",
            "&::-webkit-scrollbar":{ width:"2.5px",height:"9px" },
            "&::-webkit-scrollbar-thumb":{ backgroundColor: 'barra.main' ,borderRadius:"5px" },
            borderRadius:"10px 0 0 10px",margin:"3.5vh 1%",background:"white",width:"100%",height:"78.5vh"
          }}
        >
          {!datos.columnas.length && <Carga/>}
          <Table stickyHeader sx={{ "& .MuiTableCell-stickyHeader":{ backgroundColor:"	#29293D",color:"white" } }}>
            <TableHead>{renderHeader()}</TableHead>
            <TableBody>{renderRows}</TableBody>
          </Table>
        </TableContainer>
      </Slide>
    </>
  )
})

const ListaDinamic = ({ datos, padre, form, consultas }) => {
  const { medidas, anchoDrawer, alerta, imagenes } = useContext(AppContext);
  const [dialog, setDialog] = useState(false);
  const [consulta, setConsulta] = useState({ columnas: [], filas: [] });
  const [consultaEditar, setConsultaEditar] = useState({});
  const [id, setId] = useState(null);
  const [clickEdit, setClickEdit] = useState(false);
  useEffect(() => {
    if (!id) return;
    let ignore = false;
    (async () => {
      try {
        const res = await fetch(`${BACKEND}/consultaFilas`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(id)
        });
        const json = await res.json();
        if (!ignore) setConsultaEditar(json);
      } catch { }
    })();
    return () => { ignore = true };
  }, [id, padre.render]);

  const contenidoWidth = useMemo(() => anchoDrawer.isOpen
    ? `calc(100% - ${anchoDrawer.ancho.open - 15}rem)`
    : `calc(100% - ${anchoDrawer.ancho.close - 4}rem)`, [anchoDrawer.isOpen, anchoDrawer.ancho.open, anchoDrawer.ancho.close]);

  useEffect(() => {
    let tabla = datos.table;
    let ignore = false;
    (async () => {
      try {
        const res = await fetch(`${BACKEND}/consultaTabla`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ table: tabla })
        });
        const json = await res.json();
        if (!ignore) setConsulta(json);
      } catch { }
    })();
    return () => { ignore = true };
  }, [datos.table, padre.render]);

  const handleClose = useCallback(() => {
    alerta.setAlerta({ estado: false, valor: { title: '', content: "" }, lado: 'derecho' });
    setDialog(false);
  }, [alerta]);
  const datosEnvioEdit = useMemo(() => ({ estado: true, datos: consultaEditar, setClick: setClickEdit , click: clickEdit ? true: false }), [consultaEditar, clickEdit]);
  const editarMemo = useMemo(() => ({ setDialog, setId }), []);
  return (
    <>
      <Box sx={{
        position: "fixed", height: dialog ? "100%" : "0", transition: "350ms", width: "100%", backgroundColor: "#ebebeb",
        zIndex: 9997, bottom: 0, right: 0, display: "flex", flexDirection: "row", alignItems: "center", overflow: 'hidden'
      }}>
        <Box sx={{
          width: "100%", height: "60px", background: "#29293D", position: 'absolute',
          top: 0, left: 0, display: "flex", alignItems: "center", justifyContent: "space-between",
          paddingLeft: "1rem", paddingRight: "1rem", boxSizing: 'border-box', zIndex: 9998
        }}>
          <Box></Box>
          {medidas != "movil" && 

            <Typography variant="h6" sx={{ color: "#ffff", fontWeight: 600, position: "absolute", left: 0 , backgroundColor: "transparent", display: "flex", width: "max-content", height: "100%", alignItems: "center", justifyContent: "flex-end", paddingLeft: "2.5rem", paddingRight: "2rem", borderRadius: "0px 20rem 20rem 0px"}}>
              {form[0].title[0]}
            </Typography>
          }
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.1rem" }}>
            <Button 
              onClick={()=>setClickEdit(true)}
              sx={{color: "white", display: "flex", alignItems: "center", gap: "0.3rem"}}>
              {<SaveIcon sx={{color: "white"}} />} Guardar
            </Button>
            <IconButton onClick={handleClose}>
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
          </Box>
        </Box>
        {Object.keys(consultaEditar).length > 0 && (
          <DinamicForm padre={padre} form={form} edit={datosEnvioEdit} consultas={consultas} />
        )}
      </Box>
      <Box className="box-contenidos" sx={{
        right: medidas === "movil" ? "0vw" : "0.6vw",
        marginLeft: "auto",
        width: medidas === "movil" ? "100%" : contenidoWidth,
        transition: "450ms"
      }}>
        <MyTable imagenes={imagenes} padre={padre} table={datos.table} datos={consulta} editar={editarMemo} />
      </Box>
    </>
  );
}

export default memo(ListaDinamic);
