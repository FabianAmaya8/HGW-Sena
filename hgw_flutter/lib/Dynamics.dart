import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:typed_data';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'dart:io' show File;
import './utils/constants.dart';

String baseUrl = "http://127.0.0.1:3000/";
final Color primaryGreen = AppColors.elegantGreenDark;
final Map<String, Future<List<Map<String, String>>>> _optionsCache = {};

Future<void> fetchJsonData(
    String url, Map<String, dynamic> data, BuildContext context) async {
  try {
    final response = await http.post(
      Uri.parse(url),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(data),
    );
    if (response.statusCode >= 200 && response.statusCode < 300) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text("✅ Operación exitosa"),
            backgroundColor: AppColors.elegantGreenDark),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content: Text("❌ Error: ${response.body}"),
            backgroundColor: AppColors.errorColor),
      );
    }
  } catch (e) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
          content: Text("⚠️ No se pudo conectar con el servidor"),
          backgroundColor: AppColors.warningColor),
    );
  }
}

void showGlobalAlert(BuildContext context, String message) {
  showDialog(
    context: context,
    builder: (ctx) => AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      title: const Text("Mensaje",
          style: TextStyle(
              color: AppColors.elegantGreenDark, fontWeight: FontWeight.bold)),
      content:
          Text(message, style: const TextStyle(color: AppColors.textMedium)),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(ctx).pop(),
          child: const Text("Cerrar",
              style: TextStyle(
                  color: AppColors.elegantGreenDark,
                  fontWeight: FontWeight.bold)),
        ),
      ],
    ),
  );
}

Future<void> fetch(
    String url, Map<String, dynamic> data, BuildContext context) async {
  try {
    final request = http.MultipartRequest('POST', Uri.parse(url));
    request.fields['nombres'] = data['nombre'] ?? '';
    request.fields['apellido'] = data['apellido'] ?? '';
    request.fields['patrocinador'] = data['patrocinador'] ?? '';
    request.fields['usuario'] = data['usuario'] ?? '';
    request.fields['contrasena'] = data['contrasena'] ?? '';
    request.fields['confirmar_contrasena'] =
        data['confirmar_contrasena'] ?? data['contrasena'] ?? '';
    request.fields['correo'] = data['correo'] ?? '';
    request.fields['telefono'] = data['telefono'] ?? '';
    request.fields['direccion'] = data['direccion'] ?? '';
    request.fields['codigo_postal'] = data['postal'] ?? '';
    request.fields['lugar_entrega'] = data['lugar_entrega'] ?? '';
    request.fields['ciudad'] = data['ciudad'].toString();

    if (data['foto'] != null && data['foto'] is List<int>) {
      request.files.add(http.MultipartFile.fromBytes(
        'foto_perfil',
        List<int>.from(data['foto']),
        filename: 'perfil.png',
      ));
    }

    final response = await request.send();
    final responseBody = await response.stream.bytesToString();

    if (response.statusCode >= 200 && response.statusCode < 300) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text("✅ Registro exitoso"),
            backgroundColor: AppColors.elegantGreenDark),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content: Text("❌ Error: $responseBody"),
            backgroundColor: AppColors.errorColor),
      );
    }
  } catch (e) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
          content: Text("⚠️ No se pudo conectar con el servidor"),
          backgroundColor: AppColors.warningColor),
    );
  }
}

