import os, json
from flask_bcrypt import Bcrypt
from flask import Blueprint, request, jsonify, Response
from flask_cors import cross_origin
from sqlalchemy.ext.automap import automap_base
from app import db
from werkzeug.utils import secure_filename
from flasgger import swag_from
from app.controllers.User.utils.upload_image import upload_image_to_supabase

tablas = automap_base()
bcrypt = Bcrypt()

def get_fk_display(obj):
    cols = [c.name for c in obj.__table__.columns if 'name' in c.name.lower() or 'nombre' in c.name.lower()]
    if cols:
        return getattr(obj, cols[0])
    pks = [c.name for c in obj.__table__.primary_key]
    return getattr(obj, pks[0])

def serializar_con_fk_lookup(objetos):
    fk_tablas = {
        'categoria':    'categorias',
        'subcategoria': 'subcategoria',
        'membresia':    'membresias',
        'medio_pago':   'medios_pago',
        'rol':          'roles'
    }
    lista = []
    for o in objetos:
        data = {}
        for col in o.__table__.columns:
            valor = getattr(o, col.name)
            
            if col.name in fk_tablas and valor is not None:
                try:
                    clase_fk = getattr(tablas.classes, fk_tablas[col.name])
                    obj_fk = db.session.get(clase_fk, valor)
                    if obj_fk:
                        data[col.name] = {
                            'id': valor,
                            'value': get_fk_display(obj_fk)
                        }
                        continue
                except Exception:
                    pass
            
            data[col.name] = valor
        lista.append(data)
    return lista

bp_tablas = Blueprint("tablas", __name__)

def get_tabla(nombre):
    claves = {k.lower(): k for k in tablas.classes.keys()}
    return tablas.classes.get(claves.get(nombre.lower()))
# ---------------- RUTAS ---------------- #

@bp_tablas.route("/registro", methods=["POST","OPTIONS"])
@cross_origin()
@swag_from('../controllers/Doc/Tablas/registros.yml')
def registros():
    if request.method == "OPTIONS":
        return Response(status=200)
    tablaActual = get_tabla(request.form["table"])
    if not tablaActual:
        return jsonify({"error": f"Tabla '{request.form['table']}' no encontrada"}), 400

    registro = tablaActual()
    for clave, valor in request.form.items():
        try: 
            lista = json.loads(valor)
            if "password" in lista:
                valor = bcrypt.generate_password_hash(lista.get("text")).decode('utf-8')
            elif "text" in lista:
                valor = lista.get("text")
            setattr(registro, clave, valor)
        except(json.JSONDecodeError, TypeError):
            if clave not in ("table", "req"):
                setattr(registro, clave, valor)

    for clave, archivo in request.files.items():
        url, filename = upload_image_to_supabase(archivo, folder=request.form["table"])
        setattr(registro, clave, url)

    db.session.add(registro)
    db.session.commit()
    return jsonify({"respuesta": "Se registró correctamente"})

@bp_tablas.route("/consultas", methods=["POST","OPTIONS"])
@cross_origin()
@swag_from('../controllers/Doc/Tablas/consultas.yml')
def consultas():
    if request.method == "OPTIONS":
        return Response(status=200)
    objeto = request.get_json()
    respuestas = {}
    if "foreign" in objeto:
        tablaActual = get_tabla(objeto["table"])
        if not tablaActual:
            return jsonify({"error": f"Tabla '{objeto['table']}' no encontrada"}), 400
        get = serializar_con_fk_lookup(
            db.session.query(tablaActual)
                      .filter(getattr(tablaActual, objeto["columnDependency"]) == objeto["foreign"])
                      .all()
        )
        respuestas[objeto["table"]] = get
    else:
        for tabla in objeto:
            tablaActual = get_tabla(tabla["table"])
            if not tablaActual:
                respuestas[tabla["table"]] = []
                continue
            respuestas[tabla["table"]] = serializar_con_fk_lookup(
                db.session.query(tablaActual).all()
            )
    return jsonify(respuestas)

@bp_tablas.route("/consultaTabla", methods=["POST","OPTIONS"])
@cross_origin()
@swag_from('../controllers/Doc/Tablas/consultaTabla.yml')
def consultaTabla():
    if request.method == "OPTIONS":
        return Response(status=200)
    req = request.get_json()
    tabla = get_tabla(req["table"])
    if not tabla:
        return jsonify({"error": f"Tabla '{req['table']}' no encontrada"}), 400

    objetos = db.session.query(tabla).all()
    filas = serializar_con_fk_lookup(objetos)
    columnas = [{
        "name": col.name.replace("_", " ").title(),
        "field": col.name
    } for col in tabla.__table__.columns]
    return jsonify({"filas": filas, "columnas": columnas})

@bp_tablas.route("/eliminar", methods=["POST","OPTIONS"])
@cross_origin()
@swag_from('../controllers/Doc/Tablas/eliminar.yml')
def eliminar():
    if request.method == "OPTIONS":
        return Response(status=200)
    datos = request.get_json()
    tabla = get_tabla(datos["table"])
    if not tabla:
        return jsonify({"error": f"Tabla '{datos['table']}' no encontrada"}), 400

    elemento = db.session.get(tabla, datos["id"])
    if not elemento:
        return jsonify({"error": "Registro no encontrado"}), 404
    db.session.delete(elemento)
    db.session.commit()
    return jsonify({"respuesta": "Se ha eliminado el registro"})

@bp_tablas.route("/consultaFilas", methods=["POST","OPTIONS"])
@cross_origin()
@swag_from('../controllers/Doc/Tablas/consultaFilas.yml')
def consultaFilas():
    if request.method == "OPTIONS":
        return Response(status=200)
    datos = request.get_json()
    tabla = get_tabla(datos["table"])
    if not tabla:
        return jsonify({"error": f"Tabla '{datos['table']}' no encontrada"}), 400

    elemento = db.session.get(tabla, datos["id"])
    if not elemento:
        return jsonify({}), 404
    fila = serializar_con_fk_lookup([elemento])[0]
    return jsonify(fila)

@bp_tablas.route("/editar", methods=["POST","OPTIONS"])
@cross_origin()
@swag_from('../controllers/Doc/Tablas/editar.yml')
def editar():
    if request.method == "OPTIONS":
        return Response(status=200)
    tablaActual = get_tabla(request.form["table"])
    if not tablaActual:
        return jsonify({"error": f"Tabla '{request.form['table']}' no encontrada"}), 400

    elementoG = db.session.get(tablaActual, request.form["id"])
    if not elementoG:
        return jsonify({"error": "Registro no encontrado"}), 404

    for clave, valor in request.form.items():
        try:
            lista = json.loads(valor)
            if "password" in lista:
                valor = bcrypt.generate_password_hash(lista.get("text")).decode('utf-8')
            elif "text" in lista:
                valor = lista.get("text")
            setattr(elementoG, clave, valor)
        except (json.JSONDecodeError, TypeError):
            if clave not in ("table", "id", "req"):
                setattr(elementoG, clave, valor)

    for clave, archivo in request.files.items():
        url, filename = upload_image_to_supabase(archivo, folder=request.form["table"])
        setattr(elementoG, clave, url)

    db.session.commit()
    return jsonify({"respuesta": "Se actualizó el registro"})
