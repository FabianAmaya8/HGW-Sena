class MedioPago {
  final int id;
  final String nombre;

  MedioPago({
    required this.id,
    required this.nombre,
  });

  factory MedioPago.fromJson(Map<String, dynamic> json) {
    return MedioPago(
      id: json['id_medio'] ?? 0,
      nombre: json['nombre_medio'] ?? '',
    );
  }
}
