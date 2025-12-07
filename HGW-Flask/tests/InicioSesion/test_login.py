import pytest
import jwt
from datetime import datetime, timedelta

# ============================
# 1. NO ENVÍA JSON
# ============================
def test_login_sin_json(client):
    resp = client.post("/api/login", data="no-json")
    assert resp.status_code == 400
    body = resp.get_json()
    assert body["success"] is False

# ============================
# 2. FALTAN CAMPOS
# ============================
def test_login_faltan_campos(client):
    resp = client.post("/api/login", json={"usuario": "correo"})
    assert resp.status_code == 400
    body = resp.get_json()
    assert body["success"] is False

# ============================
# 3. USUARIO NO EXISTE
# ============================
def test_login_usuario_no_existe(monkeypatch, client, fake_conn):
    # DB devuelve None -> no existe usuario
    fake_conn.set_fetchone_responses([None])

    monkeypatch.setattr(
        "app.controllers.User.InicioSesion.login.get_db",
        lambda: fake_conn
    )

    resp = client.post("/api/login", json={"usuario": "test", "contrasena": "123"})
    assert resp.status_code == 401
    assert resp.get_json()["success"] is False

# ============================
# 4. CONTRASEÑA INCORRECTA
# ============================
def test_login_contrasena_incorrecta(monkeypatch, client, fake_conn):
    # Usuario encontrado PERO contraseña incorrecta
    fake_conn.set_fetchone_responses([
        {
            "id": 1,
            "nombre": "Fabian",
            "apellido": "Amaya",
            "nombre_usuario": "fabian",
            "password": "$2b$12$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            "correo_electronico": "fabian@test.com",
            "numero_telefono": "123",
            "url_foto_perfil": "",
            "patrocinador": None,
            "role_id": 3,
            "nombre_medio": "Nequi"
        }
    ])

    # Mock bcrypt.check_password_hash → devuelve False
    monkeypatch.setattr(
        "app.controllers.User.InicioSesion.login.bcrypt.check_password_hash",
        lambda hash_, pwd: False
    )

    monkeypatch.setattr(
        "app.controllers.User.InicioSesion.login.get_db",
        lambda: fake_conn
    )

    resp = client.post("/api/login", json={"usuario": "fabian", "contrasena": "incorrecta"})
    assert resp.status_code == 401
    assert resp.get_json()["success"] is False

# ============================
# 5. LOGIN EXITOSO
# ============================
def test_login_exitoso(monkeypatch, client, fake_conn):

    fake_user = {
        "id": 2,
        "nombre": "miguel",
        "apellido": "amaya",
        "nombre_usuario": "mf",
        "password": "hash123",
        "correo_electronico": "m@m.com",
        "numero_telefono": "1234567890",
        "url_foto_perfil": "images/Halloween.png",
        "patrocinador": "Fabian_Amaya8",
        "role_id": 1,
        "nombre_medio": 1
    }

    fake_conn.set_fetchone_responses([fake_user])

    monkeypatch.setattr(
        "app.controllers.User.InicioSesion.login.bcrypt.check_password_hash",
        lambda h, p: True
    )

    monkeypatch.setattr(
        "app.controllers.User.InicioSesion.login.get_db",
        lambda: fake_conn
    )

    resp = client.post("/api/login", json={"usuario": "mf", "contrasena": "123"})
    assert resp.status_code == 200

    body = resp.get_json()
    assert body["success"] is True
    assert "token" in body

    assert body["redirect"] == "/Administrador"
    assert body["usuario"]["id_usuario"] == 2
    assert body["usuario"]["correo_electronico"] == "m@m.com"

# ============================
# 6. ERROR INTERNO
# ============================
def test_login_error_interno(monkeypatch, client):

    class FakeBadConn:
        def cursor(self):
            raise Exception("BD caída")

    monkeypatch.setattr(
        "app.controllers.User.InicioSesion.login.get_db",
        lambda: FakeBadConn()
    )

    resp = client.post("/api/login", json={"usuario": "a", "contrasena": "b"})
    assert resp.status_code == 500
    assert resp.get_json()["success"] is False
