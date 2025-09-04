import 'package:flutter/material.dart';

class Login extends StatefulWidget {
  static const List<Map<String, dynamic>> camposForm = [
    {
      "titulo": "Registro",
      "content": [
        {"placeholder": "Nombre", "tipo": "input", "name": "nombre"},
        {"placeholder": "Edad", "tipo": "input", "name": "edad"},
        {
          "placeholder": "Categoría",
          "tipo": "select",
          "childs": ["JAJAJA", "JOJOJO"],
          "name": "categoria"
        }
      ]
    },
    {
      "titulo": "Paso 2",
      "content": [
        {"placeholder": "Ciudad", "tipo": "input", "name": "ciudad"},
        {"placeholder": "Telefono", "tipo": "input", "name": "telefono"},
        {
          "placeholder": "Subcategoria",
          "tipo": "select",
          "childs": ["JAJAJA", "JOJOJO"],
          "name": "subcategoria"
        }
      ]
    },
    {
      "titulo": "Paso 3",
      "content": [
        {"placeholder": "Genero", "tipo": "input", "name": "sexo"},
        {"placeholder": "Direccion", "tipo": "input", "name": "direccion"},
        {"placeholder": "Correo", "tipo": "input", "name": "correo"},
      ]
    }
  ];

  const Login({super.key});

  @override
  State<Login> createState() => _EstadoLogin();
}

class _EstadoLogin extends State<Login> {
  List<String?> valuesForm = [];
  int paso = 0;
  final PageController _pageController = PageController();
  final Color primaryGreen = Colors.green.shade600;
  final double _borderRadius = 24.0;
  final double _outerPadding = 24.0;
  final double _innerPadding = 36.0;

  void Actualizacion(int indice, String valor) {
    setState(() {
      valuesForm[indice] = valor;
    });
  }

  @override
  void initState() {
    super.initState();
    for (var dato in Login.camposForm) {
      for (var _ in dato["content"]) {
        valuesForm.add(null);
      }
    }
  }

  int _offsetForStep(int step) {
    int offset = 0;
    for (int i = 0; i < step; i++) {
      offset += (Login.camposForm[i]["content"] as List).length;
    }
    return offset;
  }

  void siguientePaso() {
    if (paso < Login.camposForm.length - 1) {
      setState(() {
        paso += 1;
      });
      _pageController.nextPage(
          duration: const Duration(milliseconds: 400), curve: Curves.easeInOut);
    }
  }

  void pasoAnterior() {
    if (paso > 0) {
      setState(() {
        paso -= 1;
      });
      _pageController.previousPage(
          duration: const Duration(milliseconds: 400), curve: Curves.easeInOut);
    }
  }

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.of(context).viewInsets.bottom;
    int totalSteps = Login.camposForm.length;
    double progress = totalSteps > 1 ? paso / (totalSteps - 1) : 1.0;
    bool isFull = progress >= 0.999;

