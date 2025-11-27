import 'package:flutter/material.dart';
import '../models/categoria.dart';
import '../models/producto.dart';
import '../services/api_service.dart';

class ProductosProvider extends ChangeNotifier {
  final ApiService _apiService;ProductosProvider({ApiService? apiService})
  : _apiService = apiService ?? ApiService();

  List<Producto> _productos = [];
  List<Categoria> _categorias = [];
  bool _isLoading = false;
  String? _error;
  String? _selectedCategoria;
  String? _selectedSubcategoria;
  String _searchQuery = '';

  List<Producto> get productos {
    if (_selectedCategoria == null && _searchQuery.isEmpty) {
      return _productos;
    }

    return _productos.where((producto) {
      bool matchCategoria = true;
      if (_selectedCategoria != null) {
        matchCategoria = producto.categoria.toLowerCase() ==
            _selectedCategoria!.toLowerCase();
      }
      bool matchSubcategoria = true;
      if (_selectedSubcategoria != null) {
        matchSubcategoria = producto.subcategoria.toLowerCase() ==
            _selectedSubcategoria!.toLowerCase();
      }
      bool matchSearch = true;
      if (_searchQuery.isNotEmpty) {
        final query = _searchQuery.toLowerCase();
        final nombre = producto.nombre.toLowerCase();
        matchSearch = nombre.contains(query);
      }
      return matchCategoria && matchSubcategoria && matchSearch;
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

  Future<void> cargarProductos() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      print('ProductosProvider: Iniciando carga de productos...');

      final results = await Future.wait([
        _apiService.obtenerProductos(),
        _apiService.obtenerCatalogo(),
      ]);

      _productos = results[0] as List<Producto>;
      _categorias = results[1] as List<Categoria>;

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
  void onSearchChanged(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  void seleccionarCategoria(String? categoria) {
    _selectedCategoria = categoria;
    _selectedSubcategoria = null;
    notifyListeners();
  }

  void seleccionarSubcategoria(String? subcategoria) {
    _selectedSubcategoria = subcategoria;
    notifyListeners();
  }

  void limpiarFiltros() {
    _selectedCategoria = null;
    _selectedSubcategoria = null;
    _searchQuery = '';
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
