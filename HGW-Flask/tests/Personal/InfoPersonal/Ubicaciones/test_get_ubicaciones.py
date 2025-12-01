import pytest

DIR = "app.controllers.User.Personal.personal"

def test_get_ubicaciones_exitoso(monkeypatch, client, fake_conn):
    """
    Caso exitoso: debe retornar países y sus ciudades.
    """

    # Respuestas simuladas:
    # Primera consulta → países
    # Las siguientes consultas → ciudades de cada país
    fake_conn.set_fetchall_responses([
        [  # países
            {"id_ubicacion": 1, "nombre": "Colombia"},
            {"id_ubicacion": 2, "nombre": "México"}
        ],
        [  # ciudades de Colombia
            {"id_ubicacion": 10, "nombre": "Bogotá"},
            {"id_ubicacion": 11, "nombre": "Medellín"}
        ],
        [  # ciudades de México
            {"id_ubicacion": 20, "nombre": "CDMX"},
            {"id_ubicacion": 21, "nombre": "Guadalajara"}
        ]
    ])

    monkeypatch.setattr(f"{DIR}.get_db", lambda: fake_conn)

    resp = client.get("/api/ubicaciones")
    assert resp.status_code == 200

    data = resp.get_json()
    assert data["success"] is True

    ubic = data["ubicaciones"]

    assert "Colombia" in ubic
    assert "México" in ubic
    assert ubic["Colombia"] == ["Bogotá", "Medellín"]
    assert ubic["México"] == ["CDMX", "Guadalajara"]


def test_get_ubicaciones_sin_ciudades(monkeypatch, client, fake_conn):
    """
    Caso donde el país existe pero no tiene ciudades asociadas.
    """

    fake_conn.set_fetchall_responses([
        [  # países
            {"id_ubicacion": 1, "nombre": "Colombia"}
        ],
        [  # ciudades vacías
        ]
    ])

    monkeypatch.setattr(f"{DIR}.get_db", lambda: fake_conn)

    resp = client.get("/api/ubicaciones")
    assert resp.status_code == 200

    data = resp.get_json()
    assert data["ubicaciones"]["Colombia"] == []


def test_get_ubicaciones_error(monkeypatch, client):
    """
    Error en base de datos.
    """

    monkeypatch.setattr(
        f"{DIR}.get_db",
        lambda: (_ for _ in ()).throw(Exception("DB caída"))
    )

    resp = client.get("/api/ubicaciones")

    assert resp.status_code == 500
    assert resp.get_json()["success"] is False
