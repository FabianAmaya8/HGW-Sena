from flask import Blueprint, jsonify
import pymysql
from .utils.datosUsuario import obtener_usuario_actual

stock_bp = Blueprint('stock_bp', __name__)

@stock_bp.route('/api/productos')
def obtener_productos():
    conexion = pymysql.connect(
        host='localhost',
        user='tu_usuario',
        password='tu_password',
        db='tu_basededatos',
        cursorclass=pymysql.cursors.DictCursor
    )

    try:
        with conexion.cursor() as cursor:
            cursor.execute("SELECT categoria, name, price, imageUrl, stock FROM productos")
            productos = cursor.fetchall()
            return jsonify(productos)
    finally:
        conexion.close()
