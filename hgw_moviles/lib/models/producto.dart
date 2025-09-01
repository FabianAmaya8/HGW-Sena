import '../config/api_config.dart';

class Producto {
  final int idProducto;
  final String categoria;
  final String subcategoria;
  final String nombre;
  final double precio;
<<<<<<< Updated upstream
  final String? imagen; // puede ser null
=======
  final String? imagen;
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
      // Manejo robusto de conversión de tipos
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
      String? parseImagen(dynamic value) {
        if (value != null && value is String && value.isNotEmpty) {
          return '${ApiConfig.baseUrl}/$value';
        }
        return null; // en vez de forzar una imagen por defecto
=======
      // Construir URL completa para la imagen si es una ruta relativa
      String? parseImagen(dynamic value) {
        if (value == null || value == '') {
          // Usar placeholder si no hay imagen
          return 'https://via.placeholder.com/300x300/00C896/ffffff?text=Producto';
        }

        String imagenPath = value.toString();

        // Si la imagen ya es una URL completa, usarla tal cual
        if (imagenPath.startsWith('http://') ||
            imagenPath.startsWith('https://')) {
          return imagenPath;
        }

        // Por ahora usar placeholder para rutas relativas hasta configurar el servidor
        // Cuando el servidor esté configurado, descomentar la línea siguiente:
        // return '${ApiConfig.baseUrl}/$imagenPath';

        // Placeholder temporal con el path de la imagen
        return 'https://via.placeholder.com/300x300/00C896/ffffff?text=${Uri.encodeComponent(imagenPath.split('/').last)}';
>>>>>>> Stashed changes
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
