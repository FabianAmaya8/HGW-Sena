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
import './utils/constants.dart';

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
        padding: const EdgeInsets.symmetric(vertical: 8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.only(left: 4, bottom: 4),
              child: Text(
                value["label"],
                style: const TextStyle(
                    color: AppColors.textMedium,
                    fontWeight: FontWeight.w600,
                    fontSize: 14),
              ),
            ),
            TextFormField(
              obscureText: value["value"] == "contrasena",
              cursorColor: AppColors.elegantGreenDark,
              onChanged: (val) => setState(() => valores[value["value"]] = val),
              style: const TextStyle(color: AppColors.textDark),
              decoration: InputDecoration(
                filled: true,
                fillColor: AppColors.backgroundLight,
                contentPadding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none),
                enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none),
                focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(
                        color: AppColors.elegantGreenDark, width: 1.5)),
                prefixIcon: Icon(
                    value["value"] == "usuario"
                        ? Icons.email_outlined
                        : Icons.lock_outline,
                    color: AppColors.textLight.withOpacity(0.7),
                    size: 20),
              ),
            ),
          ],
        ),
      );
    }).toList();
  }

  Future<void> _tryLogin(BuildContext context) async {
    final usuario = (valores["usuario"] ?? '').toString().trim();
    final contrasena = (valores["contrasena"] ?? '').toString().trim();

    if (usuario.isEmpty || contrasena.isEmpty) {
      showGlobalAlert(context, "Ingresa usuario y contraseña");
      return;
    }

    await AuthService.clearSession();

    try {
      final response = await http.post(
        Uri.parse("${ApiConfig.baseUrl}/api/login"),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'usuario': usuario, 'contrasena': contrasena}),
      );

      final responseData = jsonDecode(response.body);

      if (response.statusCode == 200 &&
          responseData['success'] == true &&
          responseData['usuario'] != null) {
        final uData = responseData['usuario'];
        final int userId = uData['id_usuario'] ?? 0;

        await AuthService.saveSession(
          usuario: Usuario(
            idUsuario: userId,
            nombre: uData['nombre'] ?? '',
            apellido: uData['apellido'] ?? '',
            nombreUsuario: uData['nombre_usuario'] ?? usuario,
            correoElectronico: uData['correo_electronico'] ?? '',
            numeroTelefono: uData['numero_telefono'],
            urlFotoPerfil: uData['url_foto_perfil'],
            patrocinador: uData['patrocinador'],
            nombreMedio: uData['nombre_medio'],
            direcciones: [],
            membresia: null,
          ),
          token: responseData['token'],
        );

        if (mounted) {
          Provider.of<AuthProvider>(context, listen: false).login();
          Provider.of<CarritoProvider>(context, listen: false)
              .setUserId(userId);
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
                content: Text("✅ Login exitoso"),
                backgroundColor: AppColors.elegantGreenDark),
          );
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
    return Scaffold(
      backgroundColor: AppColors.elegantGreenLight.withOpacity(0.4),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                constraints: const BoxConstraints(maxWidth: 400),
                padding: const EdgeInsets.all(32),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(30),
                  boxShadow: [
                    BoxShadow(
                        color: AppColors.elegantGreenDark.withOpacity(0.1),
                        blurRadius: 20,
                        offset: const Offset(0, 10)),
                  ],
                ),
                child: Column(
                  children: [
                    const Text("Iniciar sesión",
                        style: TextStyle(
                            fontSize: 26,
                            fontWeight: FontWeight.bold,
                            color: AppColors.elegantGreenDark)),
                    const SizedBox(height: 8),
                    Text("Bienvenido a HGW",
                        style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey.shade500,
                            fontWeight: FontWeight.w500)),
                    const SizedBox(height: 32),
                    ...inputsLogin([
                      {"label": "Email o Usuario", "value": "usuario"},
                      {"label": "Contraseña", "value": "contrasena"}
                    ]),
                    const SizedBox(height: 12),
                    Align(
                      alignment: Alignment.centerRight,
                      child: TextButton(
                        onPressed: () {},
                        style: TextButton.styleFrom(
                            padding: EdgeInsets.zero,
                            minimumSize: Size.zero,
                            tapTargetSize: MaterialTapTargetSize.shrinkWrap),
                        child: Text("¿Olvidaste tu contraseña?",
                            style: TextStyle(
                                color: Colors.grey.shade600, fontSize: 12)),
                      ),
                    ),
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        onPressed: () => _tryLogin(context),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.elegantGreenDark,
                          foregroundColor: Colors.white,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(25)),
                        ),
                        child: const Text("Iniciar sesión",
                            style: TextStyle(
                                fontSize: 16, fontWeight: FontWeight.bold)),
                      ),
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: OutlinedButton(
                        onPressed: () => Navigator.of(context).push(
                            MaterialPageRoute(builder: (_) => Registro())),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(
                              color: AppColors.elegantGreenDark),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(25)),
                        ),
                        child: const Text("Crear cuenta",
                            style: TextStyle(
                                color: AppColors.elegantGreenDark,
                                fontSize: 16,
                                fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 40),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.eco,
                      color: AppColors.elegantGreenDark.withOpacity(0.8)),
                  const SizedBox(width: 8),
                  Text("HGW ",
                      style: TextStyle(
                          fontFamily: 'Cursive',
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: AppColors.elegantGreenDark.withOpacity(0.8))),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
