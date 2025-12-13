import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import './utils/constants.dart';
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
      theme: AppTheme.theme,
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
    return [];
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
                    color: AppColors.errorColor,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.white, width: 1.5),
                  ),
                  constraints:
                      const BoxConstraints(minWidth: 20, minHeight: 20),
                  child: Center(
                    child: Text(
                      itemCount > 99 ? '99+' : itemCount.toString(),
                      style: const TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.bold),
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
          style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 24,
              color: Colors.white,
              letterSpacing: 2),
        ),
        const SizedBox(width: 8),
        Container(
          width: 28,
          height: 28,
          decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 2)),
          child: const Icon(Icons.storefront, color: Colors.white, size: 20),
        ),
      ],
    );
  }

  Widget _personalIcon() {
    return IconButton(
      icon: Icon(
        Icons.person,
        color: currentPage == 6 ? AppColors.elegantGreenLight : Colors.white,
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
              (_) => Container(
                  width: 5,
                  height: 5,
                  decoration: const BoxDecoration(
                      color: Colors.white, shape: BoxShape.circle)),
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
            color: AppColors.elegantGreenDark,
            boxShadow: [
              BoxShadow(
                  color: AppColors.elegantGreenDark.withOpacity(0.3),
                  blurRadius: 8,
                  offset: const Offset(0, 4))
            ],
          ),
          child: SafeArea(
            child: Row(
              children: [
                Builder(
                  builder: (context) => IconButton(
                      icon: _drawerIcon(),
                      onPressed: () => Scaffold.of(context).openDrawer()),
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
              decoration: const BoxDecoration(
                color: AppColors.elegantGreenDark,
              ),
              accountName: Consumer<PersonalProvider>(
                builder: (context, personalProvider, child) {
                  final usuario = personalProvider.usuario;
                  return Text(
                    usuario != null
                        ? "${usuario.nombre} ${usuario.apellido}"
                        : "Usuario",
                    style: const TextStyle(
                        fontSize: 18, fontWeight: FontWeight.bold),
                  );
                },
              ),
              accountEmail: Consumer<PersonalProvider>(
                builder: (context, personalProvider, child) {
                  final usuario = personalProvider.usuario;
                  return Text(
                    usuario?.correoElectronico ?? "cargando...",
                    style: TextStyle(color: Colors.white.withOpacity(0.9)),
                  );
                },
              ),
              currentAccountPicture: Consumer<PersonalProvider>(
                builder: (context, personalProvider, child) {
                  final usuario = personalProvider.usuario;
                  if (usuario?.urlFotoPerfil != null) {
                    return CircleAvatar(
                      backgroundImage: NetworkImage(usuario!.urlFotoPerfil!),
                      backgroundColor: Colors.white,
                    );
                  }
                  String inicial = usuario != null
                      ? (usuario.nombre.isNotEmpty ? usuario.nombre[0] : 'H')
                      : 'H';
                  return CircleAvatar(
                    backgroundColor: Colors.white,
                    child: Text(
                      inicial.toUpperCase(),
                      style: const TextStyle(
                        color: AppColors.elegantGreenDark,
                        fontWeight: FontWeight.bold,
                        fontSize: 24,
                      ),
                    ),
                  );
                },
              ),
            ),
            ListTile(
              leading: const Icon(Icons.home_outlined,
                  color: AppColors.elegantGreenDark),
              title: const Text("Inicio", style: AppStyles.body),
              onTap: () {
                navigateTo(0);
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: const Icon(Icons.logout, color: AppColors.errorColor),
              title: const Text("Cerrar Sesión", style: AppStyles.body),
              onTap: () {
                Provider.of<AuthProvider>(context, listen: false).logout();
                Navigator.pop(context);
              },
            ),
            const Divider(indent: 20, endIndent: 20),
            ListTile(
              leading: const Icon(Icons.school_outlined,
                  color: AppColors.elegantGreenDark),
              title: const Text("Educación", style: AppStyles.body),
              onTap: () {
                navigateTo(3);
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: const Icon(Icons.storefront_outlined,
                  color: AppColors.elegantGreenDark),
              title: const Text("Catálogo", style: AppStyles.body),
              onTap: () {
                navigateTo(4);
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: Stack(
                clipBehavior: Clip.none,
                children: [
                  const Icon(Icons.shopping_cart_outlined,
                      color: AppColors.elegantGreenDark),
                  Consumer<CarritoProvider>(
                    builder: (context, carritoProvider, child) {
                      int itemCount = carritoProvider.cantidadTotal;
                      if (itemCount == 0) return const SizedBox();
                      return Positioned(
                        right: -5,
                        top: -5,
                        child: Container(
                          padding: const EdgeInsets.all(3),
                          decoration: const BoxDecoration(
                              color: AppColors.errorColor,
                              shape: BoxShape.circle),
                          child: Text(
                            itemCount > 99 ? '99+' : itemCount.toString(),
                            style: const TextStyle(
                                color: Colors.white,
                                fontSize: 8,
                                fontWeight: FontWeight.bold),
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
              title: Consumer<CarritoProvider>(
                  builder: (context, carritoProvider, child) {
                int itemCount = carritoProvider.cantidadTotal;
                return Text("Carrito ${itemCount > 0 ? '($itemCount)' : ''}",
                    style: AppStyles.body);
              }),
              subtitle: Consumer<CarritoProvider>(
                  builder: (context, carritoProvider, child) {
                double total = carritoProvider.total;
                if (total == 0) return const SizedBox();
                return Text("\$${total.toStringAsFixed(2)}",
                    style: const TextStyle(
                        color: AppColors.elegantGreenDark,
                        fontWeight: FontWeight.bold));
              }),
              onTap: () {
                navigateTo(5);
                Navigator.pop(context);
              },
            ),
            const Divider(indent: 20, endIndent: 20),
            ListTile(
              leading: const Icon(Icons.person_outline,
                  color: AppColors.elegantGreenDark),
              title: const Text("Mi Perfil", style: AppStyles.body),
              subtitle: Consumer<PersonalProvider>(
                builder: (context, personalProvider, child) {
                  return Text(personalProvider.nivelMembresia,
                      style: AppStyles.caption);
                },
              ),
              onTap: () {
                navigateTo(6);
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: const Icon(Icons.group_outlined,
                  color: AppColors.elegantGreenDark),
              title: const Text("Mi Red", style: AppStyles.body),
              trailing: Consumer<PersonalProvider>(
                builder: (context, personalProvider, child) {
                  return Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: AppColors.elegantGreenLight.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      '${personalProvider.personasEnRed}',
                      style: const TextStyle(
                        color: AppColors.elegantGreenDark,
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
                  padding: const EdgeInsets.all(20),
                  margin: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.borderColor),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        )
                      ]),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Membresía',
                            style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: AppColors.elegantGreenDark,
                                fontSize: 16),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                                color: AppColors.elegantGreenDark,
                                borderRadius: BorderRadius.circular(4)),
                            child: Text(
                              personalProvider.nivelMembresia,
                              style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                  fontSize: 12),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: LinearProgressIndicator(
                          minHeight: 6,
                          value: personalProvider.progresoMembresia,
                          backgroundColor: AppColors.backgroundLight,
                          valueColor: const AlwaysStoppedAnimation<Color>(
                              AppColors.elegantGreenLight),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '${personalProvider.puntosActuales} BV Puntos',
                        style: const TextStyle(
                            fontSize: 12,
                            color: AppColors.textLight,
                            fontWeight: FontWeight.w500),
                      ),
                    ],
                  ),
                );
              },
            ),
            const SizedBox(height: 10),
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
                  backgroundColor: AppColors.elegantGreenDark,
                  elevation: 4,
                  icon: const Icon(Icons.shopping_cart, color: Colors.white),
                  label: Text(
                    "${carritoProvider.cantidadTotal} items",
                    style: const TextStyle(
                        fontWeight: FontWeight.bold, color: Colors.white),
                  ),
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
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                  color: AppColors.backgroundLight,
                  shape: BoxShape.circle,
                  border: Border.all(
                      color: AppColors.elegantGreenLight.withOpacity(0.5),
                      width: 2)),
              child: const Icon(Icons.storefront_outlined,
                  size: 80, color: AppColors.elegantGreenDark),
            ),
            const SizedBox(height: 32),
            const Text("Bienvenido a Tienda HGW",
                textAlign: TextAlign.center, style: AppStyles.heading2),
            const SizedBox(height: 16),
            const Text(
              "Explora nuestra selección de productos premium pensados para ti.",
              textAlign: TextAlign.center,
              style: AppStyles.body,
            ),
            const SizedBox(height: 40),
            ElevatedButton.icon(
              onPressed: () {
                final menu = context.findAncestorStateOfType<_ManejadorMenu>();
                menu?.navigateTo(4);
              },
              icon: const Icon(Icons.manage_search, color: Colors.white),
              label: const Text("Explorar Catálogo"),
            ),
          ],
        ),
      ),
    );
  }
}
