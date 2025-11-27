import 'package:flutter_test/flutter_test.dart';
import 'package:hgw/models/producto.dart';
import 'package:hgw/models/carrito/carrito_item.dart';
import 'package:hgw/providers/productos_provider.dart';
import 'package:hgw/providers/carrito/carrito_provider.dart';
import 'package:hgw/services/api_service.dart';
import 'package:hgw/services/carrito/carrito_service.dart';
import 'package:hgw/models/categoria.dart';

class MockApiService implements ApiService {
  bool simularError = false;

  @override
  Future<List<Producto>> obtenerProductos() async {
    if (simularError) throw Exception("Error 500: Server Down");
    return [
      Producto(
          idProducto: 1,
          nombre: 'Manzana',
          categoria: 'Frutas',
          subcategoria: 'Rojas',
          precio: 1000.0,
          puntosBV: 10,
          stock: 50,
          imagen: 'uwu.png'),
      Producto(
          idProducto: 2,
          nombre: 'Jabón',
          categoria: 'Aseo',
          subcategoria: 'Baño',
          precio: 2000.0,
          puntosBV: 5,
          stock: 20,
          imagen: '777.png'),
    ];
  }

  @override
  Future<List<Categoria>> obtenerCatalogo() async => [];
  @override
  void dispose() {}
  @override
  dynamic noSuchMethod(Invocation invocation) => super.noSuchMethod(invocation);
}
class MockCarritoService implements CarritoService {
  List<CarritoItem> itemsSimulados = [];

  @override
  Future<bool> agregarProducto(int userId, int idProducto, int cantidad) async {
    itemsSimulados.add(CarritoItem(
      idProducto: idProducto,
      nombre: 'Producto Test',
      precio: 2000.0,
      cantidad: cantidad,
      imagen: 'img.png',
      stock: 99,
    ));
    return true;
  }
  @override
  Future<Map<String, dynamic>> obtenerCarrito(int userId) async {
    return {
      'items': List<CarritoItem>.from(itemsSimulados),
      'mensaje': 'Carrito cargado ok'
    };
  }
  @override
  dynamic noSuchMethod(Invocation invocation) => super.noSuchMethod(invocation);
}

void main() {
  group('1. Integridad de Modelos (Data Parsing)', () {
    test('Debe convertir un JSON válido en un objeto Producto correctamente',
        () {
      final json = {
        'id_producto': 10,
        'nombre': 'Vitaminas',
        'categoria': 'Salud',
        'subcategoria': 'Suplementos',
        'precio': 50000.0,
        'puntos_bv': 20,
        'stock': 100,
        'imagen': 'owo.jpg'
      };
      final producto = Producto.fromJson(json);
      expect(producto.idProducto, 10);
      expect(producto.precio, 50000.0);
    });
  });
  group('2. Lógica del CarritoProvider (Core Business)', () {
    late CarritoProvider carrito;
    late MockCarritoService mockService;

    setUp(() {
      mockService = MockCarritoService();
      carrito = CarritoProvider(service: mockService);
      carrito.setUserId(1);
    });

    test('Debe agregar un producto a la lista del carrito', () async {
      await carrito.agregarProducto(1, 2);
      expect(carrito.cantidadTotal, 2);
      expect(carrito.items.length, 1);
    });

    test('Limpiar carrito debe dejar el estado en cero', () async {
      await carrito.agregarProducto(1, 5);
      expect(carrito.cantidadTotal, 5);
      carrito.limpiarCarrito();
      expect(carrito.items.isEmpty, true);
      expect(carrito.cantidadTotal, 0);
    });
  });

  group('3. Lógica de ProductosProvider (State Management)', () {
    late ProductosProvider provider;
    late MockApiService mockService;

    setUp(() {
      mockService = MockApiService();
      provider = ProductosProvider(apiService: mockService);
    });

    test('Debe cambiar isLoading a true y luego a false al cargar', () async {
      final future = provider.cargarProductos();
      expect(provider.isLoading, true);
      await future;
      expect(provider.isLoading, false);
    });

    test('Debe capturar errores de la API y guardarlos en la variable error',
        () async {
      mockService.simularError = true;
      await provider.cargarProductos();
      expect(provider.error, contains('Error'));
    });

    test('El getter "productos" debe filtrar la lista original sin borrarla',
        () async {
      await provider.cargarProductos();
      provider.seleccionarCategoria('Aseo');
      expect(provider.productos.length, 1);
      provider.limpiarFiltros();
      expect(provider.productos.length, 2);
    });

    test('La búsqueda debe ignorar mayúsculas (Case Insensitive)', () async {
      await provider.cargarProductos();
      provider.onSearchChanged('manzana');
      expect(provider.productos.length, 1);
    });
  });
}
