import 'package:flutter/material.dart';
import 'Dynamics.dart';

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
        {"placeholder": "Sexo", "tipo": "input", "name": "sexo"},
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
          duration: Duration(milliseconds: 400), curve: Curves.easeInOut);
    }
  }

  void pasoAnterior() {
    if (paso > 0) {
      setState(() {
        paso -= 1;
      });
      _pageController.previousPage(
          duration: Duration(milliseconds: 400), curve: Curves.easeInOut);
    }
  }

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.of(context).viewInsets.bottom;
    int totalSteps = Login.camposForm.length;
    double progress = totalSteps > 1 ? paso / (totalSteps - 1) : 1.0;
    bool isFull = progress >= 0.999;
    final double barHeight = 6.0;

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.all(_outerPadding),
          child: Container(
            decoration: BoxDecoration(
              color: Colors.blue.withOpacity(0.05),
              borderRadius: BorderRadius.circular(_borderRadius),
            ),
            padding: EdgeInsets.all(_outerPadding),
            child: Center(
              child: LayoutBuilder(
                builder: (context, constraints) {
                  final isWide = constraints.maxWidth >= 700;
                  final maxWidth = constraints.maxWidth;

                  final leftWidth = isWide ? maxWidth * 0.32 : maxWidth;
                  final rightWidth = isWide ? maxWidth * 0.60 : maxWidth;

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
                                  Colors.green.shade700
                                ],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                              boxShadow: [
                                BoxShadow(
                                    color: Colors.black12,
                                    blurRadius: 12,
                                    offset: Offset(0, 6))
                              ],
                            ),
                            child: Text(
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
                            style:
                                TextStyle(color: Colors.grey[700], fontSize: 14),
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
                          color: Colors.white,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              Container(
                                height: barHeight,
                                child: Stack(
                                  children: [
                                    Positioned.fill(
                                        child: Container(color: Colors.white)),
                                    Align(
                                      alignment: Alignment.topLeft,
                                      child: FractionallySizedBox(
                                        widthFactor: progress.clamp(0.0, 1.0),
                                        child: Container(
                                          height: barHeight,
                                          decoration: BoxDecoration(
                                            color: primaryGreen,
                                            borderRadius:
                                                BorderRadius.horizontal(
                                              left: Radius.circular(
                                                  _borderRadius),
                                              right: Radius.circular(
                                                  isFull ? _borderRadius : 0),
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Expanded(
                                child: Padding(
                                  padding: EdgeInsets.symmetric(
                                      horizontal: _outerPadding,
                                      vertical: _innerPadding),
                                  child: PageView.builder(
                                    controller: _pageController,
                                    physics: NeverScrollableScrollPhysics(),
                                    itemCount: totalSteps,
                                    itemBuilder: (context, index) {
                                      int offset = _offsetForStep(index);
                                      List camposData =
                                          Login.camposForm[index]["content"];

                                      List<Map<String, dynamic>> campos =
                                          camposData.asMap().entries.map((e) {
                                        final campo =
                                            Map<String, dynamic>.from(e.value);
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
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceBetween,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.stretch,
                                        children: [
                                          Column(
                                            children: [
                                              Center(
                                                child: Text(
                                                  Login.camposForm[index]
                                                      ["titulo"],
                                                  style: TextStyle(
                                                      fontSize: 28,
                                                      fontWeight:
                                                          FontWeight.bold,
                                                      color: Colors.grey[800]),
                                                ),
                                              ),
                                              SizedBox(
                                                  height: _outerPadding / 2),
                                              ...widgets.map((c) => Padding(
                                                    padding:
                                                        EdgeInsets.symmetric(
                                                            vertical:
                                                                _outerPadding /
                                                                    4),
                                                    child: c,
                                                  )),
                                            ],
                                          ),
                                          Column(
                                            children: [
                                              Row(
                                                mainAxisAlignment:
                                                    MainAxisAlignment.end,
                                                children: [
                                                  if (paso > 0)
                                                    TextButton(
                                                      onPressed: pasoAnterior,
                                                      style: TextButton.styleFrom(
                                                          foregroundColor:
                                                              Colors.grey[700]),
                                                      child: Text("Atrás",
                                                          style: TextStyle(
                                                              fontWeight:
                                                                  FontWeight
                                                                      .w500)),
                                                    ),
                                                  if (paso > 0)
                                                    SizedBox(width: 12),
                                                  ElevatedButton(
                                                    onPressed: siguientePaso,
                                                    style: ElevatedButton
                                                        .styleFrom(
                                                      backgroundColor:
                                                          primaryGreen,
                                                      padding:
                                                          EdgeInsets.symmetric(
                                                              horizontal: 28,
                                                              vertical: 14),
                                                      shape: RoundedRectangleBorder(
                                                          borderRadius:
                                                              BorderRadius
                                                                  .circular(
                                                                      18)),
                                                      elevation: 6,
                                                    ),
                                                    child: Text(
                                                        paso == totalSteps - 1
                                                            ? "Finalizar"
                                                            : "Siguiente",
                                                        style: TextStyle(
                                                            fontSize: 15,
                                                            fontWeight:
                                                                FontWeight.w600,
                                                            color:
                                                                Colors.white)),
                                                  ),
                                                ],
                                              ),
                                              SizedBox(height: bottomInset),
                                            ],
                                          ),
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
                    return Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        panelIzquierdo,
                        SizedBox(width: _outerPadding),
                        contenedorBlanco,
                      ],
                    );
                  } else {
                    return Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        panelIzquierdo,
                        SizedBox(height: _outerPadding),
                        contenedorBlanco,
                      ],
                    );
                  }
                },
              ),
            ),
          ),
        ),
      ),
    );
  }
}
