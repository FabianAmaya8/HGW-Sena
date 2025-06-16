from flask import Blueprint, request, jsonify, current_app
from decimal import Decimal

from .utils.datosProductos import obtener_productos

user_bp = Blueprint('user_bp', __name__)

@user_bp.route("/api/header", methods=["GET"])
def obtener_usuario():
    user_id = request.args.get("id", type=int)

    if not user_id:
        return jsonify({"success": False, "message": "ID de usuario no proporcionado"}), 400

    connection = current_app.config['MYSQL_CONNECTION']
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT url_foto_perfil FROM usuarios
                WHERE id_usuario = %s
            """, (user_id,))
            user = cursor.fetchone()

            if not user:
                return jsonify({"success": False, "message": "Usuario no encontrado"}), 404

            if user.get("activo") == 0:
                return jsonify({
                    "success": False,
                    "message": "Tu cuenta ha sido desactivada. Contacta al administrador."
                }), 403
            
            cursor.execute("""
                SELECT COALESCE(SUM(pc.cantidad_producto), 0) AS total_carrito
                FROM carrito_compras c
                JOIN productos_carrito pc ON c.id_carrito = pc.carrito
                WHERE c.id_usuario = %s
            """, (user_id,))
            carrito = cursor.fetchone()
            total_carrito = carrito['total_carrito'] if carrito else 0

            user['total_carrito'] = total_carrito

            # Convertir Decimals a float para evitar errores de serialización
            for key, value in user.items():
                if isinstance(value, Decimal):
                    user[key] = float(value)

            return jsonify({"success": True, "user": user})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@user_bp.route("/api/productos")
def api_obtener_productos():
    try:
        limit = int(request.args.get('limit', 30))
        productos = obtener_productos(limit)
        if isinstance(productos, str):
            return jsonify({'error': productos}), 500
        return jsonify(productos), 200

    except Exception:
        current_app.logger.exception("Error en api_obtener_productos")
        return jsonify({'error': 'Error interno al obtener productos'}), 500