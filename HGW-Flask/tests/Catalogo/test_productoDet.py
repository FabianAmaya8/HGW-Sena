import json

def test_producto_unico_exitoso(monkeypatch, client, fake_conn):
    # Datos simulados del producto
    fake_product = {
        "id_producto": 5,
        "nombre": "Gaseosa Cola",
        "precio": 2500,
        "puntos_bv": 8,
        "imagen": "cola.png",
        "imagenes": "img1.png,img2.png",
        "descripcion": "Bebida refrescante",
        "stock": 50,
        "categoria": "Bebidas",
        "subcategoria": "Gaseosas"
    }

    # Configurar respuesta del cursor
    fake_conn.set_fetchone_responses([fake_product])

    # Parche del get_db correcto
    monkeypatch.setattr(
        "app.controllers.User.Catalogo.productoDet.get_db",
        lambda: fake_conn
    )

    resp = client.get("/api/producto/unico?id=5")

    assert resp.status_code == 200
    body = resp.get_json()

    assert body["id_producto"] == 5
    assert body["nombre"] == "Gaseosa Cola"
    assert body["imagenes"] == ["img1.png", "img2.png"]

def test_producto_unico_no_encontrado(monkeypatch, client, fake_conn):
    # No se encontró, fetchone devuelve None
    fake_conn.set_fetchone_responses([None])

    monkeypatch.setattr(
        "app.controllers.User.Catalogo.productoDet.get_db",
        lambda: fake_conn
    )

    resp = client.get("/api/producto/unico?id=999")

    assert resp.status_code == 404
    body = resp.get_json()
    assert "error" in body
    assert body["error"] == "Producto no encontrado"

def test_producto_unico_error_bd(monkeypatch, client):

    class FakeBadConn:
        def cursor(self):
            raise Exception("Falla crítica")

    monkeypatch.setattr(
        "app.controllers.User.Catalogo.productoDet.get_db",
        lambda: FakeBadConn()
    )

    resp = client.get("/api/producto/unico?id=5")

    assert resp.status_code == 500
    body = resp.get_json()
    assert "error" in body
    assert "Falla crítica" in body["error"]
