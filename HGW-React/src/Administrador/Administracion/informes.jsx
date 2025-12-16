import { Box, Button, Typography } from '@mui/material';
import Style from "./Informes.module.scss";
import { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '../../controlador';
import { findWorkingBaseUrl } from "../../urlDB";
import { ResponsiveContainer, Cell, PieChart, Pie, LineChart, XAxis, YAxis, Line, Legend, CartesianGrid, Bar, BarChart } from 'recharts';
import { jwtDecode } from 'jwt-decode';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const URL = findWorkingBaseUrl();
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFE", "#FE7FA2", "#7BD389"];

const Informes = () => {
  // Utilidad moneda
  function convertirMoneda(valor) {
    const v = typeof valor === "number" ? valor : parseInt(valor ?? 0);
    return Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(isNaN(v) ? 0 : v);
  }

  const { medidas, anchoDrawer } = useContext(AppContext);
  const [informesDatos, setInformesDatos] = useState({});
  const [generando, setGenerando] = useState(false); // estado del botón

  let token = localStorage.getItem("token");
  const contenidoWidth = useMemo(
    () => anchoDrawer.isOpen
      ? `calc(100% - ${anchoDrawer.ancho.open - 15}rem)`
      : `calc(100% - ${anchoDrawer.ancho.close - 4}rem)`,
    [anchoDrawer.isOpen, anchoDrawer.ancho.open, anchoDrawer.ancho.close]
  );

  token = jwtDecode(token);

  useEffect(() => {
    fetch(URL + "consultasInformes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(token)
    })
      .then((first) => first.json())
      .then((res) => setInformesDatos(res))
      .catch(() => setInformesDatos({}));
  }, []);

  // Estilos UI
  const globalBox = {
    py: "2%",
    background: "white",
    width: "100%",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center"
  };
  const anchoBox = "23%";
  const BoxGrande = {
    width: '90%',
    height: medidas === "movil" ? '600px' : '350px',
    background: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: '4%',
    padding: medidas === "movil" ? '5%' : '3%',
    borderRadius: '20px',
    mt: 6 // más espacio entre métricas y gráficos
  };

  // ---- Generación de PDF profesional ----
  const generarPDF = async () => {
    try {
      setGenerando(true);

      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Encabezado
      doc.setFontSize(18);
      doc.text("HGW", 20, 20); // nombre empresa
      doc.setFontSize(11);
      doc.text(`Informe generado: ${new Date().toLocaleDateString()}`, 20, 28);

      // Logo a la derecha (opcional)
      try {
        const logoImg = new Image();
        logoImg.crossOrigin = "anonymous";
        logoImg.src = "/logo.png"; // coloca tu logo en public/logo.png
        await new Promise((res, rej) => { logoImg.onload = res; logoImg.onerror = rej; });
        doc.addImage(logoImg, "PNG", pageWidth - 50, 10, 30, 20);
      } catch (e) { /* sin logo no rompe */ }

      // Métricas en texto
      let cursorY = 45;
      doc.setFontSize(14);
      doc.text("Resumen de métricas", 20, cursorY);
      cursorY += 8;
      doc.setFontSize(12);
      const lineas = [
        `Ventas hoy: ${informesDatos["ventas_hoy"] ?? "-"}`,
        `Ventas mes: ${informesDatos["ventas_mes"] ?? "-"}`,
        `Usuarios registrados: ${informesDatos["total_clientes"] ?? "-"}`,
        `Ingresos hoy: ${convertirMoneda(informesDatos["ingresos_hoy"])}`,
        `Ingresos mes: ${convertirMoneda(informesDatos["ingresos_mes"])}`
      ];
      lineas.forEach((l) => { doc.text(l, 20, cursorY); cursorY += 7; });

      // Utilidades de paginado
      const espacioDisponible = () => pageHeight - 20 - cursorY;
      const asegurarEspacio = (altoNecesario) => {
        if (espacioDisponible() < altoNecesario) {
          doc.addPage();
          cursorY = 20;
        }
      };

      // Captura y colocación de gráficos, con espaciado extra antes del título
      const colocarGrafico = async (id, titulo) => {
        const nodo = document.getElementById(id);
        if (!nodo) return;

        // Espaciado extra antes de cada bloque de gráfico
        cursorY += 15;
        doc.setFontSize(14);
        doc.text(titulo, 20, cursorY);
        cursorY += 6;

        const canvas = await html2canvas(nodo, {
          scale: 2,
          backgroundColor: "#ffffff",
          useCORS: true
        });
        const imgData = canvas.toDataURL("image/png");

        const anchoImgMm = pageWidth - 40; // márgenes laterales de 20mm
        const pxToMm = 0.264583;
        const imgWmm = canvas.width * pxToMm;
        const imgHmm = canvas.height * pxToMm;
        const scale = anchoImgMm / imgWmm;
        const renderW = anchoImgMm;
        const renderH = imgHmm * scale;

        asegurarEspacio(renderH + 12);
        doc.addImage(imgData, "PNG", 20, cursorY, renderW, renderH);
        cursorY += renderH + 12;
      };

      await colocarGrafico("grafico-productos", "Productos más vendidos");
      await colocarGrafico("grafico-ingresos", "Ingresos últimos meses");
      await colocarGrafico("grafico-categorias", "Categorías más compradas");

      // Vista previa profesional (no descarga directa)
      const blobUrl = doc.output("bloburl");
      window.open(blobUrl, "_blank");
    } finally {
      setGenerando(false);
    }
  };

  return (
    <Box
      className="box-contenidos"
      sx={{
        right: medidas === "movil" ? "0vw" : "0.6vw",
        marginLeft: "auto",
        width: medidas === "movil" ? "100%" : contenidoWidth,
        transition: "450ms",
        backgroundColor: "#f7f7f7",
        pb: 4
      }}
    >
      <Box sx={{ pt: "3%", width: "100%", display: "flex", gap: "2.5rem", flexDirection: "column", justifyContent: "space-between", alignItems: "center", paddingBottom: "2.5rem" }}>
        {/* Métricas */}
        <Box sx={{ width: "100%", px: "3%", height: "100%" }}>
          <Box sx={{ width: "100%", display: "flex", justifyContent: "center", flexWrap: "wrap", columnGap: "2.5%", rowGap: "2rem" }}>
            <Box sx={{ width: anchoBox }}>
              <Box sx={globalBox}><Typography>Ventas Hoy</Typography></Box>
              <Box className={Style.boxChildren}>{informesDatos["ventas_hoy"] ?? "-"}</Box>
            </Box>
            <Box sx={{ width: anchoBox }}>
              <Box sx={globalBox}><Typography>Ventas Mes</Typography></Box>
              <Box className={Style.boxChildren}>{informesDatos["ventas_mes"] ?? "-"}</Box>
            </Box>
            <Box sx={{ width: anchoBox }}>
              <Box sx={globalBox}><Typography>Usuarios Registrados</Typography></Box>
              <Box className={Style.boxChildren}>{informesDatos["total_clientes"] ?? "-"}</Box>
            </Box>
            <Box sx={{ width: anchoBox }}>
              <Box sx={globalBox}><Typography>Ingresos Hoy</Typography></Box>
              <Box className={Style.boxChildren}>{convertirMoneda(informesDatos["ingresos_hoy"])}</Box>
            </Box>
            <Box sx={{ width: anchoBox }}>
              <Box sx={globalBox}><Typography>Ingresos Este Mes</Typography></Box>
              <Box className={Style.boxChildren}>{convertirMoneda(informesDatos["ingresos_mes"])}</Box>
            </Box>
          </Box>
        </Box>

        {/* Gráfico productos más vendidos */}
        <Box id="grafico-productos" sx={BoxGrande}>
          <Typography typography={"h5"}>Productos Más Vendidos</Typography>
          <ResponsiveContainer width="97%" height="100%">
            <BarChart data={informesDatos["productos_destacados"] ?? []} margin={{ bottom: medidas === "movil" ? 120 : 0, right: 45 }}>
              <XAxis tick={{ textAnchor: medidas === "movil" ? 'end' : 'middle' }} angle={medidas === "movil" ? -90 : 0} dataKey="nombre_producto" interval={0} />
              <YAxis />
              <Bar dataKey="cantidad_productos" fill="#8884d8" />
              <Legend verticalAlign="top" height={36} />
              <CartesianGrid strokeDasharray="3 3" stroke="#00000048" />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Gráfico ingresos últimos meses */}
        <Box id="grafico-ingresos" sx={BoxGrande}>
          <Typography typography={"h5"}>Ingresos Últimos Meses</Typography>
          <ResponsiveContainer width="97%" height="100%">
            <LineChart data={informesDatos["Ingresos Mes"] ?? []} margin={{ bottom: medidas === "movil" ? 80 : 0, right: 45 }}>
              <XAxis tick={{ textAnchor: medidas === "movil" ? 'end' : 'middle' }} angle={medidas === "movil" ? -90 : 0} dataKey="mes" interval={0} />
              <YAxis width={110} tickFormatter={(value) => convertirMoneda(value)} />
              <Line type="monotone" dataKey="data" stroke="#8884d8" />
              <Legend verticalAlign="top" height={medidas === "movil" ? 53 : 36} />
              <CartesianGrid strokeDasharray="3 3" stroke="#00000048" />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* Gráfico categorías más compradas */}
        <Box
          id="grafico-categorias"
          sx={{
            ...BoxGrande,
            justifyContent: "space-between",
            gap: "4%",
            height: medidas === "movil" ? "380px" : "480px",
            py: medidas === "movil" ? '5%' : '3%'
          }}
        >
          <Typography typography={"h5"}>Categorías Más Compradas</Typography>
          <Box sx={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", height: "100%", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ bottom: 0 }}>
                <Pie
                  data={informesDatos["categorias_destacadas"] ?? []}
                  dataKey="cantidad_compras"
                  nameKey="nombre_categoria"
                  outerRadius={100}
                  cx="50%"
                  cy="50%"
                  animationDuration={800}
                >
                  {(informesDatos["categorias_destacadas"] ?? []).map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="top" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Botón para exportar PDF con estado de "generando" */}
        <Box sx={{ width: "90%", display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color={generando ? "inherit" : "primary"}
            disabled={generando}
            onClick={generarPDF}
          >
            {generando ? "Generando PDF..." : "Exportar informe a PDF"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Informes;
