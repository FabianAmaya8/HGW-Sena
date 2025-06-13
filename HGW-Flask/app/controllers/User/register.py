from flask import Blueprint, request,current_app,jsonify
from flask_bcrypt import Bcrypt
from werkzeug.utils import secure_filename
import os

# Crear blueprint
register_bp = Blueprint('register_bp', __name__)
bcrypt = Bcrypt()

@register_bp.route('/api/status', methods=['HEAD', 'GET'])
def status():
    return '', 200  

@register_bp.route('/api/ubicacion/paises', methods=['GET', 'POST'])
def api_ubicacion_paises():
    connection = current_app.config['MYSQL_CONNECTION']
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT id_ubicacion, nombre FROM ubicaciones WHERE tipo = 'pais'")
            paises = cursor.fetchall()
            return jsonify(paises)
    except Exception as e:
        return str(e)

@register_bp.route('/api/ubicacion/ciudades', methods=['GET'])
def api_ubicacion_ciudades():
    connection = current_app.config['MYSQL_CONNECTION']
    pais_id = request.args.get('paisId')

    try:
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
def register():
    connection = current_app.config['MYSQL_CONNECTION']

    try:
        # Campos desde el formulario de react
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

        # Validar campos obligatorios
        required = [nombre, apellido, nombre_usuario, contrasena, confirmar_contrasena,
                    correo, telefono, direccion, codigo_postal, ciudad, lugar_entrega]
        if not all(required):
            return jsonify(success=False, message="Faltan campos obligatorios"), 400

        if contrasena != confirmar_contrasena:
            return jsonify(success=False, message="Las contraseñas no coinciden."), 400

        # Hashear contraseña
        hashed_password = bcrypt.generate_password_hash(contrasena).decode('utf-8')

        # Guardar foto de perfil
        foto = (
            request.files.get('foto_perfil')
            or request.files.get('fotoPerfil')
        )
        ruta_foto = None
        if foto and foto.filename:
            ext = os.path.splitext(foto.filename)[1]
            filename = secure_filename(f"{nombre_usuario}{ext}")
            rel_path = os.path.join('static/uploads/profile_pictures', filename)
            abs_path = os.path.join(current_app.root_path, 'static', rel_path)
            os.makedirs(os.path.dirname(abs_path), exist_ok=True)
            foto.save(abs_path)
            ruta_foto = rel_path.replace('\\', '/')

        with connection.cursor() as cursor:
            # Insertar usuario (rol 3 = Usuario)
            cursor.execute(
                """
                INSERT INTO usuarios 
                (nombre, apellido, nombre_usuario, pss, correo_electronico, numero_telefono, 
                    url_foto_perfil, patrocinador, membresia, medio_pago, rol)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (nombre, apellido, nombre_usuario, hashed_password, correo,
                    telefono, ruta_foto, patrocinador, 1, 1, 3)
            )
            id_usuario = cursor.lastrowid

            # Insertar dirección (usa ciudad como id_ubicacion)
            cursor.execute(
                """
                INSERT INTO direcciones 
                (id_usuario, direccion, codigo_postal, id_ubicacion, lugar_entrega)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (id_usuario, direccion, codigo_postal, int(ciudad), lugar_entrega)
            )

            # Crear carrito de compras
            cursor.execute(
                "INSERT INTO carrito_compras (id_usuario) VALUES (%s)",
                (id_usuario,)
            )

            connection.commit()

        return jsonify(success=True, message="Registro exitoso"), 201

    except Exception as e:
        current_app.logger.error(f"Error durante el registro: {e}")
        return jsonify(success=False, message=f"Error durante el registro: {str(e)}"), 500

