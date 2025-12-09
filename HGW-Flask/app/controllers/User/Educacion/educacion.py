from flask import Blueprint, request, jsonify, current_app
from app.controllers.db import get_db
from flasgger import swag_from
import pymysql
import traceback

educacion_bp = Blueprint("educacion", __name__)

# ----------------- Endpoints para tabla educacion -----------------

@educacion_bp.route("/api/educacion", methods=["GET"])
@swag_from("../../Doc/Educacion/get_temas.yml")
def get_temas():
    try:
        connection = get_db()
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("SELECT * FROM educacion")
            temas = cursor.fetchall()
            return jsonify(temas), 200
    except Exception:
        current_app.logger.exception("Error en get_temas")
        return jsonify({"error": "Error interno al obtener temas"}), 500

# ----------------- Endpoints para tabla contenido_tema -----------------

@educacion_bp.route("/api/contenido_tema", methods=["GET"])
@swag_from("../../Doc/Educacion/get_contenidos.yml")
def get_contenidos():
    try:
        id_tema = request.args.get("id_tema") 
        connection = get_db()
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            if id_tema:
                cursor.execute("""
                    SELECT *, 
                        (SELECT tema 
                         FROM educacion 
                         WHERE educacion.id_tema = contenido_tema.tema) AS temaName
                    FROM contenido_tema
                    WHERE tema = %s
                """, (id_tema,))
            else:
                cursor.execute("""
                    SELECT *, 
                        (SELECT tema 
                         FROM educacion 
                         WHERE educacion.id_tema = contenido_tema.tema) AS temaName
                    FROM contenido_tema
                """)
            contenidos = cursor.fetchall()
            return jsonify(contenidos), 200
    except Exception:
        current_app.logger.exception("Error en get_contenidos")
        return jsonify({"error": "Error interno al obtener contenidos"}), 500
