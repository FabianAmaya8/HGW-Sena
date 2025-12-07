import 'package:flutter_test/flutter_test.dart';
import 'package:hgw/models/carrito/carrito_item.dart';
import 'package:hgw/providers/carrito/carrito_provider.dart';
import 'package:hgw/services/carrito/carrito_service.dart';
class MockCarritoService implements CarritoService {
  List<CarritoItem> itemsSimulados = [];
  @override
  Future<bool> agregarProducto(int userId, int idProducto, int cantidad) async {
    itemsSimulados.add(CarritoItem(
      idProducto: idProducto,
      nombre: 'Producto Test',
      precio: 5000.0,
      cantidad: cantidad,
      stock: 100,
    ));
    return true;
  }
  @override
  Future<Map<String, dynamic>> obtenerCarrito(int userId) async {
    return {'items': itemsSimulados, 'mensaje': null};
  }
  @override dynamic noSuchMethod(Invocation invocation)=>super.noSuchMethod(invocation);
}

void main() {
  group('1. Modelo CarritoItem-logica Interna', () {
    test('Debe calcular el subtotal correctamente (Precio x Cantidad)', () {
      final item = CarritoItem(
          idProducto: 1,
          nombre: 'Café',
          precio: 15000.0,
          cantidad: 3,
          stock: 50);
      expect(item.subtotal, 45000.0);
    });
    test('Debe asignar imagen por defecto si la URL es inválida', () {
      final json = {
        'id_producto': 1,
        'nombre_producto': 'Té Verde',
        'precio_producto': 12000,
        'cantidad_producto': 1,
        'stock': 20,
        'imagen_producto':
            'ruta_sin_http'
      };

      final item = CarritoItem.fromJson(json); expect(item.imagen, contains('placeholder.com'));
    });
  });
  group('2. CarritoProvider - Gestión de Estado', () {
    late CarritoProvider provider;
    late MockCarritoService mockService;
    setUp(() {
      mockService = MockCarritoService();
      provider = CarritoProvider(service: mockService);
      provider.setUserId(123);
    });
    test('Agregar producto debe actualizar la lista y el total', () async {
      await provider.agregarProducto(1, 2);
      expect(provider.items.length, 1,
          reason: 'La lista debe tener 1 elemento');
      expect(provider.cantidadTotal, 2, reason: 'La cantidad total debe ser 2');
      expect(provider.total, 10000.0,
          reason: 'El total monetario debe ser 10.000');
    });
    test('Limpiar carrito debe dejar todo en cero', () async {
      await provider.agregarProducto(1, 5);
      provider.limpiarCarrito();
      expect(provider.items.isEmpty, true);
      expect(provider.total, 0.0);
    });
    test('No debe permitir agregar productos si no hay usuario (Login check)',
        () async {
      provider.limpiarEstado();
      final resultado = await provider.agregarProducto(1, 1);
      expect(resultado, false,reason: 'Debe rechazar la acción si usuario es null');
      expect(provider.items.isEmpty, true);
    });
  });
}
