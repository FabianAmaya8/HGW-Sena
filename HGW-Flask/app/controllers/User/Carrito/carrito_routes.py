from flask import Blueprint, request, jsonify, current_app
from app.controllers.db import get_db
import traceback

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
            cursor.execute("SELECT id_carrito FROM carrito_compras WHERE id_usuario = %s", (id_usuario,))
            carrito = cursor.fetchone()

            if not carrito:
                cursor.execute("INSERT INTO carrito_compras (id_usuario) VALUES (%s)", (id_usuario,))
                connection.commit()
                cursor.execute("SELECT id_carrito FROM carrito_compras WHERE id_usuario = %s", (id_usuario,))
                carrito = cursor.fetchone()

            id_carrito = carrito["id_carrito"]

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

@carrito_bp.route("/api/direcciones/<int:id_usuario>", methods=["GET"])
def obtener_direcciones(id_usuario):
    connection = get_db()
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id_direccion, direccion, codigo_postal, id_ubicacion, lugar_entrega
                FROM direcciones
                WHERE id_usuario = %s
            """, (id_usuario,))

            columns = [desc[0] for desc in cursor.description]
            direcciones = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return jsonify(direcciones), 200
    except Exception as e:
        current_app.logger.error(f"Error al obtener direcciones: {str(e)}")
        return jsonify({"error": "Error al obtener direcciones"}), 500

@carrito_bp.route("/api/direcciones", methods=["POST"])
def guardar_direccion():
    connection = get_db()

    try:
        datos = request.get_json()
        if not datos:
            return jsonify({"error": "No se recibieron datos JSON"}), 400

        campos_requeridos = ["id_usuario", "direccion", "codigo_postal", "id_ubicacion", "lugar_entrega"]
        for campo in campos_requeridos:
            valor = datos.get(campo)
            if valor is None:
                return jsonify({"error": f"Campo '{campo}' es requerido"}), 400
            if isinstance(valor, str) and valor.strip() == "":
                return jsonify({"error": f"Campo '{campo}' no puede estar vacío"}), 400

        try:
            id_ubicacion = int(datos["id_ubicacion"])
        except (ValueError, TypeError):
            return jsonify({"error": "id_ubicacion debe ser un número válido"}), 400

        try:
            id_usuario = int(datos["id_usuario"])
        except (ValueError, TypeError):
            return jsonify({"error": "id_usuario debe ser un número válido"}), 400

        with connection.cursor() as cursor:
            cursor.execute("SELECT id_usuario FROM usuarios WHERE id_usuario = %s", (id_usuario,))
            if not cursor.fetchone():
                return jsonify({"error": "El usuario no existe"}), 400

            cursor.execute("SELECT id_ubicacion FROM ubicaciones WHERE id_ubicacion = %s", (id_ubicacion,))
            if not cursor.fetchone():
                return jsonify({"error": "La ubicación no existe"}), 400

        lugares_validos = ['Casa', 'Apartamento', 'Hotel', 'Oficina', 'Otro']
        if datos["lugar_entrega"] not in lugares_validos:
            return jsonify({"error": f"lugar_entrega debe ser uno de: {', '.join(lugares_validos)}"}), 400

        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO direcciones (id_usuario, direccion, codigo_postal, id_ubicacion, lugar_entrega)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                id_usuario,
                datos["direccion"].strip(),
                datos["codigo_postal"].strip(),
                id_ubicacion,
                datos["lugar_entrega"]
            ))
            connection.commit()

            cursor.execute("SELECT LAST_INSERT_ID() AS id_direccion")
            nueva_id = cursor.fetchone()["id_direccion"]

            cursor.execute("""
                SELECT id_direccion, direccion, codigo_postal, id_ubicacion, lugar_entrega
                FROM direcciones
                WHERE id_direccion = %s
            """, (nueva_id,))

            columns = [desc[0] for desc in cursor.description]
            row = cursor.fetchone()
            if not row:
                return jsonify({"error": "Error al recuperar la dirección creada"}), 500

            nueva_direccion = dict(zip(columns, row))

        return jsonify(nueva_direccion), 201

    except Exception as e:
        current_app.logger.error(f"Error al guardar dirección: {str(e)}")
        current_app.logger.error(f"Traceback: {traceback.format_exc()}")
        return jsonify({"error": f"Error interno del servidor: {str(e)}"}), 500

@carrito_bp.route("/api/direcciones/<int:id_direccion>", methods=["DELETE"])
def eliminar_direccion(id_direccion):
    connection = get_db()

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT id_direccion FROM direcciones WHERE id_direccion = %s", (id_direccion,))
            if not cursor.fetchone():
                return jsonify({"error": "La dirección no existe"}), 404

            cursor.execute("DELETE FROM direcciones WHERE id_direccion = %s", (id_direccion,))
            connection.commit()

            if cursor.rowcount == 0:
                return jsonify({"error": "No se pudo eliminar la dirección"}), 400

        return jsonify({"mensaje": "Dirección eliminada exitosamente"}), 200

    except Exception as e:
        current_app.logger.error(f"Error al eliminar dirección: {str(e)}")
        return jsonify({"error": "Error interno del servidor"}), 500