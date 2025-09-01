import 'package:flutter/material.dart';
import 'modules/educacion/education_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Mi App Educación',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        // Colores globales
        scaffoldBackgroundColor: Colors.white,
        primaryColor: Colors.white,
        colorScheme: ColorScheme.fromSwatch().copyWith(
          secondary: Colors.green,
        ),
      ),
      home: const EducationPage(),
    );
  }
}
