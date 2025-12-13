import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/img/logo.png";

export async function generarPDFOrden(data) {
    const { orden, productos } = data;

    const doc = new jsPDF({
        unit: "pt",
        format: "letter"
    });

    const centrarX = doc.internal.pageSize.getWidth() / 2;

    // ================================
    // 1. HEADER CORPORATIVO (ESTILO C)
    // ================================
    doc.setFillColor(241, 241, 241); 
    doc.rect(0, 0, 612, 90, "F"); // Fondo gris claro

    // Logo (ajustable)
    try {
        const img = await getBase64Image(logo);
        doc.addImage(img, "PNG", 30, 10, 70, 70);
    } catch (err) {
        console.warn("No se pudo cargar el logo:", err);
    }

    // Título
    doc.setFontSize(26);
    doc.setTextColor("#1f5f39");
    doc.text("Factura de Compra", centrarX, 50, { align: "center" });

    // Línea decorativa inferior
    doc.setDrawColor("#47BF26");
    doc.setLineWidth(2);
    doc.line(0, 88, 612, 88);

    // ================================
    // 2. INFORMACIÓN DE LA ORDEN
    // ================================
    doc.setFontSize(12);
    doc.setTextColor("#333");

    let y = 110;

    doc.setFont(undefined, "bold");
    doc.text("Detalles de la Orden", 30, y);
    doc.setFont(undefined, "normal");

    y += 18;
    doc.text(`ID Orden: ${orden.id_orden}`, 30, y);
    y += 16;
    doc.text(`Cliente: ${orden.usuario}`, 30, y);
    y += 16;
    doc.text(`Correo: ${orden.correo_electronico}`, 30, y);
    y += 16;
    doc.text(`Teléfono: ${orden.numero_telefono}`, 30, y);
    y += 16;
    doc.text(`Dirección: ${orden.direccion}`, 30, y);
    y += 16;
    doc.text(`Ubicación: ${orden.ubicacion}`, 30, y);
    y += 16;
    doc.text(`Medio de Pago: ${orden.medio_pago}`, 30, y);
    y += 16;
    doc.text(`Fecha: ${orden.fecha_creacion}`, 30, y);

    // ================================
    // 3. TABLA DE PRODUCTOS
    // ================================
    const tabla = productos.map(p => [
        p.nombre_producto,
        p.cantidad,
        `$${Number(p.precio_unitario).toLocaleString()}`,
        `$${Number(p.subtotal).toLocaleString()}`,
        `${p.bv_total} pts`
    ]);

    autoTable(doc, {
        startY: y + 30,
        head: [["Producto", "Cantidad", "Unitario", "Subtotal", "BV"]],
        body: tabla,
        theme: "striped",
        styles: {
            fontSize: 10,
            cellPadding: 5,
        },
        headStyles: {
            fillColor: [31, 95, 57], // Verde oscuro HGW
            textColor: "#fff",
        },
        alternateRowStyles: {
            fillColor: [230, 247, 235] // Verde muy claro
        },
        margin: { left: 30, right: 30 }
    });

    const tableY = doc.lastAutoTable.finalY;

    // ================================
    // 4. RESUMEN DE TOTALES (mejorado)
    // ================================
    const pageHeight = doc.internal.pageSize.getHeight();
    let resumenStartY = tableY + 40;

    // 1) Si no cabe el resumen COMPLETO → crear nueva página
    if (resumenStartY + 180 > pageHeight) {
        doc.addPage();
        resumenStartY = 60; // margen superior cómodo en nueva página
    }

    doc.setFontSize(13);
    doc.setFont(undefined, "bold");
    doc.setTextColor("#1f5f39");
    doc.text("Resumen de Factura", 30, resumenStartY);

    doc.setFont(undefined, "normal");
    doc.setTextColor("#333");

    doc.text(`Subtotal: $${(orden.total - 0).toLocaleString()}`, 30, resumenStartY + 25);
    doc.text(`Impuestos: $${(0).toLocaleString()}`, 30, resumenStartY + 45);
    doc.text(`Envío: $0`, 30, resumenStartY + 65);

    doc.setFont(undefined, "bold");
    doc.setTextColor("#47BF26");
    doc.text(`TOTAL: $${orden.total.toLocaleString()}`, 30, resumenStartY + 95);

    // ================================
    // 5. MENSAJE FINAL (Gracias)
    // ================================
    doc.setFontSize(14);
    doc.setTextColor("#47BF26");
    doc.setFont(undefined, "bold");
    doc.text("¡Gracias por tu compra!", centrarX, resumenStartY + 140, { align: "center" });

    // ================================
    // 6. PREVISUALIZACIÓN EN OTRA PESTAÑA
    // ================================
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
}

// ===========================================
// HELPER: convertir imagen a Base64
// ===========================================
function getBase64Image(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            resolve(canvas.toDataURL("image/png"));
        };

        img.onerror = reject;
    });
}
