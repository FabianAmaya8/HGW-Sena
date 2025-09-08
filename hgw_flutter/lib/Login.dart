import 'package:flutter/material.dart';
import './Dynamics.dart';

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  State<Login> createState() => _ManejadorLogin();
}

class _ManejadorLogin extends State<Login> {
  Map<String, dynamic> valores = {};

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
                    onPressed: () {
                      fetch(baseUrl + "api/login", valores, context);
                    },
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
                SizedBox(height: 15),
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
