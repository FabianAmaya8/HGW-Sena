import json

def test_eliminar_producto_carrito_missing_data(client):
    resp = client.delete("/api/carrito/eliminar", json={})
    assert resp.status_code == 400
    assert "error" in resp.get_json()

def test_eliminar_producto_carrito_exitoso(monkeypatch, client, fake_conn):
    
    # no fetch needed, solo ejecutar y commit
    monkeypatch.setattr("app.controllers.db.get_db", lambda: fake_conn)

    payload = {"id_usuario": 9, "id_producto": 4}
    resp = client.delete("/api/carrito/eliminar", json=payload)
    assert resp.status_code == 200
    body = resp.get_json()
    assert "mensaje" in body
