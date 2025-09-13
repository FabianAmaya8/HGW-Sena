import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../../config/api_config.dart';
import '../../models/personal/usuario.dart';
class PersonalService {
  static String get baseUrl => ApiConfig.baseUrl;

  Future<Usuario?> obtenerDatosPersonales(int userId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/personal?id=$userId'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success']) {
          return Usuario.fromJson(data['usuario']);
        }
      }
      return null;
    } catch (e) {
      print('Error obteniendo datos personales: $e');
      return null;
    }
  }

  Future<bool> actualizarDatosPersonales(int userId, Map<String, dynamic> datos,
      {File? fotoPerfil}) async {
    try {
      var request = http.MultipartRequest(
        'PUT',
        Uri.parse('$baseUrl/api/personal/update?id=$userId'),
      );

      if (fotoPerfil != null) {
        request.files.add(
          await http.MultipartFile.fromPath(
            'foto_perfil',
            fotoPerfil.path,
          ),
        );
      }

      request.fields['data'] = json.encode(datos);

      final response = await request.send();
      final responseBody = await response.stream.bytesToString();
      final data = json.decode(responseBody);

      return response.statusCode == 200 && data['success'];
    } catch (e) {
      print('Error actualizando datos personales: $e');
      return false;
    }
  }

  Future<bool> cambiarContrasena(
      int userId, String contrasenaActual, String contrasenaNueva) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/cambiar-contrasena'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'id_usuario': userId,
          'actual': contrasenaActual,
          'nueva': contrasenaNueva,
        }),
      );

      final data = json.decode(response.body);
      return response.statusCode == 200 && data['success'];
    } catch (e) {
      print('Error cambiando contraseña: $e');
      return false;
    }
  }

  Future<bool> eliminarFotoPerfil(int userId) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl/api/personal/delete?id=$userId'),
      );

      final data = json.decode(response.body);
      return response.statusCode == 200 && data['success'];
    } catch (e) {
      print('Error eliminando foto de perfil: $e');
      return false;
    }
  }

  Future<Map<String, dynamic>?> obtenerMembresia(int userId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/membresia?id=$userId'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success']) {
          return data['membresia'];
        }
      }
      return null;
    } catch (e) {
      print('Error obteniendo membresía: $e');
      return null;
    }
  }

  Future<List<Map<String, dynamic>>> obtenerTodasMembresias() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/membresias'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success']) {
          return List<Map<String, dynamic>>.from(data['membresias']);
        }
      }
      return [];
    } catch (e) {
      print('Error obteniendo membresías: $e');
      return [];
    }
  }

  Future<List<Map<String, dynamic>>> obtenerMiRed(int userId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/mi-red?id=$userId'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success']) {
          return List<Map<String, dynamic>>.from(data['red']);
        }
      }
      return [];
    } catch (e) {
      print('Error obteniendo mi red: $e');
      return [];
    }
  }
  Future<List<Map<String, dynamic>>> obtenerLineasDirectas(int userId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/lineas-directas?id=$userId'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success']) {
          return List<Map<String, dynamic>>.from(data['lineas']);
        }
      }
      return [];
    } catch (e) {
      print('Error obteniendo líneas directas: $e');
      return [];
    }
  }
  Future<bool> actualizarDireccion(
      int userId, int direccionId, Map<String, dynamic> direccion) async {
    try {
      final response = await http.put(
        Uri.parse(
            '$baseUrl/api/direccion/update?userId=$userId&direccionId=$direccionId'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(direccion),
      );

      final data = json.decode(response.body);
      return response.statusCode == 200 && data['success'];
    } catch (e) {
      print('Error actualizando dirección: $e');
      return false;
    }
  }
}
