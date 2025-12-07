import pytest

DIR = "app.controllers.User.Personal.personal"

def test_crear_direccion_exitoso(monkeypatch, client, fake_conn):
    data = {
        "id_usuario": 1,
        "lugar_entrega": "Casa",
        "direccion": "Calle 10",
        "ciudad": "Bogotá",
        "pais": "Colombia",
        "codigo_postal": "110111"
    }

    # Respuesta del SELECT de ubicaciones
    fake_conn.set_fetchone_responses([
        {"id_ubicacion": 99}
    ])

    # Mock DB
    monkeypatch.setattr(f"{DIR}.get_db", lambda: fake_conn)

    fake_conn.lastrowid = 123  # para el INSERT

    resp = client.post("/api/direcciones/crear", json=data)

    assert resp.status_code == 201
    json_data = resp.get_json()
    assert json_data["success"] is True
    assert json_data["id_direccion"] == 123
    assert fake_conn.commit_count == 1


def test_crear_direccion_ciudad_invalida(monkeypatch, client, fake_conn):
    data = {
        "id_usuario": 1,
        "lugar_entrega": "Casa",
        "direccion": "Calle 10",
        "ciudad": "X",
        "pais": "Y",
        "codigo_postal": "110111"
    }

    fake_conn.set_fetchone_responses([None])

    monkeypatch.setattr(f"{DIR}.get_db", lambda: fake_conn)

    resp = client.post("/api/direcciones/crear", json=data)
    assert resp.status_code == 400
    assert resp.get_json()["success"] is False


def test_crear_direccion_error_db(monkeypatch, client):
    def fake_error():
        raise Exception("DB caída")

    monkeypatch.setattr(f"{DIR}.get_db", fake_error)

    data = {
        "id_usuario": 1,
        "lugar_entrega": "Casa",
        "direccion": "Calle 10",
        "ciudad": "Bogotá",
        "pais": "Colombia",
        "codigo_postal": "110111"
    }

    resp = client.post("/api/direcciones/crear", json=data)

    assert resp.status_code == 500
    assert resp.get_json()["success"] is False
