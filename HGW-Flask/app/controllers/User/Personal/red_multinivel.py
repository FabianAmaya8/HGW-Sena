from flask import Blueprint, request, jsonify, current_app
from flasgger import swag_from

red_bp = Blueprint('red_bp', __name__)

# -------------------- Helpers --------------------
def get_connection():
    return current_app.config.get('MYSQL_CONNECTION')

def validar_usuario(user_id):
    if not user_id:
        return None, ({"success": False, "message": "ID de usuario no proporcionado"}, 400)
    connection = get_connection()
    if not connection:
        return None, ({"success": False, "message": "Error de conexión a la base de datos"}, 500)
    return connection, None

# -------------------- Endpoints --------------------
@red_bp.route('/api/mi-red', methods=['GET'])
@swag_from({
    'tags': ['Personal - Red Multinivel'],
    'summary': 'Obtener toda la red de un usuario',
    'parameters': [{'name': 'id', 'in': 'query', 'type': 'integer', 'required': True}],
    'responses': {200: {'description': 'OK'}, 400: {}, 404: {}, 500: {}}
})
def obtener_mi_red():
    """Obtiene la red multinivel de un usuario hasta 10 niveles"""
    user_id = request.args.get("id", type=int)
    connection, error = validar_usuario(user_id)
    if error:
        return jsonify(error[0]), error[1]

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT nombre_usuario FROM usuarios WHERE id_usuario = %s", (user_id,))
            usuario = cursor.fetchone()
            if not usuario:
                return jsonify({"success": False, "message": "Usuario no encontrado"}), 404

            cursor.execute(""" 
                WITH RECURSIVE red_usuarios AS (
                    SELECT u.id_usuario, u.nombre, u.apellido, u.nombre_usuario, 
                        u.correo_electronico, u.url_foto_perfil, u.patrocinador, 
                        m.nombre_membresia, IFNULL(u.created_at, NOW()) AS fecha_registro, 
                        1 AS nivel, u.activo, u.numero_telefono
                    FROM usuarios u
                    LEFT JOIN membresias m ON u.membresia = m.id_membresia
                    WHERE u.patrocinador = %s AND u.activo = 1
                    UNION ALL
                    SELECT u.id_usuario, u.nombre, u.apellido, u.nombre_usuario, 
                        u.correo_electronico, u.url_foto_perfil, u.patrocinador, 
                        m.nombre_membresia, IFNULL(u.created_at, NOW()), 
                        ru.nivel + 1, u.activo, u.numero_telefono
                    FROM usuarios u
                    INNER JOIN red_usuarios ru ON u.patrocinador = ru.nombre_usuario
                    LEFT JOIN membresias m ON u.membresia = m.id_membresia
                    WHERE ru.nivel < 10 AND u.activo = 1
                )
                SELECT ru.*, 
                    (SELECT COUNT(*) FROM usuarios WHERE patrocinador = ru.nombre_usuario AND activo = 1) AS total_red,
                    IFNULL(m2.bv, 0) AS puntos_bv
                FROM red_usuarios ru
                LEFT JOIN usuarios u2 ON ru.id_usuario = u2.id_usuario
                LEFT JOIN membresias m2 ON u2.membresia = m2.id_membresia
                ORDER BY ru.nivel ASC, ru.fecha_registro DESC
            """, (usuario['nombre_usuario'],))

            red = cursor.fetchall()
            for p in red:
                if p.get('fecha_registro'):
                    p['fecha_registro'] = str(p['fecha_registro'])
                p['activo'] = int(p.get('activo', 0))

            return jsonify({
                "success": True,
                "red": red,
                "total": len(red),
                "codigo_patrocinador": usuario['nombre_usuario']
            }), 200
    except Exception as e:
        current_app.logger.error(f"Error en obtener_mi_red: {str(e)}")
        return jsonify({"success": False, "message": f"Error del servidor: {str(e)}"}), 500
