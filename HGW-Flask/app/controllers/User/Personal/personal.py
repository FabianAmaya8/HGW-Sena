from flask import Blueprint, request, jsonify, current_app
from app.controllers.db import get_db
from flask_bcrypt import Bcrypt
from werkzeug.utils import secure_filename
from flasgger import swag_from
import os, json
from decimal import Decimal

bcrypt = Bcrypt()
personal_bp = Blueprint('personal_bp', __name__)

# -------------------- Personal GET --------------------
@personal_bp.route('/api/personal', methods=['GET'])
@swag_from('../../Doc/Personal/ControllerPersonal/get_personal.yml')
def get_personal():
    user_id = request.args.get("id", type=int)
    if not user_id:
        return jsonify({"success": False, "message": "ID de usuario no proporcionado"}), 400

    try:
        connection = get_db()
        with connection.cursor() as cursor:
            # Datos del usuario
            cursor.execute("""
                SELECT u.id_usuario, u.nombre, u.apellido, u.nombre_usuario, u.pss,
                    u.correo_electronico, u.numero_telefono, u.url_foto_perfil,
                    u.patrocinador, u.bv_acumulados, mp.nombre_medio
                FROM usuarios u
                LEFT JOIN medios_pago mp ON u.medio_pago = mp.id_medio
                WHERE u.id_usuario = %s
            """, (user_id,))
            usuario = cursor.fetchone()
            if not usuario:
                return jsonify({'success': False, 'message': 'Usuario no encontrado'}), 404

            # Direcciones
            cursor.execute("""
                SELECT d.id_direccion, d.direccion, d.codigo_postal, d.lugar_entrega,
                    ciudad.id_ubicacion AS ciudad_id, pais.id_ubicacion AS pais_id,
                    ciudad.nombre AS ciudad, pais.nombre AS pais
                FROM direcciones d
                LEFT JOIN ubicaciones ciudad ON d.id_ubicacion = ciudad.id_ubicacion
                LEFT JOIN ubicaciones pais ON ciudad.ubicacion_padre = pais.id_ubicacion
                WHERE d.id_usuario = %s
            """, (user_id,))
            usuario['direcciones'] = cursor.fetchall()

            # Membresía
            cursor.execute("""
                SELECT u.membresia, m.nombre_membresia, m.bv AS bv_requeridos, m.precio_membresia,
                       u.bv_acumulados,
                       (SELECT nombre_membresia 
                        FROM membresias 
                        WHERE bv > u.bv_acumulados 
                        ORDER BY bv ASC LIMIT 1) AS proxima_membresia
                FROM usuarios u
                LEFT JOIN membresias m ON u.membresia = m.id_membresia
                WHERE u.id_usuario = %s
            """, (user_id,))
            usuario['membresia'] = cursor.fetchone()

            # Historial de BV
            cursor.execute("""
                SELECT bv_ganados, fecha_transaccion, descripcion
                FROM historial_bv 
                WHERE id_usuario = %s
                ORDER BY fecha_transaccion DESC LIMIT 10
            """, (user_id,))
            historial = cursor.fetchall()
            for h in historial:
                h['fecha_transaccion'] = str(h['fecha_transaccion'])
            usuario['historial_bv'] = historial

            # Convertir Decimals
            for k, v in usuario.items():
                if isinstance(v, Decimal):
                    usuario[k] = float(v)

            return jsonify({'success': True, 'usuario': usuario})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# -------------------- Personal UPDATE --------------------