    return Scaffold(
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            final isWide = constraints.maxWidth >= 700;
            final maxContainerWidth = isWide ? 1000.0 : constraints.maxWidth * 0.95;
            final maxContainerHeight = isWide ? 600.0 : constraints.maxHeight * 0.95;

            final leftWidth = isWide ? maxContainerWidth * 0.3 : maxContainerWidth;
            final rightWidth = isWide ? maxContainerWidth * 0.65 : maxContainerWidth;

            Widget panelIzquierdo = ConstrainedBox(
              constraints: BoxConstraints(maxWidth: leftWidth),
              child: Padding(
                padding: EdgeInsets.all(_outerPadding),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: EdgeInsets.all(_outerPadding),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: LinearGradient(
                          colors: [
                            Colors.green.shade400,
                            Colors.green.shade700,
                          ],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                      ),
                      child: const Text(
                        "HGW",
                        style: TextStyle(
                            fontSize: 36,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                            letterSpacing: 2),
                      ),
                    ),
                    SizedBox(height: _outerPadding),
                    Text(
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.grey[700], fontSize: 14),
                    ),
                  ],
                ),
              ),
            );

            Widget contenedorBlanco = ConstrainedBox(
              constraints: BoxConstraints(maxWidth: rightWidth),
              child: Padding(
                padding: EdgeInsets.all(_outerPadding / 1.5),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(_borderRadius),
                  child: Container(
                    clipBehavior: Clip.hardEdge,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(_borderRadius),
                      boxShadow: const [
                        BoxShadow(
                          color: Colors.black12,
                          blurRadius: 12,
                          offset: Offset(0, 6),
                        ),
                      ],
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          height: 6.0,
                          width: double.infinity,
                          child: Stack(
                            children: [
                              Positioned.fill(child: Container(color: Colors.white)),
                              Align(
                                alignment: Alignment.topLeft,
                                child: FractionallySizedBox(
                                  widthFactor: progress.clamp(0.0, 1.0),
                                  child: Container(
                                    height: 6.0,
                                    decoration: BoxDecoration(
                                      color: primaryGreen,
                                      borderRadius: BorderRadius.horizontal(
                                        left: Radius.circular(_borderRadius),
                                        right: Radius.circular(isFull ? _borderRadius : 0),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        Padding(
                          padding: EdgeInsets.symmetric(
                              horizontal: _outerPadding, vertical: _innerPadding),
                          child: SizedBox(
                            height: 300,
                            child: PageView.builder(
                              controller: _pageController,
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: totalSteps,
                              itemBuilder: (context, index) {
                                int offset = _offsetForStep(index);
                                List camposData = Login.camposForm[index]["content"];

                                List<Map<String, dynamic>> campos = camposData
                                    .asMap()
                                    .entries
                                    .map((e) {
                                  final campo = Map<String, dynamic>.from(e.value);
                                  campo["globalIndex"] = offset + e.key;
                                  return campo;
                                }).toList();

                                List<Widget> widgets = Forms(
                                  campos,
                                  Actualizacion,
                                  valuesForm,
                                  primaryGreen,
                                );

                                return Column(
                                  crossAxisAlignment: CrossAxisAlignment.stretch,
                                  children: [
                                    Expanded(
                                      child: SingleChildScrollView(
                                        physics: const BouncingScrollPhysics(),
                                        child: Column(
                                          children: [
                                            Center(
                                              child: Text(
                                                Login.camposForm[index]["titulo"],
                                                style: TextStyle(
                                                    fontSize: 28,
                                                    fontWeight: FontWeight.bold,
                                                    color: Colors.grey[800]),
                                              ),
                                            ),
                                            SizedBox(height: _outerPadding / 2),
                                            ...widgets.expand((widget) sync* {
                                              yield widget;
                                              yield const SizedBox(height: 12);
                                            }).toList(),
                                          ],
                                        ),
                                      ),
                                    ),
                                    const SizedBox(height: 16),
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.end,
                                      children: [
                                        if (paso > 0)
                                          TextButton(
                                            onPressed: pasoAnterior,
                                            style: TextButton.styleFrom(
                                                foregroundColor: Colors.grey[700]),
                                            child: const Text("Atrás",
                                                style: TextStyle(fontWeight: FontWeight.w500)),
                                          ),
                                        if (paso > 0) const SizedBox(width: 12),
                                        ElevatedButton(
                                          onPressed: siguientePaso,
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: primaryGreen,
                                            padding: const EdgeInsets.symmetric(
                                                horizontal: 28, vertical: 14),
                                            shape: RoundedRectangleBorder(
                                              borderRadius: BorderRadius.circular(18),
                                            ),
                                            elevation: 0,
                                          ),
                                          child: Text(
                                            paso == totalSteps - 1 ? "Finalizar" : "Siguiente",
                                            style: const TextStyle(
                                              fontSize: 15,
                                              fontWeight: FontWeight.w600,
                                              color: Colors.white,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    SizedBox(height: bottomInset),
                                  ],
                                );
                              },
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            );

            if (isWide) {
              return Center(
                child: Container(
                  constraints: BoxConstraints(
                    maxWidth: maxContainerWidth,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      panelIzquierdo,
                      SizedBox(width: _outerPadding),
                      contenedorBlanco,
                    ],
                  ),
                ),
              );
            } else {
              return SingleChildScrollView(
                padding: EdgeInsets.all(_outerPadding),
                child: Center(
                  child: ConstrainedBox(
                    constraints: BoxConstraints(maxWidth: maxContainerWidth),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        panelIzquierdo,
                        SizedBox(height: _outerPadding),
                        contenedorBlanco,
                      ],
                    ),
                  ),
                ),
              );
            }
          },
        ),
      ),
    );
  }
}

List<Widget> Forms(
  List<Map<String, dynamic>> campos,
  Function(int, String) onChanged,
  List<String?> values,
  Color primaryGreen,
) {
  return campos.map((campo) {
    int idx = campo["globalIndex"];
    OutlineInputBorder border(Color color) => OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: color, width: 2),
        );

    if (campo["tipo"] == "input") {
      return TextFormField(
        cursorColor: primaryGreen,
        initialValue: values[idx] ?? '',
        decoration: InputDecoration(
          labelText: campo["placeholder"],
          labelStyle: TextStyle(color: Colors.grey[700]),
          floatingLabelStyle: TextStyle(color: primaryGreen),
          border: border(Colors.grey.shade400),
          enabledBorder: border(Colors.grey.shade400),
          focusedBorder: border(primaryGreen),
        ),
        onChanged: (val) => onChanged(idx, val),
      );
    } else if (campo["tipo"] == "select") {
      return DropdownButtonFormField<String>(
        value: values[idx],
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
        style: TextStyle(color: Colors.black),
        items: (campo["childs"] as List<String>)
            .map((e) => DropdownMenuItem<String>(
                  value: e,
                  child: Text(e),
                ))
            .toList(),
        onChanged: (val) {
          if (val != null) onChanged(idx, val);
        },
      );
    } else {
      return const SizedBox.shrink();
    }
  }).toList();
}


