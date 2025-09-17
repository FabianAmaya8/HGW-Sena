import 'package:flutter/material.dart';
import '../../utils/constants.dart';

class ConfirmacionScreen extends StatelessWidget {
  final int idOrden;

  const ConfirmacionScreen({Key? key, required this.idOrden}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isSmallScreen = MediaQuery.of(context).size.width < 600;

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: EdgeInsets.all(isSmallScreen ? 24 : 32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: const EdgeInsets.all(32),
                  decoration: BoxDecoration(
                    gradient: AppColors.primaryGradient,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.primaryGreen.withOpacity(0.3),
                        blurRadius: 20,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  child: Icon(
                    Icons.check,
                    size: isSmallScreen ? 60 : 80,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 32),
                Text(
                  '¡Compra Finalizada!',
                  style: AppStyles.heading2.copyWith(
                    fontSize: isSmallScreen ? 28 : 32,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 12,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.primaryGreen.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    'Orden #$idOrden',
                    style: TextStyle(
                      fontSize: isSmallScreen ? 18 : 20,
                      color: AppColors.primaryGreen,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  'Tu pedido ha sido procesado exitosamente',
                  textAlign: TextAlign.center,
                  style: AppStyles.body.copyWith(
                    color: AppColors.textMedium,
                    fontSize: isSmallScreen ? 14 : 16,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Recibirás un correo con los detalles de tu compra',
                  textAlign: TextAlign.center,
                  style: AppStyles.caption.copyWith(
                    color: AppColors.textMedium,
                    fontSize: isSmallScreen ? 13 : 14,
                  ),
                ),
                const SizedBox(height: 40),
                Container(
                  width: double.infinity,
                  decoration: BoxDecoration(
                    gradient: AppColors.primaryGradient,
                    borderRadius: BorderRadius.circular(15),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.primaryGreen.withOpacity(0.3),
                        blurRadius: 20,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      borderRadius: BorderRadius.circular(15),
                      onTap: () {
                        Navigator.popUntil(context, (route) => route.isFirst);
                      },
                      child: Padding(
                        padding: EdgeInsets.symmetric(
                          vertical: isSmallScreen ? 16 : 18,
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.store, color: Colors.white),
                            const SizedBox(width: 12),
                            Text(
                              'Volver al Catálogo',
                              style: TextStyle(
                                fontSize: isSmallScreen ? 15 : 17,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                TextButton.icon(
                  onPressed: () {
                    // Funcionalidad para ver detalles del pedido
                  },
                  icon: Icon(Icons.receipt_long,
                      size: 18, color: AppColors.primaryGreen),
                  label: Text(
                    'Ver detalles del pedido',
                    style: TextStyle(
                      color: AppColors.primaryGreen,
                      fontWeight: FontWeight.w600,
                      fontSize: 14,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
