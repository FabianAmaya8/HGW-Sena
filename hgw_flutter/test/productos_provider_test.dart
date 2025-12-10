import 'package:flutter_test/flutter_test.dart';
import 'package:hgw/providers/productos_provider.dart';
import 'package:hgw/models/producto.dart';
import 'package:hgw/models/categoria.dart';
import 'package:hgw/services/api_service.dart';

class FakeApiService implements ApiService {
  @override
  Future<List<Producto>> obtenerProductos() async {
    return [
      Producto(
          idProducto: 1,
          categoria: 'Frutas',
          subcategoria: 'Rojas',
          nombre: 'Manzana Roja',
          precio: 5000.0,
          puntosBV: 10, 
          stock: 10,
          imagen: 'https://via.placeholder.com/150'),
      Producto(
          idProducto: 2,
          categoria: 'Frutas',
          subcategoria: 'Verdes',
          nombre: 'Manzana Verde',
          precio: 5000.0,
          puntosBV: 10,
          stock: 10,
          imagen: 'https://via.placeholder.com/150'),
      Producto(
          idProducto: 3,
          categoria: 'Bebidas',
          subcategoria: 'Gaseosas',
          nombre: 'Gaseosa Cola',
          precio: 3000.0,
          puntosBV: 5,
          stock: 20,
          imagen: 'https://via.placeholder.com/150'),
    ];
  }

  @override
  Future<List<Categoria>> obtenerCatalogo() async {
    return [
      Categoria(idCategoria: 1, nombreCategoria: 'Frutas'),
      Categoria(idCategoria: 2, nombreCategoria: 'Bebidas'),
    ];
  }

  @override void dispose() {}

  @override dynamic noSuchMethod(Invocation invocation) => super.noSuchMethod(invocation);
}

void main() {
  late ProductosProvider provider;
  setUp(() async {
    provider = ProductosProvider(apiService: FakeApiService());
    await provider.cargarProductos();
  });
  group('Pruebas de Caja Blanca - ProductosProvider', () {
    test('1. Carga inicial correcta (debe haber 3 productos)', () {
      expect(provider.productos.length, 3);
      expect(provider.isLoading, false);
    });

    test('2. Filtro por Búsqueda (Debe encontrar "Manzana")', () {
      provider.onSearchChanged('Manzana');
      expect(provider.productos.length, 2);
      expect(provider.productos.first.nombre, contains('Manzana'));
    });

    test('3. Filtro por Categoría (Debe filtrar "Bebidas")', () {
      provider.seleccionarCategoria('Bebidas');
      expect(provider.productos.length, 1);
      expect(provider.productos.first.categoria, 'Bebidas');
    });

    test('4. Filtro Combinado (Categoría "Frutas" + Texto "Verde")', () {
      provider.seleccionarCategoria('Frutas');
      provider.onSearchChanged('Verde');
      expect(provider.productos.length, 1);
      expect(provider.productos.first.nombre, 'Manzana Verde');
    });

    test('5. Limpiar Filtros (Debe resetear todo)', () {
      provider.seleccionarCategoria('Frutas');
      provider.onSearchChanged('xyz');
      provider.limpiarFiltros();
      expect(provider.productos.length, 3);
      expect(provider.selectedCategoria, null);
    });
  });
}
