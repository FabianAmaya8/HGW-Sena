import '../config/api_config.dart';

class Producto {
  final int idProducto;
  final String categoria;
  final String subcategoria;
  final String nombre;
  final double precio;
  final String? imagen; // puede ser null
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

      String? parseImagen(dynamic value) {
        if (value != null && value is String && value.isNotEmpty) {
          return '${ApiConfig.baseUrl}/$value';
        }
        return null; // en vez de forzar una imagen por defecto
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
