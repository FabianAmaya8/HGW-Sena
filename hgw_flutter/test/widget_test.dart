import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:hgw/screens/catalogo_screen.dart';
import 'package:hgw/providers/productos_provider.dart';
import 'package:hgw/providers/carrito/carrito_provider.dart';
import 'package:hgw/services/api_service.dart';
import 'package:hgw/services/carrito/carrito_service.dart';
import 'package:hgw/models/producto.dart';
import 'package:hgw/models/categoria.dart';

class MockApiService implements ApiService {
  @override
  Future<List<Producto>> obtenerProductos() async{
    return [];
  }
  @override
  Future<List<Categoria>> obtenerCatalogo() async{
    return []; }
  @override
  void dispose() {}
  @override dynamic noSuchMethod(Invocation invocation) => super.noSuchMethod(invocation);
}
class MockCarritoService implements CarritoService {
  @override
  Future<Map<String, dynamic>> obtenerCarrito(int userId) async {
    return {'items': [], 'mensaje': ''};
  }
  @override
  dynamic noSuchMethod(Invocation invocation) => super.noSuchMethod(invocation);
}

void main() {
  testWidgets(
      'La pantalla debe mostrar el título Catálogo y la barra de búsqueda',
      (WidgetTester tester) async {
    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(
              create: (_) => ProductosProvider(apiService: MockApiService())),
          ChangeNotifierProvider(
              create: (_) => CarritoProvider(service: MockCarritoService())),
        ],
        child: const MaterialApp(
          home: CatalogoScreen(),
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('Catálogo'), findsOneWidget);
    expect(find.byType(TextField), findsOneWidget);
    expect(find.byIcon(Icons.search), findsOneWidget);
  });
}
