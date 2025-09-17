from flask import Blueprint, jsonify

admin_bp = Blueprint('admin', __name__)

@admin_bp.route("/api/administrador", methods=["GET"])
def dashboard():

    
    return "Admin dashboard"
