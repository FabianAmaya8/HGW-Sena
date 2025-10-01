import os
from werkzeug.utils import secure_filename
from app.supabase_client import supabase, bucket

def upload_image_to_supabase(file, folder=""):
    """
    Sube una imagen a Supabase Storage y devuelve la URL pública.
    Acepta un FileStorage de Flask.
    """
    filename = secure_filename(file.filename)
    path = f"{folder}/{filename}" if folder else filename

    # leer contenido como bytes
    data = file.read()

    # 📌 usar update para sobrescribir siempre
    supabase.storage.from_(bucket).update(path, data)

    # devolver URL pública
    public_url = supabase.storage.from_(bucket).get_public_url(path)
    return public_url, filename
