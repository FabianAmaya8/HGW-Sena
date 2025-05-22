from flask import Flask
import pymysql.cursors
from config import Config

from .controllers.User.admin import admin_bp
from .controllers.User.mod import mod_bp
from .controllers.User.user import user_bp
from .controllers.User.login import login_bp

def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    connection = pymysql.connect(
        host=app.config['MYSQL_HOST'],
        user=app.config['MYSQL_USER'],
        password=app.config['MYSQL_PASSWORD'],
        database=app.config['MYSQL_DB'],
        cursorclass=pymysql.cursors.DictCursor
    )
    app.config['MYSQL_CONNECTION'] = connection

    # Registrar Blueprints
    app.register_blueprint(admin_bp)
    app.register_blueprint(mod_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(login_bp)

    return app
