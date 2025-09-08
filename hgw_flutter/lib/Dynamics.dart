import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter/scheduler.dart';

String baseUrl = "http://127.0.0.1:3000/";
final Color primaryGreen = Colors.green[400]!;

final Map<String, Future<List<Map<String, String>>>> _optionsCache = {};

/// Alerta global
void showGlobalAlert(BuildContext context, String message) {
  showDialog(
    context: context,
    builder: (ctx) => AlertDialog(
      title: Text("Mensaje"),
      content: Text(message),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(ctx).pop(),
          child: Text("Cerrar"),
        ),
      ],
    ),
  );
}

/// Fetch POST genérico con alerta
Future<void> fetch(String urlStr, Map<String, dynamic> datos, BuildContext context) async {
  Uri url = Uri.parse(urlStr);
  final respuesta = await http.post(
    url,
    headers: {"content-type": "application/json"},
    body: jsonEncode(datos),
  );

  print('Respuesta POST API: ${respuesta.body}');

  // Mostrar alerta si hay mensaje
  try {
    final decoded = jsonDecode(respuesta.body);
    if (decoded is Map && decoded.containsKey("message")) {
      final msg = decoded["message"]?.toString() ?? '';
      if (msg.isNotEmpty) showGlobalAlert(context, msg);
    }
  } catch (e) {
    showGlobalAlert(context, "Error al procesar la respuesta");
  }
}

/// Fetch sin cache con alerta
Future<List<Map<String, String>>> fetchOptionsUncached(String urlStr, BuildContext context) async {
  final Uri url = Uri.parse(urlStr);
  final respuesta = await http.get(url);

  print('Respuesta API cruda de $urlStr: ${respuesta.body}');

  if (respuesta.statusCode == 200) {
    final decoded = jsonDecode(respuesta.body);

    // Mostrar mensaje si existe
    if (decoded is Map && decoded.containsKey("message")) {
      final msg = decoded["message"]?.toString() ?? '';
      if (msg.isNotEmpty) showGlobalAlert(context, msg);
    }

    List<dynamic> lista = [];
    if (decoded is List) {
      lista = decoded;
    } else if (decoded is Map && decoded["data"] is List) {
      lista = decoded["data"];
    }

    return lista.map<Map<String, String>>((e) {
      return {
        "id": e["id_ubicacion"]?.toString() ?? UniqueKey().toString(),
        "nombre": e["nombre"]?.toString() ?? "Sin nombre",
      };
    }).toList();
  }

  return [];
}

/// Fetch con cache e integración de alertas
Future<List<Map<String, String>>> _fetchOptionsCached(String url, BuildContext context) {
  if (_optionsCache.containsKey(url)) return _optionsCache[url]!;
  final future = fetchOptionsUncached(url, context);
  _optionsCache[url] = future;
  return future;
}

/// Función auxiliar para seleccionar valor válido
String? _matchingValue(List<Map<String, String>> opciones, dynamic currentValue) {
  if (currentValue == null) return null;
  final cur = currentValue.toString();
  final exists = opciones.any((o) => o['id'] == cur);
  return exists ? cur : null;
}

/// Generador de widgets de formulario
List<Widget> Forms(
  BuildContext context,
  List<Map<String, dynamic>> campos,
  Function(String, String) onChanged,
  Map<String, dynamic> values,
  Color primaryGreen,
) {
  OutlineInputBorder border(Color color) => OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: color, width: 2),
      );

  return campos.map((campo) {
    final String name = campo["name"];

    // Input
    if (campo["tipo"] == "input") {
      return TextFormField(
        cursorColor: primaryGreen,
        initialValue: values[name]?.toString() ?? '',
        decoration: InputDecoration(
          labelText: campo["placeholder"],
          labelStyle: TextStyle(color: Colors.grey[700]),
          floatingLabelStyle: TextStyle(color: primaryGreen),
          border: border(Colors.grey.shade400),
          enabledBorder: border(Colors.grey.shade400),
          focusedBorder: border(primaryGreen),
        ),
        onChanged: (val) => onChanged(name, val),
      );
    }

    // Select
    if (campo["tipo"] == "select") {
      final childs = campo["childs"];

      if (childs is List) {
        final opciones = childs.map<Map<String, String>>((e) {
          String idValue = (e is Map && e.containsKey("id") ? e["id"] : UniqueKey()).toString();
          String nameValue = (e is Map && e.containsKey("nombre") ? e["nombre"] : "Sin nombre").toString();
          return {"id": idValue, "nombre": nameValue};
        }).toList();

        final valorActual = _matchingValue(opciones, values[name]);

        return DropdownButtonFormField<String>(
          value: valorActual,
          decoration: InputDecoration(
            labelText: campo["placeholder"],
            labelStyle: TextStyle(color: Colors.grey[700]),
            floatingLabelStyle: TextStyle(color: primaryGreen),
            border: border(Colors.grey.shade400),
            enabledBorder: border(Colors.grey.shade400),
            focusedBorder: border(primaryGreen),
          ),
          iconEnabledColor: primaryGreen,
          dropdownColor: Colors.white,
          style: const TextStyle(color: Colors.black),
          items: opciones
              .map((e) => DropdownMenuItem<String>(
                    value: e["id"],
                    child: Text(e["nombre"]!),
                  ))
              .toList(),
          onChanged: (val) {
            if (val != null) {
              SchedulerBinding.instance.addPostFrameCallback((_) {
                onChanged(name, val);
              });
            }
          },
        );
      }

      if (childs is String) {
        String urlFinal = childs;
        if (values.containsKey("pais") && values["pais"] != '') {
          urlFinal = "$childs?paisId=${values["pais"]}";
        }

        final future = _fetchOptionsCached(urlFinal, context);

        return FutureBuilder<List<Map<String, String>>>(
          future: future,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const SizedBox(
                height: 56,
                child: Center(child: CircularProgressIndicator()),
              );
            }
            if (snapshot.hasError || !snapshot.hasData || snapshot.data!.isEmpty) {
              return const Text("No hay opciones disponibles");
            }

            final opciones = snapshot.data!;
            final valorActual = _matchingValue(opciones, values[name]);

            return DropdownButtonFormField<String>(
              value: valorActual,
              decoration: InputDecoration(
                labelText: campo["placeholder"],
                labelStyle: TextStyle(color: Colors.grey[700]),
                floatingLabelStyle: TextStyle(color: primaryGreen),
                border: border(Colors.grey.shade400),
                enabledBorder: border(Colors.grey.shade400),
                focusedBorder: border(primaryGreen),
              ),
              iconEnabledColor: primaryGreen,
              dropdownColor: Colors.white,
              style: const TextStyle(color: Colors.black),
              items: opciones
                  .map((e) => DropdownMenuItem<String>(
                        value: e["id"],
                        child: Text(e["nombre"]!),
                      ))
                  .toList(),
              onChanged: (val) {
                if (val != null) {
                  SchedulerBinding.instance.addPostFrameCallback((_) {
                    onChanged(name, val);
                  });
                }
              },
            );
          },
        );
      }

      return const SizedBox.shrink();
    }

    return const SizedBox.shrink();
  }).toList();
}
