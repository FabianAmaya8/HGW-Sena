import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/carrito/carrito_item.dart';
import '../../models/carrito/direccion.dart';
import '../../models/carrito/respuesta_compra.dart';
import '../../providers/carrito/carrito_provider.dart';
import '../../providers/personal/personal_provider.dart';
import '../../utils/constants.dart';
import 'confirmacion_screen.dart';

class PagoScreen extends StatefulWidget {
  const PagoScreen({Key? key}) : super(key: key);

  @override
  State<PagoScreen> createState() => _PagoScreenState();
}

class _PagoScreenState extends State<PagoScreen> {
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CarritoProvider>().cargarMediosPago();
    });
  }

  Future<void> _procesarPago() async {
    final carritoProvider = context.read<CarritoProvider>();
    if (carritoProvider.medioPagoSeleccionado == null) return;

    setState(() => _loading = true);

    final itemsParaRecibo = List<CarritoItem>.from(carritoProvider.items);
    final totalParaRecibo = carritoProvider.total;
    final direccionParaRecibo = carritoProvider.direccionSeleccionada;

    final RespuestaCompra respuesta = await carritoProvider.crearOrden();

    if (respuesta.success && respuesta.idOrden != null) {
      try {
        if (mounted) {
          await context.read<PersonalProvider>().cargarDatosPersonales();
        }
      } catch (_) {}

      if (!mounted) return;
      setState(() => _loading = false);

      if (respuesta.subioRango) {
        await _mostrarAlertaAscenso(
            respuesta.nuevoRango!, respuesta.puntosGanados);
      }

      if (!mounted) return;

      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(
          builder: (_) => ConfirmacionScreen(
            idOrden: respuesta.idOrden.toString(),
            itemsCompra: itemsParaRecibo,
            totalCompra: totalParaRecibo,
            direccionCompra: direccionParaRecibo,
          ),
        ),
        (route) => route.isFirst,
      );
    } else {
      if (!mounted) return;
      setState(() => _loading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(respuesta.message ?? 'Error al procesar el pago'),
          backgroundColor: AppColors.errorColor,
        ),
      );
    }
  }

  Future<void> _mostrarAlertaAscenso(String nuevoRango, int puntos) async {
    return showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.emoji_events_rounded,
                size: 80, color: Colors.amber),
            const SizedBox(height: 15),
            Text(
              "¡FELICIDADES!",
              style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.amber[800],
                  letterSpacing: 1.2),
            ),
            const SizedBox(height: 10),
            const Text(
              "Has alcanzado un nuevo nivel:",
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 14, color: Colors.black54),
            ),
            const SizedBox(height: 5),
            Text(
              nuevoRango.toUpperCase(),
              style: const TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w900,
                  color: AppColors.primaryGreen),
            ),
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                  color: AppColors.primaryGreen.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10)),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.add_circle,
                      color: AppColors.primaryGreen, size: 20),
                  const SizedBox(width: 8),
                  Text("Ganaste +$puntos BV",
                      style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          color: AppColors.primaryGreen)),
                ],
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryGreen,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30)),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 40, vertical: 12)),
              onPressed: () {
                Navigator.pop(ctx);
              },
              child:
                  const Text("¡GENIAL!", style: TextStyle(color: Colors.white)),
            )
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(
        title: const Text('Método de Pago'),
        backgroundColor: AppColors.primaryGreen,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: Consumer<CarritoProvider>(
        builder: (context, provider, _) {
          return Column(
            children: [
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.all(20),
                  children: [
                    _buildInfoCard(
                      icon: Icons.shopping_bag_outlined,
                      title: 'Resumen',
                      content:
                          '${provider.cantidadTotal} productos • \$${provider.total.toStringAsFixed(2)}',
                    ),
                    const SizedBox(height: 16),
                    if (provider.direccionSeleccionada != null)
                      _buildInfoCard(
                        icon: Icons.location_on_outlined,
                        title: 'Enviando a',
                        content: provider.direccionSeleccionada!.direccion,
                      ),
                    const SizedBox(height: 24),
                    const Text('Selecciona método de pago:',
                        style: TextStyle(
                            fontWeight: FontWeight.bold, fontSize: 16)),
                    const SizedBox(height: 12),
                    ...provider.mediosPago.map((medio) {
                      final isSelected =
                          provider.medioPagoSeleccionado?.id == medio.id;
                      return Card(
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                          side: BorderSide(
                            color: isSelected
                                ? AppColors.primaryGreen
                                : Colors.grey.shade300,
                            width: isSelected ? 2 : 1,
                          ),
                        ),
                        child: RadioListTile<int>(
                          value: medio.id,
                          groupValue: provider.medioPagoSeleccionado?.id,
                          onChanged: (_) =>
                              provider.seleccionarMedioPago(medio),
                          activeColor: AppColors.primaryGreen,
                          title: Text(medio.nombre,
                              style:
                                  const TextStyle(fontWeight: FontWeight.w600)),
                          secondary: Icon(Icons.payment,
                              color: isSelected
                                  ? AppColors.primaryGreen
                                  : Colors.grey),
                        ),
                      );
                    }).toList(),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                        color: Colors.black.withOpacity(0.05),
                        blurRadius: 10,
                        offset: const Offset(0, -5))
                  ],
                  borderRadius:
                      const BorderRadius.vertical(top: Radius.circular(24)),
                ),
                child: SafeArea(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Total a Pagar:',
                              style:
                                  TextStyle(fontSize: 16, color: Colors.grey)),
                          Text('\$${provider.total.toStringAsFixed(2)}',
                              style: const TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.primaryGreen)),
                        ],
                      ),
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: (provider.medioPagoSeleccionado != null &&
                                  !_loading)
                              ? _procesarPago
                              : null,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primaryGreen,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12)),
                          ),
                          child: _loading
                              ? const SizedBox(
                                  height: 20,
                                  width: 20,
                                  child: CircularProgressIndicator(
                                      color: Colors.white, strokeWidth: 2))
                              : const Text('Confirmar Pago',
                                  style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white)),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildInfoCard(
      {required IconData icon,
      required String title,
      required String content}) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Row(
        children: [
          Icon(icon, color: AppColors.primaryGreen),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title,
                  style: const TextStyle(fontSize: 12, color: Colors.grey)),
              Text(content,
                  style: const TextStyle(
                      fontWeight: FontWeight.w600, fontSize: 14)),
            ],
          ),
        ],
      ),
    );
  }
}
