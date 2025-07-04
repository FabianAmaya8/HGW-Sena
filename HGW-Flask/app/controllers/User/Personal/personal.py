from flask import Blueprint, request, jsonify, current_app
from app.controllers.db import get_db
from flask_bcrypt import Bcrypt
from werkzeug.utils import secure_filename
import os

bcrypt = Bcrypt()
personal_bp = Blueprint('personal_bp', __name__)

# -------------------- Personal GET --------------------
@personal_bp.route('/api/personal', methods=['GET'])
def get_personal():
    user_id = request.args.get("id", type=int)
    if not user_id:
        return jsonify({"success": False, "message": "ID de usuario no proporcionado"}), 400

    try:
        connection = get_db()
        with connection.cursor() as cursor:
            cursor.execute("""
                        SELECT 
                            u.id_usuario, u.nombre, u.apellido, u.nombre_usuario, u.pss , u.correo_electronico, 
                            u.numero_telefono, u.url_foto_perfil, u.patrocinador, mp.nombre_medio
                        FROM usuarios u
                        LEFT JOIN medios_pago mp ON u.medio_pago = mp.id_medio
                        WHERE u.id_usuario = %s
                        """,
                        (user_id,))
            usuario = cursor.fetchone()
            if not usuario:
                return jsonify({'success': False, 'message': 'Usuario no encontrado'}), 404

            cursor.execute("""
                        SELECT 
                            d.id_direccion , d.direccion, d.codigo_postal, d.lugar_entrega,
                            ciudad.id_ubicacion AS ciudad_id,pais.id_ubicacion AS pais_id,
                            ciudad.nombre AS ciudad, pais.nombre AS pais
                        FROM direcciones d
                        LEFT JOIN ubicaciones ciudad ON d.id_ubicacion = ciudad.id_ubicacion
                        LEFT JOIN ubicaciones pais ON ciudad.ubicacion_padre = pais.id_ubicacion
                        WHERE d.id_usuario = %s"""
                        , (user_id,))
            direcciones = cursor.fetchall()

            cursor.execute("""
                        SELECT 
                            u.membresia, m.nombre_membresia
                        FROM usuarios u
                        LEFT JOIN membresias m ON u.membresia = m.id_membresia
                        WHERE u.id_usuario = %s
                        """,
                        (user_id,))
            membresia = cursor.fetchone()

            usuario['direcciones'] = direcciones
            usuario['membresia'] = membresia
            return jsonify({'success': True, 'usuario': usuario})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


