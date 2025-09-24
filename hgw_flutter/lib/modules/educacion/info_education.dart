import 'package:flutter/material.dart';
import 'package:youtube_player_flutter/youtube_player_flutter.dart';
import 'education_page.dart';

class InfoListPage extends StatelessWidget {
  final List<String> items;

  const InfoListPage({Key? key, required this.items}) : super(key: key);

  static const Color oliveColor = Color(0xFF6B8E23);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[200],
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            boxShadow: const [
              BoxShadow(color: Colors.black12, blurRadius: 8, offset: Offset(0, 4)),
            ],
          ),
          child: Column(
            children: [
              Text(
                'Lista de Información',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: oliveColor,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),

              // Tarjetas basadas en items
              if (items.isEmpty)
                const Text("No hay temas disponibles.")
              else
                Column(
                  children: [
                    for (var i = 0; i < items.length; i++) ...[
                      _SampleCard(text: items[i]),
                      if (i < items.length - 1) const SizedBox(height: 16),
                    ],
                  ],
                ),

              const SizedBox(height: 32),

              ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const EducationPage()),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: oliveColor,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                ),
                child: const Text(
                  'Volver a Educación',
                  style: TextStyle(fontSize: 14, color: Colors.white),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SampleCard extends StatelessWidget {
  final String text;

  const _SampleCard({Key? key, required this.text}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 80,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(12),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 6, offset: Offset(0, 3)),
        ],
      ),
      child: Text(
        text,
        style: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w600,
          color: Colors.black87,
        ),
        textAlign: TextAlign.center,
      ),
    );
  }
}
