import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/carrito/carrito_provider.dart';
import '../../utils/constants.dart';
import '../../models/carrito/direccion.dart';
import 'pago_screen.dart';

class DireccionesScreen extends StatefulWidget {
  const DireccionesScreen({Key? key}) : super(key: key);

  @override
  State<DireccionesScreen> createState() => _DireccionesScreenState();
}

class _DireccionesScreenState extends State<DireccionesScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CarritoProvider>().cargarDirecciones();
    });
  }

  void _mostrarFormularioDireccion(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
        ),
        child: const _FormularioDireccion(),
      ),
    );
  }

  void _confirmarEliminarDireccion(
      BuildContext context, CarritoProvider provider, Direccion direccion) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Eliminar dirección'),
        content: Text(
          '¿Está seguro que desea eliminar la dirección "${direccion.lugarEntrega}"?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context);

              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Row(
                      children: [
                        SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor:
                                AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        ),
                        SizedBox(width: 16),
                        Text('Eliminando dirección...'),
                      ],
                    ),
                    duration: Duration(seconds: 2),
                  ),
                );
              }

              final success = await provider.eliminarDireccion(direccion.id);

              if (context.mounted) {
                ScaffoldMessenger.of(context).clearSnackBars();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      success
                          ? 'Dirección eliminada exitosamente'
                          : 'Error al eliminar dirección',
                    ),
                    backgroundColor: success ? Colors.green : Colors.red,
                  ),
                );
              }
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Eliminar'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(
        title: const Text('Seleccionar Dirección'),
        backgroundColor: AppColors.primaryGreen,
        foregroundColor: Colors.white,
      ),
      body: Consumer<CarritoProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          return Column(
            children: [
              // Botón para agregar dirección
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                child: ElevatedButton.icon(
                  onPressed: () => _mostrarFormularioDireccion(context),
                  icon: const Icon(Icons.add),
                  label: const Text('Agregar Nueva Dirección'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryGreen,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                ),
              ),

              // Lista de direcciones
              Expanded(
                child: provider.direcciones.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.location_off,
                              size: 64,
                              color: AppColors.textMedium,
                            ),
                            const SizedBox(height: 16),
                            Text(
                              'No hay direcciones registradas',
                              style: TextStyle(
                                fontSize: 16,
                                color: AppColors.textMedium,
                              ),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        itemCount: provider.direcciones.length,
                        itemBuilder: (context, index) {
                          final direccion = provider.direcciones[index];
                          final isSelected =
                              provider.direccionSeleccionada?.id ==
                                  direccion.id;

                          return Card(
                            margin: const EdgeInsets.only(bottom: 8),
                            elevation: isSelected ? 4 : 1,
                            color: isSelected
                                ? AppColors.primaryGreen.withOpacity(0.1)
                                : Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                              side: BorderSide(
                                color: isSelected
                                    ? AppColors.primaryGreen
                                    : Colors.grey.shade300,
                                width: isSelected ? 2 : 1,
                              ),
                            ),
                            child: InkWell(
                              onTap: () =>
                                  provider.seleccionarDireccion(direccion),
                              borderRadius: BorderRadius.circular(8),
                              child: Padding(
                                padding: const EdgeInsets.all(12),
                                child: Row(
                                  children: [
                                    Radio<int>(
                                      value: direccion.id,
                                      groupValue:
                                          provider.direccionSeleccionada?.id,
                                      activeColor: AppColors.primaryGreen,
                                      onChanged: (_) => provider
                                          .seleccionarDireccion(direccion),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            direccion.lugarEntrega,
                                            style: const TextStyle(
                                              fontWeight: FontWeight.bold,
                                              fontSize: 16,
                                            ),
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            direccion.direccion,
                                            style:
                                                const TextStyle(fontSize: 14),
                                          ),
                                          const SizedBox(height: 2),
                                          Text(
                                            '${direccion.ciudad ?? ''}, ${direccion.pais ?? ''} - CP: ${direccion.codigoPostal}',
                                            style: TextStyle(
                                              fontSize: 12,
                                              color: AppColors.textMedium,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    // ⚠️ NUEVO: Botón de eliminar
                                    IconButton(
                                      icon: const Icon(
                                        Icons.delete_outline,
                                        color: Colors.red,
                                      ),
                                      tooltip: 'Eliminar dirección',
                                      onPressed: () =>
                                          _confirmarEliminarDireccion(
                                        context,
                                        provider,
                                        direccion,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          );
                        },
                      ),
              ),

              // Sección inferior con total y botón de continuar
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 10,
                      offset: const Offset(0, -5),
                    ),
                  ],
                ),
                child: SafeArea(
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Total del pedido:',
                            style: TextStyle(fontSize: 16),
                          ),
                          Text(
                            '\$${provider.total.toStringAsFixed(2)}',
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: provider.direccionSeleccionada != null
                              ? () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) => const PagoScreen(),
                                    ),
                                  );
                                }
                              : null,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primaryGreen,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          child: const Text(
                            'Continuar al pago',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

// Formulario para agregar nueva dirección
class _FormularioDireccion extends StatefulWidget {
  const _FormularioDireccion();

  @override
  State<_FormularioDireccion> createState() => _FormularioDireccionState();
}

class _FormularioDireccionState extends State<_FormularioDireccion> {
  final _formKey = GlobalKey<FormState>();
  final _direccionController = TextEditingController();
  final _codigoPostalController = TextEditingController();

  String _lugarSeleccionado = 'Casa';
  String? _paisSeleccionado;
  String? _ciudadSeleccionada;
  bool _isLoading = false;
  Map<String, List<String>> _ubicaciones = {};

  final List<String> _tiposLugar = [
    'Casa',
    'Apartamento',
    'Hotel',
    'Oficina',
    'Otro'
  ];

  @override
  void initState() {
    super.initState();
    _cargarUbicaciones();
  }

  Future<void> _cargarUbicaciones() async {
    setState(() => _isLoading = true);
    try {
      final provider = context.read<CarritoProvider>();
      final ubicaciones = await provider.obtenerUbicaciones();
      setState(() {
        _ubicaciones = ubicaciones;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  @override
  void dispose() {
    _direccionController.dispose();
    _codigoPostalController.dispose();
    super.dispose();
  }

  Future<void> _guardarDireccion() async {
    if (!_formKey.currentState!.validate()) return;
    if (_paisSeleccionado == null || _ciudadSeleccionada == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor seleccione país y ciudad')),
      );
      return;
    }

    setState(() => _isLoading = true);

    final provider = context.read<CarritoProvider>();
    final success = await provider.agregarDireccion(
      lugarEntrega: _lugarSeleccionado,
      direccion: _direccionController.text.trim(),
      ciudad: _ciudadSeleccionada!,
      pais: _paisSeleccionado!,
      codigoPostal: _codigoPostalController.text.trim(),
    );

    if (mounted) {
      if (success) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Dirección agregada exitosamente'),
            backgroundColor: Colors.green,
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Error al agregar dirección'),
            backgroundColor: Colors.red,
          ),
        );
      }
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Nueva Dirección',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),

            // Tipo de lugar
            DropdownButtonFormField<String>(
              value: _lugarSeleccionado,
              decoration: const InputDecoration(
                labelText: 'Tipo de lugar',
                border: OutlineInputBorder(),
              ),
              items: _tiposLugar
                  .map((tipo) =>
                      DropdownMenuItem(value: tipo, child: Text(tipo)))
                  .toList(),
              onChanged: (value) {
                if (value != null) setState(() => _lugarSeleccionado = value);
              },
            ),
            const SizedBox(height: 16),

            // Dirección
            TextFormField(
              controller: _direccionController,
              decoration: const InputDecoration(
                labelText: 'Dirección completa',
                hintText: 'Calle, número, colonia...',
                border: OutlineInputBorder(),
              ),
              maxLines: 2,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Por favor ingrese la dirección';
                }
                return null;
              },
            ),
            const SizedBox(height: 16),

            // País
            DropdownButtonFormField<String>(
              value: _paisSeleccionado,
              decoration: const InputDecoration(
                labelText: 'País',
                border: OutlineInputBorder(),
              ),
              items: _ubicaciones.keys
                  .map((pais) =>
                      DropdownMenuItem(value: pais, child: Text(pais)))
                  .toList(),
              onChanged: (value) {
                setState(() {
                  _paisSeleccionado = value;
                  _ciudadSeleccionada = null;
                });
              },
            ),
            const SizedBox(height: 16),

            // Ciudad
            DropdownButtonFormField<String>(
              value: _ciudadSeleccionada,
              decoration: const InputDecoration(
                labelText: 'Ciudad',
                border: OutlineInputBorder(),
              ),
              items: _paisSeleccionado != null
                  ? _ubicaciones[_paisSeleccionado]
                          ?.map((ciudad) => DropdownMenuItem(
                              value: ciudad, child: Text(ciudad)))
                          .toList() ??
                      []
                  : [],
              onChanged: (value) => setState(() => _ciudadSeleccionada = value),
            ),
            const SizedBox(height: 16),

            // Código Postal
            TextFormField(
              controller: _codigoPostalController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Código Postal',
                border: OutlineInputBorder(),
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Por favor ingrese el código postal';
                }
                return null;
              },
            ),
            const SizedBox(height: 24),

            // Botones
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Cancelar'),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _guardarDireccion,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryGreen,
                    ),
                    child: _isLoading
                        ? const SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor:
                                  AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                          )
                        : const Text('Guardar'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
