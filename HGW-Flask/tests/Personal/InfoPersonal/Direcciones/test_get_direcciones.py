import pytest

DIR = "app.controllers.User.Personal.personal"

def test_get_direcciones_exitoso(monkeypatch, client, fake_conn):
    fake_conn.set_fetchall_responses([
        [
            {
                "id": 1,
                "direccion": "Calle 10",
                "codigo_postal": "110111",
                "lugar_entrega": "Casa",
                "ciudad": "Bogotá",
                "pais": "Colombia"
            }
        ]
    ])

    monkeypatch.setattr(f"{DIR}.get_db", lambda: fake_conn)

    resp = client.get("/api/direcciones?id=1")

    assert resp.status_code == 200
    json_data = resp.get_json()
    assert json_data["success"] is True
    assert len(json_data["direcciones"]) == 1


def test_get_direcciones_sin_id(client):
    resp = client.get("/api/direcciones")
    assert resp.status_code == 400


def test_get_direcciones_error(monkeypatch, client):
    monkeypatch.setattr(
        f"{DIR}.get_db",
        lambda: (_ for _ in ()).throw(Exception("DB caída"))
    )

    resp = client.get("/api/direcciones?id=1")

    assert resp.status_code == 500
    assert resp.get_json()["success"] is False
