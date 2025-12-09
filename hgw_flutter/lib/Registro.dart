import 'package:flutter/material.dart';
import './Dynamics.dart';

class Registro extends StatefulWidget {
  static const List<Map<String, dynamic>> camposForm = [
    {
      "titulo": "Registro",
      "content": [
        {"placeholder": "Nombre", "tipo": "input", "name": "nombre"},
        {"placeholder": "Apellido", "tipo": "input", "name": "apellido"},
        {"placeholder": "Patrocinador", "tipo": "input", "name": "patrocinador"},
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
  final Color primaryGreen = Colors.green.shade600;
  final double _borderRadius = 16.0;
  final double _outerPadding = 16.0;
  final double _innerPadding = 20.0;
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
      fetch(baseUrl + "api/register", valuesForm, context);
    }
  }

  void pasoAnterior() {
    if (paso > 0) {
      setState(() => paso -= 1);
    } else {
      Navigator.pop(context);
    }
  }

  Widget _mobileHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        CircleAvatar(
          radius: 36,
          backgroundColor: primaryGreen,
          child: const Text(
            "HGW",
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 24,
            ),
          ),
        ),
        const SizedBox(height: 12),
        Text(
          "Completa tu registro en 3 simples pasos",
          style: TextStyle(color: Colors.white70, fontSize: 14),
          textAlign: TextAlign.center,
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
          duration: const Duration(milliseconds: 250),
          margin: const EdgeInsets.symmetric(horizontal: 6),
          width: active ? 18 : 10,
          height: 10,
          decoration: BoxDecoration(
            color: active ? primaryGreen : Colors.grey.shade300,
            borderRadius: BorderRadius.circular(10),
            boxShadow: active
                ? [BoxShadow(color: primaryGreen.withOpacity(0.12), blurRadius: 6, offset: const Offset(0, 2))]
                : null,
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
    List<Widget> widgets = Forms(context, campos, Actualizacion, valuesForm, primaryGreen);
    return LayoutBuilder(builder: (context, constraints) {
      double available = constraints.maxWidth;
      bool singleColumn = available < 460;
      double gap = constraints.maxWidth < 400 ? 10 : 16;
      double itemWidth = singleColumn ? available : (available - gap) / 2;
      List<Widget> items = widgets.map((w) => SizedBox(width: itemWidth, child: w)).toList();
      return SingleChildScrollView(
        padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom + 100),
        physics: const BouncingScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Center(
              child: Text(
                Registro.camposForm[index]["titulo"],
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: primaryGreen),
              ),
            ),
            const SizedBox(height: 16),
            Wrap(spacing: gap, runSpacing: gap, children: items),
            const SizedBox(height: 12),
          ],
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final isWide = size.width >= 700;
    final maxContainerWidth = isWide ? 1000.0 : size.width * 0.98;
    int totalSteps = Registro.camposForm.length;

    Widget panelIzquierdo = Padding(
      padding: EdgeInsets.all(_outerPadding),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: EdgeInsets.all(_outerPadding),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: LinearGradient(
                  colors: [Colors.green.shade300, Colors.green.shade600],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight),
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
          const SizedBox(height: 12),
          Text(
            "Bienvenido — completa tu registro en unos pocos pasos.",
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.grey[700], fontSize: 14),
          ),
        ],
      ),
    );

    Widget contenedorBlanco = ClipRRect(
      borderRadius: BorderRadius.circular(_borderRadius),
      child: Container(
        width: double.infinity,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(_borderRadius),
          boxShadow: const [
            BoxShadow(color: Colors.black12, blurRadius: 20, offset: Offset(0, 8))
          ],
        ),
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: _outerPadding, vertical: _innerPadding),
          child: Theme(
            data: Theme.of(context).copyWith(
              inputDecorationTheme: InputDecorationTheme(
                filled: true,
                fillColor: Colors.grey.shade50,
                isDense: true,
                contentPadding: const EdgeInsets.symmetric(vertical: 14, horizontal: 12),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Colors.grey.shade300)),
                focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: primaryGreen, width: 1.5)),
              ),
            ),
            child: Column(
              children: [
                if (!isWide) _mobileHeader(),
                if (!isWide) const SizedBox(height: 12),
                _stepIndicator(totalSteps),
                const SizedBox(height: 12),
                Expanded(
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 350),
                    transitionBuilder: (child, animation) => FadeTransition(opacity: animation, child: child),
                    child: KeyedSubtree(
                      key: ValueKey(paso),
                      child: Form(key: _formKey, child: _buildStep(context, paso)),
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
      return Scaffold(
        appBar: AppBar(
          backgroundColor: primaryGreen,
          title: const Text(
            "Registro",
            style: TextStyle(color: Colors.white),
          ),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        body: SafeArea(
          child: Center(
            child: Container(
              constraints: BoxConstraints(maxWidth: maxContainerWidth, minHeight: 520),
              child: Row(
                children: [
                  Expanded(flex: 3, child: panelIzquierdo),
                  const SizedBox(width: 16),
                  Expanded(flex: 5, child: contenedorBlanco),
                ],
              ),
            ),
          ),
        ),
        bottomNavigationBar: _buildBottomBar(isWide),
      );
    }

    return Scaffold(
      appBar: AppBar(
        backgroundColor: primaryGreen,
        title: const Text(
          "Registro",
          style: TextStyle(color: Colors.white),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      resizeToAvoidBottomInset: true,
      body: SafeArea(
        child: Center(
          child: Container(
            constraints: BoxConstraints(maxWidth: maxContainerWidth),
            padding: EdgeInsets.symmetric(horizontal: _outerPadding, vertical: _outerPadding / 2),
            child: Column(children: [Expanded(child: contenedorBlanco)]),
          ),
        ),
      ),
      bottomNavigationBar: _buildBottomBar(isWide),
    );
  }

  Widget _buildBottomBar(bool isWide) {
    final size = MediaQuery.of(context).size;
    return SafeArea(
      top: false,
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 16, vertical: size.height < 600 ? 6 : 12),
        decoration: BoxDecoration(color: Colors.white, boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 8, offset: const Offset(0, -4))]),
        child: Row(
          children: [
            if (paso > 0)
              OutlinedButton(
                onPressed: pasoAnterior,
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.grey[800],
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text("Atrás"),
              )
            else
              const SizedBox(width: 6),
            const SizedBox(width: 12),
            Expanded(
              child: ElevatedButton(
                onPressed: siguientePaso,
                style: ElevatedButton.styleFrom(
                  backgroundColor: primaryGreen,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 4,
                ),
                child: Text(this.paso == 2 ? "Registrar": "Siguiente", style: TextStyle(fontSize: 16, color: Colors.white)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
