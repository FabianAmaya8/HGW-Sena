from flask import Blueprint, request, jsonify, current_app
from app.controllers.db import get_db 
carrito_bp = Blueprint("carrito_bp", __name__)

@carrito_bp.route("/api/carrito/agregar", methods=["POST"])
def agregar_producto_carrito():
    connection = get_db()
    datos = request.get_json()

    id_usuario = datos.get("id_usuario")
    id_producto = datos.get("id_producto")
    cantidad = datos.get("cantidad", 1)

    if not all([id_usuario, id_producto]):
        return jsonify({"error": "Faltan datos obligatorios"}), 400

    try:
        with connection.cursor() as cursor:
            # Buscar el carrito del usuario
            cursor.execute("SELECT id_carrito FROM carrito_compras WHERE id_usuario = %s", (id_usuario,))
            carrito = cursor.fetchone()

            if not carrito:
                cursor.execute("INSERT INTO carrito_compras (id_usuario) VALUES (%s)", (id_usuario,))
                connection.commit()
                cursor.execute("SELECT id_carrito FROM carrito_compras WHERE id_usuario = %s", (id_usuario,))
                carrito = cursor.fetchone()

            id_carrito = carrito["id_carrito"]

            # Verificar si el producto ya está en el carrito
            cursor.execute("""
                SELECT cantidad_producto FROM productos_carrito
                WHERE producto = %s AND carrito = %s
            """, (id_producto, id_carrito))
            existente = cursor.fetchone()

            if existente:
                nueva_cantidad = existente["cantidad_producto"] + cantidad
                cursor.execute("""
                    UPDATE productos_carrito
                    SET cantidad_producto = %s
                    WHERE producto = %s AND carrito = %s
                """, (nueva_cantidad, id_producto, id_carrito))
            else:
                cursor.execute("""
                    INSERT INTO productos_carrito (producto, cantidad_producto, carrito)
                    VALUES (%s, %s, %s)
                """, (id_producto, cantidad, id_carrito))

            connection.commit()

        return jsonify({"mensaje": "Producto agregado al carrito en la base de datos"}), 200

    except Exception as e:
        current_app.logger.error(str(e))
        return jsonify({"error": "Error interno al guardar en el carrito"}), 500
