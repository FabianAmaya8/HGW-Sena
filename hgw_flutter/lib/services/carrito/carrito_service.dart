import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../config/api_config.dart';
import '../../models/carrito/carrito_item.dart';
import '../../models/carrito/direccion.dart';
import '../../models/carrito/medio_pago.dart';
import '../../models/carrito/respuesta_compra.dart';
class CarritoService {
  static final CarritoService _instance = CarritoService._internal();
  factory CarritoService() => _instance;
  CarritoService._internal();

  Future<Map<String, dynamic>> obtenerCarrito(int userId) async {
    try {
      final response = await http
          .get(Uri.parse('${ApiConfig.baseUrl}/api/carrito?id=$userId'))
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
          'eliminados': data['eliminados']
        };
      }
      return {'items': [], 'mensaje': null, 'eliminados': null};
    } catch (e) {
      return {'items': [], 'mensaje': null, 'eliminados': null};
    }
  }

  Future<bool> agregarProducto(int u, int p, int c) async => _postAction(
      '/api/carrito/agregar',
      {'id_usuario': u, 'id_producto': p, 'cantidad': c});
  Future<bool> eliminarProducto(int u, int p) async => _deleteAction(
      '/api/carrito/eliminar', {'id_usuario': u, 'id_producto': p});
  Future<bool> actualizarCantidad(int u, int p, int c) async => _putAction(
      '/api/carrito/actualizar',
      {'id_usuario': u, 'id_producto': p, 'nueva_cantidad': c});

  Future<List<Direccion>> obtenerDirecciones(int userId) async {
    try {
      final r = await http
          .get(Uri.parse('${ApiConfig.baseUrl}/api/direcciones?id=$userId'));
      if (r.statusCode == 200) {
        final d = json.decode(r.body);
        if (d['success']) {
          return (d['direcciones'] as List)
              .map((i) => Direccion.fromJson(i))
              .toList();
        }
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  Future<bool> crearDireccion(
      {required int userId,
      required String lugarEntrega,
      required String direccion,
      required String ciudad,
      required String pais,
      required String codigoPostal}) async {
    return _postAction('/api/direcciones/crear', {
      'id_usuario': userId,
      'lugar_entrega': lugarEntrega,
      'direccion': direccion,
      'ciudad': ciudad,
      'pais': pais,
      'codigo_postal': codigoPostal
    });
  }

  Future<bool> eliminarDireccion(int u, int d) async => _deleteAction(
      '/api/direcciones/eliminar', {'id_usuario': u, 'id_direccion': d});

  Future<List<MedioPago>> obtenerMediosPago() async {
    try {
      final r =
          await http.get(Uri.parse('${ApiConfig.baseUrl}/api/medios-pago'));
      if (r.statusCode == 200) {
        return (json.decode(r.body) as List)
            .map((i) => MedioPago.fromJson(i))
            .toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  Future<Map<String, List<String>>> obtenerUbicaciones() async {
    try {
      final r =
          await http.get(Uri.parse('${ApiConfig.baseUrl}/api/ubicaciones'));
      if (r.statusCode == 200) {
        final d = json.decode(r.body);
        if (d['success']) {
          return Map<String, List<String>>.from(d['ubicaciones']
              .map((k, v) => MapEntry(k, List<String>.from(v))));
        }
      }
      return {};
    } catch (e) {
      return {};
    }
  }

  Future<RespuestaCompra> crearOrden(int userId, int direccionId,
      int medioPagoId, double total, List<CarritoItem> items) async {
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

      final data = json.decode(response.body);

      if (response.statusCode == 201 || response.statusCode == 200) {
        return RespuestaCompra.fromJson(data);
      }
      return RespuestaCompra(
          success: false, message: data['error'] ?? 'Error desconocido');
    } catch (e) {
      print('Error creando orden: $e');
      return RespuestaCompra(success: false, message: 'Error de conexión: $e');
    }
  }

  Future<bool> _postAction(String path, Map body) async {
    try {
      final r = await http
          .post(Uri.parse('${ApiConfig.baseUrl}$path'),
              headers: {'Content-Type': 'application/json'},
              body: json.encode(body))
          .timeout(ApiConfig.timeout);
      return r.statusCode == 200 || r.statusCode == 201;
    } catch (e) {
      return false;
    }
  }

  Future<bool> _putAction(String path, Map body) async {
    try {
      final r = await http
          .put(Uri.parse('${ApiConfig.baseUrl}$path'),
              headers: {'Content-Type': 'application/json'},
              body: json.encode(body))
          .timeout(ApiConfig.timeout);
      return r.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  Future<bool> _deleteAction(String path, Map body) async {
    try {
      final r = await http
          .delete(Uri.parse('${ApiConfig.baseUrl}$path'),
              headers: {'Content-Type': 'application/json'},
              body: json.encode(body))
          .timeout(ApiConfig.timeout);
      return r.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
}