Future<List<Map<String, String>>> fetchOptionsUncached(
    String urlStr, BuildContext context) async {
  final Uri url = Uri.parse(urlStr);
  final respuesta = await http.get(url);
  if (respuesta.statusCode == 200) {
    final decoded = jsonDecode(respuesta.body);
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

Future<List<Map<String, String>>> _fetchOptionsCached(
    String url, BuildContext context) {
  if (_optionsCache.containsKey(url)) return _optionsCache[url]!;
  final future = fetchOptionsUncached(url, context);
  _optionsCache[url] = future;
  return future;
}

String? _matchingValue(
    List<Map<String, String>> opciones, dynamic currentValue) {
  if (currentValue == null) return null;
  final cur = currentValue.toString();
  final exists = opciones.any((o) => o['id'] == cur);
  return exists ? cur : null;
}

class MobileSelect extends StatelessWidget {
  final String label;
  final List<Map<String, String>> options;
  final String? value;
  final Function(String) onChanged;
  final Color primaryGreen;
  const MobileSelect({
    super.key,
    required this.label,
    required this.options,
    required this.value,
    required this.onChanged,
    required this.primaryGreen,
  });
  @override
  Widget build(BuildContext context) {
    String displayText = value != null
        ? options.firstWhere((o) => o['id'] == value,
            orElse: () => {'nombre': label})['nombre']!
        : label;
    return GestureDetector(
      onTap: () async {
        final selected = await showModalBottomSheet<String>(
          context: context,
          backgroundColor: Colors.transparent,
          builder: (ctx) => Container(
            height: 350,
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
            ),
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Text(label,
                      style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                          color: AppColors.elegantGreenDark)),
                ),
                const Divider(height: 1),
                Expanded(
                  child: ListView(
                    children: options
                        .map((o) => ListTile(
                              title: Text(o['nombre']!,
                                  style: const TextStyle(
                                      color: AppColors.textDark)),
                              onTap: () => Navigator.pop(ctx, o['id']),
                              trailing: value == o['id']
                                  ? const Icon(Icons.check,
                                      color: AppColors.elegantGreenDark)
                                  : null,
                            ))
                        .toList(),
                  ),
                ),
              ],
            ),
          ),
        );
        if (selected != null) {
          SchedulerBinding.instance.addPostFrameCallback((_) {
            onChanged(selected);
          });
        }
      },
      child: Container(
        height: 56,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        decoration: BoxDecoration(
          color: AppColors.backgroundLight,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.transparent),
        ),
        alignment: Alignment.centerLeft,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              displayText,
              style: TextStyle(
                color: value == null ? AppColors.textLight : AppColors.textDark,
                fontSize: 16,
              ),
            ),
            const Icon(Icons.arrow_drop_down,
                color: AppColors.textLight, size: 28),
          ],
        ),
      ),
    );
  }
}

