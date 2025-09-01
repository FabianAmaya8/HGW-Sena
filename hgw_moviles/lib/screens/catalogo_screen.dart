import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import 'package:shimmer/shimmer.dart';
import '../providers/productos_provider.dart';
import '../widgets/producto_card.dart';
import '../utils/constants.dart';
import 'producto_detalle_screen.dart';

class CatalogoScreen extends StatefulWidget {
  const CatalogoScreen({Key? key}) : super(key: key);

  @override
  State<CatalogoScreen> createState() => _CatalogoScreenState();
}

class _CatalogoScreenState extends State<CatalogoScreen>
    with TickerProviderStateMixin {
  late AnimationController _fadeController;
  late Animation<double> _fadeAnimation;
  final ScrollController _scrollController = ScrollController();
  bool _showBackToTop = false;

  @override
  void initState() {
    super.initState();
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );
    _fadeAnimation = CurvedAnimation(
      parent: _fadeController,
      curve: Curves.easeIn,
    );
    _fadeController.forward();

    _scrollController.addListener(() {
      setState(() {
        _showBackToTop = _scrollController.offset > 200;
      });
    });

    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ProductosProvider>().cargarProductos();
    });
  }

  @override
  void dispose() {
    _fadeController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(
      const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
      ),
    );

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      body: Stack(
        children: [
          CustomScrollView(
            controller: _scrollController,
            slivers: [
              // Header moderno
              SliverToBoxAdapter(
                child: FadeTransition(
                  opacity: _fadeAnimation,
                  child: Container(
                    padding: const EdgeInsets.fromLTRB(24, 60, 24, 24),
                    decoration: BoxDecoration(
                      gradient: AppColors.primaryGradient.scale(0.1),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      gradient: AppColors.primaryGradient,
                                      borderRadius: BorderRadius.circular(16),
                                      boxShadow: [
                                        BoxShadow(
                                          color: AppColors.primaryGreen
                                              .withOpacity(0.3),
                                          blurRadius: 12,
                                          offset: const Offset(0, 6),
                                        ),
                                      ],
                                    ),
                                    child: const Text(
                                      'HGW',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 20,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 16),
                                  Flexible(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          'Catálogo',
                                          style: AppStyles.heading1
                                              .copyWith(fontSize: 24),
                                        ),
                                        Text(
                                          'Productos Premium',
                                          style: AppStyles.caption,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Row(
                              children: [
                                _buildIconButton(
                                  Icons.search,
                                  () {
                                    // Implementar búsqueda
                                  },
                                ),
                                const SizedBox(width: 8),
                                _buildIconButton(
                                  Icons.shopping_cart_outlined,
                                  () {
                                    // Implementar carrito
                                  },
                                ),
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              // Filtros de categorías con diseño moderno
              Consumer<ProductosProvider>(
                builder: (context, provider, child) {
                  if (provider.categoriasUnicas.isEmpty) {
                    return const SliverToBoxAdapter(child: SizedBox.shrink());
                  }

                  return SliverToBoxAdapter(
                    child: Container(
                      height: 50,
                      margin: const EdgeInsets.only(bottom: 16),
                      child: ListView(
                        scrollDirection: Axis.horizontal,
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        children: [
                          _buildCategoryChip(
                            'Todos',
                            provider.selectedCategoria == null,
                            () => provider.limpiarFiltros(),
                            Icons.apps,
                          ),
                          ...provider.categoriasUnicas.map((categoria) {
                            return _buildCategoryChip(
                              categoria,
                              provider.selectedCategoria == categoria,
                              () => provider.seleccionarCategoria(categoria),
                              Icons.category,
                            );
                          }).toList(),
                        ],
                      ),
                    ),
                  );
                },
              ),

              // Grid de productos
              Consumer<ProductosProvider>(
                builder: (context, provider, child) {
                  if (provider.isLoading) {
                    return SliverPadding(
                      padding: const EdgeInsets.symmetric(horizontal: 24),
                      sliver: SliverGrid(
                        gridDelegate:
                            const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          childAspectRatio: 0.65,
                          crossAxisSpacing: 16,
                          mainAxisSpacing: 20,
                        ),
                        delegate: SliverChildBuilderDelegate(
                          (context, index) => _buildShimmerCard(),
                          childCount: 6,
                        ),
                      ),
                    );
                  }

                  if (provider.error != null) {
                    return SliverFillRemaining(
                      child: _buildErrorState(provider),
                    );
                  }

                  if (provider.productos.isEmpty) {
                    return SliverFillRemaining(
                      child: _buildEmptyState(provider),
                    );
                  }

                  return SliverPadding(
                    padding: const EdgeInsets.fromLTRB(24, 0, 24, 100),
                    sliver: SliverMasonryGrid.count(
                      crossAxisCount: 2,
                      crossAxisSpacing: 16,
                      mainAxisSpacing: 20,
                      childCount: provider.productos.length,
                      itemBuilder: (context, index) {
                        final producto = provider.productos[index];
                        return ProductoCard(
                          producto: producto,
                          onTap: () {
                            Navigator.push(
                              context,
                              PageRouteBuilder(
                                pageBuilder:
                                    (context, animation, secondaryAnimation) =>
                                        ProductoDetalleScreen(
                                            productoId: producto.idProducto),
                                transitionsBuilder: (context, animation,
                                    secondaryAnimation, child) {
                                  return FadeTransition(
                                    opacity: animation,
                                    child: child,
                                  );
                                },
                              ),
                            );
                          },
                        );
                      },
                    ),
                  );
                },
              ),
            ],
          ),

          // Botón flotante para volver arriba
          if (_showBackToTop)
            Positioned(
              bottom: 24,
              right: 24,
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                child: FloatingActionButton(
                  mini: true,
                  backgroundColor: AppColors.primaryGreen,
                  onPressed: () {
                    _scrollController.animateTo(
                      0,
                      duration: const Duration(milliseconds: 500),
                      curve: Curves.easeOutCubic,
                    );
                  },
                  child: const Icon(Icons.arrow_upward, color: Colors.white),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildIconButton(IconData icon, VoidCallback onPressed) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surfaceWhite,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.borderColor),
      ),
      child: IconButton(
        icon: Icon(icon, color: AppColors.textMedium),
        onPressed: onPressed,
      ),
    );
  }

  Widget _buildCategoryChip(
      String label, bool isSelected, VoidCallback onTap, IconData icon) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        margin: const EdgeInsets.only(right: 12),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        decoration: BoxDecoration(
          gradient: isSelected ? AppColors.primaryGradient : null,
          color: isSelected ? null : AppColors.surfaceWhite,
          borderRadius: BorderRadius.circular(25),
          border: isSelected ? null : Border.all(color: AppColors.borderColor),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: AppColors.primaryGreen.withOpacity(0.3),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ]
              : [],
        ),
        child: Row(
          children: [
            Icon(
              icon,
              size: 16,
              color: isSelected ? Colors.white : AppColors.textMedium,
            ),
            const SizedBox(width: 8),
            Text(
              label,
              style: TextStyle(
                color: isSelected ? Colors.white : AppColors.textMedium,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildShimmerCard() {
    return Shimmer.fromColors(
      baseColor: Colors.grey[200]!,
      highlightColor: Colors.grey[100]!,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
        ),
      ),
    );
  }

  Widget _buildErrorState(ProductosProvider provider) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AppColors.errorColor.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.wifi_off,
                size: 48,
                color: AppColors.errorColor,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Error de conexión',
              style: AppStyles.heading2,
            ),
            const SizedBox(height: 8),
            Text(
              provider.error ?? 'No se pudo conectar con el servidor',
              style: AppStyles.body,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () => provider.cargarProductos(),
              icon: const Icon(Icons.refresh),
              label: const Text('Reintentar'),
              style: ElevatedButton.styleFrom(
                padding:
                    const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState(ProductosProvider provider) {
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
                Icons.inventory_2_outlined,
                size: 64,
                color: AppColors.primaryGreen,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Sin productos',
              style: AppStyles.heading2,
            ),
            const SizedBox(height: 8),
            Text(
              'No hay productos disponibles en este momento',
              style: AppStyles.body,
              textAlign: TextAlign.center,
            ),
            if (provider.selectedCategoria != null) ...[
              const SizedBox(height: 24),
              TextButton.icon(
                onPressed: () => provider.limpiarFiltros(),
                icon: const Icon(Icons.clear),
                label: const Text('Limpiar filtros'),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