@personal_bp.route('/api/personal/update', methods=['PUT'])
@swag_from('../../Doc/Personal/ControllerPersonal/update_personal.yml')
def update_personal():
    user_id = request.args.get("id", type=int)
    if not user_id:
        return jsonify({"success": False, "message": "ID de usuario no proporcionado"}), 400

    try:
        connection = get_db()

        # Manejo de multipart/form-data
        if request.content_type and request.content_type.startswith('multipart/form-data'):
            data = json.loads(request.form.get('data', '{}'))
            foto = request.files.get('foto_perfil')
        else:
            data = request.json or {}
            foto = None

        with connection.cursor() as cursor:

            # Verificar usuario
            cursor.execute("SELECT id_usuario FROM usuarios WHERE id_usuario = %s", (user_id,))
            if cursor.fetchone() is None:
                return jsonify({'success': False, 'message': 'Usuario no encontrado'}), 404

            # ---------------------------------------------
            # Subir foto
            # ---------------------------------------------
            if foto and foto.filename:
                cursor.execute("SELECT nombre_usuario, url_foto_perfil FROM usuarios WHERE id_usuario = %s", (user_id,))
                row = cursor.fetchone()

                if row is None:
                    return jsonify({'success': False, 'message': 'Usuario no encontrado'}), 404

                nombre_usuario = row.get('nombre_usuario')
                ruta_anterior = row.get('url_foto_perfil')
                ext = os.path.splitext(foto.filename)[1]
                filename = secure_filename(f"{nombre_usuario}{ext}")
                rel_path = os.path.join('uploads/profile_pictures', filename)
                abs_path = os.path.join(current_app.root_path, 'static', rel_path)

                # Borrar foto anterior
                if ruta_anterior:
                    ruta_abs_anterior = os.path.join(current_app.root_path, *ruta_anterior.split('/')[1:])
                    if os.path.exists(ruta_abs_anterior):
                        os.remove(ruta_abs_anterior)

                os.makedirs(os.path.dirname(abs_path), exist_ok=True)
                foto.save(abs_path)

                nueva_ruta = "static/" + rel_path.replace('\\', '/')
                cursor.execute("UPDATE usuarios SET url_foto_perfil = %s WHERE id_usuario = %s",
                               (nueva_ruta, user_id))

            # Datos usuario
            campos_usuario = [k for k in data.keys() if k not in ['direcciones', 'foto_perfil']]
            if campos_usuario:
                set_usuario = ', '.join([f"{x}=%s" for x in campos_usuario])
                valores = [data[c] for c in campos_usuario] + [user_id]
                cursor.execute(f"UPDATE usuarios SET {set_usuario} WHERE id_usuario = %s", valores)

            # Direcciones
            for direccion in data.get('direcciones', []):
                if 'id_direccion' in direccion:
                    set_dir = ', '.join([f"{k}=%s" for k in direccion if k != 'id_direccion'])
                    valores = [direccion[k] for k in direccion if k != 'id_direccion'] + [
                        direccion['id_direccion']
                    ]
                    cursor.execute(f"UPDATE direcciones SET {set_dir} WHERE id_direccion = %s", valores)

            connection.commit()
            return jsonify({'success': True, 'message': 'Datos actualizados correctamente'})

    except Exception as e:
        if 'connection' in locals():
            connection.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

# -------------------- Personal CAMBIAR CONTRASEÑA --------------------
@personal_bp.route('/api/cambiar-contrasena', methods=['POST'])
@swag_from('../../Doc/Personal/ControllerPersonal/cambiar_contrasena.yml')
def cambiar_contrasena():
    data = request.json
    user_id, actual, nueva = data.get('id_usuario'), data.get('actual'), data.get('nueva')

    if not user_id or not actual or not nueva:
        return jsonify({'success': False, 'message': 'Datos incompletos'}), 400

    try:
        connection = get_db()
        with connection.cursor() as cursor:
            cursor.execute("SELECT pss FROM usuarios WHERE id_usuario = %s", (user_id,))
            row = cursor.fetchone()
            if not row:
                return jsonify({'success': False, 'message': 'Usuario no encontrado'}), 404

            if not bcrypt.check_password_hash(row['pss'], actual):
                return jsonify({'success': False, 'message': 'La contraseña actual es incorrecta'}), 401

            nueva_hash = bcrypt.generate_password_hash(nueva).decode('utf-8')
            cursor.execute("UPDATE usuarios SET pss = %s WHERE id_usuario = %s",
                           (nueva_hash, user_id))
            connection.commit()

        return jsonify({'success': True, 'message': 'Contraseña actualizada correctamente'})

    except Exception as e:
        if 'connection' in locals():
            connection.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

# -------------------- Personal DELETE --------------------
@personal_bp.route('/api/personal/delete', methods=['DELETE'])
@swag_from('../../Doc/Personal/ControllerPersonal/delete_foto_perfil.yml')
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

            cursor.execute("UPDATE usuarios SET url_foto_perfil = NULL WHERE id_usuario = %s",
                           (user_id,))
            connection.commit()

        return jsonify({'success': True, 'message': 'Foto eliminada'})

    except Exception as e:
        if 'connection' in locals():
            connection.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500
    
    # -------------------- Crear nueva dirección --------------------
