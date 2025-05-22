from flask import Blueprint, render_template, request, jsonify, current_app
from .utils.datosProductos import obtener_productos
from .utils.datosUsuario import obtener_usuario_actual

user_bp = Blueprint('user', __name__)
@user_bp.route("/api/usuario/<id>")
def api_obtener_usuarioX(id):
    # try:
    #     id = int(id)
    # except ValueError:
    #     return jsonify({'error': 'ID inválido'}), 400

    usuario = obtener_usuario_actual(id)
    if isinstance(usuario, str):
        return jsonify({'error': usuario}), 404
    return jsonify(usuario), 200


@user_bp.route("/api/productos")
def api_obtener_productos():
    try:
        limit = int(request.args.get('limit', 10))
        productos = obtener_productos(limit)
        if isinstance(productos, str):
            return jsonify({'error': productos}), 500
        return jsonify(productos), 200

    except Exception:
        current_app.logger.exception("Error en api_obtener_productos")
        return jsonify({'error': 'Error interno al obtener productos'}), 500
