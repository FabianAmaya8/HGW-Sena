import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/carrito/carrito_provider.dart';
import '../../utils/constants.dart';
import 'pago_screen.dart';

class DireccionesScreen extends StatefulWidget {
  const DireccionesScreen({Key? key}) : super(key: key);

  @override
  State<DireccionesScreen> createState() => _DireccionesScreenState();
}

class _DireccionesScreenState extends State<DireccionesScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CarritoProvider>().cargarDirecciones();
    });
  }

  @override
  Widget build(BuildContext context) {
    final isSmallScreen = MediaQuery.of(context).size.width < 600;

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(
        title: const Text('Dirección de Envío'),
        backgroundColor: AppColors.primaryGreen,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: Consumer<CarritoProvider>(
        builder: (context, provider, _) {
          if (provider.direcciones.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(32),
                      decoration: BoxDecoration(
                        gradient: AppColors.primaryGradient.scale(0.2),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.location_off,
                        size: 80,
                        color: AppColors.primaryGreen,
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'No hay direcciones registradas',
                      style: AppStyles.heading2,
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'Agrega una dirección para continuar',
                      style: AppStyles.body.copyWith(
                        color: AppColors.textMedium,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            );
          }

          return Column(
            children: [
              Expanded(
                child: ListView.builder(
                  padding: EdgeInsets.all(isSmallScreen ? 12 : 20),
                  itemCount: provider.direcciones.length,
                  itemBuilder: (context, index) {
                    final direccion = provider.direcciones[index];
                    final isSelected =
                        provider.direccionSeleccionada?.id == direccion.id;

                    return Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceWhite,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isSelected
                              ? AppColors.primaryGreen
                              : AppColors.borderColor,
                          width: isSelected ? 2 : 1,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.05),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Material(
                        color: isSelected
                            ? AppColors.primaryGreen.withOpacity(0.05)
                            : Colors.transparent,
                        borderRadius: BorderRadius.circular(12),
                        child: InkWell(
                          onTap: () => provider.seleccionarDireccion(direccion),
                          borderRadius: BorderRadius.circular(12),
                          child: Padding(
                            padding: EdgeInsets.all(isSmallScreen ? 12 : 16),
                            child: Row(
                              children: [
                                Radio<int>(
                                  value: direccion.id,
                                  groupValue:
                                      provider.direccionSeleccionada?.id,
                                  activeColor: AppColors.primaryGreen,
                                  onChanged: (_) =>
                                      provider.seleccionarDireccion(direccion),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          Icon(
                                            Icons.home,
                                            size: 18,
                                            color: AppColors.primaryGreen,
                                          ),
                                          const SizedBox(width: 8),
                                          Text(
                                            direccion.lugarEntrega,
                                            style: AppStyles.body.copyWith(
                                              fontWeight: FontWeight.bold,
                                              fontSize: 16,
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        direccion.direccion,
                                        style: AppStyles.body.copyWith(
                                          fontSize: isSmallScreen ? 13 : 14,
                                        ),
                                      ),
                                      if (direccion.ciudad != null ||
                                          direccion.pais != null) ...[
                                        const SizedBox(height: 4),
                                        Text(
                                          direccion.direccionCompleta,
                                          style: AppStyles.caption.copyWith(
                                            color: AppColors.textMedium,
                                            fontSize: isSmallScreen ? 12 : 13,
                                          ),
                                        ),
                                      ],
                                      const SizedBox(height: 4),
                                      Text(
                                        'CP: ${direccion.codigoPostal}',
                                        style: AppStyles.caption.copyWith(
                                          color: AppColors.textMedium,
                                          fontSize: isSmallScreen ? 12 : 13,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),

              // Resumen y botón
              Container(
                padding: EdgeInsets.all(isSmallScreen ? 16 : 24),
                decoration: BoxDecoration(
                  color: AppColors.surfaceWhite,
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(24),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 20,
                      offset: const Offset(0, -10),
                    ),
                  ],
                ),
                child: SafeArea(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 40,
                        height: 4,
                        margin: const EdgeInsets.only(bottom: 16),
                        decoration: BoxDecoration(
                          color: AppColors.borderColor,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Total del pedido:',
                            style: AppStyles.body.copyWith(
                              fontSize: isSmallScreen ? 14 : 16,
                              color: AppColors.textMedium,
                            ),
                          ),
                          Text(
                            '\$${provider.total.toStringAsFixed(2)}',
                            style: AppStyles.price.copyWith(
                              fontSize: isSmallScreen ? 20 : 24,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      Container(
                        width: double.infinity,
                        decoration: BoxDecoration(
                          gradient: provider.direccionSeleccionada != null
                              ? AppColors.primaryGradient
                              : LinearGradient(
                                  colors: [
                                    AppColors.borderColor,
                                    AppColors.borderColor,
                                  ],
                                ),
                          borderRadius: BorderRadius.circular(15),
                          boxShadow: provider.direccionSeleccionada != null
                              ? [
                                  BoxShadow(
                                    color:
                                        AppColors.primaryGreen.withOpacity(0.3),
                                    blurRadius: 20,
                                    offset: const Offset(0, 10),
                                  ),
                                ]
                              : null,
                        ),
                        child: Material(
                          color: Colors.transparent,
                          child: InkWell(
                            borderRadius: BorderRadius.circular(15),
                            onTap: provider.direccionSeleccionada != null
                                ? () {
                                    Navigator.push(
                                      context,
                                      PageRouteBuilder(
                                        pageBuilder: (context, animation,
                                                secondaryAnimation) =>
                                            const PagoScreen(),
                                        transitionsBuilder: (context, animation,
                                            secondaryAnimation, child) {
                                          return FadeTransition(
                                              opacity: animation, child: child);
                                        },
                                      ),
                                    );
                                  }
                                : null,
                            child: Padding(
                              padding: EdgeInsets.symmetric(
                                vertical: isSmallScreen ? 14 : 16,
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    Icons.payment,
                                    color:
                                        provider.direccionSeleccionada != null
                                            ? Colors.white
                                            : AppColors.textMedium,
                                  ),
                                  const SizedBox(width: 12),
                                  Text(
                                    'Continuar al pago',
                                    style: TextStyle(
                                      fontSize: isSmallScreen ? 14 : 16,
                                      fontWeight: FontWeight.bold,
                                      color:
                                          provider.direccionSeleccionada != null
                                              ? Colors.white
                                              : AppColors.textMedium,
                                    ),
                                  ),
                                ],
                              ),
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
}
