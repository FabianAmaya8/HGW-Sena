import React, {
  memo,
  useCallback,
  useEffect,
  useState,
  useContext,
  useMemo,
  lazy,
  Suspense
} from "react";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { Fade } from "@mui/material";
import "../../../font.module.scss";
import { AppContext } from "../../../controlador";
import Style from "./ListaDinamic.module.scss";
import SaveIcon from "@mui/icons-material/Save";
import {
  TableContainer,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Box,
  Dialog,
  Slide,
  IconButton,
  Typography,
  Divider
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import Carga from "../../intermedias/carga";
import { findWorkingBaseUrl } from "../../../urlDB";
import VisibilityIcon from "@mui/icons-material/Visibility";

const DinamicForm = lazy(() => import("../formularios/Dinamics"));
const BACKEND = findWorkingBaseUrl().replace(/\/$/, "");

/* ────────────────────────────────
   Modal de Detalle de Órdenes
──────────────────────────────── */
const OrdenDetalleModal = memo(({ open, onClose, ordenId }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!open || !ordenId) return;

    setLoading(true);
    fetch(`${BACKEND}/ordenDetalle/${ordenId}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
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
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle
        sx={{
          background: "#29293D",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 2
        }}
      >
        <Typography variant="h6">Orden #{ordenId}</Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {loading && <Carga />}
        {data && (
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
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
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                Dirección
              </Typography>
              <Typography variant="body2">{data.orden.direccion}</Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Pago
                </Typography>
                <Typography variant="body2">{data.orden.medio_pago}</Typography>
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Fecha
                </Typography>
                <Typography variant="body2">
                  {data.orden.fecha_creacion}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Productos ({data.productos.length})
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {data.productos.map((producto, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 1.5,
                    border: "1px solid #e0e0e0",
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
                    <Typography
                      variant="caption"
                      color="success.main"
                      sx={{ display: "block" }}
                    >
                      {producto.bv_total} BV
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600}>
                    ${producto.subtotal.toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                mt: 3,
                pt: 2,
                borderTop: "2px solid #29293D",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
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

/* ────────────────────────────────
   Tabla Dinámica General
──────────────────────────────── */
const MyTable = memo(({ datos, editar, table, padre, imagenes }) => {
  const [confirmacion, setConfirmacion] = useState({
    estado: false,
    table: "",
    filaDatos: null,
    columnas: []
  });
  const [detalleOrden, setDetalleOrden] = useState({
    open: false,
    ordenId: null
  });

  const columnas = useMemo(
    () => [...datos.columnas.map((c) => c.field), "Acciones"],
    [datos.columnas]
  );

  const renderHeader = useMemo(
    () => (
      <TableRow sx={{ background: "#9BCC4B" }}>
        {datos.columnas.map((c, i) => (
          <TableCell key={c.field + "_" + i} sx={{ minWidth: "80px" }}>
            <Typography sx={{ color: "white", textAlign: "center" }}>
              {c.name}
            </Typography>
          </TableCell>
        ))}
        <TableCell key="acciones_header">
          <Typography sx={{ color: "white", textAlign: "center" }}>
            {table === "ordenes" ? "Acciones" : "Editar / Eliminar"}
          </Typography>
        </TableCell>
      </TableRow>
    ),
    [datos.columnas, table]
  );

  const edit = useCallback(
    (id) => {
      editar.setId(id);
      editar.setDialog(true);
    },
    [editar]
  );

  const eliminar = useCallback(
    async (tbl, fila, cols) => {
      await fetch(`${BACKEND}/eliminar`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ table: tbl, id: fila[cols[0]] })
      });
      padre.setRender((r) => !r);
    },
    [padre]
  );

  const createImageHandler = useCallback(
    (file) => () => {
      let f = file;
      if (typeof f === "string") f = f.trim();
      if (!f) return;
      if (f.startsWith("http") || f.startsWith("data:image/")) {
        imagenes.setImagenes({ estado: true, file: f });
      } else {
        imagenes.setImagenes({ estado: true, file: `${BACKEND}/uploads/${f}` });
      }
    },
    [imagenes]
  );

  const renderRows = useMemo(
    () =>
      datos.filas.map((fila, i) => (
        <TableRow key={fila.id ?? "fila_" + i}>
          {columnas.map((col) => (
            <TableCell key={(fila.id ?? i) + "_" + col}>
              {col === "Acciones" ? (
                table === "ordenes" ? (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() =>
                      setDetalleOrden({ open: true, ordenId: fila.id_orden })
                    }
                    sx={{ textTransform: "none" }}
                  >
                    Ver
                  </Button>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Button
                      onClick={() => edit({ id: fila[columnas[0]], table })}
                    >
                      <EditIcon sx={{ color: "black" }} />
                    </Button>
                    <Button
                      sx={{ background: "red", borderRadius: "2rem" }}
                      onClick={() =>
                        setConfirmacion({
                          estado: true,
                          table,
                          filaDatos: fila,
                          columnas
                        })
                      }
                    >
                      <DeleteIcon sx={{ color: "white" }} />
                    </Button>
                  </Box>
                )
              ) : col.toLowerCase().includes("img") ||
                col.toLowerCase().includes("imagen") ||
                col.toLowerCase().includes("foto") ? (
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  {fila[col] && (
                    <Button onClick={createImageHandler(fila[col])}>
                      Ver Imagen
                    </Button>
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  {fila[col]?.value ?? fila[col]}
                </Box>
              )}
            </TableCell>
          ))}
        </TableRow>
      )),
    [datos.filas, columnas, table, edit, createImageHandler]
  );

  return (
    <>
      <OrdenDetalleModal
        open={detalleOrden.open}
        ordenId={detalleOrden.ordenId}
        onClose={() => setDetalleOrden({ open: false, ordenId: null })}
      />

      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        open={confirmacion.estado}
        disableRestoreFocus
        onClose={() => setConfirmacion((s) => ({ ...s, estado: false }))}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 420,
            borderRadius: 4,
            px: 4,
            py: 3,
            boxShadow: 12,
            backdropFilter: "blur(12px)",
            backgroundColor: "rgba(255,255,255,0.85)",
            position: "relative",
            overflow: "visible"
          }
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -35,
            left: "50%",
            transform: "translateX(-50%)"
          }}
        >
          <WarningAmberRoundedIcon
            sx={{
              fontSize: 64,
              color: "warning.main",
              background: "linear-gradient(135deg,#fff7e0,#ffe0b2)",
              borderRadius: "50%",
              p: 2,
              boxShadow: 4
            }}
          />
        </Box>
        <DialogTitle
          sx={{
            mt: 5,
            textAlign: "center",
            fontWeight: 700,
            fontSize: "1.6rem",
            color: "text.primary"
          }}
        >
          ¿Eliminar registro?
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", mt: 1 }}>
          <Typography variant="body1" color="text.secondary">
            Esta acción no se puede deshacer.<br />
            ¿Estás completamente seguro?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", mt: 3, gap: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setConfirmacion((s) => ({ ...s, estado: false }));
              eliminar(
                confirmacion.table,
                confirmacion.filaDatos,
                confirmacion.columnas
              );
            }}
          >
            Eliminar
          </Button>
          <Button
            variant="outlined"
            onClick={() => setConfirmacion((s) => ({ ...s, estado: false }))}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      <Slide direction="left" in timeout={400}>
        <TableContainer
          className={Style.formulario}
          sx={{
            "&::-webkit-scrollbar": { width: "2.5px", height: "9px" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "barra.main",
              borderRadius: "5px"
            },
            borderRadius: "10px 0 0 10px",
            margin: "3.5vh 1%",
            background: "white",
            width: "100%",
            height: "78.5vh"
          }}
        >
          {!datos.columnas.length && <Carga />}
          <Table
            stickyHeader
            sx={{
              "& .MuiTableCell-stickyHeader": {
                backgroundColor: "#29293D",
                color: "white"
              }
            }}
          >
            <TableHead>{renderHeader}</TableHead>
            <TableBody>{renderRows}</TableBody>
          </Table>
        </TableContainer>
      </Slide>
    </>
  );
});

export default memo(MyTable);
