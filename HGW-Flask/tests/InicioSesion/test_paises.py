import pytest
from sqlalchemy import text

def test_api_ubicacion_paises_exitoso(monkeypatch, client):

    fake_rows = [
        {"id_ubicacion": 1, "nombre": "Colombia"},
        {"id_ubicacion": 2, "nombre": "México"}
    ]

    # === Fake row con atributo _mapping ===
    class FakeRow:
        def __init__(self, data):
            self._mapping = data

    # === Fake result iterable ===
    class FakeResult:
        def __iter__(self):
            for r in fake_rows:
                yield FakeRow(r)

    # === Fake session con execute() y remove() ===
    class FakeSession:
        def execute(self, query):
            return FakeResult()

        def remove(self):
            pass  # Flask-SQLAlchemy lo llamará

    # Monkeypatch a db.session
    monkeypatch.setattr(
        "app.controllers.User.InicioSesion.register.db.session",
        FakeSession()
    )

    resp = client.get("/api/ubicacion/paises")

    assert resp.status_code == 200
    assert resp.get_json() == fake_rows


def test_api_ubicacion_paises_error(monkeypatch, client):

    class FakeSession:
        def execute(self, query):
            raise Exception("DB caída")

        def remove(self):
            pass  # evitar error en teardown

    monkeypatch.setattr(
        "app.controllers.User.InicioSesion.register.db.session",
        FakeSession()
    )

    resp = client.get("/api/ubicacion/paises")
    body = resp.get_json()

    assert resp.status_code == 500
    assert body["error"] == "DB caída"
