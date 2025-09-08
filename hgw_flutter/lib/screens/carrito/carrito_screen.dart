import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/carrito/carrito_provider.dart';
import '../../widgets/carrito/carrito_item_widget.dart';
import '../../utils/constants.dart';
import 'direcciones_screen.dart';

class CarritoScreen extends StatefulWidget {
  final VoidCallback? onNavigateToCatalog;

  const CarritoScreen({Key? key, this.onNavigateToCatalog}) : super(key: key);

  @override
  State<CarritoScreen> createState() => _CarritoScreenState();
}

class _CarritoScreenState extends State<CarritoScreen>
    with TickerProviderStateMixin {
  late AnimationController _fadeController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );
    _fadeAnimation = CurvedAnimation(
      parent: _fadeController,
      curve: Curves.easeIn,
    );
    _fadeController.forward();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CarritoProvider>().cargarCarrito();
    });
  }

  @override
  void dispose() {
    _fadeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final isSmallScreen = size.width < 600;

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      body: FadeTransition(
        opacity: _fadeAnimation,
        child: Stack(
          children: [
            CustomScrollView(
              slivers: [
                SliverAppBar(
                  backgroundColor: Colors.transparent,
                  elevation: 0,
                  floating: true,
                  snap: true,
                  expandedHeight: 80,
                  flexibleSpace: Container(
                    padding: const EdgeInsets.only(top: 40, left: 24, right: 24),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: const [SizedBox()],
                    ),
                  ),
                ),
                Consumer<CarritoProvider>(
                  builder: (context, provider, _) {
                    if (provider.mensaje != null) {
                      WidgetsBinding.instance.addPostFrameCallback((_) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Row(
                              children: [
                                const Icon(Icons.warning, color: Colors.white),
                                const SizedBox(width: 12),
                                Text(provider.mensaje!),
                              ],
                            ),
                            backgroundColor: AppColors.warningColor,
                            behavior: SnackBarBehavior.floating,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                        );
                        provider.limpiarMensaje();
                      });
                    }

                    if (provider.isLoading) {
                      return SliverFillRemaining(
                        child: Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              CircularProgressIndicator(
                                color: AppColors.primaryGreen,
                                strokeWidth: 2,
                              ),
                              const SizedBox(height: 16),
                              Text('Cargando carrito...', style: AppStyles.caption),
                            ],
                          ),
                        ),
                      );
                    }

                    if (provider.items.isEmpty) {
                      return SliverFillRemaining(
                        child: Center(
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
                                    Icons.shopping_cart_outlined,
                                    size: 80,
                                    color: AppColors.primaryGreen,
                                  ),
                                ),
                                const SizedBox(height: 24),
                                Text('Tu carrito está vacío', style: AppStyles.heading2),
                                const SizedBox(height: 12),
                                Text(
                                  'Agrega productos para continuar',
                                  style: AppStyles.body.copyWith(
                                    color: AppColors.textMedium,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                                const SizedBox(height: 32),
                                Container(
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
                                      onTap: widget.onNavigateToCatalog ?? () => Navigator.pop(context),
                                      child: Padding(
                                        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                                        child: Row(
                                          mainAxisSize: MainAxisSize.min,
                                          children: const [
                                            Icon(Icons.store, color: Colors.white),
                                            SizedBox(width: 12),
                                            Text(
                                              'Ir al Catálogo',
                                              style: TextStyle(
                                                color: Colors.white,
                                                fontSize: 16,
                                                fontWeight: FontWeight.bold,
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
                      );
                    }

                    return SliverPadding(
                      padding: EdgeInsets.fromLTRB(
                        isSmallScreen ? 12 : 20,
                        12,
                        isSmallScreen ? 12 : 20,
                        120,
                      ),
                      sliver: SliverList(
                        delegate: SliverChildBuilderDelegate(
                          (context, index) {
                            final item = provider.items[index];
                            return AnimatedContainer(
                              duration: const Duration(milliseconds: 300),
                              margin: const EdgeInsets.only(bottom: 12),
                              child: CarritoItemWidget(
                                item: item,
                                onUpdateQuantity: (cantidad) {
                                  provider.actualizarCantidad(item.idProducto, cantidad);
                                },
                                onDelete: () {
                                  provider.eliminarProducto(item.idProducto);
                                },
                              ),
                            );
                          },
                          childCount: provider.items.length,
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
            Consumer<CarritoProvider>(
              builder: (context, provider, _) {
                if (provider.items.isEmpty) return const SizedBox();

                return Positioned(
                  bottom: 0,
                  left: 0,
                  right: 0,
                  child: Container(
                    padding: EdgeInsets.all(isSmallScreen ? 16 : 24),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceWhite,
                      borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
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
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Subtotal',
                                    style: AppStyles.caption.copyWith(color: AppColors.textMedium),
                                  ),
                                  const SizedBox(height: 4),
                                  Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                        decoration: BoxDecoration(
                                          color: AppColors.primaryGreen.withOpacity(0.1),
                                          borderRadius: BorderRadius.circular(12),
                                        ),
                                        child: Text(
                                          '${provider.cantidadTotal} productos',
                                          style: TextStyle(
                                            fontSize: isSmallScreen ? 12 : 13,
                                            color: AppColors.primaryGreen,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                              Text(
                                '\$${provider.total.toStringAsFixed(2)}',
                                style: AppStyles.price.copyWith(fontSize: isSmallScreen ? 26 : 30),
                              ),
                            ],
                          ),
                          const SizedBox(height: 20),
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
                                  Navigator.push(
                                    context,
                                    PageRouteBuilder(
                                      pageBuilder: (context, animation, secondaryAnimation) =>
                                          const DireccionesScreen(),
                                      transitionsBuilder: (context, animation, secondaryAnimation, child) {
                                        return FadeTransition(opacity: animation, child: child);
                                      },
                                    ),
                                  );
                                },
                                child: Padding(
                                  padding: EdgeInsets.symmetric(vertical: isSmallScreen ? 16 : 18),
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      const Icon(Icons.local_shipping, color: Colors.white),
                                      const SizedBox(width: 12),
                                      Text(
                                        'Continuar con el envío',
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
                            onPressed: widget.onNavigateToCatalog ?? () => Navigator.pop(context),
                            icon: Icon(Icons.arrow_back, size: 18, color: AppColors.primaryGreen),
                            label: Text(
                              'Seguir comprando',
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
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
