from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:@localhost/HGW_database"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

CORS(app)

with app.app_context():
    from app.models import tablas
    from app.models.tablas import bp_tablas
    app.register_blueprint(bp_tablas)

with app.app_context():
    db.create_all()

def get_app():
    return app