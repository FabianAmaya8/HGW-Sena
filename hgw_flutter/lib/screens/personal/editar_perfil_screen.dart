import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import '../../providers/personal/personal_provider.dart';
import '../../services/personal/personal_service.dart';
import '../../utils/constants.dart';

class EditarPerfilScreen extends StatefulWidget {
  const EditarPerfilScreen({Key? key}) : super(key: key);

  @override
  State<EditarPerfilScreen> createState() => _EditarPerfilScreenState();
}

class _EditarPerfilScreenState extends State<EditarPerfilScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nombreController = TextEditingController();
  final _apellidoController = TextEditingController();
  final _emailController = TextEditingController();
  final _telefonoController = TextEditingController();

  // Controllers para dirección
  final _direccionController = TextEditingController();
  final _codigoPostalController = TextEditingController();
  final _lugarEntregaController = TextEditingController();
  final _ciudadController = TextEditingController();

  File? _imagenSeleccionada;
  final ImagePicker _picker = ImagePicker();
  bool _guardando = false;
  int? _direccionId;

  @override
  void initState() {
    super.initState();
    _cargarDatosUsuario();
  }

  void _cargarDatosUsuario() {
    final provider = context.read<PersonalProvider>();
    final usuario = provider.usuario;

    if (usuario != null) {
      _nombreController.text = usuario.nombre;
      _apellidoController.text = usuario.apellido;
      _emailController.text = usuario.correoElectronico;
      _telefonoController.text = usuario.numeroTelefono ?? '';
      if (usuario.direcciones.isNotEmpty) {
        final direccion = usuario.direcciones.first;
        _direccionId = direccion.idDireccion;
        _direccionController.text = direccion.direccion;
        _codigoPostalController.text = direccion.codigoPostal ?? '';
        _lugarEntregaController.text = direccion.lugarEntrega ?? '';
        _ciudadController.text = direccion.ciudad ?? '';
      }
    }
  }

  @override
  void dispose() {
    _nombreController.dispose();
    _apellidoController.dispose();
    _emailController.dispose();
    _telefonoController.dispose();
    _direccionController.dispose();
    _codigoPostalController.dispose();
    _lugarEntregaController.dispose();
    _ciudadController.dispose();
    super.dispose();
  }

  Future<void> _seleccionarImagen(ImageSource source) async {
    try {
      final XFile? imagen = await _picker.pickImage(
        source: source,
        maxWidth: 800,
        maxHeight: 800,
        imageQuality: 80,
      );

      if (imagen != null) {
        setState(() {
          _imagenSeleccionada = File(imagen.path);
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error al seleccionar imagen: $e'),
          backgroundColor: AppColors.errorColor,
        ),
      );
    }
  }
  void _mostrarOpcionesImagen() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (BuildContext context) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Cambiar foto de perfil',
                  style: AppStyles.heading2,
                ),
                const SizedBox(height: 20),
                ListTile(
                  leading: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppColors.primaryGreen.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child:
                        Icon(Icons.camera_alt, color: AppColors.primaryGreen),
                  ),
                  title: const Text('Tomar foto'),
                  onTap: () {
                    Navigator.pop(context);
                    _seleccionarImagen(ImageSource.camera);
                  },
                ),
                ListTile(
                  leading: Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppColors.primaryGreen.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(Icons.photo_library,
                        color: AppColors.primaryGreen),
                  ),
                  title: const Text('Elegir de la galería'),
                  onTap: () {
                    Navigator.pop(context);
                    _seleccionarImagen(ImageSource.gallery);
                  },
                ),
                if (context.read<PersonalProvider>().usuario?.urlFotoPerfil !=
                    null)
                  ListTile(
                    leading: Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: Colors.red.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.delete, color: Colors.red),
                    ),
                    title: const Text('Eliminar foto actual'),
                    onTap: () async {
                      Navigator.pop(context);
                      final provider = context.read<PersonalProvider>();
                      bool success = await provider.eliminarFotoPerfil();
                      if (success && mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Foto eliminada'),
                            backgroundColor: Colors.green,
                          ),
                        );
                      }
                    },
                  ),
              ],
            ),
          ),
        );
      },
    );
  }

  Future<void> _guardarCambios() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _guardando = true;
    });

    try {
      final provider = context.read<PersonalProvider>();

      Map<String, dynamic> datos = {
        'nombre': _nombreController.text.trim(),
        'apellido': _apellidoController.text.trim(),
        'correo_electronico': _emailController.text.trim(),
        'numero_telefono': _telefonoController.text.trim(),
      };

      if (_direccionController.text.isNotEmpty) {
        datos['direcciones'] = [
          {
            'id_direccion': _direccionId,
            'direccion': _direccionController.text.trim(),
            'codigo_postal': _codigoPostalController.text.trim(),
            'lugar_entrega': _lugarEntregaController.text.trim(),
            'ciudad': _ciudadController.text.trim(),
          }
        ];
      }

      bool success = await provider.actualizarDatosPersonales(
        datos,
        fotoPerfil: _imagenSeleccionada,
      );

      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Perfil actualizado correctamente'),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context);
      } else if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error al actualizar: ${provider.error}'),
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
    final provider = context.watch<PersonalProvider>();

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: IconThemeData(color: AppColors.textDark),
        title: Text('Editar Perfil', style: AppStyles.heading2),
        actions: [
          if (_guardando)
            const Center(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(strokeWidth: 2),
                ),
              ),
            )
          else
            TextButton(
              onPressed: _guardarCambios,
              child: Text(
                'Guardar',
                style: TextStyle(
                  color: AppColors.primaryGreen,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Foto de perfil
              Center(
                child: GestureDetector(
                  onTap: _mostrarOpcionesImagen,
                  child: Stack(
                    children: [
                      Container(
                        width: 120,
                        height: 120,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: AppColors.primaryGreen,
                            width: 3,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.primaryGreen.withOpacity(0.2),
                              blurRadius: 20,
                              offset: const Offset(0, 10),
                            ),
                          ],
                        ),
                        child: ClipOval(
                        child: _imagenSeleccionada != null
                              ? Image.file(
                                  _imagenSeleccionada!,
                                  fit: BoxFit.cover,
                                )
                              : provider.usuario?.urlFotoPerfil != null
                                  ? Image.network(
                                      '${PersonalService.baseUrl}/${provider.usuario!.urlFotoPerfil}',
                                      fit: BoxFit.cover,
                                      errorBuilder: (context, error,
                                              stackTrace) =>
                                          _buildDefaultAvatar(provider.usuario),
                                    )
                                  : _buildDefaultAvatar(provider.usuario),
                        ),
                      ),
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppColors.primaryGreen,
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.2),
                                blurRadius: 10,
                              ),
                            ],
                          ),
                          child: const Icon(
                            Icons.camera_alt,
                            size: 20,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 32),

              // Sección de Información Personal
              Text('Información Personal', style: AppStyles.heading2),
              const SizedBox(height: 20),

              // Campos del formulario
              _buildTextField(
                controller: _nombreController,
                label: 'Nombre',
                icon: Icons.person,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'El nombre es requerido';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 20),

              _buildTextField(
                controller: _apellidoController,
                label: 'Apellido',
                icon: Icons.person_outline,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'El apellido es requerido';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 20),

              _buildTextField(
                controller: _emailController,
                label: 'Correo electrónico',
                icon: Icons.email,
                keyboardType: TextInputType.emailAddress,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'El correo es requerido';
                  }
                  if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')
                      .hasMatch(value)) {
                    return 'Ingrese un correo válido';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 20),

              _buildTextField(
                controller: _telefonoController,
                label: 'Teléfono',
                icon: Icons.phone,
                keyboardType: TextInputType.phone,
              ),

              const SizedBox(height: 32),

              // Sección de Dirección
              Text('Dirección de Envío', style: AppStyles.heading2),
              const SizedBox(height: 20),

              _buildTextField(
                controller: _direccionController,
                label: 'Dirección',
                icon: Icons.location_on,
                maxLines: 2,
              ),
              const SizedBox(height: 20),

              Row(
                children: [
                  Expanded(
                    child: _buildTextField(
                      controller: _codigoPostalController,
                      label: 'Código Postal',
                      icon: Icons.markunread_mailbox,
                      keyboardType: TextInputType.number,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildTextField(
                      controller: _ciudadController,
                      label: 'Ciudad',
                      icon: Icons.location_city,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              _buildTextField(
                controller: _lugarEntregaController,
                label: 'Lugar de Entrega (Referencias)',
                icon: Icons.place,
                maxLines: 2,
              ),

              const SizedBox(height: 40),

              // Información adicional no editable
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.08),
                      blurRadius: 10,
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Información de cuenta', style: AppStyles.heading3),
                    const SizedBox(height: 16),
                    _buildInfoRow(
                      'Usuario',
                      '@${provider.usuario?.nombreUsuario ?? ''}',
                      Icons.alternate_email,
                    ),
                    _buildInfoRow(
                      'Membresía',
                      provider.nivelMembresia,
                      Icons.card_membership,
                    ),
                    _buildInfoRow(
                      'Puntos BV',
                      '${provider.puntosActuales}',
                      Icons.stars,
                    ),
                    if (provider.usuario?.patrocinador != null)
                      _buildInfoRow(
                        'Patrocinador',
                        provider.usuario!.patrocinador!,
                        Icons.person_add,
                      ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    TextInputType? keyboardType,
    String? Function(String?)? validator,
    int maxLines = 1,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      validator: validator,
      maxLines: maxLines,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: maxLines > 1
            ? Padding(
                padding: const EdgeInsets.only(bottom: 40),
                child: Icon(icon, color: AppColors.primaryGreen),
              )
            : Icon(icon, color: AppColors.primaryGreen),
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
          borderSide: BorderSide(color: AppColors.primaryGreen, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: AppColors.errorColor),
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, IconData icon) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(icon, size: 20, color: AppColors.textMedium),
          const SizedBox(width: 12),
          Text(
            '$label: ',
            style: TextStyle(
              color: AppColors.textMedium,
              fontSize: 14,
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDefaultAvatar(usuario) {
    String inicial = usuario != null
        ? (usuario.nombre.isNotEmpty ? usuario.nombre[0] : 'U')
        : 'U';

    return Container(
      color: AppColors.accentGreen,
      child: Center(
        child: Text(
          inicial.toUpperCase(),
          style: const TextStyle(
            fontSize: 48,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ),
    );
  }
}
