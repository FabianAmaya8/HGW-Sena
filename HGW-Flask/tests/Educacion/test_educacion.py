# -------------------- Tests GET /api/educacion --------------------

def test_get_temas_ok(monkeypatch, client, fake_conn):
    temas = [
        {"id_tema": 1, "tema": "Matemáticas"},
        {"id_tema": 2, "tema": "Historia"}
    ]

    fake_conn.set_fetchall_responses([temas])

    monkeypatch.setattr(
        "app.controllers.User.Educacion.educacion.get_db",
        lambda: fake_conn
    )

    resp = client.get("/api/educacion")
    assert resp.status_code == 200

    body = resp.get_json()
    assert isinstance(body, list)
    assert len(body) == 2
    assert body[0]["tema"] == "Matemáticas"


def test_get_temas_error(monkeypatch, client):
    def fake_get_db_error():
        raise Exception("Error de conexión")

    monkeypatch.setattr(
        "app.controllers.User.Educacion.educacion.get_db",
        fake_get_db_error
    )

    resp = client.get("/api/educacion")
    assert resp.status_code == 500

    body = resp.get_json()
    assert "error" in body


# -------------------- Tests GET /api/contenido_tema --------------------

def test_get_contenidos_sin_filtro(monkeypatch, client, fake_conn):

    contenidos = [
        {
            "id_contenido": 10,
            "titulo": "Introducción",
            "tema": 1,
            "temaName": "Matemáticas"
        }
    ]

    fake_conn.set_fetchall_responses([contenidos])

    monkeypatch.setattr(
        "app.controllers.User.Educacion.educacion.get_db",
        lambda: fake_conn
    )

    resp = client.get("/api/contenido_tema")
    assert resp.status_code == 200

    body = resp.get_json()
    assert isinstance(body, list)
    assert len(body) == 1
    assert body[0]["temaName"] == "Matemáticas"


def test_get_contenidos_con_filtro(monkeypatch, client, fake_conn):

    contenidos = [
        {
            "id_contenido": 5,
            "titulo": "Fracciones",
            "tema": 1,
            "temaName": "Matemáticas"
        }
    ]

    fake_conn.set_fetchall_responses([contenidos])

    monkeypatch.setattr(
        "app.controllers.User.Educacion.educacion.get_db",
        lambda: fake_conn
    )

    resp = client.get("/api/contenido_tema?id_tema=1")
    assert resp.status_code == 200

    body = resp.get_json()
    assert len(body) == 1
    assert body[0]["titulo"] == "Fracciones"


def test_get_contenidos_error(monkeypatch, client):
    def fake_get_db_error():
        raise Exception("Error de BD")

    monkeypatch.setattr(
        "app.controllers.User.Educacion.educacion.get_db",
        fake_get_db_error
    )

    resp = client.get("/api/contenido_tema")
    assert resp.status_code == 500

    body = resp.get_json()
    assert "error" in body
