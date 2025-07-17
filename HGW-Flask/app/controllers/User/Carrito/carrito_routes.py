from flask import Blueprint, request, jsonify, current_app
from app.controllers.db import get_db
import traceback

carrito_bp = Blueprint("carrito_bp", __name__)

@carrito_bp.route("/api/carrito", methods=["GET"])
def obtener_carrito():
    connection = get_db()
    id_usuario = request.args.get("id", type=int)

    if not id_usuario:
        return jsonify({"error": "Faltan datos obligatorios"}), 400

    try:
        with connection.cursor() as cursor:
            # 1. Obtener los productos inactivos que serán eliminados
            cursor.execute("""
                SELECT p.nombre_producto
                FROM productos_carrito pc
                JOIN productos p ON p.id_producto = pc.producto
                JOIN carrito_compras cc ON pc.carrito = cc.id_carrito
                WHERE cc.id_usuario = %s AND p.activo = 0 OR p.stock = 0
            """, (id_usuario,))
            productos_eliminados = cursor.fetchall()
            nombres_eliminados = [p["nombre_producto"] for p in productos_eliminados]

            # 2. Eliminar productos inactivos del carrito
            cursor.execute("""
                DELETE pc FROM productos_carrito pc
                JOIN productos p ON p.id_producto = pc.producto
                JOIN carrito_compras cc ON pc.carrito = cc.id_carrito
                WHERE cc.id_usuario = %s AND p.activo = 0 OR p.stock = 0
            """, (id_usuario,))
            connection.commit()

            # 3. Obtener los productos activos
            cursor.execute("""
                SELECT p.id_producto, p.nombre_producto, 
                        p.imagen_producto, p.precio_producto, pc.cantidad_producto,
                        p.stock
                FROM productos_carrito pc
                JOIN productos p ON p.id_producto = pc.producto
                JOIN carrito_compras cc ON pc.carrito = cc.id_carrito
                WHERE cc.id_usuario = %s AND p.activo = 1
            """, (id_usuario,))
            productos = cursor.fetchall()

            respuesta = {"success": True, "productos": productos}

            # 4. Si se eliminaron productos, informar al usuario
            if nombres_eliminados:
                respuesta["eliminados"] = nombres_eliminados
                respuesta["mensaje"] = "Algunos productos ya no están disponibles y fueron eliminados del carrito."

            if not productos:
                respuesta["mensaje"] = respuesta.get("mensaje", "") + " El carrito está vacío."

            return jsonify(respuesta)

    except Exception as e:
        current_app.logger.error(f"Error al obtener el carrito: {str(e)}")
        return jsonify({"error": "Error al obtener el carrito"}), 500

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
    
@carrito_bp.route("/api/carrito/eliminar", methods=["DELETE"])
def eliminar_producto_carrito():
    connection = get_db()
    datos = request.get_json()

    id_usuario = datos.get("id_usuario")
    id_producto = datos.get("id_producto")

    if not all([id_usuario, id_producto]):
        return jsonify({"error": "Faltan datos obligatorios"}), 400

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                DELETE pc FROM productos_carrito pc
                JOIN carrito_compras cc ON pc.carrito = cc.id_carrito
                WHERE cc.id_usuario = %s AND pc.producto = %s
            """, (id_usuario, id_producto))
            connection.commit()

        return jsonify({"mensaje": "Producto eliminado del carrito"}), 200
    except Exception as e:
        current_app.logger.error(f"Error al eliminar producto: {str(e)}")
        return jsonify({"error": "Error interno al eliminar producto"}), 500

@carrito_bp.route("/api/carrito/actualizar", methods=["PUT"])
def actualizar_cantidad_carrito():
    connection = get_db()
    datos = request.get_json()

    id_usuario = datos.get("id_usuario")
    id_producto = datos.get("id_producto")
    nueva_cantidad = datos.get("nueva_cantidad")

    if not all([id_usuario, id_producto, nueva_cantidad]):
        return jsonify({"error": "Faltan datos obligatorios"}), 400

    if nueva_cantidad <= 0:
        return jsonify({"error": "La cantidad debe ser mayor a 0"}), 400

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                UPDATE productos_carrito pc
                JOIN carrito_compras cc ON pc.carrito = cc.id_carrito
                SET pc.cantidad_producto = %s
                WHERE cc.id_usuario = %s AND pc.producto = %s
            """, (nueva_cantidad, id_usuario, id_producto))
            connection.commit()

        return jsonify({"mensaje": "Cantidad actualizada"}), 200
    except Exception as e:
        current_app.logger.error(f"Error al actualizar cantidad: {str(e)}")
        return jsonify({"error": "Error interno al actualizar cantidad"}), 500

