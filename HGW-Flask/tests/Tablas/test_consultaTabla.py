import pytest
import types

# ------------------------------------------------------
# CASO 1: Tabla no existe
# ------------------------------------------------------
def test_consultaTabla_tabla_no_existe(client, monkeypatch):
    monkeypatch.setattr("app.models.tablas.classes", {})

    resp = client.post("/consultaTabla", json={"table": "fantasma"})
    data = resp.get_json()

    assert resp.status_code == 400
    assert "Tabla 'fantasma' no encontrada" in data["error"]


# ------------------------------------------------------
# CASO 2: Tabla = ordenes  (usa query especial)
# ------------------------------------------------------
def test_consultaTabla_ordenes_query_especial(client, monkeypatch):
    # fake tabla (no se usa realmente, solo la clave importa)
    monkeypatch.setattr(
        "app.models.tablas.classes",
        {"ordenes": object}
    )

    # fake resultado de query
    fake_rows = [
        {
            "id_orden": 1,
            "usuario": "Juan Pérez",
            "correo_electronico": "juan@test.com",
            "total": 150000,
            "fecha_creacion": "2024-01-01 10:00",
            "medio_pago": "Nequi"
        }
    ]

    class FakeResult:
        def keys(self):
            return fake_rows[0].keys()

        def __iter__(self):
            for row in fake_rows:
                yield types.SimpleNamespace(_mapping=row)

    def fake_execute(query):
        return FakeResult()

    # mock DB
    class FakeSession:
        def execute(self, query):
            return fake_execute(query)

        def remove(self):
            pass

    monkeypatch.setattr("app.models.tablas.db.session", FakeSession())

    resp = client.post("/consultaTabla", json={"table": "ordenes"})
    data = resp.get_json()

    assert resp.status_code == 200
    assert "filas" in data
    assert "columnas" in data
    assert data["filas"][0]["usuario"] == "Juan Pérez"


# ------------------------------------------------------
# CASO 3: Tabla normal (serializar_con_fk_lookup)
# ------------------------------------------------------
def test_consultaTabla_tabla_normal(client, monkeypatch):
    # ---------- Fake tabla con columnas simuladas ----------
    class FakeColumn:
        def __init__(self, name):
            self.name = name

    class FakeColumns:
        def __init__(self):
            self._cols = {
                "id": FakeColumn("id"),
                "nombre": FakeColumn("nombre")
            }

        def __iter__(self):
            return iter(self._cols.values())

    class FakeTableObj:
        def __init__(self):
            # Se asegura de que __table__ sea una instancia, no una clase
            self.__table__ = types.SimpleNamespace(columns = FakeColumns())

    fake_tabla = FakeTableObj()

    monkeypatch.setattr(
        "app.models.tablas.classes",
        {"categorias": fake_tabla}
    )

    # ---------- Mock serializar ----------
    def fake_serializar(lista):
        return [{"id": 10, "nombre": "Categoría Test"}]

    monkeypatch.setattr(
        "app.models.tablas.serializar_con_fk_lookup",
        fake_serializar
    )

    # ---------- Fake query ----------
    class FakeObj:
        id = 10
        nombre = "Categoría Test"

    class FakeQuery:
        def all(self):
            return [FakeObj()]

    class FakeSession:
        def query(self, tabla):
            return FakeQuery()
        def remove(self):
            pass

    monkeypatch.setattr("app.models.tablas.db.session", FakeSession())

    resp = client.post("/consultaTabla", json={"table": "categorias"})
    data = resp.get_json()

    assert resp.status_code == 200
    assert "filas" in data
    assert "columnas" in data

    # Verifica que los valores serializados estén presentes
    assert data["filas"][0]["id"] == 10
    assert data["filas"][0]["nombre"] == "Categoría Test"

    # Verifica que entre las columnas haya “nombre”
    assert any(col["field"] == "nombre" for col in data["columnas"])
    assert any(col["field"] == "id" for col in data["columnas"])
