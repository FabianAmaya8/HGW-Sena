class RespuestaCompra {
  final bool success;
  final String? message;
  final int? idOrden;
  final int puntosGanados;
  final bool subioRango;
  final String? nuevoRango;
  final int nuevoTotalBv;

  RespuestaCompra({
    required this.success,
    this.message,
    this.idOrden,
    this.puntosGanados = 0,
    this.subioRango = false,
    this.nuevoRango,
    this.nuevoTotalBv = 0,
  });

  factory RespuestaCompra.fromJson(Map<String, dynamic> json) {
    return RespuestaCompra(
      success: json['success'] ?? false,
      message: json['message'] ?? json['error'],
      idOrden: json['id_orden'],
      puntosGanados: json['puntos_ganados'] ?? 0,
      subioRango: json['subio_rango'] ?? false,
      nuevoRango: json['nombre_nuevo_rango'],
      nuevoTotalBv: json['nuevo_total_bv'] ?? 0,
    );
  }
}
