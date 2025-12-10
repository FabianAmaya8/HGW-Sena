import json

def test_agregar_producto_carrito_missing_data(client):
    resp = client.post("/api/carrito/agregar", json={})
    assert resp.status_code == 400
    assert "error" in resp.get_json()

def test_agregar_producto_carrito_crea_carrito_y_agrega(monkeypatch, client, fake_conn):
    cursor = fake_conn.cursor()
    # Secuencia de fetchone() en el controlador:
    # 1. SELECT id_carrito -> None (no carrito)
    # 2. SELECT id_carrito AFTER INSERT -> {'id_carrito': 10}
    # 3. SELECT cantidad_producto para producto existente -> None (no existente)
    cursor.set_fetchone_responses([None, {"id_carrito": 10}, None])

    monkeypatch.setattr("app.controllers.db.get_db", lambda: fake_conn)

    payload = {"id_usuario": 7, "id_producto": 3, "cantidad": 2}
    resp = client.post("/api/carrito/agregar", json=payload)
    assert resp.status_code == 200
    body = resp.get_json()
    assert "mensaje" in body
    assert "Producto agregado" in body["mensaje"] or "agregado" in body["mensaje"]

def test_agregar_producto_carrito_incrementa(monkeypatch, client, fake_conn):
    cursor = fake_conn.cursor()
    # 1. SELECT id_carrito -> {'id_carrito': 5}
    # 2. SELECT cantidad_producto -> {'cantidad_producto': 2} (existe)
    cursor.set_fetchone_responses([{"id_carrito": 5}, {"cantidad_producto": 2}])

    monkeypatch.setattr("app.controllers.db.get_db", lambda: fake_conn)

    payload = {"id_usuario": 7, "id_producto": 3, "cantidad": 1}
    resp = client.post("/api/carrito/agregar", json=payload)
    assert resp.status_code == 200
    body = resp.get_json()
    assert "mensaje" in body
