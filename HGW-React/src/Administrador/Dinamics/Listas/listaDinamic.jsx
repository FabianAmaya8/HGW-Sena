import { memo, useCallback, useEffect, useState, useContext, useMemo } from 'react'
import React from 'react';
import { AppContext } from '../../../controlador';
import Style from './ListaDinamic.module.scss'
import { TableContainer, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableRow, TableCell, TableBody, Button, Box, Dialog, Slide, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import Categorias from '../../Categorias/Categorias';
import Subcategorias from '../../Categorias/Subcategorias/Subcategorias';
import CrearProducto from '../../Productos/CrearProducto';
import Usuarios from '../../Usuarios/Usuarios';
import Carga from '../../intermedias/carga';
import Membresias from '../../Membresias/Membresias';
import Bonos from './../../Bonos/Bonos';

const BACKEND = "http://127.0.0.1:3000"

const MyTable = memo(({ datos, editar, table, padre, imagenes }) => {
  const [confirmacion, setConfirmacion] = useState({ estado: false, table: "", filaDatos: "", columnas: "" });
  const columnas = useMemo(() => [...datos.columnas.map(c => c.field), 'Editar/Eliminar'], [datos.columnas]);
  const renderHeader = useCallback(() => (
    <TableRow sx={{ background: '#9BCC4B' }}>
      {datos.columnas.map((celda, i) => (
        <TableCell key={celda.field + '_' + i} sx={{ minWidth: "80px" }}>
          <Typography sx={{ color: 'white', textAlign: 'center' }}>{celda.name}</Typography>
        </TableCell>
      ))}
      <TableCell key="editarEliminar_header">
        <Typography sx={{ color: 'white', textAlign: 'center' }}>Editar/Eliminar</Typography>
      </TableCell>
    </TableRow>
  ), [datos.columnas]);
  const edit = useCallback((id) => {
    editar.setId(id);
    editar.setDialog(true);
  }, [editar]);
  const eliminar = useCallback((table, filaDatos, columnas) => {
    fetch(`${BACKEND}/eliminar`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ table: table, id: filaDatos[columnas[0]] })
    }).then(() => padre.setRender(!padre.render));
  }, [padre]);
  const renderRows = useCallback(() =>
    datos.filas.map((filaDatos, rowIndex) => (
      <TableRow key={'fila_' + rowIndex}>
        {columnas.map(col => (
          <TableCell key={rowIndex + '_' + col}>
            {col === 'Editar/Eliminar' ? (
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Button onClick={() => edit({ id: filaDatos[columnas[0]], table })}><EditIcon sx={{ color: "black" }} /></Button>
                <Button onClick={() => setConfirmacion({ estado: true, table, filaDatos, columnas })} sx={{ background: "red", borderRadius: "2rem" }}>
                  <DeleteIcon sx={{ color: "white" }} />
                </Button>
              </Box>
            ) : (col.toLowerCase().includes("img") || col.toLowerCase().includes("imagen") || col.toLowerCase().includes("foto")) ? (
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                {filaDatos[col] && (
                  <Button onClick={() => {
                    let file = filaDatos[col];
                    if (typeof file === 'string' && file.startsWith('http')) {
                      try {
                        const url = new URL(file);
                        file = url.pathname.split('/').pop();
                      } catch { }
                    }
                    if (typeof file === 'string') file = file.trim();
                    if (!file) return;
                    imagenes.setImagenes({ estado: true, file });
                  }}>Ver Imagen</Button>
                )}
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                {filaDatos[col]?.value ?? filaDatos[col]}
              </Box>
            )}
          </TableCell>
        ))}
      </TableRow>
    )), [datos.filas, columnas, edit, table, imagenes, padre]);
  return (
    <>
      <Dialog
        open={confirmacion.estado}
        PaperProps={{ sx: { width: "60%", maxWidth: "400px", borderRadius: "30px", display: "flex", flexDirection: "column", overflow: "visible", p: 0 } }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.25rem' }}>¿Eliminar registro?</DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pt: 0, pb: 3 }}>
          <Typography variant="body1" color="textSecondary">¿En verdad desea eliminar este registro? Esta acción no se puede deshacer.</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 4, gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => {
              setConfirmacion(s => ({ ...s, estado: false }));
              eliminar(confirmacion.table, confirmacion.filaDatos, confirmacion.columnas);
            }}
            sx={{ backgroundColor: 'error.main', color: 'common.white', px: 3, py: 1, borderRadius: '30px', textTransform: 'none', boxShadow: 2, '&:hover': { backgroundColor: 'error.dark', boxShadow: 4 } }}
          >
            Confirmar
          </Button>
          <Button
            variant="outlined"
            onClick={() => setConfirmacion({ estado: false, table: "", filaDatos: "", columnas: "" })}
            sx={{ px: 3, py: 1, borderRadius: '30px', textTransform: 'none', borderColor: 'grey.400', color: 'text.primary', '&:hover': { borderColor: 'grey.600', backgroundColor: 'action.hover' } }}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      <Slide direction="left" in timeout={400}>
        <TableContainer
          className={Style.formulario}
          sx={{
            position: "relative",
            "&::-webkit-scrollbar": { width: "2.5px", height: "9px" },
            "&::-webkit-scrollbar-thumb": { background: "#7e9e4a", borderRadius: "5px" },
            "& .MuiTableCell-stickyHeader": { backgroundColor: "#9BCC4B", color: "white" },
            borderRadius: '10px 0 0 10px', margin: '3.5vh 1%', background: 'white', width: '100%', height: '78.5vh'
          }}
        >
          {datos.columnas.length <= 0 && <Carga />}
          <Table stickyHeader sx={{ "& .MuiTableCell-stickyHeader": { backgroundColor: "#9BCC4B", color: "white" } }}>
            <TableHead>{renderHeader()}</TableHead>
            <TableBody>{renderRows()}</TableBody>
          </Table>
        </TableContainer>
      </Slide>
    </>
  );
});

