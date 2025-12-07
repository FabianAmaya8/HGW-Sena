import json


def test_obtener_productos_exitoso(monkeypatch, client, fake_conn):
    # Datos simulados de la BD
    fake_products = [
        {
            "id_producto": 1,
            "categoria": "Bebidas",
            "subcategoria": "Jugos",
            "nombre": "Jugo de Naranja",
            "precio": 5000,
            "puntos_bv": 10,
            "imagen": "jugo.png",
            "stock": 20
        },
        {
            "id_producto": 2,
            "categoria": "Snacks",
            "subcategoria": "Chocolates",
            "nombre": "Chocolate Bar",
            "precio": 3000,
            "puntos_bv": 5,
            "imagen": "choco.png",
            "stock": 15
        }
    ]

    # Configurar respuestas del fake cursor
    fake_conn.set_fetchall_responses([fake_products])

    # Parche correcto del import REAL usado por el controlador
    monkeypatch.setattr(
        "app.controllers.User.Catalogo.producto.get_db",
        lambda: fake_conn
    )

    resp = client.get("/api/productos")
    assert resp.status_code == 200

    body = resp.get_json()
    assert isinstance(body, list)
    assert len(body) == 2
    assert body[0]["nombre"] == "Jugo de Naranja"


def test_obtener_productos_vacio(monkeypatch, client, fake_conn):
    # Sin productos
    fake_conn.set_fetchall_responses([[]])

    monkeypatch.setattr(
        "app.controllers.User.Catalogo.producto.get_db",
        lambda: fake_conn
    )

    resp = client.get("/api/productos")
    assert resp.status_code == 200
    assert resp.get_json() == []


def test_obtener_productos_error_bd(monkeypatch, client):

    class FakeBadConn:
        def cursor(self):
            raise Exception("Falla en BD")

    # Parcheo correcto
    monkeypatch.setattr(
        "app.controllers.User.Catalogo.producto.get_db",
        lambda: FakeBadConn()
    )

    resp = client.get("/api/productos")
    assert resp.status_code == 500

    body = resp.get_json()
    assert "error" in body
    assert body["error"] == "Error interno al obtener productos"