# -------------------- Personal UPDATE --------------------
@personal_bp.route('/api/personal/update', methods=['PUT'])
def update_personal():
    user_id = request.args.get("id", type=int)
    if not user_id:
        return jsonify({"success": False, "message": "ID de usuario no proporcionado"}), 400

    connection = get_db()
    try:
        if request.content_type and request.content_type.startswith('multipart/form-data'):
            data = request.form.get('data')
            if data:
                import json
                data = json.loads(data)
            else:
                data = {}
            foto = request.files.get('foto_perfil')
        else:
            data = request.json
            foto = None

        with connection.cursor() as cursor:
            if foto and foto.filename:
                cursor.execute("SELECT nombre_usuario, url_foto_perfil FROM usuarios WHERE id_usuario = %s", (user_id,))
                user_row = cursor.fetchone()
                if not user_row:
                    return jsonify({'success': False, 'message': 'Usuario no encontrado'}), 404

                nombre_usuario = user_row['nombre_usuario']
                ruta_anterior = user_row['url_foto_perfil']
                ext = os.path.splitext(foto.filename)[1]
                filename = secure_filename(f"{nombre_usuario}{ext}")
                rel_path = os.path.join('uploads/profile_pictures', filename)
                abs_path = os.path.join(current_app.root_path, 'static', rel_path)

                if ruta_anterior and not ruta_anterior.endswith(ext):
                    ruta_abs_anterior = os.path.join(current_app.root_path, *ruta_anterior.split('/')[1:])
                    if os.path.exists(ruta_abs_anterior):
                        os.remove(ruta_abs_anterior)

                os.makedirs(os.path.dirname(abs_path), exist_ok=True)
                foto.save(abs_path)
                nueva_ruta = "static/" + rel_path.replace('\\', '/')

                if not ruta_anterior or not ruta_anterior.endswith(ext):
                    cursor.execute("UPDATE usuarios SET url_foto_perfil = %s WHERE id_usuario = %s", (nueva_ruta, user_id))

            campos_usuario = [k for k in data.keys() if k != 'direcciones' and k != 'foto_perfil']
            if campos_usuario:
                set_usuario = ', '.join([f"{campo}=%s" for campo in campos_usuario])
                valores_usuario = [data[campo] for campo in campos_usuario]
                valores_usuario.append(user_id)
                cursor.execute(f"UPDATE usuarios SET {set_usuario} WHERE id_usuario = %s", valores_usuario)

            if 'direcciones' in data:
                for direccion in data['direcciones']:
                    if 'id_direccion' in direccion:
                        set_dir = ', '.join([f"{k}=%s" for k in direccion if k != 'id_direccion'])
                        valores_dir = [direccion[k] for k in direccion if k != 'id_direccion']
                        valores_dir.append(direccion['id_direccion'])
                        cursor.execute(f"UPDATE direcciones SET {set_dir} WHERE id_direccion = %s", valores_dir)

            connection.commit()
        return jsonify({'success': True, 'message': 'Datos actualizados correctamente'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


# -------------------- Personal CAMBIAR CONTRASEÑA --------------------
@personal_bp.route('/api/cambiar-contrasena', methods=['POST'])
def cambiar_contrasena():
    data = request.json
    user_id = data.get('id_usuario')
    actual = data.get('actual')
    nueva = data.get('nueva')
    if not user_id or not actual or not nueva:
        return jsonify({'success': False, 'message': 'Datos incompletos'}), 400

    try:
        connection = get_db()
        with connection.cursor() as cursor:
            cursor.execute("SELECT pss FROM usuarios WHERE id_usuario = %s", (user_id,))
            row = cursor.fetchone()
            if not row:
                return jsonify({'success': False, 'message': 'Usuario no encontrado'}), 404

            hash_actual = row['pss']
            if not bcrypt.check_password_hash(hash_actual, actual):
                return jsonify({'success': False, 'message': 'La contraseña actual es incorrecta'}), 401

            hash_nueva = bcrypt.generate_password_hash(nueva).decode('utf-8')
            cursor.execute("UPDATE usuarios SET pss = %s WHERE id_usuario = %s", (hash_nueva, user_id))
            connection.commit()
        return jsonify({'success': True, 'message': 'Contraseña actualizada correctamente'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# -------------------- Personal DELETE --------------------
@personal_bp.route('/api/personal/delete', methods=['DELETE'])
def delete_foto_perfil():
    user_id = request.args.get("id", type=int)
    if not user_id:
        return jsonify({"success": False, "message": "ID de usuario no proporcionado"}), 400

    try:
        connection = get_db()
        with connection.cursor() as cursor:
            cursor.execute("SELECT url_foto_perfil FROM usuarios WHERE id_usuario = %s", (user_id,))
            row = cursor.fetchone()
            if not row or not row['url_foto_perfil']:
                return jsonify({'success': False, 'message': 'No hay foto para borrar'}), 404

            ruta = row['url_foto_perfil']
            ruta_abs = os.path.join(current_app.root_path, *ruta.split('/')[1:])
            if os.path.exists(ruta_abs):
                os.remove(ruta_abs)

            cursor.execute("UPDATE usuarios SET url_foto_perfil = NULL WHERE id_usuario = %s", (user_id,))
            connection.commit()
        return jsonify({'success': True, 'message': 'Foto de perfil eliminada'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
