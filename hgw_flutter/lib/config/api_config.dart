import 'package:flutter/foundation.dart';

class ApiConfig {
  // Detecta automáticamente la plataforma y usa la URL correcta
  static String get baseUrl {
    if (kIsWeb) {
      // Para Flutter Web
      return 'http://127.0.0.1:3000';
    } else if (defaultTargetPlatform == TargetPlatform.android) {
      // Para emulador Android
      return 'http://10.0.2.2:3000';
    } else if (defaultTargetPlatform == TargetPlatform.iOS) {
      // Para iOS Simulator
      return 'http://localhost:3000';
    } else {
      // Para otros casos
      return 'http://127.0.0.1:3000';
    }
  }

  static const String catalogoEndpoint = '/api/catalogo';
  static const String productosEndpoint = '/api/productos';
  static const String productoUnicoEndpoint = '/api/producto/unico';

  // Timeout para las peticiones
  static const Duration timeout = Duration(seconds: 30);
}
