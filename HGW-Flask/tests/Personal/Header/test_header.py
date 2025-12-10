import pytest

DIR = "app.controllers.User.Personal.Info_Header"

# -------------------------------------------------------
# 1. FALTA ID DE USUARIO
# -------------------------------------------------------
def test_header_sin_id(client):
    resp = client.get("/api/header")
    assert resp.status_code == 400

    data = resp.get_json()
    assert data["success"] is False
    assert "ID de usuario" in data["message"]


# -------------------------------------------------------
# 2. USUARIO NO EXISTE
# -------------------------------------------------------
def test_header_usuario_no_existe(monkeypatch, client, fake_conn):
    
    # fetchone → None en consulta del usuario
    fake_conn.set_fetchone_responses([
        None
    ])
    fake_conn.set_fetchall_responses([])

    monkeypatch.setattr(f"{DIR}.get_db", lambda: fake_conn)

    resp = client.get("/api/header?id=5")

    assert resp.status_code == 404
    assert resp.get_json()["message"] == "Usuario no encontrado"


# -------------------------------------------------------
# 3. USUARIO INACTIVO
# -------------------------------------------------------
def test_header_usuario_inactivo(monkeypatch, client, fake_conn):

    fake_conn.set_fetchone_responses([
        {"url_foto_perfil": "image.jpg", "activo": 0}
    ])
    fake_conn.set_fetchall_responses([])

    monkeypatch.setattr(f"{DIR}.get_db", lambda: fake_conn)

    resp = client.get("/api/header?id=10")

    assert resp.status_code == 403
    assert "desactivada" in resp.get_json()["message"].lower()


# -------------------------------------------------------
# 4. HEADER EXITOSO (carrito suma correctamente)
# -------------------------------------------------------
def test_header_exitoso(monkeypatch, client, fake_conn):

    # 1) Primero fetchone() trae la info del usuario
    # 2) Segundo fetchone() trae el total del carrito
    fake_conn.set_fetchone_responses([
        {"url_foto_perfil": "foto.jpg", "activo": 1},   # usuario
        {"total_carrito": 4}                            # carrito
    ])
    fake_conn.set_fetchall_responses([])

    monkeypatch.setattr(f"{DIR}.get_db", lambda: fake_conn)

    resp = client.get("/api/header?id=1")

    assert resp.status_code == 200
    data = resp.get_json()

    assert data["success"] is True
    assert data["user"]["total_carrito"] == 4
    assert data["user"]["url_foto_perfil"] == "foto.jpg"


# -------------------------------------------------------
# 5. ERROR INTERNO (Excepción en cursor)
# -------------------------------------------------------
def test_header_error(monkeypatch, client):

    class FakeConn:
        def cursor(self):
            raise Exception("DB rota")

    monkeypatch.setattr(f"{DIR}.get_db", lambda: FakeConn())

    resp = client.get("/api/header?id=1")

    assert resp.status_code == 500
    assert resp.get_json()["success"] is False
