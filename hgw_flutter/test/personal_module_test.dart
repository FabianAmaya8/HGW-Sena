import 'package:flutter_test/flutter_test.dart';
import 'package:hgw/models/personal/usuario.dart';
import 'package:hgw/models/personal/membresia.dart';
import 'package:hgw/services/personal/personal_service.dart';

class MockPersonalService implements PersonalService {
  bool simularError = false;

  @override
  Future<Usuario?> obtenerDatosPersonales(int userId) async {
    if (simularError) return null;

    return Usuario(
        idUsuario: userId,
        nombre: 'Juan',
        apellido: 'Pérez',
        nombreUsuario: 'juanperez',
        correoElectronico: 'juan@test.com',
        numeroTelefono: '123456789',
        urlFotoPerfil: 'https://via.placeholder.com/150',
        patrocinador: 'PatrocinadorTest',
        nombreMedio: 'Tarjeta',
        direcciones: [
          DireccionPersonal(
              idDireccion: 1,
              direccion: 'Calle Falsa 123',
              ciudad: 'Bogotá',
              pais: 'Colombia')
        ],
        membresia: Membresia(
            idMembresia: 1,
            nombreMembresia: 'Junior',
            puntosRequeridos: 100,
            puntosActuales: 50));
  }

  @override
  Future<bool> actualizarDatosPersonales(int userId, Map<String, dynamic> datos,
      {dynamic fotoPerfil}) async {
    return datos.isNotEmpty;
  }

  @override
  dynamic noSuchMethod(Invocation invocation) => super.noSuchMethod(invocation);
}

void main() {
  group('1. Modelos Personal - Integridad de Datos', () {
    test('Usuario.fromJson debe parsear correctamente estructuras anidadas',
        () {
      final json = {
        'id_usuario': 10,
        'nombre': 'Maria',
        'apellido': 'Gomez',
        'nombre_usuario': 'mariag',
        'correo_electronico': 'maria@test.com',
        'direcciones': [
          {
            'id_direccion': 5,
            'direccion': 'Av. Siempre Viva',
            'ciudad': 'Medellín'
          }
        ],
        'membresia': {
          'id_membresia': 2,
          'nombre_membresia': 'Senior',
          'puntos_actuales': 200
        }
      };

      final usuario = Usuario.fromJson(json);

      expect(usuario.nombre, 'Maria');
      expect(usuario.direcciones.length, 1);
      expect(usuario.direcciones.first.ciudad, 'Medellín');
      expect(usuario.membresia?.nombreMembresia, 'Senior');
    });

    test('Membresia: Cálculo de Progreso y Nivel Siguiente', () {
      final membresia = Membresia(
          idMembresia: 1,
          nombreMembresia: 'Junior',
          puntosRequeridos: 100,
          puntosActuales: 50);

      expect(membresia.progreso, 0.5); 
      expect(membresia.nivelSiguiente, 'Senior');
      expect(membresia.puntosParaSiguienteNivel, 300); 
    });

    test('Membresia: Manejo de valores nulos o por defecto', () {
      final jsonVacio = <String, dynamic>{};

      final membresia = Membresia.fromJson(jsonVacio);

      expect(membresia.nombreMembresia, 'Cliente');
      expect(membresia.puntosRequeridos, 0);
      expect(membresia.precioMembresia, 0.0);
    });
  });
  group('2. Lógica de Servicio Personal', () {
    late MockPersonalService servicio;

    setUp(() {
      servicio = MockPersonalService();
    });

    test('obtenerDatosPersonales debe retornar un Usuario completo', () async {
      final usuario = await servicio.obtenerDatosPersonales(1);

      expect(usuario, isNotNull);
      expect(usuario!.nombre, 'Juan');
      expect(usuario.membresia, isNotNull);
      expect(usuario.direcciones.isNotEmpty, true);
    });

    test(
        'actualizarDatosPersonales debe retornar true si los datos son válidos',
        () async {
      final datos = {'nombre': 'Juan Actualizado', 'telefono': '987654321'};
      final exito = await servicio.actualizarDatosPersonales(1, datos);

      expect(exito, true);
    });

    test('Manejo de errores: debe retornar null si falla la petición',
        () async {
      servicio.simularError = true;
      final usuario = await servicio.obtenerDatosPersonales(99);

      expect(usuario, isNull);
    });
  });
}
