import json

def test_obtener_carrito_missing_id(client):
    resp = client.get("/api/carrito")
    assert resp.status_code == 400
    body = resp.get_json()
    assert "error" in body

def test_obtener_carrito_elimina_e_informa(monkeypatch, client, fake_conn):
    # configurar fetchall: primero productos_eliminados, luego productos activos
    productos_eliminados = [{"nombre_producto": "Leche"}]
    productos_activos = [
        {
            "id_producto": 1,
            "nombre_producto": "Pan",
            "imagen_producto": "img.jpg",
            "precio_producto": 1000,
            "cantidad_producto": 2,
            "stock": 10
        }
    ]
    
    fake_conn.set_fetchall_responses([
        productos_eliminados,
        productos_activos
    ])

    # patchear get_db para que devuelva fake_conn
    monkeypatch.setattr(
        "app.controllers.User.Carrito.carrito_routes.get_db",
        lambda: fake_conn
    )


    resp = client.get("/api/carrito?id=5")
    assert resp.status_code == 200
    body = resp.get_json()
    assert body["success"] is True
    assert "productos" in body
    assert "eliminados" in body
    assert "Leche" in body["eliminados"]

def test_obtener_carrito_vacio(monkeypatch, client, fake_conn):
    
    fake_conn.set_fetchall_responses([
        [], []
    ])
    monkeypatch.setattr(
        "app.controllers.User.Carrito.carrito_routes.get_db",
        lambda: fake_conn
    )


    resp = client.get("/api/carrito?id=1")
    body = resp.get_json()

    assert resp.status_code == 200
    assert body["success"] is True
    assert body["productos"] == []

    assert "El carrito está vacío" in body.get("mensaje", "") or "carrito" in body.get("mensaje", "")
