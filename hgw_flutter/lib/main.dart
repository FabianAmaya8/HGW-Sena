import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import './providers/productos_provider.dart';
import './providers/carrito/carrito_provider.dart';
import './providers/personal/personal_provider.dart';
import './Registro.dart';
import './Login.dart';
import './modules/educacion/education_page.dart';
import './screens/catalogo_screen.dart';
import './screens/carrito/carrito_screen.dart';
import './screens/personal/personal_screen.dart';

class AuthProvider extends ChangeNotifier {
  bool _isLoggedIn = false;
  bool get isLoggedIn => _isLoggedIn;
  void login() {
    _isLoggedIn = true;
    notifyListeners();
  }
  void logout() {
    _isLoggedIn = false;
    notifyListeners();
  }
}

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ProductosProvider()),
        ChangeNotifierProvider(create: (_) => CarritoProvider()),
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => PersonalProvider()),
      ],
      child: const App(),
    ),
  );
}

class App extends StatelessWidget {
  const App({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: const AuthGate(),
    );
  }
}

class AuthGate extends StatelessWidget {
  const AuthGate({super.key});
  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, auth, child) {
        if (!auth.isLoggedIn) return const Login();
        return const Menu(
          headers: [
            {"value": "Inicio"},
            {"value": "Registro"},
            {"value": "Login"},
          ],
        );
      },
    );
  }
}

class Menu extends StatefulWidget {
  final List<Map<String, String>> headers;
  const Menu({super.key, required this.headers});
  @override
  State<Menu> createState() => _ManejadorMenu();
}

class _ManejadorMenu extends State<Menu> {
  int currentPage = 0;
  final Color primaryGreen = Colors.green.shade600;

  void navigateTo(int index) {
    setState(() {
      currentPage = index;
    });
  }

  List<Widget> _pages() {
    return [
      const HomePage(),
      const Registro(),
      const Login(),
      const EducationPage(),
      const CatalogoScreen(),
      CarritoScreen(onNavigateToCatalog: () => navigateTo(4)),
      const PersonalScreen(),
    ];
  }

  List<Widget> _quickNav(bool visible) {
    if (!visible) return [];
    return [
      _elegantButton("Registro", 1, icon: Icons.person_add),
      _elegantButton("Login", 2, icon: Icons.login),
    ];
  }

