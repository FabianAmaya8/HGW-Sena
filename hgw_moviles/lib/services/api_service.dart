import 'dart:convert';
import 'dart:async';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import '../models/categoria.dart';
import '../models/producto.dart';
import '../models/producto_detalle.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  // Cliente HTTP reutilizable
  final http.Client _client = http.Client();

  Future<List<Categoria>> obtenerCatalogo() async {
    try {
      print(
          'Fetching catalog from: ${ApiConfig.baseUrl}${ApiConfig.catalogoEndpoint}');

      final response = await _client
          .get(Uri.parse('${ApiConfig.baseUrl}${ApiConfig.catalogoEndpoint}'))
          .timeout(ApiConfig.timeout);

      print('Catalog response status: ${response.statusCode}');
      print(
          'Catalog response body: ${response.body.substring(0, response.body.length.clamp(0, 200))}');

      if (response.statusCode == 200) {
        final dynamic decodedData = json.decode(response.body);

        if (decodedData == null) {
          return [];
        }

        if (decodedData is List) {
          return decodedData
              .where((item) => item != null)
              .map((json) => Categoria.fromJson(json as Map<String, dynamic>))
              .toList();
        } else {
          print('Unexpected catalog response type: ${decodedData.runtimeType}');
          return [];
        }
      } else {
        throw Exception('Error del servidor: ${response.statusCode}');
      }
    } on TimeoutException {
      throw Exception('Tiempo de espera agotado. Verifica tu conexión.');
    } catch (e) {
      print('Error in obtenerCatalogo: $e');
      throw Exception('Error al conectar con el servidor: $e');
    }
  }

  Future<List<Producto>> obtenerProductos() async {
    try {
      print(
          'Fetching products from: ${ApiConfig.baseUrl}${ApiConfig.productosEndpoint}');

      final response = await _client
          .get(Uri.parse('${ApiConfig.baseUrl}${ApiConfig.productosEndpoint}'))
          .timeout(ApiConfig.timeout);

      print('Products response status: ${response.statusCode}');
<<<<<<< Updated upstream
      print(
          'Products response body: ${response.body.substring(0, response.body.length.clamp(0, 200))}');
=======
>>>>>>> Stashed changes

      if (response.statusCode == 200) {
        final dynamic decodedData = json.decode(response.body);

<<<<<<< Updated upstream
        if (decodedData == null) {
=======
        print('Products raw data type: ${decodedData.runtimeType}');
        print('Products raw data: $decodedData');

        if (decodedData == null) {
          print('Warning: Products data is null');
>>>>>>> Stashed changes
          return [];
        }

        if (decodedData is List) {
<<<<<<< Updated upstream
          return decodedData
              .where((item) => item != null)
              .map((json) => Producto.fromJson(json as Map<String, dynamic>))
              .toList();
=======
          print('Products count: ${decodedData.length}');

          final productos = <Producto>[];
          for (var i = 0; i < decodedData.length; i++) {
            try {
              if (decodedData[i] != null) {
                print('Parsing product $i: ${decodedData[i]}');
                final producto =
                    Producto.fromJson(decodedData[i] as Map<String, dynamic>);
                productos.add(producto);
                print('Successfully parsed: ${producto.nombre}');
              }
            } catch (e) {
              print('Error parsing product $i: $e');
              print('Product data: ${decodedData[i]}');
            }
          }

          print('Successfully parsed ${productos.length} products');
          return productos;
>>>>>>> Stashed changes
        } else {
          print(
              'Unexpected products response type: ${decodedData.runtimeType}');
          return [];
        }
      } else {
        throw Exception('Error del servidor: ${response.statusCode}');
      }
    } on TimeoutException {
      throw Exception('Tiempo de espera agotado. Verifica tu conexión.');
    } catch (e) {
      print('Error in obtenerProductos: $e');
      throw Exception('Error al conectar con el servidor: $e');
    }
  }

  Future<ProductoDetalle> obtenerProductoDetalle(int id) async {
    try {
      final url =
          '${ApiConfig.baseUrl}${ApiConfig.productoUnicoEndpoint}?id=$id';
      print('Fetching product detail from: $url');

      final response =
          await _client.get(Uri.parse(url)).timeout(ApiConfig.timeout);

      print('Product detail response status: ${response.statusCode}');
      print('Product detail response body: ${response.body}');

      if (response.statusCode == 200) {
        final dynamic decodedData = json.decode(response.body);

        if (decodedData == null) {
          throw Exception('Producto no encontrado');
        }

        if (decodedData is Map<String, dynamic>) {
          return ProductoDetalle.fromJson(decodedData);
        } else {
          throw Exception('Formato de respuesta inválido');
        }
      } else if (response.statusCode == 404) {
        throw Exception('Producto no encontrado');
      } else {
        throw Exception('Error del servidor: ${response.statusCode}');
      }
    } on TimeoutException {
      throw Exception('Tiempo de espera agotado. Verifica tu conexión.');
    } catch (e) {
      print('Error in obtenerProductoDetalle: $e');
      throw Exception('Error al obtener el producto: $e');
    }
  }

  void dispose() {
    _client.close();
  }
}
