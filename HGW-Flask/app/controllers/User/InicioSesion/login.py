from flask import Blueprint, request, session, current_app, jsonify
from flask_bcrypt import Bcrypt
import jwt
from datetime import datetime, timedelta 
import time

login_bp = Blueprint('login_bp', __name__)
bcrypt = Bcrypt()

@login_bp.route('/api/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify(success=False, message='Formato de datos no válido. Se esperaba JSON.'), 400

    data = request.get_json()


    # "usuario" y "contrasena" del JSON
    usuario = data.get('usuario')
    contrasena = data.get('contrasena')

    if not usuario or not contrasena:
        return jsonify(success=False, message='Debes enviar usuario y contraseña.'), 400

    # la conexión MySQL
    connection = current_app.config['MYSQL_CONNECTION']

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id_usuario AS id, pss AS password, rol AS role_id 
                FROM usuarios 
                WHERE correo_electronico = %s OR nombre_usuario = %s AND activo = 1
            """, (usuario, usuario))
            usuario_encontrado = cursor.fetchone()

            if usuario_encontrado and bcrypt.check_password_hash(usuario_encontrado['password'], contrasena):
                exp_time = datetime.utcnow() + timedelta(minutes=1)

                payload = {
                        "id": usuario_encontrado['id'],
                        "role": usuario_encontrado['role_id'],
                        "exp": int(exp_time.timestamp())  # expira en 12h
                }
                token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm="HS256")
                
                role_redirects = {
                    1: '/Administrador',
                    2: '/moderador',
                    3: '/inicio'
                }
                destino = role_redirects.get(usuario_encontrado['role_id'], '/inicio')

                print(payload)
                return jsonify(
                    success=True, 
                    token=token, 
                    redirect=destino
                ), 200

            # Si usuario no existe o contraseña inválida:
            return jsonify(success=False, message="Usuario o contraseña incorrectos."), 401

    except Exception as e:
        # En caso de cualquier error de base de datos:
        current_app.logger.error(f"Error en login: {e}")
        return jsonify(success=False, message=f"Error de servidor: {str(e)}"), 500
