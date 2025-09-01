import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'providers/productos_provider.dart';
import 'screens/catalogo_screen.dart';
import 'utils/constants.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  // Configurar orientación
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ProductosProvider()),
      ],
      child: MaterialApp(
        title: 'HGW Catálogo Premium',
        theme: AppTheme.theme,
        debugShowCheckedModeBanner: false,
        home: const CatalogoScreen(),
      ),
    );
  }
}
