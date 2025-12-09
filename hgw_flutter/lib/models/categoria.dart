class Categoria {
  final int idCategoria;
  final String nombreCategoria;
  final int? idSubcategoria;
  final String? nombreSubcategoria;

  Categoria({
    required this.idCategoria,
    required this.nombreCategoria,
    this.idSubcategoria,
    this.nombreSubcategoria,
  });

  factory Categoria.fromJson(Map<String, dynamic> json) {
    try {
      return Categoria(
        idCategoria: json['id_categoria'] ?? 0,
        nombreCategoria:
            json['nombre_categoria']?.toString() ?? 'Sin categoría',
        idSubcategoria: json['id_subcategoria'] as int?,
        nombreSubcategoria: json['nombre_subcategoria']?.toString(),
      );
    } catch (e) {
      print('Error parsing Categoria: $e');
      print('JSON data: $json');
      throw Exception('Error al parsear categoría: $e');
    }
  }
}
