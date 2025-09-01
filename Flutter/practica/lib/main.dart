import 'package:flutter/material.dart';
import 'Login.dart';

void main() {
  runApp(const App());
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

  Widget _drawerIcon() {
    return SizedBox(
      width: 28,
      height: 28,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: List.generate(3, (row) {
          return Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: List.generate(3, (_) => Container(
              width: 5,
              height: 5,
              decoration: BoxDecoration(
                color: Colors.grey[800],
                shape: BoxShape.circle,
              ),
            )),
          );
        }),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(kToolbarHeight),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16),
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
                Text(
                  "HGW",
                  style: TextStyle(
                    color: primaryGreen,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.5,
                    fontSize: 20,
                  ),
                ),
                const Spacer(),
                ..._quickNav(),
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
              accountName: const Text("HGW Tienda", style: TextStyle(fontSize: 18)),
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
              onTap: () => navigateTo(0),
            ),
            ListTile(
              leading: Icon(Icons.app_registration, color: primaryGreen),
              title: const Text("Registro"),
              onTap: () => navigateTo(1),
            ),
            ListTile(
              leading: Icon(Icons.login, color: primaryGreen),
              title: const Text("Login"),
              onTap: () => navigateTo(2),
            ),
            const Divider(),
            ListTile(
              leading: Icon(Icons.info, color: primaryGreen),
              title: const Text("Acerca de"),
              onTap: () {},
            ),
            ListTile(
              leading: Icon(Icons.settings, color: primaryGreen),
              title: const Text("Configuración"),
              onTap: () {},
            ),
          ],
        ),
      ),
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 300),
        child: _pages()[currentPage],
      ),
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
          ],
        ),
      ),
    );
  }
}
