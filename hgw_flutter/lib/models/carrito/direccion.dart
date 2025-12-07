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
      id: json['id'] ?? json['id_direccion'] ?? 0,
      direccion: json['direccion'] ?? '',
      codigoPostal: json['codigo_postal'] ?? '',
      lugarEntrega: json['lugar_entrega'] ?? '',
      ciudad: json['ciudad'],
      pais: json['pais'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'direccion': direccion,
      'codigo_postal': codigoPostal,
      'lugar_entrega': lugarEntrega,
      'ciudad': ciudad,
      'pais': pais,
    };
  }
}
