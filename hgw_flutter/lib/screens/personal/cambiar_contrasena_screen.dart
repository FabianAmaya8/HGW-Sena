import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/personal/personal_provider.dart';
import '../../utils/constants.dart';

class CambiarContrasenaScreen extends StatefulWidget {
  const CambiarContrasenaScreen({Key? key}) : super(key: key);

  @override
  State<CambiarContrasenaScreen> createState() =>
      _CambiarContrasenaScreenState();
}

class _CambiarContrasenaScreenState extends State<CambiarContrasenaScreen> {
  final _formKey = GlobalKey<FormState>();
  final _contrasenaActualController = TextEditingController();
  final _contrasenaNuevaController = TextEditingController();
  final _confirmarContrasenaController = TextEditingController();

  bool _mostrarContrasenaActual = false;
  bool _mostrarContrasenaNueva = false;
  bool _mostrarConfirmarContrasena = false;
  bool _guardando = false;

  @override
  void dispose() {
    _contrasenaActualController.dispose();
    _contrasenaNuevaController.dispose();
    _confirmarContrasenaController.dispose();
    super.dispose();
  }

  Future<void> _cambiarContrasena() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _guardando = true;
    });

    try {
      final provider = context.read<PersonalProvider>();
      bool success = await provider.cambiarContrasena(
        _contrasenaActualController.text,
        _contrasenaNuevaController.text,
      );

      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Contraseña actualizada correctamente'),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context);
      } else if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(provider.error ?? 'Error al cambiar la contraseña'),
            backgroundColor: AppColors.errorColor,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _guardando = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: IconThemeData(color: AppColors.textDark),
        title: Text('Cambiar Contraseña', style: AppStyles.heading2),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Ilustración
              Center(
                child: Container(
                  padding: const EdgeInsets.all(32),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        AppColors.primaryGreen.withOpacity(0.1),
                        AppColors.accentGreen.withOpacity(0.1),
                      ],
                    ),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.lock_outline,
                    size: 80,
                    color: AppColors.primaryGreen,
                  ),
                ),
              ),
              const SizedBox(height: 32),

              // Instrucciones
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.blue.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.blue.withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.info_outline, color: Colors.blue),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'Tu nueva contraseña debe tener al menos 8 caracteres',
                        style: TextStyle(
                          color: Colors.blue[700],
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Campo de contraseña actual
              Text('Contraseña Actual', style: AppStyles.heading3),
              const SizedBox(height: 8),
              TextFormField(
                controller: _contrasenaActualController,
                obscureText: !_mostrarContrasenaActual,
                decoration: InputDecoration(
                  hintText: 'Ingresa tu contraseña actual',
                  prefixIcon:
                      Icon(Icons.lock_outline, color: AppColors.primaryGreen),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _mostrarContrasenaActual
                          ? Icons.visibility
                          : Icons.visibility_off,
                      color: AppColors.textMedium,
                    ),
                    onPressed: () {
                      setState(() {
                        _mostrarContrasenaActual = !_mostrarContrasenaActual;
                      });
                    },
                  ),
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: BorderSide.none,
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: BorderSide(color: Colors.grey.shade200),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide:
                        BorderSide(color: AppColors.primaryGreen, width: 2),
                  ),
                  errorBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: BorderSide(color: AppColors.errorColor),
                  ),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'La contraseña actual es requerida';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 20),

              // Campo de nueva contraseña
              Text('Nueva Contraseña', style: AppStyles.heading3),
              const SizedBox(height: 8),
              TextFormField(
                controller: _contrasenaNuevaController,
                obscureText: !_mostrarContrasenaNueva,
                decoration: InputDecoration(
                  hintText: 'Ingresa tu nueva contraseña',
                  prefixIcon: Icon(Icons.lock, color: AppColors.primaryGreen),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _mostrarContrasenaNueva
                          ? Icons.visibility
                          : Icons.visibility_off,
                      color: AppColors.textMedium,
                    ),
                    onPressed: () {
                      setState(() {
                        _mostrarContrasenaNueva = !_mostrarContrasenaNueva;
                      });
                    },
                  ),
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: BorderSide.none,
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: BorderSide(color: Colors.grey.shade200),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide:
                        BorderSide(color: AppColors.primaryGreen, width: 2),
                  ),
                  errorBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: BorderSide(color: AppColors.errorColor),
                  ),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'La nueva contraseña es requerida';
                  }
                  if (value.length < 8) {
                    return 'La contraseña debe tener al menos 8 caracteres';
                  }
                  if (value == _contrasenaActualController.text) {
                    return 'La nueva contraseña debe ser diferente a la actual';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 20),

              // Campo de confirmar contraseña
              Text('Confirmar Nueva Contraseña', style: AppStyles.heading3),
              const SizedBox(height: 8),
              TextFormField(
                controller: _confirmarContrasenaController,
                obscureText: !_mostrarConfirmarContrasena,
                decoration: InputDecoration(
                  hintText: 'Confirma tu nueva contraseña',
                  prefixIcon:
                      Icon(Icons.lock_clock, color: AppColors.primaryGreen),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _mostrarConfirmarContrasena
                          ? Icons.visibility
                          : Icons.visibility_off,
                      color: AppColors.textMedium,
                    ),
                    onPressed: () {
                      setState(() {
                        _mostrarConfirmarContrasena =
                            !_mostrarConfirmarContrasena;
                      });
                    },
                  ),
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: BorderSide.none,
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: BorderSide(color: Colors.grey.shade200),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide:
                        BorderSide(color: AppColors.primaryGreen, width: 2),
                  ),
                  errorBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                    borderSide: BorderSide(color: AppColors.errorColor),
                  ),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Debes confirmar tu nueva contraseña';
                  }
                  if (value != _contrasenaNuevaController.text) {
                    return 'Las contraseñas no coinciden';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 32),

              // Requisitos de contraseña
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.grey[50],
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Requisitos de contraseña:',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: AppColors.textDark,
                      ),
                    ),
                    const SizedBox(height: 8),
                    _buildRequisito('Mínimo 8 caracteres',
                        _contrasenaNuevaController.text.length >= 8),
                    _buildRequisito(
                        'Diferente a la contraseña actual',
                        _contrasenaNuevaController.text.isNotEmpty &&
                            _contrasenaNuevaController.text !=
                                _contrasenaActualController.text),
                    _buildRequisito(
                        'Las contraseñas coinciden',
                        _confirmarContrasenaController.text.isNotEmpty &&
                            _contrasenaNuevaController.text ==
                                _confirmarContrasenaController.text),
                  ],
                ),
              ),
              const SizedBox(height: 32),

              // Botón de guardar
              Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  gradient: AppColors.primaryGradient,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primaryGreen.withOpacity(0.3),
                      blurRadius: 20,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    borderRadius: BorderRadius.circular(16),
                    onTap: _guardando ? null : _cambiarContrasena,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 18),
                      child: Center(
                        child: _guardando
                            ? const SizedBox(
                                width: 24,
                                height: 24,
                                child: CircularProgressIndicator(
                                  color: Colors.white,
                                  strokeWidth: 2,
                                ),
                              )
                            : const Text(
                                'Cambiar Contraseña',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRequisito(String texto, bool cumplido) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Icon(
            cumplido ? Icons.check_circle : Icons.circle_outlined,
            size: 16,
            color: cumplido ? Colors.green : Colors.grey,
          ),
          const SizedBox(width: 8),
          Text(
            texto,
            style: TextStyle(
              color: cumplido ? Colors.green[700] : AppColors.textMedium,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }
}
