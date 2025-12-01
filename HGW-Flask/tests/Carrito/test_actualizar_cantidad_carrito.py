import json

def test_actualizar_cantidad_missing(client):
    resp = client.put("/api/carrito/actualizar", json={})
    assert resp.status_code == 400

def test_actualizar_cantidad_invalida(client):
    payload = {
        "id_usuario": 1, 
        "id_producto": 2, 
        "nueva_cantidad": 0
    }
    resp = client.put("/api/carrito/actualizar", json=payload)
    assert resp.status_code == 400
    body = resp.get_json()
    assert "La cantidad debe ser mayor a 0" in body.get("error", "") or "cantidad" in body.get("error", "")

def test_actualizar_cantidad_exitoso(monkeypatch, client, fake_conn):
    monkeypatch.setattr("app.controllers.db.get_db", lambda: fake_conn)
    payload = {
        "id_usuario": 1, 
        "id_producto": 2, 
        "nueva_cantidad": 3
    }
    resp = client.put("/api/carrito/actualizar", json=payload)
    assert resp.status_code == 200
    assert "mensaje" in resp.get_json()