  Widget _elegantButton(String label, int index, {IconData? icon}) {
    bool isActive = currentPage == index;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 6),
      child: GestureDetector(
        onTap: () => navigateTo(index),
        child: Container(
          decoration: BoxDecoration(
            color: isActive ? Colors.white.withOpacity(0.2) : Colors.transparent,
            borderRadius: BorderRadius.circular(8),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (icon != null) Icon(icon, size: 18, color: Colors.white),
              if (icon != null) const SizedBox(width: 6),
              Text(
                label,
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                  letterSpacing: 0.5,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _cartIconWithBadge() {
    return Consumer<CarritoProvider>(
      builder: (context, carritoProvider, child) {
        int itemCount = carritoProvider.cantidadTotal;
        return Stack(
          clipBehavior: Clip.none,
          children: [
            IconButton(
              icon: const Icon(Icons.shopping_cart, color: Colors.white),
              onPressed: () => navigateTo(5),
            ),
            if (itemCount > 0)
              Positioned(
                right: 2,
                top: 2,
                child: Container(
                  padding: const EdgeInsets.all(2),
                  decoration: BoxDecoration(
                    color: Colors.red,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.white, width: 1.5),
                  ),
                  constraints: const BoxConstraints(minWidth: 20, minHeight: 20),
                  child: Center(
                    child: Text(
                      itemCount > 99 ? '99+' : itemCount.toString(),
                      style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
              ),
          ],
        );
      },
    );
  }

  Widget elegantLogo() {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Text(
          "HGW",
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 24, color: Colors.white, letterSpacing: 2),
        ),
        const SizedBox(width: 8),
        Container(
          width: 28,
          height: 28,
          decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: Colors.white, width: 2)),
          child: const Icon(Icons.storefront, color: Colors.white, size: 20),
        ),
      ],
    );
  }

  Widget _personalIcon() {
    return IconButton(
      icon: Icon(
        Icons.person,
        color: currentPage == 6 ? primaryGreen : Colors.white,
      ),
      onPressed: () => navigateTo(6),
    );
  }

  Widget _drawerIcon() {
    return SizedBox(
      width: 28,
      height: 28,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: List.generate(3, (row) {
          return Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: List.generate(
              3,
              (_) => Container(width: 5, height: 5, decoration: BoxDecoration(color: Colors.white, shape: BoxShape.circle)),
            ),
          );
        }),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final bool showQuickNav = size.width >= 700;

    return Scaffold(
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(70),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 12),
          decoration: BoxDecoration(
            gradient: LinearGradient(colors: [primaryGreen, Colors.green.shade400]),
            boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.2), blurRadius: 4, offset: const Offset(0, 2))],
          ),
          child: SafeArea(
            child: Row(
              children: [
                Builder(
                  builder: (context) => IconButton(icon: _drawerIcon(), onPressed: () => Scaffold.of(context).openDrawer()),
                ),
                const SizedBox(width: 12),
                elegantLogo(),
                const Spacer(),
                ..._quickNav(showQuickNav),
                _personalIcon(),
                _cartIconWithBadge(),
                const SizedBox(width: 8),
              ],
            ),
          ),
        ),
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            UserAccountsDrawerHeader(
              decoration: BoxDecoration(
                gradient: LinearGradient(colors: [primaryGreen, Colors.green.shade400], begin: Alignment.topLeft, end: Alignment.bottomRight),
              ),
              accountName: Consumer<PersonalProvider>(
                builder: (context, personalProvider, child) {
                  final usuario = personalProvider.usuario;
                  return Text(
                    usuario != null ? "${usuario.nombre} ${usuario.apellido}" : "HGW Tienda",
                    style: const TextStyle(fontSize: 18),
                  );
                },
              ),
              accountEmail: Consumer<PersonalProvider>(
                builder: (context, personalProvider, child) {
                  final usuario = personalProvider.usuario;
                  return Text(usuario?.correoElectronico ?? "contact@hgw.com");
                },
              ),
              currentAccountPicture: Consumer<PersonalProvider>(
                builder: (context, personalProvider, child) {
                  final usuario = personalProvider.usuario;
                  if (usuario?.urlFotoPerfil != null) {
                    return CircleAvatar(
                      backgroundImage: NetworkImage(usuario!.urlFotoPerfil!),
                      backgroundColor: Colors.white,
                      child: null,
                    );
                  }
                  String inicial = usuario != null ? (usuario.nombre.isNotEmpty ? usuario.nombre[0] : 'H') : 'H';
                  return CircleAvatar(
                    backgroundColor: Colors.white,
                    child: Text(
                      inicial.toUpperCase(),
                      style: TextStyle(
                        color: primaryGreen,
                        fontWeight: FontWeight.bold,
                        fontSize: 24,
                      ),
                    ),
                  );
                },
              ),
            ),
            ListTile(
              leading: Icon(Icons.home, color: primaryGreen),
              title: const Text("Inicio"),
              onTap: () {
                navigateTo(0);
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: Icon(Icons.app_registration, color: primaryGreen),
              title: const Text("Registro"),
              onTap: () {
                navigateTo(1);
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: Icon(Icons.login, color: primaryGreen),
              title: const Text("Login"),
              onTap: () {
                navigateTo(2);
                Navigator.pop(context);
              },
            ),
            const Divider(),
            ListTile(
              leading: Icon(Icons.school, color: primaryGreen),
              title: const Text("Educación"),
              onTap: () {
                navigateTo(3);
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: Icon(Icons.store, color: primaryGreen),
              title: const Text("Catálogo"),
              onTap: () {
                navigateTo(4);
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: Stack(
                clipBehavior: Clip.none,
                children: [
                  Icon(Icons.shopping_cart, color: primaryGreen),
                  Consumer<CarritoProvider>(builder: (context, carritoProvider, child) {
                    int itemCount = carritoProvider.cantidadTotal;
                    if (itemCount == 0) return const SizedBox();
                    return Positioned(
                      right: -8,
                      top: -8,
                      child: Container(
                        padding: const EdgeInsets.all(2),
                        decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle),
                        constraints: const BoxConstraints(minWidth: 16, minHeight: 16),
                        child: Text(itemCount > 99 ? '99+' : itemCount.toString(), style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold)),
                      ),
                    );
                  }),
                ],
              ),
              title: Consumer<CarritoProvider>(builder: (context, carritoProvider, child) {
                int itemCount = carritoProvider.cantidadTotal;
                return Text(itemCount > 0 ? "Carrito ($itemCount)" : "Carrito");
              }),
              subtitle: Consumer<CarritoProvider>(builder: (context, carritoProvider, child) {
                double total = carritoProvider.total;
                if (total == 0) return const SizedBox();
                return Text("Total: \$${total.toStringAsFixed(2)}", style: TextStyle(color: primaryGreen, fontWeight: FontWeight.bold));
              }),
              onTap: () {
                navigateTo(5);
                Navigator.pop(context);
              },
            ),
            const Divider(),
            ListTile(
              leading: Icon(Icons.person, color: primaryGreen),
              title: const Text("Mi Perfil"),
              subtitle: Consumer<PersonalProvider>(
                builder: (context, personalProvider, child) {
                  return Text(personalProvider.nivelMembresia);
                },
              ),
              onTap: () {
                navigateTo(6);
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: Icon(Icons.group, color: primaryGreen),
              title: const Text("Mi Red"),
              trailing: Consumer<PersonalProvider>(
                builder: (context, personalProvider, child) {
                  return Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: primaryGreen.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      '${personalProvider.personasEnRed}',
                      style: TextStyle(
                        color: primaryGreen,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  );
                },
              ),
              onTap: () {
                navigateTo(6);
                Navigator.pop(context);
              },
            ),
            const Spacer(),
            Consumer<PersonalProvider>(
              builder: (context, personalProvider, child) {
                return Container(
                  padding: const EdgeInsets.all(16),
                  margin: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        primaryGreen.withOpacity(0.1),
                        Colors.green.shade400.withOpacity(0.1),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Membresía',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: primaryGreen,
                            ),
                          ),
                          Text(
                            personalProvider.nivelMembresia,
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: primaryGreen,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      LinearProgressIndicator(
                        value: personalProvider.progresoMembresia,
                        backgroundColor: Colors.grey[300],
                        valueColor: AlwaysStoppedAnimation<Color>(primaryGreen),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${personalProvider.puntosActuales} BV',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 300),
        child: SizedBox.expand(
          key: ValueKey<int>(currentPage),
          child: Center(child: _pages()[currentPage]),
        ),
      ),
      floatingActionButton: currentPage != 5
          ? Consumer<CarritoProvider>(
              builder: (context, carritoProvider, child) {
                if (carritoProvider.items.isEmpty) return const SizedBox();
                return FloatingActionButton.extended(
                  onPressed: () => navigateTo(5),
                  backgroundColor: primaryGreen,
                  icon: const Icon(Icons.shopping_cart),
                  label: Text("${carritoProvider.cantidadTotal} items", style: const TextStyle(fontWeight: FontWeight.bold)),
                );
              },
            )
          : null,
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});
  @override
  Widget build(BuildContext context) {
    final Color primaryGreen = Colors.green.shade600;
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.storefront, size: 90, color: primaryGreen),
            const SizedBox(height: 20),
            Text("Bienvenido a Tienda HGW", style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.grey[800])),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: () {
                final menu = context.findAncestorStateOfType<_ManejadorMenu>();
                menu?.navigateTo(4);
              },
              icon: const Icon(Icons.store, color: Colors.white),
              label: const Text("Ver Catálogo", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              style: ElevatedButton.styleFrom(
                backgroundColor: primaryGreen,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              "Productos destacados.",
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
                height: 1.4,
              ),
            ),
            const SizedBox(height: 32),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ElevatedButton.icon(
                  onPressed: () {
                    final menu = context.findAncestorStateOfType<_ManejadorMenu>();
                    menu?.navigateTo(4);
                  },
                  icon: const Icon(Icons.store),
                  label: const Text("Ver Catálogo"),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green.shade600,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  ),
                ),
                const SizedBox(width: 16),
                Consumer<CarritoProvider>(
                  builder: (context, carritoProvider, child) {
                    if (carritoProvider.items.isEmpty) return const SizedBox();
                    return ElevatedButton.icon(
                      onPressed: () {
                        final menu = context.findAncestorStateOfType<_ManejadorMenu>();
                        menu?.navigateTo(5);
                      },
                      icon: const Icon(Icons.shopping_cart),
                      label: Text("Carrito (${carritoProvider.cantidadTotal})"),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.orange.shade600,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                      ),
                    );
                  },
                ),
              ],
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: () {
                final menu = context.findAncestorStateOfType<_ManejadorMenu>();
                menu?.navigateTo(6);
              },
              icon: const Icon(Icons.person),
              label: const Text("Mi Perfil"),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue.shade600,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
