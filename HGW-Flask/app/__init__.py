from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from config import Config
import pymysql.cursors

from flasgger import Swagger

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    swagger_template = {
        "info": {
            "title": "HGW API",
            "version": "1.0.0",
            "description": "Documentación automática de tu API en Flask"
        }
    }
    swagger_config = {
        "headers": [],
        "specs_route": "/docs/",
        "specs": [{
            "endpoint": "apispec",
            "route": "/apispec.json",
            "rule_filter": lambda rule: True,
            "model_filter": lambda tag: True,
        }],
        "static_url_path": "/flasgger_static",
        "favicon": "./static/hgw_logo.jpeg"
    }
    Swagger(app, template=swagger_template, config=swagger_config)

    db.init_app(app)
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
    from .controllers.User.user import header_bp
    from .controllers.User.InicioSesion.login import login_bp
    from .controllers.User.InicioSesion.register import register_bp
    from .controllers.User.Catalogo.catalogo import catalogo_bp
    from .controllers.User.Catalogo import productoDet 
    from .controllers.User.Catalogo.producto import stock_bp
    from .controllers.User.Personal.membresia import membresia_bp
    from .controllers.User.Personal.personal import personal_bp
    from .controllers.User.Carrito.carrito_routes import carrito_bp
    
    app.register_blueprint(header_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(register_bp)
    app.register_blueprint(catalogo_bp)
    app.register_blueprint(stock_bp)
    app.register_blueprint(membresia_bp)
    app.register_blueprint(personal_bp)
    app.register_blueprint(carrito_bp)
    with app.app_context():
        from app.models.tablas import tablas, bp_tablas
        tablas.prepare(
            db.engine,
            reflect=True,
            name_for_scalar_relationship=lambda base, local_cls, referred_cls, constraint:
                f"{referred_cls.__name__.lower()}_obj",
            name_for_collection_relationship=lambda base, local_cls, referred_cls, constraint:
                f"{referred_cls.__name__.lower()}_list"
        )
        app.register_blueprint(bp_tablas)
        db.create_all()
    return app
