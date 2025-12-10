import pytest
from decimal import Decimal

# ================================
# GET /api/membresia?id=#
# ================================

def test_obtener_membresia_sin_id(client):
    resp = client.get("/api/membresia")  
    assert resp.status_code == 400
    assert resp.get_json()["success"] is False


def test_obtener_membresia_no_existe(monkeypatch, client, fake_conn):

    fake_conn.set_fetchone_responses([None])

    monkeypatch.setattr(
        "app.controllers.User.Personal.membresia.get_db",
        lambda: fake_conn
    )

    resp = client.get("/api/membresia?id=5")
    assert resp.status_code == 404
    assert resp.get_json()["success"] is False


def test_obtener_membresia_exitoso(monkeypatch, client, fake_conn):

    fake_conn.set_fetchone_responses([
        {
            "id_membresia": 1,
            "nombre_membresia": "Bronce",
            "precio_membresia": Decimal("20.5"),
            "bv_requeridos": Decimal("100.0"),
            "bv_acumulados": Decimal("50.0"),
            "proxima_membresia": "Plata"
        }
    ])

    monkeypatch.setattr(
        "app.controllers.User.Personal.membresia.get_db",
        lambda: fake_conn
    )

    resp = client.get("/api/membresia?id=1")
    body = resp.get_json()

    assert resp.status_code == 200
    assert body["success"] is True
    assert body["membresia"]["nombre_membresia"] == "Bronce"
    assert isinstance(body["membresia"]["precio_membresia"], float)


def test_obtener_membresia_error(monkeypatch, client):

    def fake_error():
        raise Exception("DB caída")

    monkeypatch.setattr(
        "app.controllers.User.Personal.membresia.get_db",
        fake_error
    )

    resp = client.get("/api/membresia?id=1")
    assert resp.status_code == 500
    assert resp.get_json()["success"] is False
