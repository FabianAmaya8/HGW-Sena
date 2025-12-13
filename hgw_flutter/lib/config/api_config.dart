import 'package:flutter/foundation.dart';

class ApiConfig {
  // Detecta automáticamente la plataforma y usa la URL correcta
  static String get baseUrl {
    if (kIsWeb) {
      // Para Flutter Web
      return 'https://hgwflask.up.railway.app';
    } else if (defaultTargetPlatform == TargetPlatform.android) {
      // Para emulador Android
      return 'https://hgwflask.up.railway.app';
    } else if (defaultTargetPlatform == TargetPlatform.iOS) {
      // Para iOS Simulator
      return 'https://hgwflask.up.railway.app';
    } else {
      // Para otros casos
      return 'https://hgwflask.up.railway.app';
    }
  }

  static const String catalogoEndpoint = '/api/catalogo';
  static const String productosEndpoint = '/api/productos';
  static const String productoUnicoEndpoint = '/api/producto/unico';

  // Timeout para las peticiones
  static const Duration timeout = Duration(seconds: 30);
}
