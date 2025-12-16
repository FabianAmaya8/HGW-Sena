class Membresia {
  final int idMembresia;
  final String nombreMembresia;
  final double? precioMembresia;
  final int puntosRequeridos;
  final int puntosActuales;

  Membresia({
    required this.idMembresia,
    required this.nombreMembresia,
    this.precioMembresia,
    required this.puntosRequeridos,
    this.puntosActuales = 0,
  });

  factory Membresia.fromJson(Map<String, dynamic> json) {
    Map<String, int> puntosPorNivel = {
      'Cliente': 0,
      'Pre-Junior': 50,
      'Junior': 100,
      'Senior': 300,
      'Master': 600,
    };

    Map<String, double> preciosPorNivel = {
      'Cliente': 0,
      'Pre-Junior': 400000,
      'Junior': 800000,
      'Senior': 2240000,
      'Master': 4200000,
    };

    String nombre = json['nombre_membresia'] ?? 'Cliente';
    int puntosReales = 0;
    if (json['bv_acumulados'] != null) {
      puntosReales = int.tryParse(json['bv_acumulados'].toString()) ?? 0;
    } else if (json['puntos_actuales'] != null) {
      puntosReales = int.tryParse(json['puntos_actuales'].toString()) ?? 0;
    }

    return Membresia(
      idMembresia: json['membresia'] ?? json['id_membresia'] ?? 1,
      nombreMembresia: nombre,
      precioMembresia:
          json['precio_membresia']?.toDouble() ?? preciosPorNivel[nombre],
      puntosRequeridos: puntosPorNivel[nombre] ?? 0,
      puntosActuales: puntosReales,
    );
  }

  double get progreso {
    if (puntosRequeridos == 0) return 0;
    if (puntosActuales >= puntosRequeridos) return 1.0;
    return (puntosActuales / puntosRequeridos).clamp(0.0, 1.0);
  }

  String get nivelSiguiente {
    Map<String, String> siguienteNivel = {
      'Cliente': 'Pre-Junior',
      'Pre-Junior': 'Junior',
      'Junior': 'Senior',
      'Senior': 'Master',
      'Master': 'Master',
    };
    return siguienteNivel[nombreMembresia] ?? 'Pre-Junior';
  }

  int get puntosParaSiguienteNivel {
    Map<String, int> puntosNecesarios = {
      'Cliente': 50,
      'Pre-Junior': 100,
      'Junior': 300,
      'Senior': 600,
      'Master': 0, // Ya es el máximo
    };

    return puntosNecesarios[nombreMembresia] ?? 0;
  }
}
