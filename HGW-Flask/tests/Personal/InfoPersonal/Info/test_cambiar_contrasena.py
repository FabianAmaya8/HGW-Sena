import pytest

DIR = "app.controllers.User.Personal.personal"

def test_cambiar_contrasena_incompleto(client):
    resp = client.post("/api/cambiar-contrasena", json={})
    assert resp.status_code == 400


def test_cambiar_contrasena_usuario_no_existe(monkeypatch, client, fake_conn):
    fake_conn.set_fetchone_responses([None])
    monkeypatch.setattr(f"{DIR}.get_db", lambda: fake_conn)

    data = {"id_usuario": 1, "actual": "123", "nueva": "456"}
    resp = client.post("/api/cambiar-contrasena", json=data)

    assert resp.status_code == 404


def test_cambiar_contrasena_incorrecta(monkeypatch, client, fake_conn):
    fake_conn.set_fetchone_responses([{"pss": "hashed_pass"}])

    monkeypatch.setattr(f"{DIR}.get_db", lambda: fake_conn)

    monkeypatch.setattr(
        f"{DIR}.bcrypt.check_password_hash",
        lambda stored, given: False
    )

    data = {"id_usuario": 1, "actual": "wrong", "nueva": "456"}
    resp = client.post("/api/cambiar-contrasena", json=data)

    assert resp.status_code == 401


def test_cambiar_contrasena_exitoso(monkeypatch, client, fake_conn):
    fake_conn.set_fetchone_responses([{"pss": "hashed"}])

    monkeypatch.setattr(f"{DIR}.get_db", lambda: fake_conn)

    monkeypatch.setattr(
        f"{DIR}.bcrypt.check_password_hash",
        lambda stored, given: True
    )

    monkeypatch.setattr(
        f"{DIR}.bcrypt.generate_password_hash",
        lambda pwd: b"new_hashed"
    )

    data = {"id_usuario": 1, "actual": "123", "nueva": "456"}
    resp = client.post("/api/cambiar-contrasena", json=data)

    assert resp.status_code == 200
    assert fake_conn.commit_count == 1


def test_cambiar_contrasena_error(monkeypatch, client):
    monkeypatch.setattr(
        f"{DIR}.get_db",
        lambda: (_ for _ in ()).throw(Exception("DB caída"))
    )

    resp = client.post("/api/cambiar-contrasena", json={"id_usuario": 1, "actual": "x", "nueva": "y"})
    assert resp.status_code == 500
