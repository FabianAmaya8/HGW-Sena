import { memo, useCallback, useEffect, useState, useContext, useMemo } from 'react'
import React from 'react';
import { AppContext } from '../../controlador';
import { useNavigate } from 'react-router';
import Style from './ListaDinamic.module.scss'
import { AppBar, Button, IconButton, Slide, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, TablePagination, Typography, Box, Dialog, Toolbar, Icon } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import Categorias from '../../Categorias/Categorias';
import Subcategorias from '../../Categorias/Subcategorias/Subcategorias';
import CrearProducto from '../../Productos/CrearProducto';

const MyTable = memo(({ datos, editar, table, padre, imagenes }) => {
  const columnas = useMemo(
    () => [...datos.columnas.map(c => c.field), 'Editar/Eliminar'],
    [datos.columnas]
  );
  const renderHeader = () => (
    <TableRow sx={{ background: '#9BCC4B' }}>
      {datos.columnas.map((celda, i) => (
        <TableCell key={celda.field + '_' + i} sx={{minWidth: "60px"}}>
          <Typography sx={{ color: 'white', textAlign: 'center' }}>
            {celda.name}
          </Typography>
        </TableCell>
      ))}
      <TableCell key="editarEliminar_header">
        <Typography sx={{ color: 'white', textAlign: 'center' }}>
          {"Editar/Eliminar"}
        </Typography>
      </TableCell>
    </TableRow>
  );
  const edit = useCallback((id)=>{
    editar.setId(id);
    editar.setDialog(true);
  }, []);
  const renderRows = () =>
    datos.filas.map((filaDatos, rowIndex) => {
    return(
      <TableRow key={'fila_' + rowIndex}>
        {columnas.map(col => (
          <TableCell key={rowIndex + '_' + col}>
              {col === 'Editar/Eliminar' ? (
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center'}}>
                  <Button onClick={()=>edit({id: filaDatos[columnas[0]], table: table})} ><EditIcon sx={{color: "black"}}/></Button>
                  <Button onClick={()=>{
                    fetch("http://127.0.0.1:5000/eliminar", {
                        method: "POST",
                        headers: {"content-type": "application/json"},
                        body: JSON.stringify({table: table, id: filaDatos[columnas[0]]})
                    }).then(headers => headers.json()).then(res => padre.setRender(!padre.render))
                  }} sx={{background: "red", borderRadius: "2rem"}}><DeleteIcon sx={{color: "white"}}/></Button>
                </Box>
              ) : col.toLowerCase().includes("img") || col.toLowerCase().includes("imagen") || col.toLowerCase().includes("foto") ?
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center'}}>
                  {filaDatos[col] != "" && filaDatos[col] != undefined &&
                    <Button onClick={()=>{
                      imagenes.setImagenes({estado: true, file: filaDatos[col]})
                    }}>Ver Imagen</Button>
                  }
                </Box>
              :(
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center'}}>{filaDatos[col]}</Box>
              )}
          </TableCell>
        ))}
      </TableRow>
    )})

  return (
    <>
    <Slide direction="left" in timeout={400}>
      <TableContainer
        className={Style.formulario}
        sx={{ 
            "&::-webkit-scrollbar": {width: "2.5px", height: "9px"}, 
            "&::-webkit-scrollbar-thumb": {background: "#7e9e4a", borderRadius: "5px"}, 
            "& .MuiTableCell-stickyHeader": {
                backgroundColor: "#9BCC4B",
                color: "white",
            },
            borderRadius: '10px 0 0 10px', margin: '3.5vh 1%', background: 'white', width: '100%', height: '78.5vh' }}
      >
        <Table stickyHeader sx={{
                "& .MuiTableCell-stickyHeader": {
                    backgroundColor: "#9BCC4B",
                    color: "white",
                },
            }}>
          <TableHead>{renderHeader()}</TableHead>
          <TableBody>{renderRows()}</TableBody>
          {/*<TableFooter>
            <TableRow>
              <TablePagination />
            </TableRow>
          </TableFooter>*/}
        </Table>
      </TableContainer>
    </Slide>
    </>
  );
});

const ListaDinamic = ({datos, padre})=>{
    const {medidas, anchoDrawer, alerta, imagenes} = useContext(AppContext);
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide mountOnEnter unmountOnExit direction="up" ref={ref} {...props} />;
    });
    const [dialog, setDialog] = useState(false);
    const [consulta, setConsulta] = useState({columnas: [], filas: []});
    const [consultaEditar, setConsultaEditar] = useState({});
    const allFilas = useMemo(()=>datos.filas, [datos.filas]);
    const allColumns = useMemo(()=>datos.columnas,[datos.columnas]);
    const [id, setId] = useState({});
    useEffect(()=>{
      if(Object.keys(id).length > 0){
        fetch("http://127.0.0.1:5000/consultaFilas", {
          method: "POST",
          headers: {"content-type": "application/json"},
          body: JSON.stringify(id)
        }).then(headers => headers.json()).then(res => setConsultaEditar(res))
      }
    }, [id]);
    const contenidoWidth = anchoDrawer.isOpen
    ? `calc(100% - ${anchoDrawer.ancho.open-15}rem)`
    : `calc(100% - ${anchoDrawer.ancho.close-4}rem)`;
    useEffect(()=>{
        let tabla = datos.table
        fetch("http://127.0.0.1:5000/consultaTabla", {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({table: tabla})
        }).then(headers => headers.json()).then(res => {setConsulta(res)});
    }, [datos])
    const handleClose = () => {
        setDialog(false);
    };
    const datosEnvioEdit = useMemo(()=>{return{estado: true, datos: consultaEditar}}, [consultaEditar])
    return (
        <>
        <Box sx={{position: "fixed", height: dialog ? "100%": "0", transition: "350ms", width: "100%", backgroundColor: "#ebebeb", zIndex: "9997", bottom: 0, right: 0,
          display: "flex", justifyContent: "", flexDirection: "row", alignItems: "center", overflow: 'hidden'
        }}>
          <Box  sx={{width: "100%", height: "60px", background: "#9BCC4B", position: 'absolute', rigth: 0, top: 0, left: 0, display: "flex", alignItems: "center", justifyContent: "flex-end",
            paddingLeft: "1rem", paddingRight: "1rem", boxSizing: 'border-box', zIndex: 9999
          }}>
            <IconButton onClick={handleClose} >
              <CloseIcon sx={{color: "white"}} />
            </IconButton>
          </Box>
          { Object.keys(consultaEditar).length > 0 &&
            datos.table == "categorias" ?
              <Categorias edit={datosEnvioEdit} padre={padre} />:
            datos.table == "subcategoria" ?
              <Subcategorias edit={datosEnvioEdit} padre={padre} />:
            datos.table == "productos" &&
              <CrearProducto edit={datosEnvioEdit} padre={padre} />
          }
        </Box>
        <Box className="box-contenidos" sx={{ right: medidas == "movil" ? "0vw":"0.6vw",marginLeft: "auto", width: medidas == "movil" ? "100%": contenidoWidth, transition: "450ms"}}>
            <MyTable imagenes={imagenes} padre={padre} table={datos.table} datos={consulta} editar={useMemo(()=>{return{setDialog: setDialog, setId: setId}}, [])} />
        </Box>
        </>
    )
}

export default memo(ListaDinamic);