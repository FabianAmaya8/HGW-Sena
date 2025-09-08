import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/carrito/carrito_provider.dart';
import 'confirmacion_screen.dart';

class PagoScreen extends StatefulWidget {
  const PagoScreen({Key? key}) : super(key: key);

  @override
  State<PagoScreen> createState() => _PagoScreenState();
}

class _PagoScreenState extends State<PagoScreen> {
  final Color primaryGreen = Colors.green.shade600;
  bool _isProcessing = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CarritoProvider>().cargarMediosPago();
    });
  }

  @override
  Widget build(BuildContext context) {
    final isSmallScreen = MediaQuery.of(context).size.width < 600;

    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: const Text('Método de Pago'),
        backgroundColor: primaryGreen,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: Consumer<CarritoProvider>(
        builder: (context, provider, _) {
          return Column(
            children: [
              Expanded(
                child: SingleChildScrollView(
                  padding: EdgeInsets.all(isSmallScreen ? 12 : 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Resumen del pedido
                      Card(
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Padding(
                          padding: EdgeInsets.all(isSmallScreen ? 12 : 16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Icon(
                                    Icons.receipt_long,
                                    color: primaryGreen,
                                    size: 20,
                                  ),
                                  const SizedBox(width: 8),
                                  const Text(
                                    'Resumen del Pedido',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                              const Divider(height: 24),
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    '${provider.cantidadTotal} productos',
                                    style: TextStyle(
                                      fontSize: isSmallScreen ? 13 : 14,
                                      color: Colors.grey[600],
                                    ),
                                  ),
                                  Text(
                                    '\$${provider.total.toStringAsFixed(2)}',
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              Row(
                                children: [
                                  Icon(
                                    Icons.local_shipping,
                                    size: 16,
                                    color: Colors.grey[600],
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          'Enviar a:',
                                          style: TextStyle(
                                            fontSize: 12,
                                            color: Colors.grey[600],
                                          ),
                                        ),
                                        Text(
                                          provider.direccionSeleccionada
                                                  ?.lugarEntrega ??
                                              '',
                                          style: const TextStyle(
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                        Text(
                                          provider.direccionSeleccionada
                                                  ?.direccion ??
                                              '',
                                          style: TextStyle(
                                            fontSize: isSmallScreen ? 12 : 13,
                                            color: Colors.grey[600],
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Métodos de pago
                      const Text(
                        'Selecciona método de pago:',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),

                      ...provider.mediosPago.map((medio) {
                        final isSelected =
                            provider.medioPagoSeleccionado?.id == medio.id;

                        return Card(
                          margin: const EdgeInsets.only(bottom: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                            side: BorderSide(
                              color:
                                  isSelected ? primaryGreen : Colors.grey[300]!,
                              width: isSelected ? 2 : 1,
                            ),
                          ),
                          color: isSelected
                              ? primaryGreen.withOpacity(0.05)
                              : null,
                          child: InkWell(
                            onTap: () => provider.seleccionarMedioPago(medio),
                            borderRadius: BorderRadius.circular(12),
                            child: Padding(
                              padding: EdgeInsets.all(isSmallScreen ? 12 : 16),
                              child: Row(
                                children: [
                                  Radio<int>(
                                    value: medio.id,
                                    groupValue:
                                        provider.medioPagoSeleccionado?.id,
                                    activeColor: primaryGreen,
                                    onChanged: (_) =>
                                        provider.seleccionarMedioPago(medio),
                                  ),
                                  const SizedBox(width: 12),
                                  Icon(
                                    _getPaymentIcon(medio.nombre),
                                    color: isSelected
                                        ? primaryGreen
                                        : Colors.grey[600],
                                  ),
                                  const SizedBox(width: 12),
                                  Text(
                                    medio.nombre,
                                    style: TextStyle(
                                      fontSize: isSmallScreen ? 14 : 16,
                                      fontWeight: isSelected
                                          ? FontWeight.bold
                                          : FontWeight.normal,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ],
                  ),
                ),
              ),

              // Total y botón confirmar
              Container(
                padding: EdgeInsets.all(isSmallScreen ? 16 : 24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(24),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 10,
                      offset: const Offset(0, -5),
                    ),
                  ],
                ),
                child: SafeArea(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Total a pagar:',
                                style: TextStyle(
                                  fontSize: isSmallScreen ? 14 : 16,
                                  color: Colors.grey[600],
                                ),
                              ),
                              if (provider.medioPagoSeleccionado != null)
                                Text(
                                  provider.medioPagoSeleccionado!.nombre,
                                  style: TextStyle(
                                    fontSize: isSmallScreen ? 12 : 13,
                                    color: primaryGreen,
                                  ),
                                ),
                            ],
                          ),
                          Text(
                            '\$${provider.total.toStringAsFixed(2)}',
                            style: TextStyle(
                              fontSize: isSmallScreen ? 24 : 28,
                              fontWeight: FontWeight.bold,
                              color: primaryGreen,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: provider.medioPagoSeleccionado != null &&
                                  !_isProcessing
                              ? () async {
                                  setState(() => _isProcessing = true);

                                  final idOrden = await provider.crearOrden();

                                  if (idOrden != null && mounted) {
                                    Navigator.pushAndRemoveUntil(
                                      context,
                                      MaterialPageRoute(
                                        builder: (_) => ConfirmacionScreen(
                                            idOrden: idOrden),
                                      ),
                                      (route) => route.isFirst,
                                    );
                                  } else if (mounted) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content:
                                            Text('Error al procesar el pedido'),
                                        backgroundColor: Colors.red,
                                      ),
                                    );
                                    setState(() => _isProcessing = false);
                                  }
                                }
                              : null,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: primaryGreen,
                            padding: EdgeInsets.symmetric(
                              vertical: isSmallScreen ? 14 : 16,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: _isProcessing
                              ? const SizedBox(
                                  height: 20,
                                  width: 20,
                                  child: CircularProgressIndicator(
                                    color: Colors.white,
                                    strokeWidth: 2,
                                  ),
                                )
                              : Text(
                                  'Confirmar Pedido',
                                  style: TextStyle(
                                    fontSize: isSmallScreen ? 14 : 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
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

  IconData _getPaymentIcon(String nombre) {
    if (nombre.toLowerCase().contains('tarjeta') ||
        nombre.toLowerCase().contains('crédito') ||
        nombre.toLowerCase().contains('débito')) {
      return Icons.credit_card;
    } else if (nombre.toLowerCase().contains('efectivo')) {
      return Icons.payments;
    } else if (nombre.toLowerCase().contains('paypal')) {
      return Icons.account_balance_wallet;
    } else {
      return Icons.payment;
    }
  }
}
