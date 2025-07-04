from flask import Blueprint, request, jsonify
from app.controllers.db import get_db
from decimal import Decimal

membresia_bp = Blueprint('membresia_bp', __name__)
@membresia_bp.route("/api/membresia", methods=["GET"])
def obtener_membresia():
    user_id = request.args.get("id", type=int)

    if not user_id:
        return jsonify({"success": False, "message": "ID de usuario no proporcionado"}), 400

    try:
        connection = get_db()
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT m.id_membresia, m.nombre_membresia, m.precio_membresia
                FROM usuarios u
                JOIN membresias m ON u.membresia = m.id_membresia
                WHERE u.id_usuario = %s
            """, (user_id,))
            membresia = cursor.fetchone()

            if not membresia:
                return jsonify({"success": False, "message": "Membresía no encontrada"}), 404

            # Convertir Decimals a float para evitar errores de serialización
            for key, value in membresia.items():
                if isinstance(value, Decimal):
                    membresia[key] = float(value)

            return jsonify({"success": True, "membresia": membresia})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@membresia_bp.route("/api/membresias", methods=["GET"])
def obtener_todas_membresias():
    try:
        connection = get_db()
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT * FROM membresias
            """)
            membresias = cursor.fetchall()

            return jsonify({"success": True, "membresias": membresias})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
