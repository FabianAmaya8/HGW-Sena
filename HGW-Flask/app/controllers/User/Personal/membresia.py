from flask import Blueprint, request, jsonify
from app.controllers.db import get_db
from decimal import Decimal
from flasgger import swag_from

membresia_bp = Blueprint('membresia_bp', __name__)
@membresia_bp.route("/api/membresia", methods=["GET"])
@swag_from('../../Doc/Personal/Membresia/obtener_membresia.yml')
def obtener_membresia():
    user_id = request.args.get("id", type=int)
    if not user_id:
        return jsonify({"success": False, "message": "ID de usuario no proporcionado"}), 400

    try:
        connection = get_db()
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    m.id_membresia, m.nombre_membresia, m.precio_membresia, m.bv AS bv_requeridos,
                    u.bv_acumulados,
                    (SELECT nombre_membresia 
                    FROM membresias 
                    WHERE bv > u.bv_acumulados 
                    ORDER BY bv ASC LIMIT 1) AS proxima_membresia
                FROM usuarios u
                JOIN membresias m ON u.membresia = m.id_membresia
                WHERE u.id_usuario = %s
            """, (user_id,))
            membresia = cursor.fetchone()

            if not membresia:
                return jsonify({"success": False, "message": "Membresía no encontrada"}), 404

            # Convertir Decimals a float
            for k, v in membresia.items():
                if isinstance(v, Decimal):
                    membresia[k] = float(v)

            return jsonify({"success": True, "membresia": membresia})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# -------------------- Todas las membresías --------------------
@membresia_bp.route("/api/membresias", methods=["GET"])
@swag_from('../../Doc/Personal/Membresia/listar_membresias.yml')
def obtener_todas_membresias():
    try:
        connection = get_db()
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id_membresia, nombre_membresia, precio_membresia, bv
                FROM membresias
            """)
            membresias = cursor.fetchall()

            for m in membresias:
                for k, v in m.items():
                    if isinstance(v, Decimal):
                        m[k] = float(v)

            return jsonify({"success": True, "membresias": membresias})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500