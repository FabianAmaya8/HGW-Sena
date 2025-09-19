import 'dart:io';
import 'package:flutter/material.dart';
import '../../models/personal/usuario.dart';
import '../../models/personal/membresia.dart';
import '../../services/personal/personal_service.dart';

class PersonalProvider extends ChangeNotifier {
  final PersonalService _service = PersonalService();

  Usuario? _usuario;
  bool _isLoading = false;
  String? _error;
  int _puntosActuales = 45;
  int _comprasRealizadas = 0;
  int _personasEnRed = 0;
  int _lineasDirectas = 0;
  List<Map<String, dynamic>> _miRed = [];
  List<Map<String, dynamic>> _lineasDirectasList = [];
  Usuario? get usuario => _usuario;
  bool get isLoading => _isLoading;
  String? get error => _error;
  int get puntosActuales => _puntosActuales;
  int get comprasRealizadas => _comprasRealizadas;
  int get personasEnRed => _personasEnRed;
  int get lineasDirectas => _lineasDirectas;
  List<Map<String, dynamic>> get miRed => _miRed;
  List<Map<String, dynamic>> get lineasDirectasList => _lineasDirectasList;

  String get nivelMembresia {
    if (_usuario?.membresia != null) {
      return _usuario!.membresia!.nombreMembresia;
    }
    return _getNivelPorPuntos(_puntosActuales);
  }

  String _getNivelPorPuntos(int puntos) {
    if (puntos >= 600) return 'Master';
    if (puntos >= 300) return 'Senior';
    if (puntos >= 100) return 'Junior';
    if (puntos >= 50) return 'Pre-Junior';
    return 'Cliente';
  }

  double get progresoMembresia {
    Map<String, Map<String, int>> niveles = {
      'Cliente': {'min': 0, 'max': 50},
      'Pre-Junior': {'min': 50, 'max': 100},
      'Junior': {'min': 100, 'max': 300},
      'Senior': {'min': 300, 'max': 600},
      'Master': {'min': 600, 'max': 1000},
    };

    String nivel = nivelMembresia;
    var rango = niveles[nivel];

    if (rango != null) {
      int min = rango['min']!;
      int max = rango['max']!;

      if (nivel == 'Master') {
        return 1.0; // Master siempre al 100%
      }

      double progreso = (_puntosActuales - min) / (max - min);
      return progreso.clamp(0.0, 1.0);
    }

    return 0.0;
  }

  int get puntosParaSiguienteNivel {
    Map<String, int> puntosNecesarios = {
      'Cliente': 50,
      'Pre-Junior': 100,
      'Junior': 300,
      'Senior': 600,
      'Master': 0, // Ya es el máximo
    };

    return puntosNecesarios[nivelMembresia] ?? 0;
  }

  double getProgresoTotal() {
    Map<String, double> posiciones = {
      'Cliente': 0.0,
      'Pre-Junior': 0.2,
      'Junior': 0.4,
      'Senior': 0.6,
      'Master': 0.8,
    };

    String nivel = nivelMembresia;
    double posicionBase = posiciones[nivel] ?? 0.0;
    double progresoEnNivel = progresoMembresia * 0.2; // Cada nivel ocupa 20%

    return (posicionBase + progresoEnNivel).clamp(0.0, 1.0);
  }

  Future<void> cargarDatosPersonales() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      int userId =
          1; 

      _usuario = await _service.obtenerDatosPersonales(userId);

      if (_usuario == null) {
        _error = 'No se pudieron cargar los datos personales';
      } else {
        if (_usuario!.membresia != null) {
          _puntosActuales = _usuario!.membresia!.puntosActuales;
        }
        await cargarMiRed();
        await cargarLineasDirectas();
        _comprasRealizadas = 15;
      }
    } catch (e) {
      _error = 'Error al cargar datos personales: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> cargarMiRed() async {
    try {
      int userId = _usuario?.idUsuario ?? 1;
      _miRed = await _service.obtenerMiRed(userId);
      _personasEnRed = _miRed.length;
      notifyListeners();
    } catch (e) {
      print('Error al cargar mi red: $e');
    }
  }

  Future<void> cargarLineasDirectas() async {
    try {
      int userId = _usuario?.idUsuario ?? 1;
      _lineasDirectasList =
          _miRed.where((persona) => persona['nivel'] == 1).toList();
      _lineasDirectas = _lineasDirectasList.length;
      notifyListeners();
    } catch (e) {
      print('Error al cargar líneas directas: $e');
    }
  }

  Future<bool> actualizarDatosPersonales(Map<String, dynamic> datos,
      {File? fotoPerfil}) async {
    _error = null;
    int userId = _usuario?.idUsuario ?? 1;

    bool success = await _service.actualizarDatosPersonales(
      userId,
      datos,
      fotoPerfil: fotoPerfil,
    );
    if (success) {
      await cargarDatosPersonales();
      _error = null;
    }
    return success;
  }
  Future<bool> actualizarDireccion(
      int direccionId, Map<String, dynamic> direccion) async {
    try {
      int userId = _usuario?.idUsuario ?? 1;
      bool success =
          await _service.actualizarDireccion(userId, direccionId, direccion);

      if (success) {
        await cargarDatosPersonales(); // Recargar datos
      }

      return success;
    } catch (e) {
      _error = 'Error al actualizar dirección: $e';
      notifyListeners();
      return false;
    }
  }

  Future<bool> cambiarContrasena(
      String contrasenaActual, String contrasenaNueva) async {
    try {
      int userId = _usuario?.idUsuario ?? 1;
      return await _service.cambiarContrasena(
          userId, contrasenaActual, contrasenaNueva);
    } catch (e) {
      _error = 'Error al cambiar contraseña: $e';
      notifyListeners();
      return false;
    }
  }

  Future<bool> eliminarFotoPerfil() async {
    try {
      int userId = _usuario?.idUsuario ?? 1;
      bool success = await _service.eliminarFotoPerfil(userId);

      if (success) {
        await cargarDatosPersonales(); // Recargar datos
      }

      return success;
    } catch (e) {
      _error = 'Error al eliminar foto: $e';
      notifyListeners();
      return false;
    }
  }

  void actualizarPuntosPorCompra(double montoCompra) {
    int puntosGanados = (montoCompra / 10000).floor();
    _puntosActuales += puntosGanados;
    _comprasRealizadas++;
    notifyListeners();
  }

  void limpiarError() {
    _error = null;
    notifyListeners();
  }
}