List<Widget> Forms(
  BuildContext context,
  List<Map<String, dynamic>> campos,
  Function(String, dynamic) onChanged,
  Map<String, dynamic> values,
  Color primaryGreen,
) {
  InputDecoration getDecoration(String label, {Widget? suffixIcon}) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(color: AppColors.textLight),
      floatingLabelStyle: const TextStyle(
          color: AppColors.elegantGreenDark, fontWeight: FontWeight.bold),
      filled: true,
      fillColor: AppColors.backgroundLight,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
      enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide:
            const BorderSide(color: AppColors.elegantGreenDark, width: 1.5),
      ),
      suffixIcon: suffixIcon,
    );
  }

  return campos.map((campo) {
    final String name = campo["name"];

    if (campo["tipo"] == "input") {
      return Padding(
        padding: const EdgeInsets.only(bottom: 12.0),
        child: TextFormField(
          key: ValueKey(name),
          cursorColor: AppColors.elegantGreenDark,
          initialValue: values[name]?.toString() ?? '',
          style: const TextStyle(color: AppColors.textDark),
          decoration: getDecoration(campo["placeholder"]),
          onChanged: (val) => onChanged(name, val),
        ),
      );
    }

    if (campo["tipo"] == "pass") {
      bool obscureText = true;
      return StatefulBuilder(
        key: ValueKey(name),
        builder: (context, setStateSB) => Padding(
          padding: const EdgeInsets.only(bottom: 12.0),
          child: TextFormField(
            cursorColor: AppColors.elegantGreenDark,
            initialValue: values[name]?.toString() ?? '',
            obscureText: obscureText,
            style: const TextStyle(color: AppColors.textDark),
            decoration: getDecoration(
              campo["placeholder"],
              suffixIcon: IconButton(
                icon: Icon(
                    obscureText ? Icons.visibility_off : Icons.visibility,
                    color: AppColors.textLight),
                onPressed: () => setStateSB(() => obscureText = !obscureText),
              ),
            ),
            onChanged: (val) => onChanged(name, val),
          ),
        ),
      );
    }

    if (campo["tipo"] == "select") {
      final childs = campo["childs"];
      Widget selectWidget = const SizedBox.shrink();

      if (childs is List) {
        final opciones = childs.map<Map<String, String>>((e) {
          String idValue =
              (e is Map && e.containsKey("id") ? e["id"] : UniqueKey())
                  .toString();
          String nameValue =
              (e is Map && e.containsKey("nombre") ? e["nombre"] : "Sin nombre")
                  .toString();
          return {"id": idValue, "nombre": nameValue};
        }).toList();
        final valorActual = _matchingValue(opciones, values[name]);
        selectWidget = MobileSelect(
          label: campo["placeholder"],
          options: opciones,
          value: valorActual,
          onChanged: (val) => onChanged(name, val),
          primaryGreen: AppColors.elegantGreenDark,
        );
      } else if (childs is String) {
        String urlFinal = childs;
        if (values.containsKey("pais") && values["pais"] != '') {
          urlFinal = "$childs?paisId=${values["pais"]}";
        }
        final future = _fetchOptionsCached(urlFinal, context);
        selectWidget = FutureBuilder<List<Map<String, String>>>(
          future: future,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return Container(
                height: 56,
                decoration: BoxDecoration(
                    color: AppColors.backgroundLight,
                    borderRadius: BorderRadius.circular(12)),
                child: const Center(
                    child: SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: AppColors.elegantGreenDark))),
              );
            }
            if (snapshot.hasError ||
                !snapshot.hasData ||
                snapshot.data!.isEmpty) {
              return MobileSelect(
                  label: "${campo["placeholder"]} (Sin datos)",
                  options: const [],
                  value: null,
                  onChanged: (_) {},
                  primaryGreen: AppColors.elegantGreenDark);
            }
            final opciones = snapshot.data!;
            final valorActual = _matchingValue(opciones, values[name]);
            return MobileSelect(
              label: campo["placeholder"],
              options: opciones,
              value: valorActual,
              onChanged: (val) => onChanged(name, val),
              primaryGreen: AppColors.elegantGreenDark,
            );
          },
        );
      }
      return Padding(
          padding: const EdgeInsets.only(bottom: 12.0), child: selectWidget);
    }

    if (campo["tipo"] == "imagen" || campo["tipo"] == "image") {
      final currentValue = values[name];
      ImageProvider? provider;
      if (currentValue is Uint8List) {
        provider = MemoryImage(currentValue);
      } else if (!kIsWeb && currentValue is String && currentValue.isNotEmpty) {
        provider = FileImage(File(currentValue));
      }
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 16.0),
        child: Column(
          key: ValueKey(name),
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            GestureDetector(
              onTap: () async {
                final result = await FilePicker.platform
                    .pickFiles(type: FileType.image, withData: true);
                if (result != null && result.files.isNotEmpty) {
                  final file = result.files.single;
                  if (file.bytes != null) {
                    onChanged(name, file.bytes);
                  } else if (!kIsWeb && file.path != null) {
                    onChanged(name, file.path);
                  }
                }
              },
              child: Container(
                decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border:
                        Border.all(color: AppColors.elegantGreenDark, width: 2),
                    boxShadow: [
                      BoxShadow(
                          color: Colors.black.withOpacity(0.1),
                          blurRadius: 10,
                          offset: const Offset(0, 5))
                    ]),
                child: CircleAvatar(
                  radius: 50,
                  backgroundColor: AppColors.backgroundLight,
                  backgroundImage: provider,
                  child: provider == null
                      ? const Icon(Icons.add_a_photo_rounded,
                          size: 35, color: AppColors.elegantGreenDark)
                      : null,
                ),
              ),
            ),
            const SizedBox(height: 12),
            Text(campo["placeholder"],
                style: const TextStyle(
                    fontWeight: FontWeight.w600, color: AppColors.textMedium)),
          ],
        ),
      );
    }

    return const SizedBox.shrink();
  }).toList();
}
