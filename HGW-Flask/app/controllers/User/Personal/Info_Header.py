from flask import Blueprint, request, jsonify
from app.controllers.db import get_db
from decimal import Decimal
from flasgger import swag_from

header_bp = Blueprint('header_bp', __name__)

@header_bp.route("/api/header", methods=["GET"])
@swag_from('../../Doc/Personal/Info_Header.yml')
def obtener_usuario():
    user_id = request.args.get("id", type=int)

    if not user_id:
        return jsonify({"success": False, "message": "ID de usuario no proporcionado"}), 400

    try:
        connection = get_db()
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT url_foto_perfil, nombre_usuario as usuario FROM usuarios
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
