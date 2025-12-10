import React, { memo, useCallback, useEffect, useState, useContext, useMemo, lazy, Suspense } from 'react'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { Fade } from '@mui/material';
import "../../../font.module.scss"
import { AppContext } from '../../../controlador';
import Style from './ListaDinamic.module.scss'
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { datosToken } from '../../../auth';
import VistaLog from './VistaLog';
import {
  TableContainer, DialogTitle, DialogContent, DialogActions,
  Table, TableHead, TableRow, TableCell, TableBody,
  Button, Box, Dialog, Slide, IconButton, Typography, Divider, Pagination, Toolbar
} from '@mui/material';
import { Search, SearchIconWrapper, StyledInputBase } from './Search';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import Carga from '../../intermedias/carga';
import { findWorkingBaseUrl } from '../../../urlDB';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { styled } from '@mui/material/styles';
import titulos from '../Funciones/Titulos';

const DinamicForm = lazy(() => import('../formularios/Dinamics'));
const BACKEND = (findWorkingBaseUrl() || "").replace(/\/$/, "");
const usuarioActual = (datosToken()?.id);



const OrdenDetalleModal = memo(({ open, onClose, ordenId }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!open || !ordenId) return;
    setLoading(true);
    fetch(`${BACKEND}/ordenDetalle/${ordenId}`)
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, [open, ordenId]);

  if (!data && !loading) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableRestoreFocus
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{
        background: '#29293D',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 2
      }}>
        <Typography variant="span">Orden #{ordenId}</Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3,  "&::-webkit-scrollbar": { width: "2.5px", height: "9px" },
            "&::-webkit-scrollbar-thumb": { backgroundColor: 'barra.main', borderRadius: "5px" },
            borderRadius: "10px 0 0 10px", background: "white", width: "100%", height: "78.5vh" }}>
        {loading && <Carga />}
        {data && (
          <Box sx={{marginTop: "4%"}}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Cliente
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {data.orden.usuario}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {data.orden.correo_electronico}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Dirección
              </Typography>
              <Typography variant="body2">
                {data.orden.direccion}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Pago
                </Typography>
                <Typography variant="body2">{data.orden.medio_pago}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Fecha
                </Typography>
                <Typography variant="body2">{data.orden.fecha_creacion}</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
              Productos ({data.productos.length})
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {data.productos.map((producto, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    p: 1.5,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1
                  }}
                >
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {producto.nombre_producto}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {producto.cantidad} × ${producto.precio_unitario.toFixed(2)}
                    </Typography>
                    <Typography variant="caption" color="success.main" sx={{ display: 'block' }}>
                      {producto.bv_total} BV
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600}>
                    ${producto.subtotal.toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{
              mt: 3,
              pt: 2,
              borderTop: '2px solid #29293D',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h5" fontWeight={700}>
                ${data.orden.total.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
});

const MyTable = memo(({ datos, editar, table, padre, imagenes }) => {
  const { medidas } = useContext(AppContext);
  const [EstadoLog, setEstadoLog] = useState(false)
  const [confirmacion, setConfirmacion] = useState({ estado:false, table:"", filaDatos:null, columnas:[] });
  const [detalleOrden, setDetalleOrden] = useState({ open: false, ordenId: null });
  const [page, setPage] = useState(0);
  const [idFila, setFila] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const rowsPerPage = 8;
  const [consulta, setConsulta] = useState({ filas: [], columnas: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const columnas = useMemo(() => {
    const base = consulta.columnas.map(c => c.field);
    if(table === "ordenes"){
      base.push("Ver detalle");
    }
    else{
      base.push("Ver Log");
      base.push("Editar/Eliminar");
    }
    return base;
  }, [consulta.columnas, table]);

  useEffect(() => {
    if (!table) return;
    setLoading(true);
    const controller = new AbortController();
    (async () => {
      try{
        const res = await fetch(`${BACKEND}/consultaTabla`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ table, page, limit: rowsPerPage, busqueda: busqueda.trim() }),
          signal: controller.signal
        });
        const json = await res.json();
        const total = json.total ?? (Array.isArray(json.filas) ? json.filas.length : 0);
        setConsulta({ filas: json.filas || [], columnas: json.columnas || [], total });
        total != 0 && setLoading(false);
      }
      catch (err) {
      }})();
    return () => controller.abort();
  }, [table, page, padre.render, busqueda]);

  useEffect(()=>{
    if(busqueda != ""){
      setPage(0);
    }
  }, [busqueda]);
  useEffect(() => {
    setTotalPaginas(Math.ceil((consulta.total ?? consulta.filas.length ?? 0) / rowsPerPage));
    if (consulta.total && page > 0 && page * rowsPerPage >= consulta.total) {
      setPage(0);
    }
  }, [consulta.total]);

  const edit = useCallback(id => {
    editar.setId(id);
    editar.setDialog(true);
  }, [editar.setId, editar.setDialog]);

  const eliminar = useCallback(async(tbl, fila, cols) => {
    await fetch(`${BACKEND}/eliminar`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ table: tbl, id: fila[cols[0]], log: {id: usuarioActual, accion: "eliminar" }})
    });
    padre.setRender(r => !r);
  }, [padre.setRender, usuarioActual]);

  const createImageHandler = useCallback((file) => {
    let f = file;
    if (typeof f === "string") f = f.trim();
    if (!f) return null;
    if (f.startsWith("http") || f.startsWith("data:image/")) {
      return () => imagenes.setImagenes({ estado: true, file: f });
    } else {
      return () => imagenes.setImagenes({ estado: true, file: `${BACKEND}/uploads/${f}` });
    }
  }, [imagenes]);

  const abrirDetalle = useCallback((id) => {
    setDetalleOrden({ open: true, ordenId: id });
  }, []);
  const Row = useCallback(memo(({ fila, columnas, i }) => {
  const keyId = String(fila?.id?.id ?? fila?.id ?? i);
    return (
      <TableRow key={keyId}>
        {columnas.map(col => {
          const cellKey = `${keyId}_${col}`;
          return (
            <TableCell key={cellKey}>
              {col === "Ver detalle" ? (
                <Button sx={{width: "100%", height: "100%"}} onClick={() => abrirDetalle(fila[columnas[0]])}>
                  Detalle Orden
                </Button>
              ) :
              col == "Ver Log" ? 
                <Button sx={{width: "100%", height: "100%"}} onClick={()=>{
                  setEstadoLog(true);
                  setFila({ [columnas[0]]: fila[columnas[0]], table });
                }}>
                  Log Ediciones
                </Button>
              : col === "Editar/Eliminar" ? (
                <Box sx={{ display:"flex", gap:1, justifyContent:"center", alignItems:"center" }}>
                  <Button onClick={() => edit({ [columnas[0]]: fila[columnas[0]], table })}>
                    <EditIcon sx={{ color:"black" }}/>
                  </Button>
                  <Button sx={{ background:"red", borderRadius:"2rem" }} onClick={() => setConfirmacion({ estado:true, table, filaDatos:fila, columnas })}>
                    <DeleteIcon sx={{ color:"white" }}/>
                  </Button>
                </Box>
              ) : (col.toLowerCase().includes("img") || col.toLowerCase().includes("imagen") || col.toLowerCase().includes("foto")) ? (
                <Box sx={{ display:"flex", gap:1, justifyContent:"center", alignItems:"center" }}>
                  {fila[col] && <Button onClick={createImageHandler(fila[col])}>Ver Imagen</Button>}
                </Box>
              ) : (
                <Box sx={{ display:"flex", gap:1, justifyContent:"center", alignItems:"center" }}>
                  {col.toLowerCase().startsWith("id") ? fila[col]?.id ?? fila[col] : fila[col]?.value ?? fila[col]}
                </Box>
              )}
            </TableCell>
          )
        })}
      </TableRow>
    )
  }, (a, b) => a.fila === b.fila), [abrirDetalle, edit, setConfirmacion, createImageHandler, table]);

  const renderHeader = useMemo(() => (
    <TableRow sx={{ background:"#9BCC4B" }}>
      {consulta.columnas.map((c, i) =>
        <TableCell key={c.field+"_"+i} sx={{ minWidth:"80px" }}>
          <Typography sx={{ color:"white", textAlign:"center" }}>{c.name}</Typography>
        </TableCell>
      )}
      {table == "ordenes" ? 
        <TableCell>
          <Typography sx={{ color:"white", textAlign:"center" }}>Ver detalle</Typography>
        </TableCell>:
        <>
          <TableCell>
            <Typography sx={{ color:"white", textAlign:"center" }}>Ver Log</Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ color:"white", textAlign:"center" }}>Editar/Eliminar</Typography>
          </TableCell>
        </>
      }
    </TableRow>
  ), [consulta.columnas, table]);
  return (
    <>
      <VistaLog idFila = {idFila} EstadoLog = {EstadoLog} setEstadoLog = {setEstadoLog} />
      <OrdenDetalleModal
        open={detalleOrden.open}
        ordenId={detalleOrden.ordenId}
        onClose={() => setDetalleOrden({ open:false, ordenId:null })}
      />

      <Dialog
        open={confirmacion.estado}
        disableRestoreFocus
        onClose={() => setConfirmacion(s => ({ ...s, estado:false }))}
        TransitionComponent={Fade}
        PaperProps={{ sx: { width:"100%", maxWidth:420, borderRadius:4, px:4, py:3, boxShadow:12, backdropFilter:"blur(12px)", backgroundColor:"rgba(255,255,255,0.85)", position:"relative", overflow:"visible" } }}
      >
        <Box sx={{ position:"absolute", top:-35, left:"50%", transform:"translateX(-50%) scale(1)" }}>
          <Box sx={{ animation:"scaleIn 0.5s ease-out", "@keyframes scaleIn": { "0%": { transform:"scale(0)", opacity:0 }, "100%": { transform:"scale(1)", opacity:1 } } }}>
            <WarningAmberRoundedIcon sx={{ fontSize:64, color:"warning.main", background:"linear-gradient(135deg,#fff7e0,#ffe0b2)", borderRadius:"50%", p:2, boxShadow:4 }} />
          </Box>
        </Box>
        <DialogTitle sx={{ mt:5, textAlign:"center", fontWeight:700, fontSize:"1.6rem", color:"text.primary" }}>¿Eliminar registro?</DialogTitle>
        <DialogContent sx={{ textAlign:"center", mt:1 }}>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight:1.6 }}>
            Esta acción no se puede deshacer. <br /> ¿Estás completamente seguro?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent:"center", mt:3, gap:2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setConfirmacion(s => ({ ...s, estado:false }));
              eliminar(confirmacion.table, confirmacion.filaDatos, confirmacion.columnas);
            }}
            sx={{ px:4, py:1.3, borderRadius:3, textTransform:"none", fontWeight:600, boxShadow:3, "&:hover": { backgroundColor:"error.dark", transform:"scale(1.05)", boxShadow:6 } }}
          >
            Eliminar
          </Button>
          <Button
            variant="outlined"
            onClick={() => setConfirmacion(s => ({ ...s, estado:false }))}
            sx={{ px:4, py:1.3, borderRadius:3, textTransform:"none", fontWeight:600, color:"text.primary", borderColor:"grey.400", "&:hover": { backgroundColor:"action.hover", borderColor:"grey.600", transform:"scale(1.03)" } }}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      <Slide direction="left" in timeout={400}>
        <TableContainer
          className={Style.formulario}
          sx={{
            display: "flex",
            flexDirection: "column",
            position:"relative",
            borderRadius:"10px 10px 0 10px",
            margin:"3.5vh 1%",
            background:"white",
            width:"100%",
            height:"78.5vh"
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
              {titulos(table)}
            </Typography>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
              <StyledInputBase
                placeholder="Buscar…"
                inputProps={{ 'aria-label': 'search' }}
                onChange={(e)=>setBusqueda(e.target.value)}
              />
            </Search>
          </Toolbar>
          <Box sx={{
            flex: 1,
            overflowX: 'auto',
            overflowY: 'auto',
            height: '100%',
            width: '100%',
            "&::-webkit-scrollbar": { width:"2.5px", height:"9px" },
            "&::-webkit-scrollbar-thumb": { backgroundColor:'barra.main', borderRadius:"2px" },
          }}>
            <Table stickyHeader sx={{ height: '100%', width: '100%', "& .MuiTableCell-stickyHeader": { backgroundColor:"#29293D", color:"white" } }}>
              <TableHead>{renderHeader}</TableHead>
              <TableBody sx={{height: '100%', width: '100%'}}>
                {typeof consulta.filas == "string" ? 
                <TableRow sx={{pl: "5%", }}>
                  <TableCell colSpan={columnas.length} sx={{display: "flex", flex: 1, height: "100%", width: "100%", alignItems: "center", justifyContent: "center"}}><Typography variant="h4">{consulta.filas}</Typography></TableCell>
                </TableRow> 
                : consulta.filas.map((fila, i) => <Row key={String(fila?.id?.id ?? fila?.id ?? i)} fila={fila} columnas={columnas} i={i} />)}
              </TableBody>
            </Table>
          </Box>

          {loading && (
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: "100%",
              height: "100%",
              transform: 'translate(-50%, -50%)',
              zIndex: 5
            }}>
              <Carga />
            </Box>
          )}

          <Box
            sx={{
              position: 'sticky',
              bottom: 0,
              background: 'white',
              zIndex: 3,
              py: 1.2,
              display: 'flex',
              ...(medidas == "movil" && {mr: "4%"}),
              justifyContent: medidas == "movil" ? 'flex-end' : 'center',
              borderTop: '1px solid #ddd'
            }}
          >
              <Pagination
                count={totalPaginas}
                page={page + 1}
                onChange={(e, newPage) => setPage(newPage - 1)}
                size={medidas === "movil" ? "small" : "medium"}
                showFirstButton={true}
                showLastButton={true}
              />
            </Box>
        </TableContainer>
      </Slide>
    </>
  )
});



