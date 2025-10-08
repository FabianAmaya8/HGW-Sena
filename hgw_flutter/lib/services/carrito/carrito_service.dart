import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../config/api_config.dart';
import '../../models/carrito/carrito_item.dart';
import '../../models/carrito/direccion.dart';
import '../../models/carrito/medio_pago.dart';

class CarritoService {
  static final CarritoService _instance = CarritoService._internal();
  factory CarritoService() => _instance;
  CarritoService._internal();

  Future<Map<String, dynamic>> obtenerCarrito(int userId) async {
    try {
      final response = await http
          .get(
            Uri.parse('${ApiConfig.baseUrl}/api/carrito?id=$userId'),
          )
          .timeout(ApiConfig.timeout);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final List<CarritoItem> items = [];

        if (data['productos'] != null) {
          for (var item in data['productos']) {
            items.add(CarritoItem.fromJson(item));
          }
        }

        return {
          'items': items,
          'mensaje': data['mensaje'],
          'eliminados': data['eliminados'],
        };
      }
      return {'items': [], 'mensaje': null, 'eliminados': null};
    } catch (e) {
      print('Error obteniendo carrito: $e');
      return {'items': [], 'mensaje': null, 'eliminados': null};
    }
  }

  Future<bool> agregarProducto(int userId, int productId, int cantidad) async {
    try {
      final response = await http
          .post(
            Uri.parse('${ApiConfig.baseUrl}/api/carrito/agregar'),
            headers: {'Content-Type': 'application/json'},
            body: json.encode({
              'id_usuario': userId,
              'id_producto': productId,
              'cantidad': cantidad,
            }),
          )
          .timeout(ApiConfig.timeout);

      return response.statusCode == 200;
    } catch (e) {
      print('Error agregando producto: $e');
      return false;
    }
  }

  Future<bool> actualizarCantidad(
      int userId, int productId, int cantidad) async {
    try {
      final response = await http
          .put(
            Uri.parse('${ApiConfig.baseUrl}/api/carrito/actualizar'),
            headers: {'Content-Type': 'application/json'},
            body: json.encode({
              'id_usuario': userId,
              'id_producto': productId,
              'nueva_cantidad': cantidad,
            }),
          )
          .timeout(ApiConfig.timeout);

      return response.statusCode == 200;
    } catch (e) {
      print('Error actualizando cantidad: $e');
      return false;
    }
  }

  Future<bool> eliminarProducto(int userId, int productId) async {
    try {
      final response = await http
          .delete(
            Uri.parse('${ApiConfig.baseUrl}/api/carrito/eliminar'),
            headers: {'Content-Type': 'application/json'},
            body: json.encode({
              'id_usuario': userId,
              'id_producto': productId,
            }),
          )
          .timeout(ApiConfig.timeout);

      return response.statusCode == 200;
    } catch (e) {
      print('Error eliminando producto: $e');
      return false;
    }
  }

  Future<List<Direccion>> obtenerDirecciones(int userId) async {
    try {
      final response = await http
          .get(
            Uri.parse('${ApiConfig.baseUrl}/api/direcciones?id=$userId'),
          )
          .timeout(ApiConfig.timeout);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true && data['direcciones'] != null) {
          return (data['direcciones'] as List)
              .map((item) => Direccion.fromJson(item))
              .toList();
        }
      }
      return [];
    } catch (e) {
      print('Error obteniendo direcciones: $e');
      return [];
    }
  }

  Future<bool> crearDireccion({
    required int userId,
    required String lugarEntrega,
    required String direccion,
    required String ciudad,
    required String pais,
    required String codigoPostal,
  }) async {
    try {
      final response = await http
          .post(
            Uri.parse('${ApiConfig.baseUrl}/api/direcciones/crear'),
            headers: {'Content-Type': 'application/json'},
            body: json.encode({
              'id_usuario': userId,
              'lugar_entrega': lugarEntrega,
              'direccion': direccion,
              'ciudad': ciudad,
              'pais': pais,
              'codigo_postal': codigoPostal,
            }),
          )
          .timeout(ApiConfig.timeout);

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = json.decode(response.body);
        return data['success'] == true;
      }
      return false;
    } catch (e) {
      print('Error creando dirección: $e');
      return false;
    }
  }

  // Método adicional para obtener ubicaciones disponibles
  Future<Map<String, List<String>>> obtenerUbicaciones() async {
    try {
      final response = await http
          .get(
            Uri.parse('${ApiConfig.baseUrl}/api/ubicaciones'),
          )
          .timeout(ApiConfig.timeout);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success'] == true) {
          return Map<String, List<String>>.from(data['ubicaciones']
              .map((key, value) => MapEntry(key, List<String>.from(value))));
        }
      }
      return {};
    } catch (e) {
      print('Error obteniendo ubicaciones: $e');
      return {};
    }
  }

  Future<List<MedioPago>> obtenerMediosPago() async {
    try {
      final response = await http
          .get(
            Uri.parse('${ApiConfig.baseUrl}/api/medios-pago'),
          )
          .timeout(ApiConfig.timeout);

      if (response.statusCode == 200) {
        final List data = json.decode(response.body);
        return data.map((item) => MedioPago.fromJson(item)).toList();
      }
      return [];
    } catch (e) {
      print('Error obteniendo medios de pago: $e');
      return [];
    }
  }

  Future<int?> crearOrden(int userId, int direccionId, int medioPagoId,
      double total, List<CarritoItem> items) async {
    try {
      final response = await http
          .post(
            Uri.parse('${ApiConfig.baseUrl}/api/ordenes'),
            headers: {'Content-Type': 'application/json'},
            body: json.encode({
              'id_usuario': userId,
              'id_direccion': direccionId,
              'id_medio_pago': medioPagoId,
              'total': total,
              'items': items
                  .map((item) => {
                        'id_producto': item.idProducto,
                        'cantidad': item.cantidad,
                        'precio_unitario': item.precio,
                      })
                  .toList(),
            }),
          )
          .timeout(ApiConfig.timeout);

      if (response.statusCode == 201) {
        final data = json.decode(response.body);
        return data['id_orden'];
      }
      return null;
    } catch (e) {
      print('Error creando orden: $e');
      return null;
    }
  }
}
