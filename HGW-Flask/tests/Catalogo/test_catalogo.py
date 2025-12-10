import pytest

def test_catalogo_exitoso(monkeypatch, client, fake_conn):
    fake_data = [
        {"id_categoria": 1, "nombre_categoria": "Bebidas",
            "id_subcategoria": 10, "nombre_subcategoria": "Jugos"},
        {"id_categoria": 2, "nombre_categoria": "Frutas",
            "id_subcategoria": 20, "nombre_subcategoria": "Cítricos"},
    ]

    fake_conn.set_fetchall_responses([fake_data])

    monkeypatch.setattr("app.controllers.User.Catalogo.catalogo.get_db", lambda: fake_conn)

    resp = client.get("/api/catalogo")

    assert resp.status_code == 200
    body = resp.get_json()

    assert isinstance(body, list)
    assert len(body) == 2
    assert body[0]["nombre_categoria"] == "Bebidas"


def test_catalogo_vacio(monkeypatch, client, fake_conn):
    fake_conn.set_fetchall_responses([[]])

    monkeypatch.setattr("app.controllers.User.Catalogo.catalogo.get_db", lambda: fake_conn)

    resp = client.get("/api/catalogo")
    assert resp.status_code == 200

    body = resp.get_json()
    assert body == []


def test_catalogo_error_bd(monkeypatch, client):

    class FakeBadConn:
        def cursor(self):
            raise Exception("Error de prueba")

    monkeypatch.setattr("app.controllers.User.Catalogo.catalogo.get_db", lambda: FakeBadConn())

    resp = client.get("/api/catalogo")
    assert resp.status_code == 200
    assert "Error de prueba" in resp.get_data(as_text=True)
