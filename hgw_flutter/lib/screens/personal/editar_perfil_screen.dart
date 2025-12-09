import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import '../../providers/personal/personal_provider.dart';
import '../../utils/constants.dart';

class EditarPerfilScreen extends StatefulWidget {
  const EditarPerfilScreen({Key? key}) : super(key: key);

  @override
  State<EditarPerfilScreen> createState() => _EditarPerfilScreenState();
}

class _EditarPerfilScreenState extends State<EditarPerfilScreen> {
  final _formKey = GlobalKey<FormState>();
  final _controllers = {
    'nombre': TextEditingController(),
    'apellido': TextEditingController(),
    'email': TextEditingController(),
    'telefono': TextEditingController(),
    'direccion': TextEditingController(),
    'codigoPostal': TextEditingController(),
    'lugarEntrega': TextEditingController(),
    'ciudad': TextEditingController(),
  };

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
      _controllers['nombre']!.text = usuario.nombre;
      _controllers['apellido']!.text = usuario.apellido;
      _controllers['email']!.text = usuario.correoElectronico;
      _controllers['telefono']!.text = usuario.numeroTelefono ?? '';

      if (usuario.direcciones.isNotEmpty) {
        final direccion = usuario.direcciones.first;
        _direccionId = direccion.idDireccion;
        _controllers['direccion']!.text = direccion.direccion;
        _controllers['codigoPostal']!.text = direccion.codigoPostal ?? '';
        _controllers['lugarEntrega']!.text = direccion.lugarEntrega ?? '';
        _controllers['ciudad']!.text = direccion.ciudad ?? '';
      }
    }
  }

  @override
  void dispose() {
    _controllers.values.forEach((controller) => controller.dispose());
    super.dispose();
  }

  Future<void> _seleccionarImagen(ImageSource source) async {
    try {
      final XFile? imagen = await _picker.pickImage(
          source: source, maxWidth: 800, maxHeight: 800, imageQuality: 80);

      if (imagen != null)
        setState(() => _imagenSeleccionada = File(imagen.path));
    } catch (e) {
      _mostrarSnackbar('Error al seleccionar imagen: $e', AppColors.errorColor);
    }
  }

  void _mostrarSnackbar(String mensaje, Color color) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(mensaje), backgroundColor: color),
    );
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
                Text('Cambiar foto de perfil', style: AppStyles.heading2),
                const SizedBox(height: 20),
                _buildOpcionImagen(
                  icon: Icons.camera_alt,
                  texto: 'Tomar foto',
                  onTap: () {
                    Navigator.pop(context);
                    _seleccionarImagen(ImageSource.camera);
                  },
                ),
                _buildOpcionImagen(
                  icon: Icons.photo_library,
                  texto: 'Elegir de la galería',
                  onTap: () {
                    Navigator.pop(context);
                    _seleccionarImagen(ImageSource.gallery);
                  },
                ),
                if (context.read<PersonalProvider>().usuario?.urlFotoPerfil !=
                    null)
                  _buildOpcionImagen(
                    icon: Icons.delete,
                    texto: 'Eliminar foto actual',
                    color: Colors.red,
                    onTap: () async {
                      Navigator.pop(context);
                      final provider = context.read<PersonalProvider>();
                      bool success = await provider.eliminarFotoPerfil();
                      if (success && mounted)
                        _mostrarSnackbar('Foto eliminada', Colors.green);
                    },
                  ),
              ],
            ),
          ),
        );
      },
    );
  }
  ListTile _buildOpcionImagen(
      {required IconData icon,
      required String texto,
      Color color = AppColors.primaryGreen,
      required VoidCallback onTap}) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Icon(icon, color: color),
      ),
      title: Text(texto),
      onTap: onTap,
    );
  }

  Future<void> _guardarCambios() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _guardando = true);

    try {
      final provider = context.read<PersonalProvider>();
      provider.limpiarError();

      Map<String, dynamic> datos = {
        'nombre': _controllers['nombre']!.text.trim(),
        'apellido': _controllers['apellido']!.text.trim(),
        'correo_electronico': _controllers['email']!.text.trim(),
        'numero_telefono': _controllers['telefono']!.text.trim(),
      };

      if (_controllers['direccion']!.text.isNotEmpty) {
        datos['direcciones'] = [
          {
            'id_direccion': _direccionId,
            'direccion': _controllers['direccion']!.text.trim(),
            'codigo_postal': _controllers['codigoPostal']!.text.trim(),
            'lugar_entrega': _controllers['lugarEntrega']!.text.trim(),
            'ciudad': _controllers['ciudad']!.text.trim(),
          }
        ];
      }
      bool success = await provider.actualizarDatosPersonales(
        datos,
        fotoPerfil: _imagenSeleccionada,
      );
      if (!mounted) return;
      if (provider.error == null || provider.error!.isEmpty) {
        _mostrarSnackbar('Perfil actualizado correctamente', Colors.green);
        await Future.delayed(const Duration(milliseconds: 600));
        if (mounted) Navigator.pop(context);
      } else {
        _mostrarSnackbar(provider.error!, AppColors.errorColor);
      }
    } catch (e) {
      if (mounted) {
        _mostrarSnackbar(
          'Error inesperado: ${e.toString()}',
          AppColors.errorColor,
        );
      }
    } finally {
      if (mounted) setState(() => _guardando = false);
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
                  child: CircularProgressIndicator(strokeWidth: 2)),
            ))
          else
            TextButton(
              onPressed: _guardarCambios,
              child: Text('Guardar',
                  style: TextStyle(
                      color: AppColors.primaryGreen,
                      fontWeight: FontWeight.bold)),
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
                        border:
                            Border.all(color: AppColors.primaryGreen, width: 3),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.primaryGreen.withOpacity(0.2),
                            blurRadius: 20,
                            offset: const Offset(0, 10),
                          )
                        ],
                      ),
                      child: ClipOval(
                        child: _imagenSeleccionada != null
                            ? Image.file(_imagenSeleccionada!,
                                fit: BoxFit.cover)
                            : provider.usuario?.urlFotoPerfil != null
                                ? Image.network(
                                    provider.usuario!.urlFotoPerfil!,
                                    fit: BoxFit.cover,
                                    errorBuilder: (context, error,
                                            stackTrace) =>
                                        _buildDefaultAvatar(provider.usuario))
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
                                blurRadius: 10)
                          ],
                        ),
                        child: const Icon(Icons.camera_alt,
                            size: 20, color: Colors.white),
                      ),
                    ),
                  ],
                ),
              )),
              const SizedBox(height: 32),

              // Sección de Información Personal
              Text('Información Personal', style: AppStyles.heading2),
              const SizedBox(height: 20),

              // Campos del formulario
              _buildTextField(
                  controller: _controllers['nombre']!,
                  label: 'Nombre',
                  icon: Icons.person,
                  validator: _validarRequerido),
              const SizedBox(height: 20),
              _buildTextField(
                  controller: _controllers['apellido']!,
                  label: 'Apellido',
                  icon: Icons.person_outline,
                  validator: _validarRequerido),
              const SizedBox(height: 20),
              _buildTextField(
                  controller: _controllers['email']!,
                  label: 'Correo electrónico',
                  icon: Icons.email,
                  keyboardType: TextInputType.emailAddress,
                  validator: _validarEmail),
              const SizedBox(height: 20),
              _buildTextField(
                  controller: _controllers['telefono']!,
                  label: 'Teléfono',
                  icon: Icons.phone,
                  keyboardType: TextInputType.phone),
              const SizedBox(height: 32),

              // Sección de Dirección
              Text('Dirección de Envío', style: AppStyles.heading2),
              const SizedBox(height: 20),
              _buildTextField(
                  controller: _controllers['direccion']!,
                  label: 'Dirección',
                  icon: Icons.location_on,
                  maxLines: 2),
              const SizedBox(height: 20),
              Row(
                children: [
                  Expanded(
                      child: _buildTextField(
                          controller: _controllers['codigoPostal']!,
                          label: 'Código Postal',
                          icon: Icons.markunread_mailbox,
                          keyboardType: TextInputType.number)),
                  const SizedBox(width: 16),
                  Expanded(
                      child: _buildTextField(
                          controller: _controllers['ciudad']!,
                          label: 'Ciudad',
                          icon: Icons.location_city)),
                ],
              ),
              const SizedBox(height: 20),
              _buildTextField(
                  controller: _controllers['lugarEntrega']!,
                  label: 'Lugar de Entrega (Referencias)',
                  icon: Icons.place,
                  maxLines: 2),
              const SizedBox(height: 40),

              // Información adicional no editable
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                        color: Colors.grey.withOpacity(0.08), blurRadius: 10)
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
                        Icons.alternate_email),
                    _buildInfoRow('Membresía', provider.nivelMembresia,
                        Icons.card_membership),
                    _buildInfoRow(
                        'Puntos BV', '${provider.puntosActuales}', Icons.stars),
                    if (provider.usuario?.patrocinador != null)
                      _buildInfoRow('Patrocinador',
                          provider.usuario!.patrocinador!, Icons.person_add),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String? _validarRequerido(String? value) =>
      (value == null || value.isEmpty) ? 'Este campo es requerido' : null;

  String? _validarEmail(String? value) {
    if (value == null || value.isEmpty) return 'El correo es requerido';
    if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value))
      return 'Ingrese un correo válido';
    return null;
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
                child: Icon(icon, color: AppColors.primaryGreen))
            : Icon(icon, color: AppColors.primaryGreen),
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide.none),
        enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: Colors.grey.shade200)),
        focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: AppColors.primaryGreen, width: 2)),
        errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(16),
            borderSide: BorderSide(color: AppColors.errorColor)),
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
          Text('$label: ',
              style: TextStyle(color: AppColors.textMedium, fontSize: 14)),
          Text(value,
              style:
                  const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
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
        child: Text(inicial.toUpperCase(),
            style: const TextStyle(
                fontSize: 48,
                fontWeight: FontWeight.bold,
                color: Colors.white)),
      ),
    );
  }
}
