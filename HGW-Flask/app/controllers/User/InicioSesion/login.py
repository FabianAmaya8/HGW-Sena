from flask import Blueprint, request, current_app, jsonify
from flask_bcrypt import Bcrypt
from app.controllers.db import get_db
import jwt
from datetime import datetime, timedelta, timezone
from flasgger import swag_from

login_bp = Blueprint('login_bp', __name__)
bcrypt = Bcrypt()

@login_bp.route('/api/login', methods=['POST'])
@swag_from('../../Doc/InicioSesion/login.yml')
def login():
    if not request.is_json:
        return jsonify(success=False, message='Formato de datos no válido. Se esperaba JSON.'), 400

    data = request.get_json()
    usuario = data.get('usuario')
    contrasena = data.get('contrasena')

    if not usuario or not contrasena:
        return jsonify(success=False, message='Debes enviar usuario y contraseña.'), 400

    connection = get_db()

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    u.id_usuario AS id,
                    u.nombre,
                    u.apellido,
                    u.nombre_usuario,
                    u.pss AS password,
                    u.correo_electronico,
                    u.numero_telefono,
                    u.url_foto_perfil,
                    u.patrocinador,
                    u.rol AS role_id,
                    u.activo,
                    mp.nombre_medio
                FROM usuarios u
                LEFT JOIN medios_pago mp ON u.medio_pago = mp.id_medio
                WHERE (u.correo_electronico = %s OR u.nombre_usuario = %s) AND u.activo = 1
            """, (usuario, usuario))
            usuario_encontrado = cursor.fetchone()

            if usuario_encontrado and bcrypt.check_password_hash(usuario_encontrado['password'], contrasena):
                exp_time = datetime.now(timezone.utc) + timedelta(days=180)
                payload = {
                    "id": usuario_encontrado['id'],
                    "role": usuario_encontrado['role_id'],
                    "exp": int(exp_time.timestamp())
                }
                token = jwt.encode(payload, current_app.config['JWT_SECRET_KEY'], algorithm="HS256")
                role_redirects = {
                    1: '/Administrador',
                    2: '/moderador',
                    3: '/inicio'
                }
                destino = role_redirects.get(usuario_encontrado['role_id'], '/inicio')

                usuario_data = {
                    'id_usuario': usuario_encontrado['id'],
                    'nombre': usuario_encontrado['nombre'],
                    'apellido': usuario_encontrado['apellido'],
                    'nombre_usuario': usuario_encontrado['nombre_usuario'],
                    'correo_electronico': usuario_encontrado['correo_electronico'],
                    'numero_telefono': usuario_encontrado['numero_telefono'],
                    'url_foto_perfil': usuario_encontrado['url_foto_perfil'],
                    'patrocinador': usuario_encontrado['patrocinador'],
                    'nombre_medio': usuario_encontrado['nombre_medio']
                }

                return jsonify(
                    success=True,
                    token=token,
                    redirect=destino,
                    usuario=usuario_data
                ), 200

            return jsonify(success=False, message="Usuario o contraseña incorrectos."), 401

    except Exception as e:
        current_app.logger.error(f"Error en login: {e}")
        return jsonify(success=False, message=f"Error de servidor: {str(e)}"), 500
