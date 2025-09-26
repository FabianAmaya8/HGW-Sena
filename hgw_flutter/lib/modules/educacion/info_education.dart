import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../../config/api_config.dart';
import 'education_page.dart';

class InfoListPage extends StatefulWidget {
  final int idTema;
  final String titulo;

  const InfoListPage({Key? key, required this.idTema, required this.titulo}) : super(key: key);

  @override
  State<InfoListPage> createState() => _InfoListPageState();
}

class _InfoListPageState extends State<InfoListPage> {
  List<dynamic> _contenidos = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    fetchContenidos();
  }

  Future<void> fetchContenidos() async {
    try {
      final response = await http.get(
        Uri.parse("${ApiConfig.baseUrl}/api/contenido_tema?id_tema=${widget.idTema}"),
      );

      if (response.statusCode == 200) {
        setState(() {
          _contenidos = json.decode(response.body);
          _loading = false;
        });
      } else {
        setState(() {
          _contenidos = [];
          _loading = false;
        });
      }
    } catch (e) {
      setState(() {
        _contenidos = [];
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[200],
      appBar: AppBar(
        title: Text(widget.titulo),
        backgroundColor: Colors.green.shade700,
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _contenidos.isEmpty
              ? const Center(child: Text("No hay contenidos para este tema."))
              : ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: _contenidos.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 16),
                  itemBuilder: (context, index) {
                    final item = _contenidos[index];
                    return _SampleCard(
                      text: item["titulo"] ?? "Sin título",
                      description: item["url_contenido"] ?? "",
                    );
                  },
                ),
    );
  }
}

class _SampleCard extends StatelessWidget {
  final String text;
  final String description;

  const _SampleCard({Key? key, required this.text, required this.description}) : super(key: key);

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
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            text,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: Colors.black87,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            description,
            style: const TextStyle(
              fontSize: 12,
              color: Colors.black54,
            ),
          ),
        ],
      ),
    );
  }
}
