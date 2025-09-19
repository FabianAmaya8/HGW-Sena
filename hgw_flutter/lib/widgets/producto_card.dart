import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/producto.dart';
import '../utils/constants.dart';

class ProductoCard extends StatefulWidget {
  final Producto producto;
  final VoidCallback onTap;
  final VoidCallback onAddToCart;

  const ProductoCard({
    Key? key,
    required this.producto,
    required this.onTap,
    required this.onAddToCart,
  }) : super(key: key);

  @override
  State<ProductoCard> createState() => _ProductoCardState();
}

class _ProductoCardState extends State<ProductoCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  bool _isAddingToCart = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 0.95,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  
@override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final isSmallScreen = screenWidth < 375; // iPhone SE, Galaxy S8, etc.

    return GestureDetector(
      onTapDown: (_) => _controller.forward(),
      onTapUp: (_) => _controller.reverse(),
      onTapCancel: () => _controller.reverse(),
      onTap: widget.onTap,
      child: AnimatedBuilder(
        animation: _scaleAnimation,
        builder: (context, child) {
          return Transform.scale(
            scale: _scaleAnimation.value,
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primaryGreen.withOpacity(0.1),
                    blurRadius: 20,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: Card(
                clipBehavior: Clip.antiAlias,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      flex: 3,
                      child: Stack(
                        children: [
                          Container(
                            width: double.infinity,
                            decoration: const BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                                colors: [
                                  Color(0xFFF8F9FA),
                                  Color(0xFFFFFFFF),
                                ],
                              ),
                            ),
                            child: _buildProductImage(),
                          ),
                          Positioned(
                            top: isSmallScreen ? 8 : 12,
                            right: isSmallScreen ? 8 : 12,
                            child: Container(
                              padding: EdgeInsets.symmetric(
                                horizontal: isSmallScreen ? 8 : 12,
                                vertical: isSmallScreen ? 4 : 6,
                              ),
                              decoration: BoxDecoration(
                                color: widget.producto.stock > 5
                                    ? AppColors.successColor
                                    : widget.producto.stock > 0
                                        ? AppColors.warningColor
                                        : AppColors.errorColor,
                                borderRadius: BorderRadius.circular(20),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.1),
                                    blurRadius: 8,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: Text(
                                widget.producto.stock > 5
                                    ? 'Disponible'
                                    : widget.producto.stock > 0
                                        ? 'Últimas ${widget.producto.stock}'
                                        : 'Agotado',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: isSmallScreen ? 9 : 11,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    // Información del producto
                    Expanded(
                      flex: 2,
                      child: Container(
                        padding: EdgeInsets.all(isSmallScreen ? 8 : 12),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    widget.producto.subcategoria,
                                    style: AppStyles.caption.copyWith(
                                      color: AppColors.primaryGreen,
                                      fontWeight: FontWeight.w500,
                                      fontSize: isSmallScreen ? 10 : 12,
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  SizedBox(height: isSmallScreen ? 2 : 4),
                                  Text(
                                    widget.producto.nombre,
                                    style: AppStyles.heading3.copyWith(
                                      fontSize: isSmallScreen ? 12 : 14,
                                    ),
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ],
                              ),
                            ),
                            Row(
                              children: [
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Text(
                                        'Precio',
                                        style: AppStyles.caption.copyWith(
                                          fontSize: isSmallScreen ? 8 : 10,
                                        ),
                                      ),
                                      const SizedBox(height: 2),
                                      FittedBox(
                                        fit: BoxFit.scaleDown,
                                        alignment: Alignment.centerLeft,
                                        child: Text(
                                          '\$${widget.producto.precio.toStringAsFixed(2)}',
                                          style: AppStyles.price.copyWith(
                                            fontSize: isSmallScreen ? 12 : 16,
                                          ),
                                          maxLines: 1,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(width: 8),
                                GestureDetector(
                                  onTap: widget.producto.stock > 0 &&
                                          !_isAddingToCart
                                      ? () async {
                                          setState(() {
                                            _isAddingToCart = true;
                                          });

                                          widget.onAddToCart();

                                          await Future.delayed(const Duration(
                                              milliseconds: 500));

                                          if (mounted) {
                                            setState(() {
                                              _isAddingToCart = false;
                                            });
                                          }
                                        }
                                      : null,
                                  child: AnimatedContainer(
                                    duration: const Duration(milliseconds: 300),
                                    padding:
                                        EdgeInsets.all(isSmallScreen ? 6 : 8),
                                    decoration: BoxDecoration(
                                      color: _isAddingToCart
                                          ? AppColors.successColor
                                          : widget.producto.stock > 0
                                              ? AppColors.primaryGreen
                                                  .withOpacity(0.1)
                                              : Colors.grey.withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Icon(
                                      _isAddingToCart
                                          ? Icons.check
                                          : Icons.add_shopping_cart,
                                      color: _isAddingToCart
                                          ? Colors.white
                                          : widget.producto.stock > 0
                                              ? AppColors.primaryGreen
                                              : Colors.grey,
                                      size: isSmallScreen ? 16 : 18,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
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
    );
  }

  Widget _buildProductImage() {
    if (widget.producto.imagen == null || widget.producto.imagen!.isEmpty) {
      return Center(
        child: Icon(
          Icons.shopping_bag_outlined,
          size: 50,
          color: AppColors.textLight.withOpacity(0.3),
        ),
      );
    }

    String imageUrl = widget.producto.imagen!;
    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      imageUrl =
          'https://via.placeholder.com/300x300/00C896/ffffff?text=${Uri.encodeComponent(widget.producto.nombre)}';
    }

    return CachedNetworkImage(
      imageUrl: imageUrl,
      fit: BoxFit.cover,
      width: double.infinity,
      height: double.infinity,
      placeholder: (context, url) => Center(
        child: CircularProgressIndicator(
          color: AppColors.primaryGreen.withOpacity(0.3),
          strokeWidth: 2,
        ),
      ),
      errorWidget: (context, url, error) {
        return Container(
          color: AppColors.backgroundLight,
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.broken_image_outlined,
                  size: 40,
                  color: AppColors.textLight.withOpacity(0.3),
                ),
                const SizedBox(height: 8),
                Text(
                  widget.producto.nombre,
                  style: TextStyle(
                    fontSize: 12,
                    color: AppColors.textLight.withOpacity(0.5),
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
