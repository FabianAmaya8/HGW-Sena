import 'dart:typed_data';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:intl/intl.dart';
import '../../models/carrito/carrito_item.dart';
import '../../models/carrito/direccion.dart';

class PdfService {
  Future<Uint8List> generarRecibo({
    required List<CarritoItem> items,
    required double total,
    required Direccion? direccion,
    required String idOrden,
  }) async {
    final doc = pw.Document();
    final currency = NumberFormat.currency(symbol: '\$', decimalDigits: 0);
    final fecha = DateFormat('dd/MM/yyyy HH:mm').format(DateTime.now());

    doc.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        build: (pw.Context context) {
          return pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Text('HGW SHOP',
                      style: pw.TextStyle(
                          fontSize: 24,
                          fontWeight: pw.FontWeight.bold,
                          color: PdfColors.green800)),
                  pw.Text('RECIBO #$idOrden',
                      style: pw.TextStyle(
                          fontSize: 18, fontWeight: pw.FontWeight.bold)),
                ],
              ),
              pw.Divider(color: PdfColors.green800),
              pw.SizedBox(height: 10),

              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Text('Fecha: $fecha'),
                  pw.Text('Estado: Pagado'),
                ],
              ),
              pw.SizedBox(height: 20),

              if (direccion != null)
                pw.Container(
                  padding: const pw.EdgeInsets.all(10),
                  decoration: pw.BoxDecoration(
                      border: pw.Border.all(color: PdfColors.grey400)),
                  child: pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Text('Enviado a:',
                          style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
                      pw.Text(direccion.direccion),
                      pw.Text(
                          '${direccion.ciudad ?? ''}, ${direccion.pais ?? ''}'),
                    ],
                  ),
                ),
              pw.SizedBox(height: 20),

              pw.Table.fromTextArray(
                headerDecoration:
                    const pw.BoxDecoration(color: PdfColors.green100),
                headerStyle: pw.TextStyle(fontWeight: pw.FontWeight.bold),
                headers: ['Producto', 'Cant.', 'Precio', 'Total'],
                data: items
                    .map((e) => [
                          e.nombre,
                          '${e.cantidad}',
                          currency.format(e.precio),
                          currency.format(e.subtotal),
                        ])
                    .toList(),
              ),
              pw.SizedBox(height: 10),
              pw.Align(
                alignment: pw.Alignment.centerRight,
                child: pw.Text('TOTAL: ${currency.format(total)}',
                    style: pw.TextStyle(
                        fontSize: 16, fontWeight: pw.FontWeight.bold)),
              ),

              pw.Spacer(),
              pw.Center(
                  child: pw.Text('Gracias por tu compra en HGW',
                      style: const pw.TextStyle(color: PdfColors.grey600))),
            ],
          );
        },
      ),
    );
    return doc.save();
  }
}
