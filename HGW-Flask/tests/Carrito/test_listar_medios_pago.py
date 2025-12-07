def test_listar_medios_pago(monkeypatch, client, fake_conn, app):

    fake_conn.reset()
    
    medios = [
        {
            "id_medio": 1, 
            "nombre_medio": 
            "Tarjeta"
        }, 
        {
            "id_medio": 2, 
            "nombre_medio": "Efectivo"
        }
    ]
    fake_conn.set_fetchall_responses([medios])

    monkeypatch.setattr(
        "app.controllers.User.Carrito.carrito_routes.get_db",
        lambda: fake_conn
    )

    resp = client.get("/api/medios-pago")
    assert resp.status_code == 200
    body = resp.get_json()
    assert isinstance(body, list)
    assert len(body) >= 1
