import 'package:flutter/material.dart';
import 'package:youtube_player_flutter/youtube_player_flutter.dart';
import 'info_education.dart';

class EducationPage extends StatefulWidget {
  const EducationPage({Key? key}) : super(key: key);

  @override
  _EducationPageState createState() => _EducationPageState();
}

class _EducationPageState extends State<EducationPage> {
  final YoutubePlayerController _ytController = YoutubePlayerController(
    initialVideoId: 'r4UwcgL6FLA',
    flags: const YoutubePlayerFlags(autoPlay: false),
  );

  static const Color oliveColor = Color(0xFF6B8E23);
  static const Color cardButtonColor = Color(0xFF2E8B57);
  static const double cardHeight = 90;    
  static const double hSpacing = 16;      
  static const double vSpacing = 24;      

  @override
  void dispose() {
    _ytController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      backgroundColor: Colors.grey[200],
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(bottom: Radius.circular(16)),
        ),
        leading: Padding(
          padding: const EdgeInsets.all(8),
          child: Image.asset('assets/logo.png'),
        ),
        actions: [
          _NavTextButton(label: 'Inicio', onTap: () {}, color: oliveColor),
          _NavTextButton(label: 'Educación', onTap: () {}, color: oliveColor),
          _NavTextButton(label: 'Catálogo', onTap: () {}, color: oliveColor),
          _NavTextButton(label: 'Iniciar sesión', onTap: () {}, color: oliveColor),
          const SizedBox(width: 16),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(56),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Buscar...',
                prefixIcon: const Icon(Icons.search),
                filled: true,
                fillColor: Colors.grey[100],
                contentPadding: const EdgeInsets.symmetric(horizontal: 16),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Container(
              width: screenWidth,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: const [
                  BoxShadow(color: Colors.black12, blurRadius: 8, offset: Offset(0, 4)),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    'Sistema Multinivel y Plataforma de Aprendizaje',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: oliveColor,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Educación Multinivel y Productos Naturistas',
                    style: TextStyle(fontSize: 16, color: Colors.black54),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: vSpacing),
                  Center(
                    child: SizedBox(
                      width: screenWidth * 0.7,
                      height: screenWidth * 0.7 * (9 / 16),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: YoutubePlayer(
                          controller: _ytController,
                          showVideoProgressIndicator: true,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: vSpacing / 2),
                  const Text(
                    'bienvenido al apartado de educacion, aqui podra encontrar todas las guias para el manejo de la página, recuerde, su crecimiento es nuestro crecimiento',
                    style: TextStyle(fontSize: 14, color: Colors.black87),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: vSpacing),
                  Row(
                    children: [
                      Expanded(
                        child: SizedBox(
                          height: cardHeight,
                          child: _InfoCard(
                            title: 'Capacitación Básica',
                            onPressed: (){
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => const InfoListPage())
                              );
                            },
                            color: cardButtonColor,
                          ),
                        ),
                      ),
                      const SizedBox(width: hSpacing),
                      Expanded(
                        child: SizedBox(
                          height: cardHeight,
                          child: _InfoCard(
                            title: 'Productos Naturistas',
                            onPressed: () {},
                            color: cardButtonColor,
                          ),
                        ),
                      ),
                      const SizedBox(width: hSpacing),
                      Expanded(
                        child: SizedBox(
                          height: cardHeight,
                          child: _InfoCard(
                            title: 'Explicación Membresías',
                            onPressed: () {},
                            color: cardButtonColor,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: vSpacing / 2),
                  Row(
                    children: [
                      Expanded(
                        child: SizedBox(
                          height: cardHeight,
                          child: _InfoCard(
                            title: 'Información Comercial',
                            onPressed: () {},
                            color: cardButtonColor,
                          ),
                        ),
                      ),
                      const SizedBox(width: hSpacing),
                      Expanded(
                        child: SizedBox(
                          height: cardHeight,
                          child: _InfoCard(
                            title: 'Sistema de Bonos',
                            onPressed: () {},
                            color: cardButtonColor,
                          ),
                        ),
                      ),
                      const SizedBox(width: hSpacing),
                      Expanded(
                        child: SizedBox(
                          height: cardHeight,
                          child: _InfoCard(
                            title: 'Conócenos Más',
                            onPressed: () {},
                            color: cardButtonColor,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: vSpacing),
            _Footer(),
          ],
        ),
      ),
    );
  }
}

class _NavTextButton extends StatelessWidget {
  final String label;
  final VoidCallback onTap;
  final Color color;

  const _NavTextButton({
    required this.label,
    required this.onTap,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: onTap,
      child: Text(label, style: TextStyle(fontSize: 14, color: color)),
    );
  }
}

class _InfoCard extends StatelessWidget {
  final String title;
  final VoidCallback onPressed;
  final Color color;

  const _InfoCard({
    required this.title,
    required this.onPressed,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(12),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 6, offset: Offset(0, 3)),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,     
        crossAxisAlignment: CrossAxisAlignment.center,   
        children: [
          FittedBox(
            fit: BoxFit.scaleDown,
            child: Text(
              title,
              style: const TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          const SizedBox(height: 8),
          ElevatedButton(
            onPressed: onPressed,
            style: ElevatedButton.styleFrom(
              backgroundColor: color,
              minimumSize: const Size(80, 28),
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: const Text(
              'saber más',
              style: TextStyle(fontSize: 10, color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }
}

class _Footer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF0F9D58), Color(0xFF4285F4)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: const [
          Text(
            'Green World Colombia SAS',
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          SizedBox(height: 4),
          Text('NIT: 901270584', style: TextStyle(fontSize: 12, color: Colors.white)),
          Text('Teléfono: 3142921508', style: TextStyle(fontSize: 12, color: Colors.white)),
          Text('Dirección: Calle 119 #14-42', style: TextStyle(fontSize: 12, color: Colors.white)),
          Text('Email: documentoscompensaciones@world-food.com',
              style: TextStyle(fontSize: 12, color: Colors.white)),
          SizedBox(height: 8),
          Text(
            '© 2023 Todos los Derechos reservados | HGW | Green World Colombia SAS',
            style: TextStyle(fontSize: 10, color: Colors.white54),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
