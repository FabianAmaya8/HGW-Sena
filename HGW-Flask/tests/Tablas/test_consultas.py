import pytest

def test_consultas_con_foreign(client, monkeypatch):
    # -----------------------------
    # Fake tabla y fake objetos
    # -----------------------------
    class FakeObj:
        id = 1
        nombre = "Producto X"
        categoria = 2

        __table__ = type("T", (), {"columns": []})

    class FakeTabla:
        __table__ = type("T", (), {"columns": []})

    # fake resultados simulados por SQLAlchemy
    fake_result = [FakeObj()]

    # -----------------------------
    # Mock tablas.classes
    # -----------------------------
    monkeypatch.setattr(
        "app.models.tablas.classes",
        {"productos": FakeTabla}
    )

    # -----------------------------
    # Mock serializar_con_fk_lookup
    # -----------------------------
    def fake_serializar(objetos):
        return [{"id": 1, "nombre": "Producto X"}]

    monkeypatch.setattr(
        "app.models.tablas.serializar_con_fk_lookup",
        fake_serializar
    )

    # -----------------------------
    # Mock db.session.query(...).filter(...).all()
    # -----------------------------
    class FakeQuery:
        def filter(self, *args, **kwargs):
            return self

        def all(self):
            return fake_result

    class FakeSession:
        def query(self, tabla):
            return FakeQuery()
        
        def remove(self):
            pass

    monkeypatch.setattr(
        "app.models.tablas.db.session",
        FakeSession()
    )

    # -----------------------------
    # Ejecutar petición
    # -----------------------------
    body = {
        "table": "productos",
        "columnDependency": "categoria",
        "foreign": 2
    }

    response = client.post("/consultas", json=body)
    data = response.get_json()

    assert response.status_code == 200
    assert "productos" in data
    assert data["productos"][0]["id"] == 1
    assert data["productos"][0]["nombre"] == "Producto X"


def test_consultas_sin_foreign(client, monkeypatch):
    class FakeObj:
        id = 10
        nombre = "Categoría Y"
        __table__ = type("T", (), {"columns": []})

    class FakeTabla:
        __table__ = type("T", (), {"columns": []})

    monkeypatch.setattr(
        "app.models.tablas.classes",
        {"categorias": FakeTabla}
    )

    def fake_serializar(objetos):
        return [{"id": 10, "nombre": "Categoría Y"}]

    monkeypatch.setattr(
        "app.models.tablas.serializar_con_fk_lookup",
        fake_serializar
    )

    class FakeQuery:
        def all(self):
            return [FakeObj()]

    class FakeSession:
        def query(self, tabla):
            return FakeQuery()
        
        def remove(self):
            pass

    monkeypatch.setattr(
        "app.models.tablas.db.session",
        FakeSession()
    )

    body = [
        {"table": "categorias"}
    ]

    response = client.post("/consultas", json=body)
    data = response.get_json()

    assert response.status_code == 200
    assert "categorias" in data
    assert data["categorias"][0]["id"] == 10
    assert data["categorias"][0]["nombre"] == "Categoría Y"


def test_consultas_tabla_no_existe(client, monkeypatch):
    monkeypatch.setattr("app.models.tablas.classes", {})

    body = {
        "table": "noexiste",
        "columnDependency": "x",
        "foreign": 1
    }

    response = client.post("/consultas", json=body)

    assert response.status_code == 400
    assert "Tabla 'noexiste' no encontrada" in response.get_json()["error"]