@personal_bp.route('/api/direcciones/crear', methods=['POST'])
def crear_direccion():
    data = request.json
    required = ['id_usuario', 'lugar_entrega', 'direccion', 'ciudad', 'pais', 'codigo_postal']

    for f in required:
        if f not in data:
            return jsonify({'success': False, 'message': f'Campo {f} es requerido'}), 400

    try:
        connection = get_db()
        with connection.cursor() as cursor:

            cursor.execute("""
                SELECT ciudad.id_ubicacion 
                FROM ubicaciones ciudad
                JOIN ubicaciones pais ON ciudad.ubicacion_padre = pais.id_ubicacion
                WHERE ciudad.nombre = %s AND pais.nombre = %s
                AND ciudad.tipo = 'ciudad' AND pais.tipo = 'pais'
            """, (data['ciudad'], data['pais']))
            
            ubicacion = cursor.fetchone()
            if not ubicacion:
                return jsonify({'success': False, 'message': 'Ciudad o país no válido'}), 400

            cursor.execute("""
                INSERT INTO direcciones (id_usuario, direccion, codigo_postal, id_ubicacion, lugar_entrega)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                data['id_usuario'],
                data['direccion'],
                data['codigo_postal'],
                ubicacion['id_ubicacion'],
                data['lugar_entrega']
            ))
            

            connection.commit()
            return jsonify({
                'success': True,
                'message': 'Dirección creada',
                'id_direccion': cursor.lastrowid
            }), 201
            

    except Exception as e:
        if 'connection' in locals():
            connection.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

# -------------------- Obtener solo direcciones --------------------
@personal_bp.route('/api/direcciones', methods=['GET'])
def get_direcciones():
    user_id = request.args.get("id", type=int)
    if not user_id:
        return jsonify({"success": False, "message": "ID de usuario no proporcionado"}), 400

    try:
        connection = get_db()
        with connection.cursor() as cursor:

            cursor.execute("""
                SELECT d.id_direccion AS id, d.direccion, d.codigo_postal, d.lugar_entrega,
                       ciudad.nombre AS ciudad, pais.nombre AS pais
                FROM direcciones d
                LEFT JOIN ubicaciones ciudad ON d.id_ubicacion = ciudad.id_ubicacion
                LEFT JOIN ubicaciones pais ON ciudad.ubicacion_padre = pais.id_ubicacion
                WHERE d.id_usuario = %s
            """, (user_id,))

            return jsonify({'success': True, 'direcciones': cursor.fetchall()})

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# -------------------- Obtener ubicaciones disponibles --------------------
@personal_bp.route('/api/ubicaciones', methods=['GET'])
def get_ubicaciones():
    try:
        connection = get_db()
        with connection.cursor() as cursor:

            cursor.execute("SELECT id_ubicacion, nombre FROM ubicaciones WHERE tipo = 'pais'")
            paises = cursor.fetchall()

            ubicaciones = {}
            for pais in paises:
                cursor.execute("""
                    SELECT id_ubicacion, nombre 
                    FROM ubicaciones 
                    WHERE tipo = 'ciudad' AND ubicacion_padre = %s
                """, (pais['id_ubicacion'],))
                ciudades = cursor.fetchall()
                ubicaciones[pais['nombre']] = [c['nombre'] for c in ciudades]
            

            return jsonify({'success': True, 'ubicaciones': ubicaciones})

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
    # -------------------- Eliminar dirección --------------------
@personal_bp.route('/api/direcciones/eliminar', methods=['DELETE'])
def eliminar_direccion():
    data = request.json
    direccion_id = data.get('id_direccion')
    user_id = data.get('id_usuario')

    if not direccion_id or not user_id:
        return jsonify({'success': False, 'message': 'Datos incompletos'}), 400

    try:
        connection = get_db()
        with connection.cursor() as cursor:

            cursor.execute("""
                SELECT id_direccion FROM direcciones 
                WHERE id_direccion = %s AND id_usuario = %s
            """, (direccion_id, user_id))

            if not cursor.fetchone():
                return jsonify({'success': False, 'message': 'Dirección no encontrada'}), 404

            cursor.execute("DELETE FROM direcciones WHERE id_direccion = %s", (direccion_id,))
            connection.commit()

            return jsonify({'success': True, 'message': 'Dirección eliminada'})

    except Exception as e:
        if 'connection' in locals():
            connection.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500
