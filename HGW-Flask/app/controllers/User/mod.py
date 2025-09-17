from flask import Blueprint, jsonify

mod_bp = Blueprint('mod', __name__)

@mod_bp.route("/api/moderador", methods=["GET"])
def dashboard():
    return "Moderador"
