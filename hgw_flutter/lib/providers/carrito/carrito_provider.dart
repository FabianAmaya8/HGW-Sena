import 'package:flutter/material.dart';
import '../../models/carrito/carrito_item.dart';
import '../../models/carrito/direccion.dart';
import '../../models/carrito/medio_pago.dart';
import '../../models/carrito/respuesta_compra.dart';
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

  void limpiarMensaje() {
    _mensaje = null;
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
      _mensaje = 'Error al cargar el carrito';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> agregarProducto(int id, int cant) async {
    if (_userId == null) return false;
    if (await _service.agregarProducto(_userId!, id, cant)) {
      await cargarCarrito();
      return true;
    }
    return false;
  }

  Future<void> actualizarCantidad(int id, int cant) async {
    if (_userId != null &&
        cant > 0 &&
        await _service.actualizarCantidad(_userId!, id, cant)) {
      _items.firstWhere((i) => i.idProducto == id).cantidad = cant;
      notifyListeners();
    }
  }

  Future<void> eliminarProducto(int id) async {
    if (_userId != null && await _service.eliminarProducto(_userId!, id)) {
      _items.removeWhere((i) => i.idProducto == id);
      notifyListeners();
    }
  }

  Future<void> cargarDirecciones() async {
    if (_userId == null) return;
    _direcciones = await _service.obtenerDirecciones(_userId!);
    if (_direccionSeleccionada != null &&
        !_direcciones.any((d) => d.id == _direccionSeleccionada!.id)) {
      _direccionSeleccionada = null;
    }
    if (_direcciones.isNotEmpty && _direccionSeleccionada == null) {
      _direccionSeleccionada = _direcciones.first;
    }
    notifyListeners();
  }

  Future<bool> agregarDireccion(
      {required String lugarEntrega,
      required String direccion,
      required String ciudad,
      required String pais,
      required String codigoPostal}) async {
    if (_userId != null &&
        await _service.crearDireccion(
            userId: _userId!,
            lugarEntrega: lugarEntrega,
            direccion: direccion,
            ciudad: ciudad,
            pais: pais,
            codigoPostal: codigoPostal)) {
      await cargarDirecciones();
      return true;
    }
    return false;
  }

  Future<bool> eliminarDireccion(int id) async {
    if (_userId != null && await _service.eliminarDireccion(_userId!, id)) {
      _direcciones.removeWhere((d) => d.id == id);
      if (_direccionSeleccionada?.id == id) {
        _direccionSeleccionada =
            _direcciones.isNotEmpty ? _direcciones.first : null;
      }
      notifyListeners();
      return true;
    }
    return false;
  }

  Future<void> cargarMediosPago() async {
    _mediosPago = await _service.obtenerMediosPago();
    if (_mediosPago.isNotEmpty && _medioPagoSeleccionado == null) {
      _medioPagoSeleccionado = _mediosPago.first;
    }
    notifyListeners();
  }

  void seleccionarDireccion(Direccion d) {
    _direccionSeleccionada = d;
    notifyListeners();
  }

  void seleccionarMedioPago(MedioPago m) {
    _medioPagoSeleccionado = m;
    notifyListeners();
  }

  Future<Map<String, List<String>>> obtenerUbicaciones() async =>
      await _service.obtenerUbicaciones();

  Future<RespuestaCompra> crearOrden() async {
    if (_userId == null ||
        _direccionSeleccionada == null ||
        _medioPagoSeleccionado == null ||
        _items.isEmpty) {
      return RespuestaCompra(
          success: false, message: "Faltan datos para la orden");
    }

    try {
      final respuesta = await _service.crearOrden(
        _userId!,
        _direccionSeleccionada!.id,
        _medioPagoSeleccionado!.id,
        total,
        _items,
      );

      if (respuesta.success) {
        _items.clear();
        _direccionSeleccionada = null;
        _medioPagoSeleccionado = null;
        notifyListeners();
      }

      return respuesta;
    } catch (e) {
      print('Error creando orden: $e');
      return RespuestaCompra(success: false, message: "Error interno: $e");
    }
  }
}
