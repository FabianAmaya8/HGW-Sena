import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/producto_detalle.dart';
import '../services/api_service.dart';
import '../utils/constants.dart';

class ProductoDetalleScreen extends StatefulWidget {
  final int productoId;

  const ProductoDetalleScreen({
    Key? key,
    required this.productoId,
  }) : super(key: key);

  @override
  State<ProductoDetalleScreen> createState() => _ProductoDetalleScreenState();
}

class _ProductoDetalleScreenState extends State<ProductoDetalleScreen>
    with TickerProviderStateMixin {
  final ApiService _apiService = ApiService();
  ProductoDetalle? _producto;
  bool _isLoading = true;
  String? _error;
  int _selectedImageIndex = 0;
  int _cantidad = 1;
  bool _isFavorite = false;

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
    _cargarProducto();
  }

  @override
  void dispose() {
    _fadeController.dispose();
    super.dispose();
  }

  Future<void> _cargarProducto() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final producto =
          await _apiService.obtenerProductoDetalle(widget.productoId);
      setState(() {
        _producto = producto;
        _isLoading = false;
      });
      _fadeController.forward();
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      body: _isLoading
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(
                    color: AppColors.primaryGreen,
                    strokeWidth: 2,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Cargando producto...',
                    style: AppStyles.caption,
                  ),
                ],
              ),
            )
          : _error != null
              ? _buildErrorState()
              : _producto == null
                  ? const Center(
                      child: Text('Producto no encontrado'),
                    )
                  : FadeTransition(
                      opacity: _fadeAnimation,
                      child: Stack(
                        children: [
                          CustomScrollView(
                            slivers: [
                              // Galería de imágenes
                              SliverToBoxAdapter(
                                child: Container(
                                  height: 400,
                                  decoration: const BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.only(
                                      bottomLeft: Radius.circular(30),
                                      bottomRight: Radius.circular(30),
                                    ),
                                  ),
                                  child: Stack(
                                    children: [
                                      _buildImageGallery(),
                                      Positioned(
                                        top: 50,
                                        left: 20,
                                        child: _buildBackButton(),
                                      ),
                                      Positioned(
                                        top: 50,
                                        right: 20,
                                        child: _buildFavoriteButton(),
                                      ),
                                    ],
                                  ),
                                ),
                              ),

                              // Contenido
                              SliverToBoxAdapter(
                                child: Padding(
                                  padding: const EdgeInsets.all(24),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      // Tags de categoría
                                      Row(
                                        children: [
                                          _buildTag(_producto!.categoria,
                                              AppColors.primaryGreen),
                                          const SizedBox(width: 8),
                                          _buildTag(_producto!.subcategoria,
                                              AppColors.accentGreen),
                                        ],
                                      ),
                                      const SizedBox(height: 16),

                                      // Nombre y precio
                                      Text(
                                        _producto!.nombre,
                                        style: AppStyles.heading1
                                            .copyWith(fontSize: 28),
                                      ),
                                      const SizedBox(height: 12),
                                      Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceBetween,
                                        children: [
                                          Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              Text('Precio',
                                                  style: AppStyles.caption),
                                              Text(
                                                '\$${_producto!.precio.toStringAsFixed(2)}',
                                                style: AppStyles.price
                                                    .copyWith(fontSize: 32),
                                              ),
                                            ],
                                          ),
                                          _buildStockIndicator(),
                                        ],
                                      ),
                                      const SizedBox(height: 24),

                                      // Descripción
                                      if (_producto!.descripcion != null) ...[
                                        Text(
                                          'Descripción',
                                          style: AppStyles.heading2,
                                        ),
                                        const SizedBox(height: 12),
                                        Text(
                                          _producto!.descripcion!,
                                          style: AppStyles.body,
                                        ),
                                        const SizedBox(height: 32),
                                      ],

                                      // Selector de cantidad
                                      _buildQuantitySelector(),
                                      const SizedBox(height: 100),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),

                          // Botón flotante de compra
                          Positioned(
                            bottom: 24,
                            left: 24,
                            right: 24,
                            child: _buildPurchaseButton(),
                          ),
                        ],
                      ),
                    ),
    );
  }

  Widget _buildBackButton() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.9),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
          ),
        ],
      ),
      child: IconButton(
        icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.textDark),
        onPressed: () => Navigator.pop(context),
      ),
    );
  }

  Widget _buildFavoriteButton() {
    return GestureDetector(
      onTap: () {
        setState(() {
          _isFavorite = !_isFavorite;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        decoration: BoxDecoration(
          color: _isFavorite
              ? AppColors.errorColor
              : Colors.white.withOpacity(0.9),
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 10,
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Icon(
            _isFavorite ? Icons.favorite : Icons.favorite_border,
            color: _isFavorite ? Colors.white : AppColors.textDark,
          ),
        ),
      ),
    );
  }

  Widget _buildImageGallery() {
    final imagesToShow = <String>[];
    if (_producto!.imagen != null) {
      imagesToShow.add(_producto!.imagen!);
    }
    imagesToShow.addAll(_producto!.imagenes);

    if (imagesToShow.isEmpty) {
      return Center(
        child: Icon(
          Icons.shopping_bag_outlined,
          size: 100,
          color: AppColors.textLight.withOpacity(0.3),
        ),
      );
    }

    return Column(
      children: [
        Expanded(
          child: PageView.builder(
            onPageChanged: (index) {
              setState(() {
                _selectedImageIndex = index;
              });
            },
            itemCount: imagesToShow.length,
            itemBuilder: (context, index) {
              return Padding(
                padding: const EdgeInsets.all(40),
                child: CachedNetworkImage(
                  imageUrl: imagesToShow[index],
                  fit: BoxFit.contain,
                  placeholder: (context, url) => Center(
                    child: CircularProgressIndicator(
                      color: AppColors.primaryGreen.withOpacity(0.3),
                      strokeWidth: 2,
                    ),
                  ),
                  errorWidget: (context, url, error) => Icon(
                    Icons.broken_image_outlined,
                    size: 100,
                    color: AppColors.textLight.withOpacity(0.3),
                  ),
                ),
              );
            },
          ),
        ),
        if (imagesToShow.length > 1)
          Container(
            padding: const EdgeInsets.only(bottom: 20),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                imagesToShow.length,
                (index) => AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  width: _selectedImageIndex == index ? 24 : 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: _selectedImageIndex == index
                        ? AppColors.primaryGreen
                        : AppColors.borderColor,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildTag(String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: color,
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  Widget _buildStockIndicator() {
    final bool inStock = _producto!.stock > 0;
    final bool lowStock = _producto!.stock <= 5;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: inStock
              ? lowStock
                  ? [
                      AppColors.warningColor.withOpacity(0.8),
                      AppColors.warningColor
                    ]
                  : [
                      AppColors.successColor.withOpacity(0.8),
                      AppColors.successColor
                    ]
              : [AppColors.errorColor.withOpacity(0.8), AppColors.errorColor],
        ),
        borderRadius: BorderRadius.circular(25),
        boxShadow: [
          BoxShadow(
            color: (inStock ? AppColors.successColor : AppColors.errorColor)
                .withOpacity(0.3),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Icon(
            inStock ? Icons.check_circle : Icons.cancel,
            color: Colors.white,
            size: 18,
          ),
          const SizedBox(width: 8),
          Text(
            inStock
                ? lowStock
                    ? 'Últimas ${_producto!.stock} unidades'
                    : '${_producto!.stock} disponibles'
                : 'Agotado',
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuantitySelector() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.borderColor),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            'Cantidad',
            style: AppStyles.heading3,
          ),
          Container(
            decoration: BoxDecoration(
              color: AppColors.backgroundLight,
              borderRadius: BorderRadius.circular(15),
            ),
            child: Row(
              children: [
                IconButton(
                  onPressed: _cantidad > 1
                      ? () {
                          setState(() {
                            _cantidad--;
                          });
                        }
                      : null,
                  icon: Icon(
                    Icons.remove,
                    color: _cantidad > 1
                        ? AppColors.primaryGreen
                        : AppColors.borderColor,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Text(
                    _cantidad.toString(),
                    style: AppStyles.heading2,
                  ),
                ),
                IconButton(
                  onPressed: _cantidad < _producto!.stock
                      ? () {
                          setState(() {
                            _cantidad++;
                          });
                        }
                      : null,
                  icon: Icon(
                    Icons.add,
                    color: _cantidad < _producto!.stock
                        ? AppColors.primaryGreen
                        : AppColors.borderColor,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPurchaseButton() {
    return Container(
      decoration: BoxDecoration(
        gradient: AppColors.primaryGradient,
        borderRadius: BorderRadius.circular(20),
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
          borderRadius: BorderRadius.circular(20),
          onTap: _producto!.stock > 0
              ? () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        'Se agregó $_cantidad ${_producto!.nombre} al carrito',
                      ),
                      backgroundColor: AppColors.successColor,
                      behavior: SnackBarBehavior.floating,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  );
                }
              : null,
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 18),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(
                  Icons.shopping_cart_checkout,
                  color: Colors.white,
                ),
                const SizedBox(width: 12),
                Text(
                  'Agregar al Carrito - \$${(_producto!.precio * _cantidad).toStringAsFixed(2)}',
                  style: const TextStyle(
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
    );
  }

  Widget _buildErrorState() {
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
                Icons.error_outline,
                size: 48,
                color: AppColors.errorColor,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Error al cargar',
              style: AppStyles.heading2,
            ),
            const SizedBox(height: 8),
            Text(
              _error ?? 'No se pudo cargar el producto',
              style: AppStyles.body,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _cargarProducto,
              icon: const Icon(Icons.refresh),
              label: const Text('Reintentar'),
            ),
          ],
        ),
      ),
    );
  }
}
