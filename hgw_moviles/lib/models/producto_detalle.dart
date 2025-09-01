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
      List<String> parseImagenes(dynamic value) {
        if (value == null) return [];
        if (value is List) {
          return value
              .map((e) => e.toString())
              .where((e) => e.isNotEmpty)
              .toList();
        }
        if (value is String && value.isNotEmpty) {
          return value.split(',').where((e) => e.trim().isNotEmpty).toList();
        }
        return [];
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
        imagen: json['imagen']?.toString(),
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
