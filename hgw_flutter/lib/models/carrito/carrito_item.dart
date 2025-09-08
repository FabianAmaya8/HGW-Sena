import '../../config/api_config.dart';

class CarritoItem {
  final int idProducto;
  final String nombre;
  final String? imagen;
  final double precio;
  int cantidad;
  final int stock;

  CarritoItem({
    required this.idProducto,
    required this.nombre,
    this.imagen,
    required this.precio,
    required this.cantidad,
    required this.stock,
  });

  factory CarritoItem.fromJson(Map<String, dynamic> json) {
    // Construir URL completa para la imagen
    String? parseImagen(dynamic value) {
      if (value == null || value == '') return null;
      String imagenPath = value.toString();

      if (imagenPath.startsWith('http://') ||
          imagenPath.startsWith('https://')) {
        return imagenPath;
      }

      return 'https://via.placeholder.com/150/00C896/ffffff?text=Producto';
    }

    return CarritoItem(
      idProducto: json['id_producto'] ?? 0,
      nombre: json['nombre_producto'] ?? 'Sin nombre',
      imagen: parseImagen(json['imagen_producto']),
      precio: (json['precio_producto'] ?? 0).toDouble(),
      cantidad: json['cantidad_producto'] ?? 1,
      stock: json['stock'] ?? 0,
    );
  }

  double get subtotal => precio * cantidad;
}
