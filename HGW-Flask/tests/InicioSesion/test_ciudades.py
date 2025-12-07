import pytest

def test_api_ubicacion_ciudades_todas(monkeypatch, client, fake_conn):
    fake_conn.set_fetchall_responses([
        [
            {"id_ubicacion": 10, "nombre": "Bogotá", "ubicacion_padre": 1},
            {"id_ubicacion": 11, "nombre": "Medellín", "ubicacion_padre": 1}
        ]
    ])

    monkeypatch.setattr(
        "app.controllers.User.InicioSesion.register.get_db",
        lambda: fake_conn
    )

    resp = client.get("/api/ubicacion/ciudades")

    assert resp.status_code == 200
    assert resp.get_json()[0]["nombre"] == "Bogotá"


def test_api_ubicacion_ciudades_por_pais(monkeypatch, client, fake_conn):
    fake_conn.set_fetchall_responses([
        [
            {"id_ubicacion": 22, "nombre": "Santiago", "ubicacion_padre": 5}
        ]
    ])

    monkeypatch.setattr(
        "app.controllers.User.InicioSesion.register.get_db",
        lambda: fake_conn
    )

    resp = client.get("/api/ubicacion/ciudades?paisId=5")

    assert resp.status_code == 200
    assert resp.get_json()[0]["ubicacion_padre"] == 5


def test_api_ubicacion_ciudades_error(monkeypatch, client):
    def fake_error():
        raise Exception("DB caída")

    monkeypatch.setattr(
        "app.controllers.User.InicioSesion.register.get_db",
        fake_error
    )

    resp = client.get("/api/ubicacion/ciudades")
    assert resp.status_code == 500

    body = resp.get_json()
    assert "error" in body