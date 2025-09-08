class Direccion {
  final int id;
  final String direccion;
  final String codigoPostal;
  final String lugarEntrega;
  final String? ciudad;
  final String? pais;

  Direccion({
    required this.id,
    required this.direccion,
    required this.codigoPostal,
    required this.lugarEntrega,
    this.ciudad,
    this.pais,
  });

  factory Direccion.fromJson(Map<String, dynamic> json) {
    return Direccion(
      id: json['id_direccion'] ?? 0,
      direccion: json['direccion'] ?? '',
      codigoPostal: json['codigo_postal'] ?? '',
      lugarEntrega: json['lugar_entrega'] ?? '',
      ciudad: json['ciudad'],
      pais: json['pais'],
    );
  }

  String get direccionCompleta {
    String result = direccion;
    if (ciudad != null) result += ', $ciudad';
    if (pais != null) result += ', $pais';
    return result;
  }
}
