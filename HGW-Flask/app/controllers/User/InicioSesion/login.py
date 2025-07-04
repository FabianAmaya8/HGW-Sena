from flask import Blueprint, request, session, current_app, jsonify
from flask_bcrypt import Bcrypt

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
                WHERE correo_electronico = %s OR nombre_usuario = %s
            """, (usuario, usuario))
            usuario_encontrado = cursor.fetchone()

            if usuario_encontrado and bcrypt.check_password_hash(usuario_encontrado['password'], contrasena):
                session['user_id'] = usuario_encontrado['id']
                session['user_role'] = usuario_encontrado['role_id']

                role_redirects = {
                    1: '/Admin',
                    2: '/mod',
                    3: '/inicio'
                }
                destino = role_redirects.get(usuario_encontrado['role_id'], '/inicio')

                return jsonify(success=True,
                                redirect=destino,
                                user={
                                    'id': usuario_encontrado['id'],
                                    'role': usuario_encontrado['role_id']
                                })

            # Si usuario no existe o contraseña inválida:
            return jsonify(success=False, message="Usuario o contraseña incorrectos."), 401

    except Exception as e:
        # En caso de cualquier error de base de datos:
        current_app.logger.error(f"Error en login: {e}")
        return jsonify(success=False, message=f"Error de servidor: {str(e)}"), 500
