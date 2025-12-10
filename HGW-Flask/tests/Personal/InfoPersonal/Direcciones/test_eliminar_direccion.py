import pytest

DIR = "app.controllers.User.Personal.personal"

def test_eliminar_direccion_exitoso(monkeypatch, client, fake_conn):
    fake_conn.set_fetchone_responses([
        {"id_direccion": 5}  # la dirección existe
    ])

    monkeypatch.setattr(f"{DIR}.get_db", lambda: fake_conn)

    data = {"id_direccion": 5, "id_usuario": 1}

    resp = client.delete("/api/direcciones/eliminar", json=data)

    assert resp.status_code == 200
    assert resp.get_json()["success"] is True
    assert fake_conn.commit_count == 1


def test_eliminar_direccion_no_encontrada(monkeypatch, client, fake_conn):
    fake_conn.set_fetchone_responses([None])

    monkeypatch.setattr(f"{DIR}.get_db", lambda: fake_conn)

    data = {"id_direccion": 5, "id_usuario": 1}

    resp = client.delete("/api/direcciones/eliminar", json=data)

    assert resp.status_code == 404
    assert resp.get_json()["success"] is False


def test_eliminar_direccion_datos_incompletos(client):
    resp = client.delete("/api/direcciones/eliminar", json={})
    assert resp.status_code == 400


def test_eliminar_direccion_error(monkeypatch, client):
    monkeypatch.setattr(
        f"{DIR}.get_db",
        lambda: (_ for _ in ()).throw(Exception("DB caída"))
    )

    data = {"id_direccion": 5, "id_usuario": 1}

    resp = client.delete("/api/direcciones/eliminar", json=data)

    assert resp.status_code == 500
    assert resp.get_json()["success"] is False