@carrito_bp.route("/api/direcciones", methods=["GET"])
def obtener_direcciones():
    id_usuario = request.args.get("id", type=int)
    connection = get_db()
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    d.id_usuario,d.id_direccion, d.direccion, d.codigo_postal, d.lugar_entrega,
                    ciudad.id_ubicacion AS ciudad_id, pais.id_ubicacion AS pais_id,
                    ciudad.nombre AS ciudad, pais.nombre AS pais
                FROM direcciones d
                LEFT JOIN ubicaciones ciudad ON d.id_ubicacion = ciudad.id_ubicacion
                LEFT JOIN ubicaciones pais ON ciudad.ubicacion_padre = pais.id_ubicacion
                WHERE d.id_usuario = %s
            """, (id_usuario,))
            direcciones = cursor.fetchall()

        return jsonify({"success": True, "direcciones": direcciones}), 200
    except Exception as e:
        current_app.logger.error(f"Error al obtener direcciones: {str(e)}")
        return jsonify({"success": False, "error": "Error al obtener direcciones"}), 500

@carrito_bp.route("/api/ordenes", methods=["POST"])
def crear_orden():
    connection = get_db()
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No se recibieron datos"}), 400

    # Validar campos obligatorios
    required_fields = ["id_usuario", "id_direccion", "id_medio_pago", "total", "items"]
    missing_fields = [field for field in required_fields if field not in data]
    
    if missing_fields:
        return jsonify({
            "error": "Datos incompletos",
            "faltan": missing_fields,
            "recibido": data
        }), 400

    try:
        # Extraer datos del payload
        id_usuario = int(data["id_usuario"])
        id_direccion = int(data["id_direccion"])
        id_medio_pago = int(data["id_medio_pago"])
        total = float(data["total"])
        items = data["items"]

        # Validar items
        if not isinstance(items, list) or len(items) == 0:
            return jsonify({"error": "Items debe ser una lista no vacía"}), 400

        with connection.cursor() as cursor:
            # Insertar orden principal
            cursor.execute(
                "INSERT INTO ordenes (id_usuario, id_direccion, id_medio_pago, total) VALUES (%s, %s, %s, %s)",
                (id_usuario, id_direccion, id_medio_pago, total)
            )
            connection.commit()
            
            # Obtener ID de la orden creada
            cursor.execute("SELECT LAST_INSERT_ID() AS id_orden")
            id_orden = cursor.fetchone()["id_orden"]

            # Insertar productos de la orden
            sql = """
                INSERT INTO ordenes_productos 
                (id_orden, id_producto, cantidad, precio_unitario) 
                VALUES (%s, %s, %s, %s)
            """
            for item in items:
                cursor.execute(sql, (
                    id_orden, 
                    int(item["id_producto"]), 
                    int(item["cantidad"]), 
                    float(item["precio_unitario"])
                ))
            
            connection.commit()

            # Eliminar carrito
            cursor.execute("DELETE FROM carrito_compras WHERE id_usuario = %s", (id_usuario,))
            connection.commit()

            # Crear carrito vacio
            cursor.execute("INSERT INTO carrito_compras (id_usuario) VALUES (%s)", (id_usuario,))
            connection.commit()

        return jsonify({"id_orden": id_orden}), 201
        
    except Exception as e:
        current_app.logger.error(f"Error al crear orden: {str(e)}")
        return jsonify({"error": "Error interno al procesar la orden"}), 500
    
@carrito_bp.route("/api/medios-pago", methods=["GET"])
def listar_medios_pago():

    conn = current_app.config["MYSQL_CONNECTION"]
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT id_medio, nombre_medio FROM medios_pago")

            medios = cursor.fetchall()
        return jsonify(medios), 200

    except Exception as e:
        current_app.logger.error(f"Error listando medios de pago: {e}")
        return jsonify({"error": "No se pudieron cargar los medios"}), 500