const ListaDinamic = ({ datos, padre, form, consultas }) => {
  const { medidas, anchoDrawer, alerta, imagenes } = useContext(AppContext);
  const [dialog, setDialog] = useState(false);
  const [consulta, setConsulta] = useState({ columnas: [], filas: [] });
  const [consultaEditar, setConsultaEditar] = useState({});
  const [id, setId] = useState(null);
  const [clickEdit, setClickEdit] = useState(false);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`${BACKEND}/consultaFilas`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(id),
          signal: controller.signal
        });
        const json = await res.json();
        setConsultaEditar(json);
      } catch (err) {}
    })();
    return () => controller.abort();
  }, [id, padre.render]);

  const contenidoWidth = useMemo(() => anchoDrawer.isOpen
    ? `calc(100% - ${anchoDrawer.ancho.open - 15}rem)`
    : `calc(100% - ${anchoDrawer.ancho.close - 4}rem)`, [anchoDrawer.isOpen, anchoDrawer.ancho.open, anchoDrawer.ancho.close]);

  useEffect(() => {
    let tabla = datos.table;
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`${BACKEND}/consultaTabla`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ table: tabla }),
          signal: controller.signal
        });
        const json = await res.json();
        setConsulta(json);
      } catch (err) {}
    })();
    return () => controller.abort();
  }, [datos.table, padre.render]);

  const handleClose = useCallback(() => {
    alerta.setAlerta({ estado: false, valor: { title: '', content: "" }, lado: 'derecho' });
    setDialog(false);
  }, [alerta.setAlerta]);

  const datosEnvioEdit = useMemo(() => ({ estado: true, datos: consultaEditar, setClick: setClickEdit , click: clickEdit ? true: false }), [consultaEditar, clickEdit]);

  const editarMemo = useMemo(() => ({ setDialog, setId }), [setDialog, setId]);

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
            <Typography variant="h6" sx={{ color: "#ffff", fontWeight: 600, position: "absolute", left: 0, backgroundColor: "transparent", display: "flex", width: "max-content", height: "100%", alignItems: "center", justifyContent: "flex-end", paddingLeft: "2.5rem", paddingRight: "2rem", borderRadius: "0px 20rem 20rem 0px" }}>
              {form[0].title[0]}
            </Typography>
          }
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.1rem" }}>
            <Button
              onClick={() => setClickEdit(true)}
              sx={{ color: "white", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              {<SaveIcon sx={{ color: "white" }} />} Guardar
            </Button>
            <IconButton onClick={handleClose}>
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
          </Box>
        </Box>
        {Object.keys(consultaEditar).length > 0 && (
          <Suspense fallback={null}>
            <DinamicForm padre={padre} form={form} edit={datosEnvioEdit} consultas={consultas} />
          </Suspense>
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
