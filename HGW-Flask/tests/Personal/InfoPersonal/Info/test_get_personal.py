import pytest
from decimal import Decimal

DIR = "app.controllers.User.Personal.personal"

def test_get_personal_exitoso(monkeypatch, client, fake_conn):
    # 1) SELECT usuario
    fake_conn.set_fetchone_responses([
        {
            "id_usuario": 1,
            "nombre": "Fabian",
            "apellido": "Amaya",
            "nombre_usuario": "fabian",
            "pss": "hashed",
            "correo_electronico": "f@f.com",
            "numero_telefono": "123",
            "url_foto_perfil": None,
            "patrocinador": None,
            "bv_acumulados": Decimal("100"),
            "nombre_medio": "Nequi"
        },
        # 3) SELECT membresía
        {
            "membresia": 1,
            "nombre_membresia": "Bronce",
            "bv_requeridos": Decimal("200"),
            "precio_membresia": Decimal("50000"),
            "bv_acumulados": Decimal("100"),
            "proxima_membresia": "Plata"
        }
    ])

    # 2) fetchall → direcciones
    fake_conn.set_fetchall_responses([
        [  # Direcciones
            {
                "id_direccion": 1,
                "direccion": "Calle 10",
                "codigo_postal": "110111",
                "lugar_entrega": "Casa",
                "ciudad_id": 10,
                "pais_id": 20,
                "ciudad": "Bogotá",
                "pais": "Colombia"
            }
        ],
        [  # historial BV
            {
                "bv_ganados": 10,
                "fecha_transaccion": "2024-10-01",
                "descripcion": "Compra"
            }
        ]
    ])

    # Mock DB
    monkeypatch.setattr(f"{DIR}.get_db", lambda: fake_conn)

    resp = client.get("/api/personal?id=1")

    assert resp.status_code == 200
    json_data = resp.get_json()
    assert json_data["success"] is True
    assert json_data["usuario"]["nombre"] == "Fabian"
    assert len(json_data["usuario"]["direcciones"]) == 1


def test_get_personal_sin_id(client):
    resp = client.get("/api/personal")
    assert resp.status_code == 400


def test_get_personal_no_existe(monkeypatch, client, fake_conn):
    fake_conn.set_fetchone_responses([None])

    monkeypatch.setattr(f"{DIR}.get_db", lambda: fake_conn)

    resp = client.get("/api/personal?id=99")

    assert resp.status_code == 404


def test_get_personal_error(monkeypatch, client):
    monkeypatch.setattr(
        f"{DIR}.get_db",
        lambda: (_ for _ in ()).throw(Exception("DB caída"))
    )

    resp = client.get("/api/personal?id=1")

    assert resp.status_code == 500
    assert resp.get_json()["success"] is False
