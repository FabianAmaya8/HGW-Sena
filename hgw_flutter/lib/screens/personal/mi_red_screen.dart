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

  final List<Map<String, dynamic>> _miRed = [
    {
      'nombre': 'Juanito',
      'nivel': 'Senior',
      'ventas': 2500000,
      'fecha': '22/01/2025',
      'activo': true
    },
    {
      'nombre': 'hernesto el elefante',
      'nivel': 'Junior',
      'ventas': 1200000,
      'fecha': '22/01/2025',
      'activo': true
    },
    {
      'nombre': 'Carlitos',
      'nivel': 'Pre-Junior',
      'ventas': 450000,
      'fecha': '10/02/2025',
      'activo': false
    },
    {
      'nombre': 'pepe',
      'nivel': 'Master',
      'ventas': 5200000,
      'fecha': '05/01/2025',
      'activo': true
    },
    {
      'nombre': 'ye',
      'nivel': 'Junior',
      'ventas': 980000,
      'fecha': '18/02/2025',
      'activo': true
    },
  ];

  final List<Map<String, dynamic>> _lineasDirectas = [
    {
      'nombre': 'onichansita',
      'nivel': 'Junior',
      'ventas': 1500000,
      'puntos': 150,
      'activo': true
    },
    {
      'nombre': '',
      'nivel': 'paconi',
      'ventas': 600000,
      'puntos': 60,
      'activo': true
    },
    {
      'nombre': 'criptocaca',
      'nivel': 'Senior',
      'ventas': 3200000,
      'puntos': 320,
      'activo': true
    },
    {
      'nombre': 'julio iglesias',
      'nivel': 'Cliente',
      'ventas': 200000,
      'puntos': 20,
      'activo': false
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(
      length: 2,
      vsync: this,
      initialIndex: widget.mostrarSoloLineasDirectas ? 1 : 0,
    );
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
      body: widget.mostrarSoloLineasDirectas
          ? _buildLineasDirectasContent()
          : TabBarView(
              controller: _tabController,
              children: [
                _buildMiRedContent(),
                _buildLineasDirectasContent(),
              ],
            ),
    );
  }

  Widget _buildMiRedContent() {
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
                  'Total en Red', _miRed.length.toString(), Icons.group),
              _buildStatItem(
                  'Activos',
                  _miRed.where((m) => m['activo']).length.toString(),
                  Icons.check_circle),
              _buildStatItem(
                  'Ventas Totales',
                  '\$${(_miRed.fold<double>(0, (sum, m) => sum + m['ventas']) / 1000000).toStringAsFixed(1)}M',
                  Icons.attach_money),
            ],
          ),
        ),

        // Lista de personas
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            itemCount: _miRed.length,
            itemBuilder: (context, index) {
              final persona = _miRed[index];
              return _buildPersonaCard(persona);
            },
          ),
        ),
      ],
    );
  }

  Widget _buildLineasDirectasContent() {
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
                      '${_lineasDirectas.length} personas',
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
                      'Puntos Totales',
                      _lineasDirectas
                          .fold<int>(0, (sum, l) => sum + (l['puntos'] as int))
                          .toString(),
                      Colors.blue),
                  _buildLineaStatItem(
                      'Ventas Mes',
                      '\$${(_lineasDirectas.fold<double>(0, (sum, l) => sum + l['ventas']) / 1000000).toStringAsFixed(1)}M',
                      Colors.green),
                ],
              ),
            ],
          ),
        ),

        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            itemCount: _lineasDirectas.length,
            itemBuilder: (context, index) {
              final linea = _lineasDirectas[index];
              return _buildLineaDirectaCard(linea);
            },
          ),
        ),
      ],
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
    Color nivelColor = _getNivelColor(persona['nivel']);

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
          CircleAvatar(
            radius: 25,
            backgroundColor: nivelColor.withOpacity(0.2),
            child: Text(
              persona['nombre'].split(' ').map((n) => n[0]).take(2).join(),
              style: TextStyle(
                color: nivelColor,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      persona['nombre'],
                      style: AppStyles.heading3,
                    ),
                    const SizedBox(width: 8),
                    if (persona['activo'])
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
                        persona['nivel'],
                        style: TextStyle(
                          color: nivelColor,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Desde ${persona['fecha']}',
                      style: AppStyles.caption,
                    ),
                  ],
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '\$${(persona['ventas'] / 1000000).toStringAsFixed(1)}M',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textDark,
                ),
              ),
              Text(
                'Ventas',
                style: AppStyles.caption,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLineaDirectaCard(Map<String, dynamic> linea) {
    Color nivelColor = _getNivelColor(linea['nivel']);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: linea['activo']
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
                child: Text(
                  linea['nombre'].split(' ').map((n) => n[0]).take(2).join(),
                  style: TextStyle(
                    color: nivelColor,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      linea['nombre'],
                      style: AppStyles.heading3,
                    ),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: nivelColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        linea['nivel'],
                        style: TextStyle(
                          color: nivelColor,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              Icon(
                linea['activo'] ? Icons.check_circle : Icons.cancel,
                color: linea['activo'] ? Colors.green : Colors.grey,
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildLineaInfo('Puntos BV', '${linea['puntos']}', Icons.stars),
              _buildLineaInfo(
                  'Ventas',
                  '\$${(linea['ventas'] / 1000000).toStringAsFixed(1)}M',
                  Icons.attach_money),
              _buildLineaInfo('Estado', linea['activo'] ? 'Activo' : 'Inactivo',
                  Icons.info),
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
      default:
        return Colors.grey;
    }
  }
}