const ListaDinamic = ({ datos, padre }) => {
  const { medidas, anchoDrawer, alerta, imagenes } = useContext(AppContext);
  const [dialog, setDialog] = useState(false);
  const [consulta, setConsulta] = useState({ columnas: [], filas: [] });
  const [consultaEditar, setConsultaEditar] = useState({});
  const [id, setId] = useState({});
  useEffect(() => {
    if (Object.keys(id).length > 0) {
      let ignore = false;
      fetch(`${BACKEND}/consultaFilas`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(id)
      }).then(r => r.json()).then(res => { if (!ignore) setConsultaEditar(res) });
      return () => { ignore = true };
    }
  }, [id]);
  const contenidoWidth = useMemo(() => anchoDrawer.isOpen
    ? `calc(100% - ${anchoDrawer.ancho.open - 15}rem)`
    : `calc(100% - ${anchoDrawer.ancho.close - 4}rem)`, [anchoDrawer.isOpen, anchoDrawer.ancho.open, anchoDrawer.ancho.close]);
  useEffect(() => {
    let tabla = datos.table;
    let ignore = false;
    fetch(`${BACKEND}/consultaTabla`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ table: tabla })
    }).then(r => r.json()).then(res => { if (!ignore) setConsulta(res) });
    return () => { ignore = true };
  }, [datos.table, padre.render]);
  const handleClose = useCallback(() => {
    alerta.setAlerta({ estado: false, valor: { title: '', content: "" }, lado: 'derecho' });
    setDialog(false);
  }, [alerta]);
  const datosEnvioEdit = useMemo(() => ({ estado: true, datos: consultaEditar }), [consultaEditar]);
  const editarMemo = useMemo(() => ({ setDialog, setId }), []);
  return (
    <>
      <Box sx={{ position: "fixed", height: dialog ? "100%" : "0", transition: "350ms", width: "100%", backgroundColor: "#ebebeb", zIndex: "9997", bottom: 0, right: 0, display: "flex", flexDirection: "row", alignItems: "center", overflow: 'hidden' }}>
        <Box sx={{ width: "100%", height: "60px", background: "#9BCC4B", position: 'absolute', top: 0, left: 0, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingLeft: "1rem", paddingRight: "1rem", boxSizing: 'border-box', zIndex: 9999 }}>
          <IconButton onClick={handleClose}>
            <CloseIcon sx={{ color: "white" }} />
          </IconButton>
        </Box>
        {Object.keys(consultaEditar).length > 0 && (
          datos.table === "categorias" ? <Categorias edit={datosEnvioEdit} padre={padre} /> :
            datos.table === "subcategoria" ? <Subcategorias edit={datosEnvioEdit} padre={padre} /> :
              datos.table === "productos" ? <CrearProducto edit={datosEnvioEdit} padre={padre} /> :
                datos.table === "usuarios" ? <Usuarios edit={datosEnvioEdit} padre={padre} /> :
                  datos.table === "membresias" ? <Membresias edit={datosEnvioEdit} padre={padre} /> :
                    datos.table === "bonos" && <Bonos edit={datosEnvioEdit} padre={padre} />
        )}
      </Box>
      <Box className="box-contenidos" sx={{ right: medidas === "movil" ? "0vw" : "0.6vw", marginLeft: "auto", width: medidas === "movil" ? "100%" : contenidoWidth, transition: "450ms" }}>
        <MyTable imagenes={imagenes} padre={padre} table={datos.table} datos={consulta} editar={editarMemo} />
      </Box>
    </>
  );
}

export default memo(ListaDinamic);
