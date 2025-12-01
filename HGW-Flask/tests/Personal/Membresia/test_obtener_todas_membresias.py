import pytest
from decimal import Decimal

# ================================
# GET /api/membresias
# ================================

def test_obtener_todas_membresias_exitoso(monkeypatch, client, fake_conn):

    fake_conn.set_fetchall_responses([
        [
            {
                "id_membresia": 1,
                "nombre_membresia": "Bronce",
                "precio_membresia": Decimal("19.99"),
                "bv": Decimal("50")
            },
            {
                "id_membresia": 2,
                "nombre_membresia": "Plata",
                "precio_membresia": Decimal("39.99"),
                "bv": Decimal("120")
            }
        ]
    ])

    monkeypatch.setattr(
        "app.controllers.User.Personal.membresia.get_db",
        lambda: fake_conn
    )

    resp = client.get("/api/membresias")
    body = resp.get_json()

    assert resp.status_code == 200
    assert body["success"] is True
    assert isinstance(body["membresias"], list)
    assert isinstance(body["membresias"][0]["precio_membresia"], float)


def test_obtener_todas_membresias_error(monkeypatch, client):

    def fake_error():
        raise Exception("DB caída")

    monkeypatch.setattr(
        "app.controllers.User.Personal.membresia.get_db",
        fake_error
    )

    resp = client.get("/api/membresias")
    assert resp.status_code == 500
    assert resp.get_json()["success"] is False
