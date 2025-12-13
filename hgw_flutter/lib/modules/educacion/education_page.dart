import 'package:flutter/material.dart';
import 'package:youtube_player_iframe/youtube_player_iframe.dart';
import 'info_education.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../../config/api_config.dart';

class EducationPage extends StatefulWidget {
  const EducationPage({Key? key}) : super(key: key);

  @override
  _EducationPageState createState() => _EducationPageState();
}

class _EducationPageState extends State<EducationPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[200],
      body: const SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: InterfaceEducation(),
      ),
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
        children: [
          FittedBox(
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
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
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

class InterfaceEducation extends StatefulWidget {
  const InterfaceEducation({super.key});

  @override
  State<InterfaceEducation> createState() => _ManejadorInterface();
}

class _ManejadorInterface extends State<InterfaceEducation> {
  static const Color cardButtonColor = Color(0xFF2E8B57);
  static const double cardHeight = 90;
  static const double hSpacing = 16;
  static const double vSpacing = 24;

  late YoutubePlayerController _ytController;
  List<dynamic> _temas = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();

    _ytController = YoutubePlayerController(
      params: const YoutubePlayerParams(
        mute: false,
        showControls: true,
        showFullscreenButton: true,
        playsInline: true,
      ),
    );

    // ✔ carga correcta del video en v5.2.2
    _ytController.loadVideoById(videoId: 'r4UwcgL6FLA');

    fetchTemas();
  }

  Future<void> fetchTemas() async {
    try {
      final response =
          await http.get(Uri.parse("${ApiConfig.baseUrl}/api/educacion"));

      if (response.statusCode == 200) {
        setState(() {
          _temas = json.decode(response.body);
          _loading = false;
        });
      } else {
        setState(() {
          _temas = [];
          _loading = false;
        });
      }
    } catch (e) {
      setState(() {
        _temas = [];
        _loading = false;
      });
    }
  }

  @override
  void dispose() {
    _ytController.close();
    super.dispose();
  }

  String capitalizarCadaPalabra(String texto) {
    return texto.split(" ").map((palabra) {
      if (palabra.isEmpty) return palabra;
      return palabra[0].toUpperCase() + palabra.substring(1).toLowerCase();
    }).join(" ");
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          width: MediaQuery.of(context).size.width,
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            boxShadow: const [
              BoxShadow(color: Colors.black12, blurRadius: 8, offset: Offset(0, 4)),
            ],
          ),
          child: Column(
            children: [
              const Text(
                'Sistema Multinivel y Plataforma de Aprendizaje',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF6B8E23),
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              const Text(
                'Educación Multinivel y Productos Naturistas',
                style: TextStyle(fontSize: 16, color: Colors.black54),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: vSpacing),

              /// VIDEO
              Center(
                child: SizedBox(
                  width: MediaQuery.of(context).size.width * 0.7,
                  height: MediaQuery.of(context).size.width * 0.7 * (9 / 16),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: YoutubePlayer(
                      controller: _ytController,
                      aspectRatio: 16 / 9,
                    ),
                  ),
                ),
              ),

              const SizedBox(height: vSpacing / 2),
              const Text(
                'Bienvenido al apartado de educación, aquí podrá encontrar todas las guías para el manejo de la página.',
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: vSpacing),

              _loading
                  ? const Center(child: CircularProgressIndicator())
                  : _temas.isEmpty
                      ? const Text("No se encontraron temas.")
                      : Wrap(
                          spacing: hSpacing,
                          runSpacing: vSpacing / 2,
                          children: _temas.map((tema) {
                            final titulo = tema["nombre_tema"] ?? "Sin título";
                            final id = tema['id_tema'];

                            return SizedBox(
                              width:
                                  (MediaQuery.of(context).size.width - 2 * 5 - hSpacing) / 3,
                              height: cardHeight,
                              child: _InfoCard(
                                title: capitalizarCadaPalabra(titulo),
                                color: cardButtonColor,
                                onPressed: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) => InfoListPage(
                                        idTema: id,
                                        titulo: titulo,
                                      ),
                                    ),
                                  );
                                },
                              ),
                            );
                          }).toList(),
                        ),
            ],
          ),
        ),
        const SizedBox(height: vSpacing),
      ],
    );
  }
}
