import json

def test_crear_orden_sin_payload(client):
    resp = client.post("/api/ordenes", json=None)
    assert resp.status_code == 400

def test_crear_orden_faltan_campos(client):
    payload = {"id_usuario": 1, "items": []}
    resp = client.post("/api/ordenes", json=payload)
    assert resp.status_code == 400
    body = resp.get_json()
    assert "faltan" in body or "error" in body

def test_crear_orden_exitoso(monkeypatch, client, fake_conn):
    cursor = fake_conn.cursor()
    # El controlador hace:
    # - INSERT orden -> commit
    # - SELECT LAST_INSERT_ID() -> fetchone -> {'id_orden': 55}
    # Según eso, configuramos fetchone_responses para devolver id_orden
    cursor.set_fetchone_responses([{"id_orden": 55}])

    monkeypatch.setattr(
        "app.controllers.User.Carrito.carrito_routes.get_db",
        lambda: fake_conn)

    payload = {
        "id_usuario": 2,
        "id_direccion": 1,
        "id_medio_pago": 1,
        "total": 25000,
        "items": [
            {"id_producto": 1, "cantidad": 2, "precio_unitario": 5000},
            {"id_producto": 2, "cantidad": 1, "precio_unitario": 15000}
        ]
    }
    resp = client.post("/api/ordenes", json=payload)
    assert resp.status_code == 201
    body = resp.get_json()
    assert "id_orden" in body
    assert body["id_orden"] > 0
