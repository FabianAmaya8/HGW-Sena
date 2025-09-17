import 'membresia.dart';

class Usuario {
  final int idUsuario;
  final String nombre;
  final String apellido;
  final String nombreUsuario;
  final String correoElectronico;
  final String? numeroTelefono;
  final String? urlFotoPerfil;
  final String? patrocinador;
  final String? nombreMedio;
  final List<DireccionPersonal> direcciones;
  final Membresia? membresia;

  Usuario({
    required this.idUsuario,
    required this.nombre,
    required this.apellido,
    required this.nombreUsuario,
    required this.correoElectronico,
    this.numeroTelefono,
    this.urlFotoPerfil,
    this.patrocinador,
    this.nombreMedio,
    required this.direcciones,
    this.membresia,
  });

  factory Usuario.fromJson(Map<String, dynamic> json) {
    return Usuario(
      idUsuario: json['id_usuario'],
      nombre: json['nombre'] ?? '',
      apellido: json['apellido'] ?? '',
      nombreUsuario: json['nombre_usuario'] ?? '',
      correoElectronico: json['correo_electronico'] ?? '',
      numeroTelefono: json['numero_telefono'],
      urlFotoPerfil: json['url_foto_perfil'],
      patrocinador: json['patrocinador'],
      nombreMedio: json['nombre_medio'],
      direcciones: (json['direcciones'] as List?)
              ?.map((d) => DireccionPersonal.fromJson(d))
              .toList() ??
          [],
      membresia: json['membresia'] != null
          ? Membresia.fromJson(json['membresia'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'nombre': nombre,
      'apellido': apellido,
      'correo_electronico': correoElectronico,
      'numero_telefono': numeroTelefono,
    };
  }
}

class DireccionPersonal {
  final int? idDireccion;
  final String direccion;
  final String? codigoPostal;
  final String? lugarEntrega;
  final int? ciudadId;
  final int? paisId;
  final String? ciudad;
  final String? pais;

  DireccionPersonal({
    this.idDireccion,
    required this.direccion,
    this.codigoPostal,
    this.lugarEntrega,
    this.ciudadId,
    this.paisId,
    this.ciudad,
    this.pais,
  });

  factory DireccionPersonal.fromJson(Map<String, dynamic> json) {
    return DireccionPersonal(
      idDireccion: json['id_direccion'],
      direccion: json['direccion'] ?? '',
      codigoPostal: json['codigo_postal'],
      lugarEntrega: json['lugar_entrega'],
      ciudadId: json['ciudad_id'],
      paisId: json['pais_id'],
      ciudad: json['ciudad'],
      pais: json['pais'],
    );
  }
}
