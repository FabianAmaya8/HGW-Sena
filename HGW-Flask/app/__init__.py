from flask import Flask
import pymysql.cursors
from config import Config
from flask_cors import CORS

from .controllers.User.admin import admin_bp
from .controllers.User.mod import mod_bp
from .controllers.User.user import header_bp
from .controllers.User.InicioSesion.login import login_bp
from .controllers.User.InicioSesion.register import register_bp
from .controllers.User.Catalogo.catalogo import catalogo_bp
from .controllers.User.Catalogo import productoDet 
from .controllers.User.Catalogo.producto import stock_bp 
from .controllers.User.Personal.membresia import membresia_bp 
from .controllers.User.Personal.personal import personal_bp
from .controllers.User.Carrito.carrito_routes import carrito_bp

def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    CORS(app)
    connection = pymysql.connect(
        host=app.config['MYSQL_HOST'],
        user=app.config['MYSQL_USER'],
        password=app.config['MYSQL_PASSWORD'],
        database=app.config['MYSQL_DB'],
        port=app.config['MYSQL_PORT'],
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True
    )
    app.config['MYSQL_CONNECTION'] = connection

    # Registrar Blueprints
    app.register_blueprint(admin_bp)
    app.register_blueprint(mod_bp)
    app.register_blueprint(header_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(register_bp)
    app.register_blueprint(catalogo_bp)
    app.register_blueprint(stock_bp)
    app.register_blueprint(membresia_bp)
    app.register_blueprint(personal_bp)
    app.register_blueprint(carrito_bp)

    return app
