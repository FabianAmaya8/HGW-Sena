import 'package:flutter/material.dart';
import '../models/categoria.dart';
import '../models/producto.dart';
import '../services/api_service.dart';

class ProductosProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();

  List<Producto> _productos = [];
  List<Categoria> _categorias = [];
  bool _isLoading = false;
  String? _error;
  String? _selectedCategoria;
  String? _selectedSubcategoria;

  // Getters
  List<Producto> get productos {
    if (_selectedCategoria == null) {
      return _productos;
    }

    return _productos.where((producto) {
      bool matchCategoria =
          producto.categoria.toLowerCase() == _selectedCategoria!.toLowerCase();

      if (_selectedSubcategoria != null) {
        bool matchSubcategoria = producto.subcategoria.toLowerCase() ==
            _selectedSubcategoria!.toLowerCase();
        return matchCategoria && matchSubcategoria;
      }

      return matchCategoria;
    }).toList();
  }

  List<Categoria> get categorias => _categorias;
  bool get isLoading => _isLoading;
  String? get error => _error;
  String? get selectedCategoria => _selectedCategoria;
  String? get selectedSubcategoria => _selectedSubcategoria;

  Set<String> get categoriasUnicas {
    return _productos
        .map((p) => p.categoria)
        .where((cat) => cat.isNotEmpty)
        .toSet();
  }

  Set<String> get subcategoriasUnicas {
    if (_selectedCategoria == null) return {};

    return _productos
        .where((p) =>
            p.categoria.toLowerCase() == _selectedCategoria!.toLowerCase())
        .map((p) => p.subcategoria)
        .where((subcat) => subcat.isNotEmpty)
        .toSet();
  }

  // Métodos
  Future<void> cargarProductos() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      print('ProductosProvider: Iniciando carga de productos...');

      // Cargar productos y categorías en paralelo
      final results = await Future.wait([
        _apiService.obtenerProductos(),
        _apiService.obtenerCatalogo(),
      ]);

      _productos = results[0] as List<Producto>;
      _categorias = results[1] as List<Categoria>;

      print('ProductosProvider: Productos cargados: ${_productos.length}');
      print('ProductosProvider: Categorías cargadas: ${_categorias.length}');

      _error = null;
    } catch (e) {
      print('ProductosProvider Error: $e');
      _error = _parseError(e.toString());
      _productos = [];
      _categorias = [];
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void seleccionarCategoria(String? categoria) {
    _selectedCategoria = categoria;
    _selectedSubcategoria = null; // Reset subcategoría al cambiar categoría
    notifyListeners();
  }

  void seleccionarSubcategoria(String? subcategoria) {
    _selectedSubcategoria = subcategoria;
    notifyListeners();
  }

  void limpiarFiltros() {
    _selectedCategoria = null;
    _selectedSubcategoria = null;
    notifyListeners();
  }

  String _parseError(String error) {
    if (error.contains('SocketException')) {
      return 'No se pudo conectar al servidor. Verifica tu conexión a internet.';
    } else if (error.contains('TimeoutException')) {
      return 'La conexión tardó demasiado. Intenta nuevamente.';
    } else if (error.contains('FormatException')) {
      return 'Error al procesar los datos del servidor.';
    } else {
      return 'Error inesperado. Por favor, intenta nuevamente.';
    }
  }

  @override
  void dispose() {
    _apiService.dispose();
    super.dispose();
  }
}
