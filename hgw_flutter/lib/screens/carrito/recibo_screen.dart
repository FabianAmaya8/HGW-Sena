import 'package:flutter/material.dart';
import 'package:printing/printing.dart';
import '../../models/carrito/carrito_item.dart';
import '../../models/carrito/direccion.dart';
import '../../services/carrito/pdf_service.dart';
import '../../utils/constants.dart';

class ReciboScreen extends StatelessWidget {
  final String idOrden;
  final List<dynamic> items;
  final double total;
  final Direccion? direccion;
  const ReciboScreen({
    Key? key,
    required this.idOrden,
    required this.items,
    required this.total,
    required this.direccion,
  }) : super(key: key);
  @override
  Widget build(BuildContext context) {
    final pdfService = PdfService();
    return Scaffold(
      backgroundColor: AppColors.backgroundLight, 
      appBar: AppBar(
        title: const Text('Recibo de Compra'),
        backgroundColor: AppColors.primaryGreen, 
        foregroundColor: Colors.white, 
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: Column(
        children: [
          Container(
            height: 20,
            decoration: const BoxDecoration(
              gradient: AppColors.primaryGradient,
              borderRadius: BorderRadius.vertical(bottom: Radius.circular(20)),
            ),
          ),

          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primaryGreen.withOpacity(0.1),
                      blurRadius: 20,
                      offset: const Offset(0, 10),
                    ),
                  ],
                  border: Border.all(color: AppColors.borderColor),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(20),
                  child: PdfPreview(
                    build: (format) => pdfService.generarRecibo(
                      items: items.cast<CarritoItem>(),
                      total: total,
                      direccion: direccion,
                      idOrden: idOrden,
                    ),
                    pdfFileName: 'Recibo_HGW_$idOrden.pdf',
                    canDebug: false,
                    canChangeOrientation: false,
                    canChangePageFormat: false,
                    allowPrinting: true,
                    allowSharing: true,
                    actions: [
                      PdfPreviewAction(
                        icon: const Icon(Icons.save_alt_rounded),
                        onPressed: (context, build, pageFormat) async {
                          final bytes = await build(pageFormat);
                          await Printing.sharePdf(
                              bytes: bytes,
                              filename: 'Recibo_HGW_$idOrden.pdf');
                        },
                      ),
                    ],
                    loadingWidget: const Center(
                      child: CircularProgressIndicator(
                        color: AppColors.primaryGreen,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
