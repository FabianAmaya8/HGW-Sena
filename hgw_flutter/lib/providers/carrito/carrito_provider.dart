import 'package:flutter/material.dart';
import '../../models/carrito/carrito_item.dart';
import '../../models/carrito/direccion.dart';
import '../../models/carrito/medio_pago.dart';
import '../../services/carrito/carrito_service.dart';

class CarritoProvider extends ChangeNotifier {
  final CarritoService _service;

  CarritoProvider({CarritoService? service})
      : _service = service ?? CarritoService();

  List<CarritoItem> _items = [];
  List<Direccion> _direcciones = [];
  List<MedioPago> _mediosPago = [];
  Direccion? _direccionSeleccionada;
  MedioPago? _medioPagoSeleccionado;

  bool _isLoading = false;
  String? _mensaje;
  int? _userId;

  List<CarritoItem> get items => _items;
  List<Direccion> get direcciones => _direcciones;
  List<MedioPago> get mediosPago => _mediosPago;
  Direccion? get direccionSeleccionada => _direccionSeleccionada;
  MedioPago? get medioPagoSeleccionado => _medioPagoSeleccionado;
  bool get isLoading => _isLoading;
  String? get mensaje => _mensaje;

  double get total => _items.fold(0, (sum, item) => sum + item.subtotal);
  int get cantidadTotal => _items.fold(0, (sum, item) => sum + item.cantidad);

  void setUserId(int userId) {
    _userId = userId;
    notifyListeners();
  }

  void limpiarEstado() {
    _userId = null;
    _items = [];
    _direcciones = [];
    _mediosPago = [];
    _direccionSeleccionada = null;
    _medioPagoSeleccionado = null;
    _mensaje = null;
    notifyListeners();
  }

  void limpiarCarrito() {
    _items = [];
    notifyListeners();
  }

  Future<void> cargarCarrito() async {
    if (_userId == null) return;

    _isLoading = true;
    notifyListeners();

    try {
      final result = await _service.obtenerCarrito(_userId!);
      _items = result['items'] ?? [];
      _mensaje = result['mensaje'];

      if (result['eliminados'] != null &&
          (result['eliminados'] as List).isNotEmpty) {
        _mensaje =
            'Algunos productos fueron eliminados: ${result['eliminados'].join(', ')}';
      }
    } catch (e) {
      print('Error cargando carrito: $e');
      _mensaje = 'Error al cargar el carrito';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> agregarProducto(int idProducto, int cantidad) async {
    if (_userId == null) return false;

    try {
      final success =
          await _service.agregarProducto(_userId!, idProducto, cantidad);
      if (success) {
        await cargarCarrito();
        return true;
      }
      return false;
    } catch (e) {
      print('Error agregando producto: $e');
      return false;
    }
  }

  Future<void> actualizarCantidad(int idProducto, int nuevaCantidad) async {
    if (_userId == null || nuevaCantidad <= 0) return;

    try {
      final success = await _service.actualizarCantidad(
          _userId!, idProducto, nuevaCantidad);
      if (success) {
        final item = _items.firstWhere((i) => i.idProducto == idProducto);
        item.cantidad = nuevaCantidad;
        notifyListeners();
      }
    } catch (e) {
      print('Error actualizando cantidad: $e');
    }
  }

  Future<void> eliminarProducto(int idProducto) async {
    if (_userId == null) return;

    try {
      final success = await _service.eliminarProducto(_userId!, idProducto);
      if (success) {
        _items.removeWhere((item) => item.idProducto == idProducto);
        notifyListeners();
      }
    } catch (e) {
      print('Error eliminando producto: $e');
    }
  }

  Future<void> cargarDirecciones() async {
    if (_userId == null) return;

    try {
      _direcciones = await _service.obtenerDirecciones(_userId!);

      if (_direccionSeleccionada != null &&
          !_direcciones.any((d) => d.id == _direccionSeleccionada!.id)) {
        _direccionSeleccionada = null;
      }

      if (_direcciones.isNotEmpty && _direccionSeleccionada == null) {
        _direccionSeleccionada = _direcciones.first;
      }

      notifyListeners();
    } catch (e) {
      print('Error cargando direcciones: $e');
    }
  }

  Future<bool> agregarDireccion({
    required String lugarEntrega,
    required String direccion,
    required String ciudad,
    required String pais,
    required String codigoPostal,
  }) async {
    if (_userId == null) return false;

    try {
      final success = await _service.crearDireccion(
        userId: _userId!,
        lugarEntrega: lugarEntrega,
        direccion: direccion,
        ciudad: ciudad,
        pais: pais,
        codigoPostal: codigoPostal,
      );

      if (success) {
        await cargarDirecciones();
        return true;
      }
      return false;
    } catch (e) {
      print('Error agregando dirección: $e');
      return false;
    }
  }

  Future<bool> eliminarDireccion(int direccionId) async {
    if (_userId == null) return false;

    try {
      final success = await _service.eliminarDireccion(_userId!, direccionId);

      if (success) {
        _direcciones.removeWhere((d) => d.id == direccionId);

        if (_direccionSeleccionada?.id == direccionId) {
          _direccionSeleccionada =
              _direcciones.isNotEmpty ? _direcciones.first : null;
        }

        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      print('Error eliminando dirección: $e');
      return false;
    }
  }

  Future<void> cargarMediosPago() async {
    try {
      _mediosPago = await _service.obtenerMediosPago();
      if (_mediosPago.isNotEmpty && _medioPagoSeleccionado == null) {
        _medioPagoSeleccionado = _mediosPago.first;
      }
      notifyListeners();
    } catch (e) {
      print('Error cargando medios de pago: $e');
    }
  }

  void seleccionarDireccion(Direccion direccion) {
    _direccionSeleccionada = direccion;
    notifyListeners();
  }

  void seleccionarMedioPago(MedioPago medio) {
    _medioPagoSeleccionado = medio;
    notifyListeners();
  }

  Future<int?> crearOrden() async {
    if (_userId == null ||
        _direccionSeleccionada == null ||
        _medioPagoSeleccionado == null ||
        _items.isEmpty) {
      return null;
    }

    try {
      final idOrden = await _service.crearOrden(
        _userId!,
        _direccionSeleccionada!.id,
        _medioPagoSeleccionado!.id,
        total,
        _items,
      );

      if (idOrden != null) {
        _items.clear();
        _direccionSeleccionada = null;
        _medioPagoSeleccionado = null;
        notifyListeners();
      }

      return idOrden;
    } catch (e) {
      print('Error creando orden: $e');
      return null;
    }
  }

  Future<Map<String, List<String>>> obtenerUbicaciones() async {
    try {
      return await _service.obtenerUbicaciones();
    } catch (e) {
      print('Error obteniendo ubicaciones: $e');
      return {};
    }
  }

  void limpiarMensaje() {
    _mensaje = null;
    notifyListeners();
  }
}
