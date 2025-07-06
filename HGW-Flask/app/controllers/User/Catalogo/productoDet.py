from flask import jsonify, current_app
from .catalogo import catalogo_bp  # usa el blueprint ya registrado

@catalogo_bp.route('/api/producto/<int:id>', methods=['GET'])
def obtener_producto(id):
    connection = current_app.config['MYSQL_CONNECTION']
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    p.id_producto,
                    p.nombre_producto AS nombre,
                    p.precio_producto AS precio,
                    p.imagen_producto AS imagen,
                    p.imgs_publicidad AS imagenes,
                    p.descripcion,
                    p.stock,
                    c.nombre_categoria AS categoria,
                    s.nombre_subcategoria AS subcategoria
                FROM productos p
                JOIN categorias c ON p.categoria = c.id_categoria
                JOIN subcategoria s ON p.subcategoria = s.id_subcategoria
                WHERE p.id_producto = %s AND p.activo = TRUE
            """, (id,))
            producto = cursor.fetchone()

        if not producto:
            return jsonify({'error': 'Producto no encontrado'}), 404

        producto['imagenes'] = producto['imagenes'].split(',') if producto['imagenes'] else []

        return jsonify(producto)

    except Exception as e:
        return jsonify({'error': str(e)}), 500
