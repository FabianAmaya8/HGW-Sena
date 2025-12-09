import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../models/carrito/carrito_item.dart';

class CarritoItemWidget extends StatelessWidget {
  final CarritoItem item;
  final Function(int) onUpdateQuantity;
  final VoidCallback onDelete;

  const CarritoItemWidget({
    Key? key,
    required this.item,
    required this.onUpdateQuantity,
    required this.onDelete,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isSmallScreen = MediaQuery.of(context).size.width < 400;
    final primaryGreen = Colors.green.shade600;
    
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: isSmallScreen ? _buildCompactLayout(primaryGreen) : _buildNormalLayout(primaryGreen),
      ),
    );
  }

  Widget _buildNormalLayout(Color primaryGreen) {
    return Row(
      children: [
        // Imagen
        Container(
          width: 80,
          height: 80,
          decoration: BoxDecoration(
            color: Colors.grey[100],
            borderRadius: BorderRadius.circular(8),
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: item.imagen != null
                ? CachedNetworkImage(
                    imageUrl: item.imagen!,
                    fit: BoxFit.cover,
                    errorWidget: (_, __, ___) => 
                      const Icon(Icons.image, size: 30, color: Colors.grey),
                  )
                : const Icon(Icons.image, size: 30, color: Colors.grey),
          ),
        ),
        const SizedBox(width: 12),
        
        // Info y controles
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                item.nombre,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 4),
              Text(
                '\$${item.precio.toStringAsFixed(2)}',
                style: TextStyle(
                  color: primaryGreen,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  _buildQuantityControls(primaryGreen),
                  const Spacer(),
                  Text(
                    '\$${item.subtotal.toStringAsFixed(2)}',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton(
                    icon: const Icon(Icons.delete_outline, color: Colors.red, size: 20),
                    onPressed: onDelete,
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildCompactLayout(Color primaryGreen) {
    return Column(
      children: [
        Row(
          children: [
            // Imagen pequeña
            Container(
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(8),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: item.imagen != null
                    ? CachedNetworkImage(
                        imageUrl: item.imagen!,
                        fit: BoxFit.cover,
                        errorWidget: (_, __, ___) => 
                          const Icon(Icons.image, size: 25, color: Colors.grey),
                      )
                    : const Icon(Icons.image, size: 25, color: Colors.grey),
              ),
            ),
            const SizedBox(width: 12),
            
            // Nombre y precio
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.nombre,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    '\$${item.precio.toStringAsFixed(2)} c/u',
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
            
            // Botón eliminar
            IconButton(
              icon: const Icon(Icons.close, color: Colors.red, size: 20),
              onPressed: onDelete,
            ),
          ],
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            _buildQuantityControls(primaryGreen),
            const Spacer(),
            Text(
              'Total: \$${item.subtotal.toStringAsFixed(2)}',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 14,
                color: primaryGreen,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildQuantityControls(Color primaryGreen) {
    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey[300]!),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          InkWell(
            onTap: item.cantidad > 1 
                ? () => onUpdateQuantity(item.cantidad - 1)
                : null,
            child: Container(
              padding: const EdgeInsets.all(4),
              child: Icon(
                Icons.remove,
                size: 18,
                color: item.cantidad > 1 
                    ? primaryGreen 
                    : Colors.grey,
              ),
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Text(
              '${item.cantidad}',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          InkWell(
            onTap: item.cantidad < item.stock
                ? () => onUpdateQuantity(item.cantidad + 1)
                : null,
            child: Container(
              padding: const EdgeInsets.all(4),
              child: Icon(
                Icons.add,
                size: 18,
                color: item.cantidad < item.stock
                    ? primaryGreen
                    : Colors.grey,
              ),
            ),
          ),
        ],
      ),
    );
  }
}