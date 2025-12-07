import pytest
import os

DIR = "app.controllers.User.Personal.personal"


def test_delete_foto_sin_id(client):
    resp = client.delete("/api/personal/delete")
    assert resp.status_code == 400


def test_delete_foto_no_existe(monkeypatch, client, fake_conn):
    fake_conn.set_fetchone_responses([None])
    monkeypatch.setattr(f"{DIR}.get_db", lambda: fake_conn)

    resp = client.delete("/api/personal/delete?id=1")

    assert resp.status_code == 404


def test_delete_foto_exitoso(monkeypatch, client, fake_conn, tmp_path):
    # Mock DB
    fake_conn.set_fetchone_responses([
        {"url_foto_perfil": "static/uploads/profile_pictures/foto.png"}
    ])

    monkeypatch.setattr(f"{DIR}.get_db", lambda: fake_conn)

    # Crear archivo simulado
    fake_file = tmp_path / "foto.png"
    fake_file.write_text("demo")

    # Mock ruta absoluta
    monkeypatch.setattr(
        f"{DIR}.os.path.exists",
        lambda path: True
    )
    monkeypatch.setattr(
        f"{DIR}.os.remove",
        lambda path: None
    )

    resp = client.delete("/api/personal/delete?id=1")

    assert resp.status_code == 200
    assert resp.get_json()["success"] is True


def test_delete_foto_error(monkeypatch, client):
    monkeypatch.setattr(
        f"{DIR}.get_db",
        lambda: (_ for _ in ()).throw(Exception("DB caída"))
    )

    resp = client.delete("/api/personal/delete?id=1")

    assert resp.status_code == 500
