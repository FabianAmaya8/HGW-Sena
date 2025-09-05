import 'package:flutter/material.dart';
import '../../models/carrito/carrito_item.dart';
import '../../models/carrito/direccion.dart';
import '../../models/carrito/medio_pago.dart';
import '../../services/carrito/carrito_service.dart';

class CarritoProvider extends ChangeNotifier {
  final CarritoService _service = CarritoService();

  List<CarritoItem> _items = [];
  List<Direccion> _direcciones = [];
  List<MedioPago> _mediosPago = [];
  Direccion? _direccionSeleccionada;
  MedioPago? _medioPagoSeleccionado;
  bool _isLoading = false;
  String? _mensaje;

  
  final int _userId = 1;

  // Getters
  List<CarritoItem> get items => _items;
  List<Direccion> get direcciones => _direcciones;
  List<MedioPago> get mediosPago => _mediosPago;
  Direccion? get direccionSeleccionada => _direccionSeleccionada;
  MedioPago? get medioPagoSeleccionado => _medioPagoSeleccionado;
  bool get isLoading => _isLoading;
  String? get mensaje => _mensaje;

  double get total => _items.fold(0, (sum, item) => sum + item.subtotal);
  int get cantidadTotal => _items.fold(0, (sum, item) => sum + item.cantidad);

  Future<void> cargarCarrito() async {
    _isLoading = true;
    notifyListeners();

    try {
      final result = await _service.obtenerCarrito(_userId);
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
    try {
      final success =
          await _service.agregarProducto(_userId, idProducto, cantidad);
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
    if (nuevaCantidad <= 0) return;

    try {
      final success =
          await _service.actualizarCantidad(_userId, idProducto, nuevaCantidad);
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
    try {
      final success = await _service.eliminarProducto(_userId, idProducto);
      if (success) {
        _items.removeWhere((item) => item.idProducto == idProducto);
        notifyListeners();
      }
    } catch (e) {
      print('Error eliminando producto: $e');
    }
  }

  Future<void> cargarDirecciones() async {
    try {
      _direcciones = await _service.obtenerDirecciones(_userId);
      if (_direcciones.isNotEmpty && _direccionSeleccionada == null) {
        _direccionSeleccionada = _direcciones.first;
      }
      notifyListeners();
    } catch (e) {
      print('Error cargando direcciones: $e');
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
    if (_direccionSeleccionada == null ||
        _medioPagoSeleccionado == null ||
        _items.isEmpty) {
      return null;
    }

    try {
      final idOrden = await _service.crearOrden(
        _userId,
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

  void limpiarMensaje() {
    _mensaje = null;
    notifyListeners();
  }
}
