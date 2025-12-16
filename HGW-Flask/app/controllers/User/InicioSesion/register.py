from flask import Blueprint, request,current_app,jsonify,render_template
from app.controllers.db import get_db
from flask_bcrypt import Bcrypt
from werkzeug.utils import secure_filename
from sqlalchemy import text
from flasgger import swag_from
from app.controllers.User.utils.upload_image import upload_image_to_supabase
import os
from app import db

# Crear blueprint
register_bp = Blueprint('register_bp', __name__)
bcrypt = Bcrypt()

@register_bp.route('/', methods=['HEAD', 'GET'])
def status():
    return render_template('index.html'), 200  

@register_bp.route('/api/ubicacion/paises', methods=['GET'])
@swag_from('../../Doc/InicioSesion/Registro/ubicacion_paises.yml')
def api_ubicacion_paises():
    try:
        result = db.session.execute(
            text("SELECT id_ubicacion, nombre FROM ubicaciones WHERE tipo = 'pais'")
        )
        paises = [dict(row._mapping) for row in result]
        return jsonify(paises), 200
    except Exception as e:
        current_app.logger.error(f"Error en /api/ubicacion/paises: {e}")
        return jsonify({'error': str(e)}), 500

@register_bp.route('/api/ubicacion/ciudades', methods=['GET'])
@swag_from('../../Doc/InicioSesion/Registro/ubicacion_ciudades.yml')
def api_ubicacion_ciudades():
    pais_id = request.args.get('paisId')

    try:
        connection = get_db()

        with connection.cursor() as cursor:
            if pais_id:
                query = """
                    SELECT id_ubicacion, nombre, ubicacion_padre 
                    FROM ubicaciones 
                    WHERE tipo = 'ciudad' AND ubicacion_padre = %s
                """
                cursor.execute(query, (pais_id,))
            else:
                query = """
                    SELECT id_ubicacion, nombre, ubicacion_padre 
                    FROM ubicaciones 
                    WHERE tipo = 'ciudad'
                """
                cursor.execute(query)

            ciudades = cursor.fetchall()
            return jsonify(ciudades)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@register_bp.route('/api/register', methods=['POST'])
@swag_from('../../Doc/InicioSesion/Registro/register.yml')
def register():
    try:
        connection = get_db()

        nombre = request.form.get('nombres')
        apellido = request.form.get('apellido')
        patrocinador = request.form.get('patrocinador')
        nombre_usuario = request.form.get('usuario')
        contrasena = request.form.get('contrasena')
        confirmar_contrasena = (
            request.form.get('confirmar_contrasena') 
            or request.form.get('confirmarContrasena')
        )
        correo = request.form.get('correo')
        telefono = request.form.get('telefono')
        direccion = request.form.get('direccion')
        codigo_postal = request.form.get('codigo_postal')
        lugar_entrega = request.form.get('lugar_entrega')
        ciudad = request.form.get('ciudad')

        required = [
            nombre, apellido, nombre_usuario, contrasena, confirmar_contrasena,
            correo, telefono, direccion, codigo_postal, ciudad, lugar_entrega
        ]
        if not all(required):
            return jsonify(success=False, message="Faltan campos obligatorios"), 400

        if contrasena != confirmar_contrasena:
            return jsonify(success=False, message="Las contraseñas no coinciden."), 400

        hashed_password = bcrypt.generate_password_hash(contrasena).decode('utf-8')

        # ============================================================
        # 📌 SUBIR FOTO A SUPABASE
        # ============================================================
        foto = request.files.get('foto_perfil') or request.files.get('fotoPerfil')
        ruta_foto = None

        if foto and foto.filename:
            try:
                # enviamos a carpeta de supabase: profile_pictures/
                ruta_foto, filename = upload_image_to_supabase(
                    foto,
                    folder=f"usuarios"
                )
            except Exception as e:
                current_app.logger.error(f"Error subiendo imagen a Supabase: {e}")
                return jsonify(success=False, message="Error subiendo la foto de perfil"), 500

        # ============================================================
        # 📌 INSERTAR USUARIO
        # ============================================================
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO usuarios 
                (nombre, apellido, nombre_usuario, pss, correo_electronico, numero_telefono, 
                    url_foto_perfil, patrocinador, membresia, medio_pago, rol)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 1, 1, 3)
                """,
                (nombre, apellido, nombre_usuario, hashed_password, correo,
                 telefono, ruta_foto, patrocinador)
            )
            id_usuario = cursor.lastrowid

            cursor.execute(
                """
                INSERT INTO direcciones 
                (id_usuario, direccion, codigo_postal, id_ubicacion, lugar_entrega)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (id_usuario, direccion, codigo_postal, int(ciudad), lugar_entrega)
            )

            cursor.execute(
                "INSERT INTO carrito_compras (id_usuario) VALUES (%s)",
                (id_usuario,)
            )

            connection.commit()

        return jsonify(success=True, message="Registro exitoso"), 201

    except Exception as e:
        current_app.logger.error(f"Error durante el registro: {e}")
        return jsonify(success=False, message=f"Error durante el registro: {str(e)}"), 500

