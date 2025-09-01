import 'package:flutter/material.dart';

final Color primaryGreen = Colors.green[400]!;

List<Widget> Forms(
    List<Map<String, dynamic>> values,
    void Function(int, String) actualizacion,
    List<String?> datosGuardados,
    Color primaryColor) {
  List<Widget> inputs = [];

  for (int i = 0; i < values.length; i++) {
    int globalIndex = values[i]["globalIndex"];
    inputs.add(
      values[i]["tipo"] == "input"
          ? CustomTextField(
              placeholder: values[i]["placeholder"] ?? "",
              initialValue: datosGuardados[globalIndex],
              primaryColor: primaryColor,
              onChanged: (valor) {
                actualizacion(globalIndex, valor);
              },
              icon: values[i]["icon"],
            )
          : CustomDropdownField(
              placeholder: values[i]["placeholder"] ?? "",
              options: (values[i]["childs"] as List<String>?) ?? [],
              value: datosGuardados[globalIndex],
              primaryColor: primaryColor,
              onChanged: (valor) {
                actualizacion(globalIndex, valor);
              },
            ),
    );
  }

  return inputs;
}

class CustomTextField extends StatelessWidget {
  final String placeholder;
  final void Function(String) onChanged;
  final String? initialValue;
  final Color primaryColor;
  final IconData? icon;

  const CustomTextField({
    Key? key,
    required this.placeholder,
    required this.onChanged,
    this.initialValue,
    required this.primaryColor,
    this.icon,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 8,
            offset: Offset(0, 4),
          )
        ],
      ),
      child: TextFormField(
        cursorColor: primaryColor,
        initialValue: initialValue,
        decoration: InputDecoration(
          labelText: placeholder,
          labelStyle: TextStyle(color: Colors.grey[700]),
          prefixIcon: icon != null ? Icon(icon, color: Colors.grey[700]) : null,
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: primaryColor, width: 2),
          ),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
          contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 20),
        ),
        onChanged: onChanged,
      ),
    );
  }
}

class CustomDropdownField extends StatelessWidget {
  final String placeholder;
  final List<String> options;
  final String? value;
  final void Function(String) onChanged;
  final Color primaryColor;

  const CustomDropdownField({
    Key? key,
    required this.placeholder,
    required this.options,
    required this.value,
    required this.onChanged,
    required this.primaryColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 8,
            offset: Offset(0, 4),
          )
        ],
      ),
      child: DropdownButtonFormField<String>(
        value: value,
        decoration: InputDecoration(
          labelText: placeholder,
          labelStyle: TextStyle(color: Colors.grey[700]),
          contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 20),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: primaryColor, width: 2),
          ),
        ),
        icon: Icon(Icons.arrow_drop_down, color: primaryColor),
        items: options
            .map((e) => DropdownMenuItem(
                  value: e,
                  child: Text(e),
                ))
            .toList(),
        onChanged: (val) {
          if (val != null) onChanged(val);
        },
      ),
    );
  }
}
