import pytest

DIR = "app.controllers.User.Personal.red_multinivel"

# -------------------------------------------------------
# 1. FALTA ID DE USUARIO
# -------------------------------------------------------
def test_obtener_mi_red_sin_id(client):
    resp = client.get("/api/mi-red")
    assert resp.status_code == 400
    assert resp.get_json()["success"] is False


# -------------------------------------------------------
# 2. ERROR EN CONEXIÓN MYSQL (connection = None)
# -------------------------------------------------------
def test_obtener_mi_red_sin_conexion(monkeypatch, client):
    monkeypatch.setattr(f"{DIR}.get_connection", lambda: None)

    resp = client.get("/api/mi-red?id=1")
    assert resp.status_code == 500

    data = resp.get_json()
    assert data["success"] is False
    assert "conexión" in data["message"].lower()


# -------------------------------------------------------
# 3. USUARIO NO EXISTE
# -------------------------------------------------------
def test_obtener_mi_red_usuario_no_existe(monkeypatch, client, fake_conn):

    # No retorna usuario
    fake_conn.set_fetchone_responses([None])
    fake_conn.set_fetchall_responses([])

    monkeypatch.setattr(f"{DIR}.get_connection", lambda: fake_conn)

    resp = client.get("/api/mi-red?id=99")

    assert resp.status_code == 404
    assert resp.get_json()["message"] == "Usuario no encontrado"


# -------------------------------------------------------
# 4. RED EXITOSA (devuelve descendientes)
# -------------------------------------------------------
def test_obtener_mi_red_exitoso(monkeypatch, client, fake_conn):

    # 1) fetchone() → usuario encontrado
    # 2) fetchall() → lista de la red
    fake_conn.set_fetchone_responses([
        {"nombre_usuario": "fabian"},  # usuario principal
    ])

    fake_conn.set_fetchall_responses([
        [   # red multinivel
            {
                "id_usuario": 2,
                "nombre": "Juan",
                "apellido": "Pérez",
                "nombre_usuario": "juan",
                "correo_electronico": "j@j.com",
                "url_foto_perfil": None,
                "patrocinador": "fabian",
                "nombre_membresia": "Bronce",
                "fecha_registro": "2024-01-01 10:00:00",
                "nivel": 1,
                "activo": 1,
                "numero_telefono": "123",
                "total_red": 3,
                "puntos_bv": 10
            }
        ]
    ])

    monkeypatch.setattr(f"{DIR}.get_connection", lambda: fake_conn)

    resp = client.get("/api/mi-red?id=1")

    assert resp.status_code == 200
    body = resp.get_json()

    assert body["success"] is True
    assert body["total"] == 1
    assert body["codigo_patrocinador"] == "fabian"
    assert body["red"][0]["nombre_usuario"] == "juan"


# -------------------------------------------------------
# 5. ERROR INTERNO EN CONSULTA
# -------------------------------------------------------
def test_obtener_mi_red_error(monkeypatch, client):

    class FakeConn:
        def cursor(self):
            raise Exception("DB caída")

    monkeypatch.setattr(f"{DIR}.get_connection", lambda: FakeConn())

    resp = client.get("/api/mi-red?id=1")

    assert resp.status_code == 500
    assert resp.get_json()["success"] is False
