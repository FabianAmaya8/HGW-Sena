import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/personal/personal_provider.dart';
import '../../utils/constants.dart';

class MiRedScreen extends StatefulWidget {
  final bool mostrarSoloLineasDirectas;
  const MiRedScreen({
    Key? key,
    this.mostrarSoloLineasDirectas = false,
  }) : super(key: key);

  @override
  State<MiRedScreen> createState() => _MiRedScreenState();
}

class _MiRedScreenState extends State<MiRedScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(
      length: 2,
      vsync: this,
      initialIndex: widget.mostrarSoloLineasDirectas ? 1 : 0,
    );

    // Cargar datos de la red
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _cargarDatos();
    });
  }

  Future<void> _cargarDatos() async {
    setState(() => _isLoading = true);
    final provider = context.read<PersonalProvider>();
    await provider.cargarMiRed();
    await provider.cargarLineasDirectas();
    setState(() => _isLoading = false);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<PersonalProvider>();

    return Scaffold(
      backgroundColor: AppColors.backgroundLight,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: IconThemeData(color: AppColors.textDark),
        title: Text(
          widget.mostrarSoloLineasDirectas ? 'Líneas Directas' : 'Mi Red',
          style: AppStyles.heading2,
        ),
        bottom: widget.mostrarSoloLineasDirectas
            ? null
            : TabBar(
                controller: _tabController,
                labelColor: AppColors.primaryGreen,
                unselectedLabelColor: AppColors.textMedium,
                indicatorColor: AppColors.primaryGreen,
                indicatorWeight: 3,
                tabs: const [
                  Tab(text: 'Mi Red'),
                  Tab(text: 'Líneas Directas'),
                ],
              ),
      ),
      body: _isLoading
          ? Center(
              child: CircularProgressIndicator(
                color: AppColors.primaryGreen,
              ),
            )
          : widget.mostrarSoloLineasDirectas
              ? _buildLineasDirectasContent(provider)
              : TabBarView(
                  controller: _tabController,
                  children: [
                    _buildMiRedContent(provider),
                    _buildLineasDirectasContent(provider),
                  ],
                ),
    );
  }

  Widget _buildMiRedContent(PersonalProvider provider) {
    final miRed = provider.miRed;

    if (miRed.isEmpty) {
      return _buildEmptyState('No tienes personas en tu red aún');
    }

    // Calcular estadísticas
    int totalActivos = miRed.where((m) => m['activo'] == 1).length;
    double ventasTotales = miRed.fold<double>(
        0, (sum, m) => sum + (m['puntos_bv'] ?? 0).toDouble());

    return Column(
      children: [
        // Estadísticas
        Container(
          margin: const EdgeInsets.all(20),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: AppColors.primaryGradient,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: AppColors.primaryGreen.withOpacity(0.3),
                blurRadius: 20,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildStatItem(
                  'Total en Red', miRed.length.toString(), Icons.group),
              _buildStatItem(
                  'Activos', totalActivos.toString(), Icons.check_circle),
              _buildStatItem(
                  'Puntos BV', ventasTotales.toStringAsFixed(0), Icons.stars),
            ],
          ),
        ),

        // Lista de personas
        Expanded(
          child: RefreshIndicator(
            onRefresh: _cargarDatos,
            color: AppColors.primaryGreen,
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              itemCount: miRed.length,
              itemBuilder: (context, index) {
                final persona = miRed[index];
                return _buildPersonaCard(persona);
              },
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildLineasDirectasContent(PersonalProvider provider) {
    final lineasDirectas = provider.lineasDirectasList;

    if (lineasDirectas.isEmpty) {
      return _buildEmptyState('No tienes líneas directas aún');
    }

    // Calcular estadísticas de líneas directas
    int puntosTotal = lineasDirectas.fold<int>(
        0, (sum, l) => sum + (l['puntos_bv'] ?? 0) as int);

    return Column(
      children: [
        Container(
          margin: const EdgeInsets.all(20),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.1),
                blurRadius: 20,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Líneas Directas', style: AppStyles.heading2),
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.primaryGreen.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      '${lineasDirectas.length} personas',
                      style: TextStyle(
                        color: AppColors.primaryGreen,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildLineaStatItem(
                      'Puntos BV Total', puntosTotal.toString(), Colors.blue),
                  _buildLineaStatItem(
                      'Promedio BV',
                      lineasDirectas.isNotEmpty
                          ? (puntosTotal / lineasDirectas.length)
                              .toStringAsFixed(0)
                          : '0',
                      Colors.green),
                ],
              ),
            ],
          ),
        ),
        Expanded(
          child: RefreshIndicator(
            onRefresh: _cargarDatos,
            color: AppColors.primaryGreen,
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              itemCount: lineasDirectas.length,
              itemBuilder: (context, index) {
                final linea = lineasDirectas[index];
                return _buildLineaDirectaCard(linea);
              },
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildEmptyState(String message) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.group_off,
            size: 80,
            color: AppColors.textMedium.withOpacity(0.5),
          ),
          const SizedBox(height: 16),
          Text(
            message,
            style: TextStyle(
              color: AppColors.textMedium,
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: _cargarDatos,
            icon: const Icon(Icons.refresh),
            label: const Text('Actualizar'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primaryGreen,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon, color: Colors.white, size: 28),
        const SizedBox(height: 8),
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          label,
          style: const TextStyle(
            color: Colors.white70,
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  Widget _buildLineaStatItem(String label, String value, Color color) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            color: color,
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            color: AppColors.textMedium,
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  Widget _buildPersonaCard(Map<String, dynamic> persona) {
    String nombreMembresia = persona['nombre_membresia'] ?? 'Cliente';
    Color nivelColor = _getNivelColor(nombreMembresia);
    bool activo = persona['activo'] == 1;

    // Formatear fecha
    String fechaRegistro = 'Sin fecha';
    if (persona['fecha_registro'] != null) {
      try {
        DateTime fecha = DateTime.parse(persona['fecha_registro']);
        fechaRegistro = '${fecha.day}/${fecha.month}/${fecha.year}';
      } catch (e) {
        fechaRegistro = persona['fecha_registro'].toString();
      }
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.08),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          // Avatar
          CircleAvatar(
            radius: 25,
            backgroundColor: nivelColor.withOpacity(0.2),
            backgroundImage: persona['url_foto_perfil'] != null
                ? NetworkImage(persona['url_foto_perfil'])
                : null,
            child: persona['url_foto_perfil'] == null
                ? Text(
                    _getInitials(
                        persona['nombre'] ?? '', persona['apellido'] ?? ''),
                    style: TextStyle(
                      color: nivelColor,
                      fontWeight: FontWeight.bold,
                    ),
                  )
                : null,
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      '${persona['nombre'] ?? ''} ${persona['apellido'] ?? ''}',
                      style: AppStyles.heading3,
                    ),
                    const SizedBox(width: 8),
                    if (activo)
                      Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          color: Colors.green,
                          shape: BoxShape.circle,
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: nivelColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        nombreMembresia,
                        style: TextStyle(
                          color: nivelColor,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Nivel ${persona['nivel'] ?? 1}',
                      style: AppStyles.caption,
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  'Desde $fechaRegistro',
                  style: AppStyles.caption,
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '${persona['puntos_bv'] ?? 0}',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textDark,
                ),
              ),
              Text(
                'BV',
                style: AppStyles.caption,
              ),
              const SizedBox(height: 4),
              Text(
                'Red: ${persona['total_red'] ?? 0}',
                style: TextStyle(
                  fontSize: 12,
                  color: AppColors.textMedium,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLineaDirectaCard(Map<String, dynamic> linea) {
    String nombreMembresia = linea['nombre_membresia'] ?? 'Cliente';
    Color nivelColor = _getNivelColor(nombreMembresia);
    bool activo = linea['activo'] == 1;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: activo
              ? Colors.green.withOpacity(0.3)
              : Colors.grey.withOpacity(0.2),
          width: 2,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.08),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 25,
                backgroundColor: nivelColor.withOpacity(0.2),
                backgroundImage: linea['url_foto_perfil'] != null
                    ? NetworkImage(linea['url_foto_perfil'])
                    : null,
                child: linea['url_foto_perfil'] == null
                    ? Text(
                        _getInitials(
                            linea['nombre'] ?? '', linea['apellido'] ?? ''),
                        style: TextStyle(
                          color: nivelColor,
                          fontWeight: FontWeight.bold,
                        ),
                      )
                    : null,
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${linea['nombre'] ?? ''} ${linea['apellido'] ?? ''}',
                      style: AppStyles.heading3,
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: nivelColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            nombreMembresia,
                            style: TextStyle(
                              color: nivelColor,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          '@${linea['nombre_usuario'] ?? ''}',
                          style: AppStyles.caption,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              Icon(
                activo ? Icons.check_circle : Icons.cancel,
                color: activo ? Colors.green : Colors.grey,
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildLineaInfo(
                  'Puntos BV', '${linea['puntos_bv'] ?? 0}', Icons.stars),
              _buildLineaInfo('Red', '${linea['total_red'] ?? 0}', Icons.group),
              _buildLineaInfo(
                  'Estado', activo ? 'Activo' : 'Inactivo', Icons.info),
              if (linea['numero_telefono'] != null)
                _buildLineaInfo(
                    'Teléfono', linea['numero_telefono'], Icons.phone),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLineaInfo(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon, size: 20, color: AppColors.textMedium),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 14,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            color: AppColors.textMedium,
            fontSize: 11,
          ),
        ),
      ],
    );
  }

  String _getInitials(String nombre, String apellido) {
    String initials = '';
    if (nombre.isNotEmpty) initials += nombre[0];
    if (apellido.isNotEmpty) initials += apellido[0];
    if (initials.isEmpty) initials = 'U';
    return initials.toUpperCase();
  }

  Color _getNivelColor(String nivel) {
    switch (nivel) {
      case 'Master':
        return Colors.purple;
      case 'Senior':
        return Colors.orange;
      case 'Junior':
        return Colors.blue;
      case 'Pre-Junior':
        return Colors.green;
      case 'Cliente':
      default:
        return Colors.grey;
    }
  }
}
