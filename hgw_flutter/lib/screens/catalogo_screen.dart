import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:shimmer/shimmer.dart';
import '../providers/productos_provider.dart';
import '../providers/carrito/carrito_provider.dart';
import '../widgets/producto_card.dart';
import '../utils/constants.dart';
import 'producto_detalle_screen.dart';
import 'carrito/carrito_screen.dart';

class CatalogoScreen extends StatefulWidget {
  const CatalogoScreen({Key? key}) : super(key: key);

  @override
  State<CatalogoScreen> createState() => _CatalogoScreenState();
}

class _CatalogoScreenState extends State<CatalogoScreen>
    with TickerProviderStateMixin {
  late AnimationController _fadeController;
  final ScrollController _scrollController = ScrollController();
  final TextEditingController _searchController = TextEditingController();
  bool _showBackToTop = false;

  @override
  void initState() {
    super.initState();
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    )..forward();

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
    _searchController.dispose(); // Limpieza del controller
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
              // Espacio para el status bar
              const SliverToBoxAdapter(child: SizedBox(height: 50)),

              // Título opcional
              SliverToBoxAdapter(
                child: Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
                  child: Text(
                    "Catálogo",
                    style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textDark),
                  ),
                ),
              ),

              // 2. Aquí insertamos la Barra de Búsqueda
              SliverToBoxAdapter(
                child: _buildSearchBar(),
              ),

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
                            () {
                              provider.limpiarFiltros();
                              _searchController
                                  .clear();
                            },
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
              Consumer<ProductosProvider>(
                builder: (context, provider, child) {
                  if (provider.isLoading) {
                    return _buildLoadingGrid();
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
                    sliver: SliverGrid(
                      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        childAspectRatio:
                            MediaQuery.of(context).size.width < 375
                                ? 0.70
                                : 0.75,
                        crossAxisSpacing:
                            MediaQuery.of(context).size.width < 375 ? 8 : 12,
                        mainAxisSpacing:
                            MediaQuery.of(context).size.width < 375 ? 12 : 16,
                      ),
                      delegate: SliverChildBuilderDelegate(
                        (context, index) {
                          final producto = provider.productos[index];
                          return ProductoCard(
                            producto: producto,
                            onTap: () {
                              Navigator.push(
                                context,
                                PageRouteBuilder(
                                  pageBuilder: (context, animation,
                                          secondaryAnimation) =>
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
                            onAddToCart: () async {
                              final carritoProvider =
                                  context.read<CarritoProvider>();
                              final success =
                                  await carritoProvider.agregarProducto(
                                producto.idProducto,
                                1,
                              );

                              if (success && mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Row(
                                      children: [
                                        const Icon(
                                          Icons.check_circle,
                                          color: Colors.white,
                                        ),
                                        const SizedBox(width: 12),
                                        Expanded(
                                          child: Text(
                                            '${producto.nombre} agregado al carrito',
                                            style: const TextStyle(
                                                color: Colors.white),
                                          ),
                                        ),
                                      ],
                                    ),
                                    backgroundColor: AppColors.successColor,
                                    behavior: SnackBarBehavior.floating,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    action: SnackBarAction(
                                      label: 'Ver Carrito',
                                      textColor: Colors.white,
                                      onPressed: () {
                                        Navigator.push(
                                          context,
                                          PageRouteBuilder(
                                            pageBuilder: (context, animation,
                                                    secondaryAnimation) =>
                                                const CarritoScreen(),
                                            transitionsBuilder: (context,
                                                animation,
                                                secondaryAnimation,
                                                child) {
                                              return FadeTransition(
                                                opacity: animation,
                                                child: child,
                                              );
                                            },
                                          ),
                                        );
                                      },
                                    ),
                                  ),
                                );
                              }
                            },
                          );
                        },
                        childCount: provider.productos.length,
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
          if (_showBackToTop)
            Positioned(
              bottom: 24,
              right: 24,
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
          Positioned(
            bottom: 24,
            left: 24,
            child: Consumer<CarritoProvider>(
              builder: (context, carrito, _) {
                if (carrito.cantidadTotal == 0) return const SizedBox();

                return FloatingActionButton.extended(
                  backgroundColor: AppColors.primaryGreen,
                  onPressed: () {
                    Navigator.push(
                      context,
                      PageRouteBuilder(
                        pageBuilder: (context, animation, secondaryAnimation) =>
                            const CarritoScreen(),
                        transitionsBuilder:
                            (context, animation, secondaryAnimation, child) {
                          return FadeTransition(
                            opacity: animation,
                            child: child,
                          );
                        },
                      ),
                    );
                  },
                  icon: const Icon(Icons.shopping_cart, color: Colors.white),
                  label: Text(
                    '${carrito.cantidadTotal} items | \$${carrito.total.toStringAsFixed(2)}',
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
  Widget _buildSearchBar() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 0, 24, 20),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(15),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: TextField(
          controller: _searchController,
          onChanged: (value) {
            // Llamamos al método nuevo del Provider
            context.read<ProductosProvider>().onSearchChanged(value);
          },
          decoration: InputDecoration(
            hintText: 'Buscar productos...',
            hintStyle: TextStyle(color: AppColors.textMedium.withOpacity(0.5)),
            prefixIcon: Icon(Icons.search, color: AppColors.primaryGreen),
            // Icono para borrar el texto
            suffixIcon: _searchController.text.isNotEmpty
                ? IconButton(
                    icon: Icon(Icons.clear, color: AppColors.textMedium),
                    onPressed: () {
                      _searchController.clear();
                      context.read<ProductosProvider>().onSearchChanged('');
                      setState(() {}); // Actualizamos para ocultar la X
                    },
                  )
                : null,
            border: InputBorder.none,
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
          ),
        ),
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

  Widget _buildLoadingGrid() {
    return SliverPadding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      sliver: SliverGrid(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.75,
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
            Text('Error de conexión', style: AppStyles.heading2),
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
                Icons.search_off, // Icono cambiado para reflejar búsqueda vacía
                size: 64,
                color: AppColors.primaryGreen,
              ),
            ),
            const SizedBox(height: 24),
            Text('Sin resultados', style: AppStyles.heading2),
            const SizedBox(height: 8),
            Text(
              'No encontramos productos con ese nombre o categoría.',
              style: AppStyles.body,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            TextButton.icon(
              onPressed: () {
                provider.limpiarFiltros();
                _searchController.clear();
              },
              icon: const Icon(Icons.clear),
              label: const Text('Limpiar filtros y búsqueda'),
            ),
          ],
        ),
      ),
    );
  }
}
