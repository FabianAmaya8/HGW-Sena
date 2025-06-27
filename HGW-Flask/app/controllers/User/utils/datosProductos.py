from app.controllers.db import get_db
import traceback

def obtener_productos():
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
            """)
            productos = cursor.fetchall()
            return productos
    except Exception as e:
        print("Error en obtener_productos:\n", traceback.format_exc())
        return f"{type(e).__name__}: {e}"
