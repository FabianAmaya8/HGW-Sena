import '../config/api_config.dart';

class Producto {
  final int idProducto;
  final String categoria;
  final String subcategoria;
  final String nombre;
  final double precio;
  final String? imagen;
  final int stock;

  Producto({
    required this.idProducto,
    required this.categoria,
    required this.subcategoria,
    required this.nombre,
    required this.precio,
    this.imagen,
    required this.stock,
  });

  factory Producto.fromJson(Map<String, dynamic> json) {
    try {
      // Manejo robusto de conversión de tipos
      double parsePrecio(dynamic value) {
        if (value == null) return 0.0;
        if (value is double) return value;
        if (value is int) return value.toDouble();
        if (value is String) return double.tryParse(value) ?? 0.0;
        return 0.0;
      }

      int parseStock(dynamic value) {
        if (value == null) return 0;
        if (value is int) return value;
        if (value is String) return int.tryParse(value) ?? 0;
        return 0;
      }

      // Construir URL completa para la imagen
      String? parseImagen(dynamic value) {
        if (value == null || value.toString().isEmpty) {
          // Usar placeholder si no hay imagen
          return 'https://via.placeholder.com/300x300/00C896/ffffff?text=Producto';
        }

        String imagenPath = value.toString();

        // Si ya es una URL completa
        if (imagenPath.startsWith('http://') ||
            imagenPath.startsWith('https://')) {
          return imagenPath;
        }

        // Usar baseUrl si es ruta relativa
        return '${ApiConfig.baseUrl}/$imagenPath';
      }

      return Producto(
        idProducto: json['id_producto'] ?? 0,
        categoria: json['categoria']?.toString() ?? 'Sin categoría',
        subcategoria: json['subcategoria']?.toString() ?? 'Sin subcategoría',
        nombre: json['nombre']?.toString() ?? 'Producto sin nombre',
        precio: parsePrecio(json['precio']),
        imagen: parseImagen(json['imagen']),
        stock: parseStock(json['stock']),
      );
    } catch (e) {
      print('Error parsing Producto: $e');
      print('JSON data: $json');
      throw Exception('Error al parsear producto: $e');
    }
  }
}
