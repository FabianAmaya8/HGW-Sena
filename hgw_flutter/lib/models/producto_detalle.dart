import '../config/api_config.dart';

class ProductoDetalle {
  final int idProducto;
  final String nombre;
  final double precio;
  final String? imagen;
  final List<String> imagenes;
  final String? descripcion;
  final int stock;
  final String categoria;
  final String subcategoria;

  ProductoDetalle({
    required this.idProducto,
    required this.nombre,
    required this.precio,
    this.imagen,
    required this.imagenes,
    this.descripcion,
    required this.stock,
    required this.categoria,
    required this.subcategoria,
  });

  factory ProductoDetalle.fromJson(Map<String, dynamic> json) {
    try {
      // Función para construir URLs completas de imágenes
      String? buildImageUrl(String? imagePath) {
        if (imagePath == null || imagePath.isEmpty) return null;

        if (imagePath.startsWith('http://') ||
            imagePath.startsWith('https://')) {
          return imagePath;
        }

        return '${ApiConfig.baseUrl}/$imagePath';
      }

      List<String> parseImagenes(dynamic value) {
        if (value == null) return [];

        List<String> imageList = [];
        if (value is List) {
          imageList = value
              .map((e) => e.toString())
              .where((e) => e.isNotEmpty)
              .toList();
        } else if (value is String && value.isNotEmpty) {
          imageList =
              value.split(',').where((e) => e.trim().isNotEmpty).toList();
        }

        // Convertir rutas relativas a URLs completas
        return imageList
            .map((img) => buildImageUrl(img.trim()) ?? '')
            .where((url) => url.isNotEmpty)
            .toList();
      }

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

      return ProductoDetalle(
        idProducto: json['id_producto'] ?? 0,
        nombre: json['nombre']?.toString() ?? 'Producto sin nombre',
        precio: parsePrecio(json['precio']),
        imagen: buildImageUrl(json['imagen']?.toString()),
        imagenes: parseImagenes(json['imagenes']),
        descripcion: json['descripcion']?.toString(),
        stock: parseStock(json['stock']),
        categoria: json['categoria']?.toString() ?? 'Sin categoría',
        subcategoria: json['subcategoria']?.toString() ?? 'Sin subcategoría',
      );
    } catch (e) {
      print('Error parsing ProductoDetalle: $e');
      print('JSON data: $json');
      throw Exception('Error al parsear detalle del producto: $e');
    }
  }
}
