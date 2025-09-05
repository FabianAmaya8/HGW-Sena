import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import './providers/productos_provider.dart';
import './providers/carrito/carrito_provider.dart'; // Nuevo import
import 'Login.dart';
import './modules/educacion/education_page.dart';
import './screens/catalogo_screen.dart';
import './screens/carrito/carrito_screen.dart'; // Nuevo import

void main() {
  runApp(
    // Cambiamos a MultiProvider para manejar múltiples providers
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ProductosProvider()),
        ChangeNotifierProvider(
            create: (_) => CarritoProvider()), // Nuevo provider
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
      home: Menu(
        headers: const [
          {"value": "Inicio"},
          {"value": "Registro"},
          {"value": "Login"},
        ],
      ),
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
      const Login(),
      const Login(),
      const EducationPage(),
      const CatalogoScreen(),
      CarritoScreen(onNavigateToCatalog: () {  },), // Nueva página del carrito
    ];
  }

  List<Widget> _quickNav() {
    return [
      _elegantButton("Registro", 1),
      _elegantButton("Login", 2),
    ];
  }

  Widget _elegantButton(String label, int index) {
    bool isActive = currentPage == index;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 6),
      child: GestureDetector(
        onTap: () => navigateTo(index),
        child: Container(
          decoration: BoxDecoration(
            color: isActive ? primaryGreen : Colors.transparent,
            border: Border.all(color: primaryGreen, width: 1.5),
            borderRadius: BorderRadius.circular(6),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Text(
            label,
            style: TextStyle(
              color: isActive ? Colors.white : primaryGreen,
              fontWeight: FontWeight.bold,
              fontSize: 14,
              letterSpacing: 0.5,
            ),
          ),
        ),
      ),
    );
  }

  // Widget para el ícono del carrito con badge
  Widget _cartIconWithBadge() {
    return Consumer<CarritoProvider>(
      builder: (context, carritoProvider, child) {
        int itemCount = carritoProvider.cantidadTotal;

        return Stack(
          clipBehavior: Clip.none,
          children: [
            IconButton(
              icon: Icon(
                Icons.shopping_cart,
                color: currentPage == 5 ? primaryGreen : Colors.grey[700],
              ),
              onPressed: () => navigateTo(5),
            ),
            if (itemCount > 0)
              Positioned(
                right: 0,
                top: 0,
                child: Container(
                  padding: const EdgeInsets.all(2),
                  decoration: BoxDecoration(
                    color: Colors.red,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: Colors.white, width: 1.5),
                  ),
                  constraints: const BoxConstraints(
                    minWidth: 20,
                    minHeight: 20,
                  ),
                  child: Center(
                    child: Text(
                      itemCount > 99 ? '99+' : itemCount.toString(),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
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
                decoration: BoxDecoration(
                  color: Colors.grey[800],
                  shape: BoxShape.circle,
                ),
              ),
            ),
          );
        }),
      ),
    );
  }

  Widget elegantLogo(Color color) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          "HGW",
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 24,
            color: color,
            letterSpacing: 2,
            fontFamily: 'Roboto',
          ),
        ),
        const SizedBox(width: 8),
        Container(
          width: 28,
          height: 28,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(color: color, width: 2),
          ),
          child: Icon(
            Icons.storefront,
            color: color,
            size: 20,
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(kToolbarHeight),
        child: Container(
          height: 200,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 5),
          color: Colors.white,
          child: SafeArea(
            child: Row(
              children: [
                Builder(
                  builder: (context) => IconButton(
                    icon: _drawerIcon(),
                    onPressed: () => Scaffold.of(context).openDrawer(),
                  ),
                ),
                const SizedBox(width: 16),
                elegantLogo(primaryGreen),
                const Spacer(),
                ..._quickNav(),
                _cartIconWithBadge(), // Ícono del carrito con badge
              ],
            ),
          ),
        ),
      ),
      drawer: Drawer(
        child: Column(
          children: [
            UserAccountsDrawerHeader(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [primaryGreen, Colors.green.shade400],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              accountName:
                  const Text("HGW Tienda", style: TextStyle(fontSize: 18)),
              accountEmail: const Text("contact@hgw.com"),
              currentAccountPicture: CircleAvatar(
                backgroundColor: Colors.white,
                child: Text(
                  "HGW",
                  style: TextStyle(
                    color: primaryGreen,
                    fontWeight: FontWeight.bold,
                  ),
                ),
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
            // Nueva opción del carrito en el drawer
            ListTile(
              leading: Stack(
                clipBehavior: Clip.none,
                children: [
                  Icon(Icons.shopping_cart, color: primaryGreen),
                  Consumer<CarritoProvider>(
                    builder: (context, carritoProvider, child) {
                      int itemCount = carritoProvider.cantidadTotal;
                      if (itemCount == 0) return const SizedBox();

                      return Positioned(
                        right: -8,
                        top: -8,
                        child: Container(
                          padding: const EdgeInsets.all(2),
                          decoration: const BoxDecoration(
                            color: Colors.red,
                            shape: BoxShape.circle,
                          ),
                          constraints: const BoxConstraints(
                            minWidth: 16,
                            minHeight: 16,
                          ),
                          child: Text(
                            itemCount > 99 ? '99+' : itemCount.toString(),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 9,
                              fontWeight: FontWeight.bold,
                            ),
                            textAlign: TextAlign.center,
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
                  return Text(
                    itemCount > 0 ? "Carrito ($itemCount)" : "Carrito",
                  );
                },
              ),
              subtitle: Consumer<CarritoProvider>(
                builder: (context, carritoProvider, child) {
                  double total = carritoProvider.total;
                  if (total == 0) return const SizedBox();
                  return Text(
                    "Total: \$${total.toStringAsFixed(2)}",
                    style: TextStyle(
                      color: primaryGreen,
                      fontWeight: FontWeight.bold,
                    ),
                  );
                },
              ),
              onTap: () {
                navigateTo(5);
                Navigator.pop(context);
              },
            ),
            const Spacer(),
            const Divider(),
            // Información del total del carrito en la parte inferior
            Consumer<CarritoProvider>(
              builder: (context, carritoProvider, child) {
                if (carritoProvider.items.isEmpty) {
                  return const SizedBox();
                }

                return Container(
                  padding: const EdgeInsets.all(16),
                  color: Colors.green.shade50,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Resumen del Carrito",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: primaryGreen,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text("Productos:"),
                          Text("${carritoProvider.cantidadTotal}"),
                        ],
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text("Total:"),
                          Text(
                            "\$${carritoProvider.total.toStringAsFixed(2)}",
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: primaryGreen,
                            ),
                          ),
                        ],
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
          child: Center(
            child: _pages()[currentPage],
          ),
        ),
      ),
      // Botón flotante para acceso rápido al carrito (opcional)
      floatingActionButton: currentPage != 5
          ? Consumer<CarritoProvider>(
              builder: (context, carritoProvider, child) {
                if (carritoProvider.items.isEmpty) return const SizedBox();

                return FloatingActionButton.extended(
                  onPressed: () => navigateTo(5),
                  backgroundColor: primaryGreen,
                  icon: const Icon(Icons.shopping_cart),
                  label: Text(
                    "${carritoProvider.cantidadTotal} items",
                    style: const TextStyle(fontWeight: FontWeight.bold),
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
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.storefront, size: 90, color: Colors.green.shade600),
            const SizedBox(height: 20),
            Text(
              "Bienvenido a Tienda HGW",
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: Colors.grey[800],
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
            // Botones de acceso rápido
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ElevatedButton.icon(
                  onPressed: () {
                    final menu =
                        context.findAncestorStateOfType<_ManejadorMenu>();
                    menu?.navigateTo(4);
                  },
                  icon: const Icon(Icons.store),
                  label: const Text("Ver Catálogo"),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green.shade600,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 24, vertical: 12),
                  ),
                ),
                const SizedBox(width: 16),
                Consumer<CarritoProvider>(
                  builder: (context, carritoProvider, child) {
                    if (carritoProvider.items.isEmpty) return const SizedBox();

                    return ElevatedButton.icon(
                      onPressed: () {
                        final menu =
                            context.findAncestorStateOfType<_ManejadorMenu>();
                        menu?.navigateTo(5);
                      },
                      icon: const Icon(Icons.shopping_cart),
                      label: Text("Carrito (${carritoProvider.cantidadTotal})"),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.orange.shade600,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 24, vertical: 12),
                      ),
                    );
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
