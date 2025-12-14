import 'package:flutter/material.dart';
import './Dynamics.dart';
import './utils/constants.dart';

class Registro extends StatefulWidget {
  static const List<Map<String, dynamic>> camposForm = [
    {
      "titulo": "Registro",
      "content": [
        {"placeholder": "Nombre", "tipo": "input", "name": "nombre"},
        {"placeholder": "Apellido", "tipo": "input", "name": "apellido"},
        {
          "placeholder": "Patrocinador",
          "tipo": "input",
          "name": "patrocinador"
        },
        {"placeholder": "Nombre Usuario", "tipo": "input", "name": "usuario"},
        {"placeholder": "Contraseña", "tipo": "pass", "name": "contrasena"},
      ]
    },
    {
      "titulo": "Paso 2",
      "content": [
        {"placeholder": "Telefono", "tipo": "input", "name": "telefono"},
        {"placeholder": "Correo", "tipo": "input", "name": "correo"},
        {"placeholder": "Dirección", "tipo": "input", "name": "direccion"},
        {"placeholder": "Codigo Postal", "tipo": "input", "name": "postal"},
        {
          "placeholder": "Lugar Entrega",
          "tipo": "select",
          "childs": [
            {"id": "casa", "nombre": "Casa"},
            {"id": "apartamento", "nombre": "Apartamento"},
            {"id": "hotel", "nombre": "Hotel"},
            {"id": "oficina", "nombre": "Oficina"},
            {"id": "otro", "nombre": "Otro"}
          ],
          "name": "lugar_entrega"
        },
        {
          "placeholder": "Pais",
          "tipo": "select",
          "childs": "http://127.0.0.1:3000/api/ubicacion/paises",
          "name": "pais"
        },
        {
          "placeholder": "Ciudad",
          "tipo": "select",
          "childs": "http://127.0.0.1:3000/api/ubicacion/ciudades",
          "name": "ciudad"
        }
      ]
    },
    {
      "titulo": "Paso 3",
      "content": [
        {"placeholder": "Foto Perfil", "tipo": "imagen", "name": "foto"}
      ]
    }
  ];

  const Registro({super.key});

  @override
  State<Registro> createState() => _EstadoRegistro();
}

class _EstadoRegistro extends State<Registro> {
  Map<String, dynamic> valuesForm = {};
  int paso = 0;
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  void Actualizacion(String name, dynamic value) {
    setState(() {
      valuesForm[name] = value;
    });
  }

  @override
  void initState() {
    super.initState();
    for (var dato in Registro.camposForm) {
      for (var campo in dato["content"]) {
        valuesForm[campo["name"]] = '';
      }
    }
  }

  int _offsetForStep(int step) {
    int offset = 0;
    for (int i = 0; i < step; i++) {
      offset += (Registro.camposForm[i]["content"] as List).length;
    }
    return offset;
  }

  void siguientePaso() {
    if (paso < Registro.camposForm.length - 1) {
      setState(() => paso += 1);
    } else {
      fetch("${baseUrl}api/register", valuesForm, context);
    }
  }

  void pasoAnterior() {
    if (paso > 0) {
      setState(() => paso -= 1);
    } else {
      Navigator.pop(context);
    }
  }
  Widget _cardHeader() {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppColors.backgroundLight,
            shape: BoxShape.circle,
          ),
          child: const Icon(
            Icons.person_add_alt_1_rounded,
            size: 32,
            color: AppColors.elegantGreenDark, 
          ),
        ),
        const SizedBox(height: 16),
        const Text(
          "Crear Cuenta",
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: AppColors.textDark,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          "Paso ${paso + 1} de ${Registro.camposForm.length}",
          style: const TextStyle(
            fontSize: 14,
            color: AppColors.textLight,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget _stepIndicator(int totalSteps) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(totalSteps, (i) {
        bool active = i == paso;
        return AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          margin: const EdgeInsets.symmetric(horizontal: 4),
          width: active ? 24 : 8,
          height: 8,
          decoration: BoxDecoration(
            color: active ? AppColors.elegantGreenDark : Colors.grey.shade300,
            borderRadius: BorderRadius.circular(4),
          ),
        );
      }),
    );
  }


  Widget _buildStep(BuildContext context, int index) {
    int offset = _offsetForStep(index);
    List camposData = Registro.camposForm[index]["content"];
    List<Map<String, dynamic>> campos = camposData.asMap().entries.map((e) {
      final campo = Map<String, dynamic>.from(e.value);
      campo["globalIndex"] = offset + e.key;
      return campo;
    }).toList();

    List<Widget> widgets = Forms(
        context, campos, Actualizacion, valuesForm, AppColors.elegantGreenDark);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Padding(
          padding: const EdgeInsets.only(bottom: 20, top: 10),
          child: Text(
            Registro.camposForm[index]["titulo"],
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: AppColors.textMedium,
            ),
          ),
        ),
        ...widgets,
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final isWide = size.width >= 700;

    final backgroundColor = AppColors.elegantGreenLight.withOpacity(0.4);

    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded,
              color: AppColors.elegantGreenDark),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Center(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 20),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: isWide
                      ? 600
                      : double.infinity, 
                  constraints: const BoxConstraints(maxWidth: 600),
                  padding: const EdgeInsets.all(32),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius:
                        BorderRadius.circular(30), 
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.elegantGreenDark.withOpacity(0.1),
                        blurRadius: 20,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      _cardHeader(),
                      const SizedBox(height: 20),
                      _stepIndicator(Registro.camposForm.length),
                      const SizedBox(height: 10),

                      AnimatedSwitcher(
                        duration: const Duration(milliseconds: 400),
                        transitionBuilder: (child, animation) =>
                            FadeTransition(opacity: animation, child: child),
                        child: KeyedSubtree(
                          key: ValueKey(paso),
                          child: Form(
                              key: _formKey, child: _buildStep(context, paso)),
                        ),
                      ),

                      const SizedBox(height: 30),

                      Row(
                        children: [
                          if (paso > 0)
                            Expanded(
                              flex: 1,
                              child: Padding(
                                padding: const EdgeInsets.only(right: 12.0),
                                child: OutlinedButton(
                                  onPressed: pasoAnterior,
                                  style: OutlinedButton.styleFrom(
                                    padding: const EdgeInsets.symmetric(
                                        vertical: 16),
                                    side: const BorderSide(
                                        color: AppColors.elegantGreenDark),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(
                                          25),
                                    ),
                                  ),
                                  child: const Text(
                                    "Atrás",
                                    style: TextStyle(
                                      color: AppColors.elegantGreenDark,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          Expanded(
                            flex: 2,
                            child: ElevatedButton(
                              onPressed: siguientePaso,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.elegantGreenDark,
                                foregroundColor: Colors.white,
                                padding:
                                    const EdgeInsets.symmetric(vertical: 16),
                                elevation: 0,
                                shape: RoundedRectangleBorder(
                                  borderRadius:
                                      BorderRadius.circular(25), 
                                ),
                              ),
                              child: Text(
                                paso == Registro.camposForm.length - 1
                                    ? "Completar Registro"
                                    : "Siguiente",
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                        ],
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
                    Text(
                      "HGW Store",
                      style: TextStyle(
                        fontFamily: 'Cursive',
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: AppColors.elegantGreenDark.withOpacity(0.8),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
