import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../models/producto.dart';
import '../utils/constants.dart';

class ProductoCard extends StatefulWidget {
  final Producto producto;
  final VoidCallback onTap;

  const ProductoCard({
    Key? key,
    required this.producto,
    required this.onTap,
  }) : super(key: key);

  @override
  State<ProductoCard> createState() => _ProductoCardState();
}

class _ProductoCardState extends State<ProductoCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
<<<<<<< Updated upstream
  bool _isHovered = false;
=======
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
=======
    // Debug para verificar los datos
    print('ProductoCard - Rendering producto: ${widget.producto.nombre}');
    print('ProductoCard - Image URL: ${widget.producto.imagen}');
    print('ProductoCard - Stock: ${widget.producto.stock}');

>>>>>>> Stashed changes
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
                    // Imagen con badge de stock
<<<<<<< Updated upstream
                    Stack(
                      children: [
                        AspectRatio(
                          aspectRatio: 1,
                          child: Container(
=======
                    Expanded(
                      flex: 3,
                      child: Stack(
                        children: [
                          Container(
                            width: double.infinity,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                            child: (widget.producto.imagen != null &&
                                    widget.producto.imagen!.isNotEmpty)
                                ? CachedNetworkImage(
                                    imageUrl: widget.producto.imagen!,
                                    fit: BoxFit.cover,
                                    placeholder: (context, url) => Center(
                                      child: CircularProgressIndicator(
                                        color: AppColors.primaryGreen
                                            .withOpacity(0.3),
                                        strokeWidth: 2,
                                      ),
                                    ),
                                    errorWidget: (context, url, error) => Icon(
                                      Icons.shopping_bag_outlined,
                                      size: 50,
                                      color:
                                          AppColors.textLight.withOpacity(0.3),
                                    ),
                                  )
                                : Icon(
                                    Icons.shopping_bag_outlined,
                                    size: 50,
                                    color: AppColors.textLight.withOpacity(0.3),
                                  ),
                          ),
                        ),
                        // Badge de estado
                        Positioned(
                          top: 12,
                          right: 12,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 6,
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
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    // Información del producto
                    Expanded(
                      child: Padding(
=======
                            child: _buildProductImage(),
                          ),
                          // Badge de estado
                          Positioned(
                            top: 12,
                            right: 12,
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 6,
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
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 11,
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
>>>>>>> Stashed changes
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
<<<<<<< Updated upstream
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  widget.producto.subcategoria,
                                  style: AppStyles.caption.copyWith(
                                    color: AppColors.primaryGreen,
                                    fontWeight: FontWeight.w500,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  widget.producto.nombre,
                                  style:
                                      AppStyles.heading3.copyWith(fontSize: 16),
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ],
=======
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    widget.producto.subcategoria,
                                    style: AppStyles.caption.copyWith(
                                      color: AppColors.primaryGreen,
                                      fontWeight: FontWeight.w500,
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    widget.producto.nombre,
                                    style: AppStyles.heading3
                                        .copyWith(fontSize: 16),
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ],
                              ),
>>>>>>> Stashed changes
                            ),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
<<<<<<< Updated upstream
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Precio',
                                      style: AppStyles.caption,
                                    ),
                                    Text(
                                      '\$${widget.producto.precio.toStringAsFixed(2)}',
                                      style: AppStyles.price
                                          .copyWith(fontSize: 20),
                                    ),
                                  ],
=======
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Text(
                                        'Precio',
                                        style: AppStyles.caption,
                                      ),
                                      FittedBox(
                                        fit: BoxFit.scaleDown,
                                        child: Text(
                                          '\${widget.producto.precio.toStringAsFixed(2)}',
                                          style: AppStyles.price
                                              .copyWith(fontSize: 20),
                                        ),
                                      ),
                                    ],
                                  ),
>>>>>>> Stashed changes
                                ),
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(
                                    color:
                                        AppColors.primaryGreen.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: const Icon(
                                    Icons.add_shopping_cart,
                                    color: AppColors.primaryGreen,
                                    size: 20,
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
<<<<<<< Updated upstream
=======

  Widget _buildProductImage() {
    // Si no hay imagen o es null, mostrar placeholder
    if (widget.producto.imagen == null || widget.producto.imagen!.isEmpty) {
      return Center(
        child: Icon(
          Icons.shopping_bag_outlined,
          size: 50,
          color: AppColors.textLight.withOpacity(0.3),
        ),
      );
    }

    // Usar imagen de placeholder si la URL no es válida
    String imageUrl = widget.producto.imagen!;

    // Si la imagen es una ruta relativa sin dominio completo, usar placeholder
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
        print('Error loading image: $url - Error: $error');
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
>>>>>>> Stashed changes
}
