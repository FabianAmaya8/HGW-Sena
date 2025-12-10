import io
import json
import types

def test_registros_exitoso(client, monkeypatch):
    class FakeTabla:
        def __init__(self):
            self.nombre = None
            self.edad = None
            self.avatar = None

    fake_classes = {"usuarios": FakeTabla}

    monkeypatch.setattr(
        "app.models.tablas.classes",
        fake_classes
    )

    def fake_upload(file, folder):
        return ("https://fake-bucket/avatar.png", "avatar.png")

    monkeypatch.setattr(
        "app.models.tablas.upload_image_to_supabase",
        fake_upload
    )

    class FakeSession:
        def __init__(self):
            self.add_called = False
            self.commit_called = False

        def add(self, x):
            self.add_called = True

        def commit(self):
            self.commit_called = True

        def remove(self):
            pass

    fake_session = FakeSession()

    monkeypatch.setattr(
        "app.models.tablas.db.session",
        fake_session
    )

    data = {
        "table": "usuarios",
        "nombre": "John",
        "edad": "25",
        "req": "123"
    }

    img = (io.BytesIO(b"fake image bytes"), "foto.png")

    response = client.post(
        "/registro",
        data={**data, "avatar": img},
        content_type="multipart/form-data"
    )

    assert response.status_code == 200
    json_data = response.get_json()
    assert json_data["respuesta"] == "Se registró correctamente"
    assert fake_session.add_called
    assert fake_session.commit_called

def test_registros_tabla_no_existe(client, monkeypatch):
    monkeypatch.setattr(
        "app.models.tablas.classes",
        {}
    )
    resp = client.post(
        "/registro",
        data={"table": "no_existe"},
        content_type="multipart/form-data"
    )
    assert resp.status_code == 400
    assert "Tabla 'no_existe' no encontrada" in resp.get_json()["error"]
