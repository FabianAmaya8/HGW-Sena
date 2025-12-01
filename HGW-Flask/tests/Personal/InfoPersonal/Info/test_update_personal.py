import pytest
import json

DIR = "app.controllers.User.Personal.personal"

def test_update_personal_json_exitoso(monkeypatch, client, fake_conn):
    data = {
        "nombre": "Fabian Nuevo",
        "apellido": "Amaya",
        "direcciones": [
            {
                "id_direccion": 1,
                "direccion": "Nueva Calle",
                "codigo_postal": "99999"
            }
        ]
    }

    fake_conn.set_fetchone_responses([{"id_usuario": 1}])
    fake_conn.set_fetchall_responses([])

    monkeypatch.setattr(f"{DIR}.get_db", lambda: fake_conn)

    resp = client.put(
        "/api/personal/update?id=1",
        data=json.dumps(data),
        content_type="application/json"
    )

    assert resp.status_code == 200
    assert resp.get_json()["success"] is True
    assert fake_conn.commit_count == 1


def test_update_personal_sin_id(client):
    resp = client.put("/api/personal/update")
    assert resp.status_code == 400


def test_update_personal_usuario_no_existe(monkeypatch, client, fake_conn):
    fake_conn.set_fetchone_responses([None])

    monkeypatch.setattr(f"{DIR}.get_db", lambda: fake_conn)

    # simulamos foto (multipart)
    resp = client.put(
        "/api/personal/update?id=1",
        data={"data": "{}"},
        content_type="multipart/form-data"
    )

    assert resp.status_code == 404


def test_update_personal_error(monkeypatch, client):
    monkeypatch.setattr(
        f"{DIR}.get_db",
        lambda: (_ for _ in ()).throw(Exception("DB caída"))
    )

    resp = client.put("/api/personal/update?id=1")

    assert resp.status_code == 500
