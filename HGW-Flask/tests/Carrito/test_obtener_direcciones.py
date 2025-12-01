def test_obtener_direcciones(monkeypatch, client, fake_conn):

    fake_conn.reset()

    direcciones = [
        {
            "id_usuario": 2,
            "id_direccion": 10,
            "direccion": "Calle 123",
            "codigo_postal": "11001",
            "lugar_entrega": "Casa",
            "ciudad_id": 100,
            "pais_id": 1,
            "ciudad": "Bogotá",
            "pais": "Colombia"
        }
    ]

    fake_conn.set_fetchall_responses([direcciones])

    monkeypatch.setattr(
        "app.controllers.User.Carrito.carrito_routes.get_db",
        lambda: fake_conn
    )

    resp = client.get("/api/direcciones?id=1")
    body = resp.get_json()

    assert resp.status_code == 200
    assert body["success"] is True
    assert len(body["direcciones"]) >= 1
