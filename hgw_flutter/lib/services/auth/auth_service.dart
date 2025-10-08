import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../../models/personal/usuario.dart';

class AuthService {
  static const String _userKey = 'user_data';
  static const String _tokenKey = 'auth_token';
  static const String _isLoggedInKey = 'is_logged_in';

  static Future<void> saveSession({
    required Usuario usuario,
    String? token,
  }) async {
    final prefs = await SharedPreferences.getInstance();

    await prefs.setString(
        _userKey,
        json.encode({
          'id_usuario': usuario.idUsuario,
          'nombre': usuario.nombre,
          'apellido': usuario.apellido,
          'nombre_usuario': usuario.nombreUsuario,
          'correo_electronico': usuario.correoElectronico,
          'numero_telefono': usuario.numeroTelefono,
          'url_foto_perfil': usuario.urlFotoPerfil,
          'patrocinador': usuario.patrocinador,
          'nombre_medio': usuario.nombreMedio,
        }));

    // guardar token
    if (token != null) {
      await prefs.setString(_tokenKey, token);
    }

    // marcar si usuario esta logeado
    await prefs.setBool(_isLoggedInKey, true);
  }

  static Future<Map<String, dynamic>?> getSessionData() async {
    final prefs = await SharedPreferences.getInstance();

    final isLoggedIn = prefs.getBool(_isLoggedInKey) ?? false;
    if (!isLoggedIn) return null;

    final userString = prefs.getString(_userKey);
    if (userString == null) return null;

    return {
      'user': json.decode(userString),
      'token': prefs.getString(_tokenKey),
    };
  }

  static Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_isLoggedInKey) ?? false;
  }

  static Future<void> clearSession() async {
    final prefs = await SharedPreferences.getInstance();

    // eliminar datos de sesion anterir
    await prefs.remove(_userKey);
    await prefs.remove(_tokenKey);
    await prefs.remove(_isLoggedInKey);
  }

  // id del usuario actual
  static Future<int?> getCurrentUserId() async {
    final sessionData = await getSessionData();
    if (sessionData != null && sessionData['user'] != null) {
      return sessionData['user']['id_usuario'];
    }
    return null;
  }

  // token actual
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }
}
