import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:youtube_player_iframe/youtube_player_iframe.dart';
import '../../config/api_config.dart';

class InfoListPage extends StatefulWidget {
  final int idTema;
  final String titulo;

  const InfoListPage({
    Key? key,
    required this.idTema,
    required this.titulo,
  }) : super(key: key);

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

  /// Extrae el ID de un video de YouTube
  String? extractYouTubeId(String url) {
    final regExp = RegExp(
      r"(?:youtube\.com/watch\?v=|youtu\.be/)([a-zA-Z0-9_-]{11})",
    );
    final match = regExp.firstMatch(url);
    return match != null ? match.group(1) : null;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade100,
      appBar: AppBar(
        title: Text(
          widget.titulo,
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700),
        ),
        backgroundColor: Colors.green.shade600,
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _contenidos.isEmpty
              ? const Center(child: Text("No hay contenidos disponibles."))
              : ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: _contenidos.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 20),
                  itemBuilder: (context, index) {
                    final contenido = _contenidos[index];
                    final url = contenido["url_contenido"] ?? "";
                    final videoId = extractYouTubeId(url);

                    return ContentCard(
                      title: contenido["titulo"] ?? "Sin título",
                      url: url,
                      videoId: videoId,
                    );
                  },
                ),
    );
  }
}

class ContentCard extends StatefulWidget {
  final String title;
  final String url;
  final String? videoId;

  const ContentCard({
    Key? key,
    required this.title,
    required this.url,
    required this.videoId,
  }) : super(key: key);

  @override
  State<ContentCard> createState() => _ContentCardState();
}

class _ContentCardState extends State<ContentCard> {
  YoutubePlayerController? _controller;

  @override
  void initState() {
    super.initState();

    if (widget.videoId != null) {
      _controller = YoutubePlayerController(
        params: const YoutubePlayerParams(
          showControls: true,
          mute: false,
          playsInline: true,
          showFullscreenButton: true,
        ),
      )..loadVideoById(videoId: widget.videoId!);
    }
  }

  @override
  void dispose() {
    _controller?.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final bool isVideo = widget.videoId != null;

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: const [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 8,
            offset: Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            widget.title,
            style: const TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: Colors.black87,
            ),
          ),
          const SizedBox(height: 10),

          /// Si es video -> mostrar reproductor YouTube
          if (isVideo && _controller != null)
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: YoutubePlayer(
                controller: _controller!,
                aspectRatio: 16 / 9,
              ),
            ),

          /// Si NO es video -> es un link/PDF
          if (!isVideo)
            InkWell(
              onTap: () {
                launchUrl(widget.url);
              },
              child: Row(
                children: const [
                  Icon(Icons.picture_as_pdf, color: Colors.red, size: 30),
                  SizedBox(width: 8),
                  Text(
                    "Abrir documento",
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.blueAccent,
                      decoration: TextDecoration.underline,
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  /// Abre enlaces externos
  void launchUrl(String url) {
    // no importé url_launcher para no afectar tu proyecto,
    // pero si quieres abrir PDFs o links, te lo agrego.
  }
}
