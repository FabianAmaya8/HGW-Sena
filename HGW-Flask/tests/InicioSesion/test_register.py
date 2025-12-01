import pytest

def test_register_faltan_campos(client):
    resp = client.post("/api/register", data={})
    assert resp.status_code == 400
    assert resp.get_json()["success"] is False


def test_register_contrasenas_no_coinciden(client):
    data = {
        "nombres": "Fabian",
        "apellido": "Amaya",
        "usuario": "fabian",
        "contrasena": "123",
        "confirmar_contrasena": "456",
        "correo": "f@f.com",
        "telefono": "123",
        "direccion": "Calle 1",
        "codigo_postal": "110111",
        "ciudad": "1",
        "lugar_entrega": "casa"
    }
    resp = client.post("/api/register", data=data)
    assert resp.status_code == 400


def test_register_exitoso(monkeypatch, client, fake_conn):
    data = {
        "nombres": "Fabian",
        "apellido": "Amaya",
        "usuario": "fabian",
        "contrasena": "123",
        "confirmar_contrasena": "123",
        "correo": "f@f.com",
        "telefono": "123",
        "direccion": "Calle 1",
        "codigo_postal": "110111",
        "ciudad": "1",
        "lugar_entrega": "casa"
    }

    fake_conn.set_fetchone_responses([])
    fake_conn.set_fetchall_responses([])

    # Mock DB
    monkeypatch.setattr(
        "app.controllers.User.InicioSesion.register.get_db",
        lambda: fake_conn
    )

    fake_conn.lastrowid = 10

    # Mock bcrypt
    monkeypatch.setattr(
        "app.controllers.User.InicioSesion.register.bcrypt.generate_password_hash",
        lambda pwd: b"hashed"
    )

    # Mock secure_filename
    monkeypatch.setattr(
        "app.controllers.User.InicioSesion.register.secure_filename",
        lambda x: "foto.png"
    )

    resp = client.post("/api/register", data=data)

    assert resp.status_code == 201
    assert resp.get_json()["success"] is True
    assert fake_conn.commit_count == 1


def test_register_error(monkeypatch, client):
    def fake_error():
        raise Exception("DB caída")

    monkeypatch.setattr(
        "app.controllers.User.InicioSesion.register.get_db",
        fake_error
    )

    data = {
        "nombres": "Fabian",
        "apellido": "Amaya",
        "usuario": "fabian",
        "contrasena": "123",
        "confirmar_contrasena": "123",
        "correo": "f@f.com",
        "telefono": "123",
        "direccion": "Calle 1",
        "codigo_postal": "110111",
        "ciudad": "1",
        "lugar_entrega": "casa"
    }

    resp = client.post("/api/register", data=data)

    assert resp.status_code == 500
    assert resp.get_json()["success"] is False
