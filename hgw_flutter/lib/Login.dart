import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import './Dynamics.dart';
import './Registro.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import './main.dart';
import 'services/auth/auth_service.dart';
import 'models/personal/usuario.dart';
import 'config/api_config.dart';
import 'providers/carrito/carrito_provider.dart';

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  State<Login> createState() => _ManejadorLogin();
}

class _ManejadorLogin extends State<Login> {
  Map<String, dynamic> valores = {};

  @override
  void initState() {
    super.initState();
    AuthService.clearSession();
  }

  List<Widget> inputsLogin(List<Map<String, dynamic>> values) {
    return values.map((value) {
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 12.0),
        child: TextFormField(
          obscureText: value["value"] == "contrasena",
          cursorColor: Colors.green.shade700,
          onChanged: (val) {
            setState(() {
              valores[value["value"]] = val;
            });
          },
          style: TextStyle(color: Colors.black87),
          decoration: InputDecoration(
            labelText: value["label"],
            labelStyle: TextStyle(color: Colors.grey.shade700),
            floatingLabelStyle: TextStyle(color: Colors.green.shade700),
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide.none,
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.green.shade700, width: 2),
            ),
          ),
        ),
      );
    }).toList();
  }

  Future<void> _tryLogin(BuildContext context) async {
    String usuario = (valores["usuario"] ?? '').toString().trim();
    String contrasena = (valores["contrasena"] ?? '').toString().trim();

    if (usuario.isEmpty || contrasena.isEmpty) {
      showGlobalAlert(context, "Ingresa usuario y contraseña");
      return;
    }

    await AuthService.clearSession();

    try {
      final response = await http.post(
        Uri.parse(ApiConfig.baseUrl + "/api/login"),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'usuario': usuario, 'contrasena': contrasena}),
      );

      final responseData = jsonDecode(response.body);

      if (response.statusCode == 200 && responseData['success'] == true) {
        if (responseData['usuario'] != null) {
          final usuarioData = responseData['usuario'];
          final int userId = usuarioData['id_usuario'] ?? 0;

          final usuarioObj = Usuario(
            idUsuario: userId,
            nombre: usuarioData['nombre'] ?? '',
            apellido: usuarioData['apellido'] ?? '',
            nombreUsuario: usuarioData['nombre_usuario'] ?? usuario,
            correoElectronico: usuarioData['correo_electronico'] ?? '',
            numeroTelefono: usuarioData['numero_telefono'],
            urlFotoPerfil: usuarioData['url_foto_perfil'],
            patrocinador: usuarioData['patrocinador'],
            nombreMedio: usuarioData['nombre_medio'],
            direcciones: [],
            membresia: null,
          );

          await AuthService.saveSession(
            usuario: usuarioObj,
            token: responseData['token'],
          );

          if (mounted) {
            final auth = Provider.of<AuthProvider>(context, listen: false);
            final carrito =
                Provider.of<CarritoProvider>(context, listen: false);

            auth.login();
            carrito.setUserId(userId);

            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text("✅ Login exitoso")),
            );
          }
        }
      } else {
        showGlobalAlert(context,
            responseData['message'] ?? "Usuario o contraseña incorrectos");
      }
    } catch (e) {
      showGlobalAlert(context, "⚠️ No se pudo conectar con el servidor");
    }
  }

  @override
  Widget build(BuildContext context) {
    double anchoPantalla = MediaQuery.of(context).size.width;

    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.grey.shade100, Colors.grey.shade300],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Center(
          child: Container(
            width: anchoPantalla * 0.85,
            constraints: BoxConstraints(maxWidth: 400),
            padding: EdgeInsets.symmetric(vertical: 40, horizontal: 30),
            decoration: BoxDecoration(
              color: Colors.grey.shade50,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black12,
                  blurRadius: 25,
                  offset: Offset(0, 12),
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  "Iniciar Sesión",
                  style: TextStyle(
                    color: Colors.black87,
                    fontSize: 26,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                SizedBox(height: 30),
                ...inputsLogin([
                  {"label": "Nombre de usuario", "value": "usuario"},
                  {"label": "Contraseña", "value": "contrasena"},
                ]),
                SizedBox(height: 25),
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    onPressed: () => _tryLogin(context),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green.shade700,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: Text(
                      "Ingresar",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
                SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: OutlinedButton(
                    onPressed: () {
                      Navigator.of(context)
                          .push(MaterialPageRoute(builder: (_) => Registro()));
                    },
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      side:
                          BorderSide(color: Colors.green.shade700, width: 1.5),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                    ),
                    child: Text(
                      "Registrarme",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.green.shade700,
                      ),
                    ),
                  ),
                ),
                SizedBox(height: 12),
                TextButton(
                  onPressed: () {},
                  child: Text(
                    "¿Olvidaste tu contraseña?",
                    style: TextStyle(color: Colors.grey.shade700),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
