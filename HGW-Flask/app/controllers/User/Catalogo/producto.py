from flask import Blueprint, jsonify, current_app
from app.controllers.db import get_db
import traceback

stock_bp = Blueprint("stock", __name__)

@stock_bp.route("/api/productos")
def api_obtener_productos():
    try:
        connection = get_db()
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    p.id_producto, 
                    c.nombre_categoria AS categoria,
                    sc.nombre_subcategoria AS subcategoria,
                    p.nombre_producto AS nombre,
                    p.precio_producto AS precio, 
                    p.imagen_producto AS imagen, 
                    p.stock
                FROM productos p
                JOIN categorias c ON p.categoria = c.id_categoria
                JOIN subcategoria sc ON p.subcategoria = sc.id_subcategoria
                WHERE p.stock > 0 AND p.activo = 1
            """)
            productos = cursor.fetchall()
            return jsonify(productos), 200

    except Exception:
        current_app.logger.exception("Error en api_obtener_productos")
        return jsonify({'error': 'Error interno al obtener productos'}), 500
