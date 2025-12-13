import os
import uuid
from werkzeug.utils import secure_filename
from app.supabase_client import supabase, bucket

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'webp'}
MAX_FILE_SIZE_MB = 5


def allowed_file(filename):
    ext = filename.rsplit('.', 1)[-1].lower()
    return ext in ALLOWED_EXTENSIONS


def upload_image_to_supabase(file, folder=""):
    """
    Sube una imagen a Supabase con nombre UUID, valida extensión y tamaño.
    Retorna (url_publica, nombre_archivo, ruta_storage)
    """

    # Validar extensión
    if not allowed_file(file.filename):
        raise ValueError("Extensión no permitida. Solo jpg, jpeg, png, webp.")

    # Validar tamaño
    file.seek(0, os.SEEK_END)
    size_mb = file.tell() / (1024 * 1024)
    file.seek(0)
    if size_mb > MAX_FILE_SIZE_MB:
        raise ValueError("La imagen supera el tamaño máximo de 5MB.")

    # Extensión original
    ext = file.filename.rsplit('.', 1)[-1].lower()

    # Nuevo nombre con UUID
    filename = f"{uuid.uuid4().hex}.{ext}"

    path = f"{folder}/{filename}" if folder else filename

    # Leer contenido en bytes
    data = file.read()

    # 📌 Usar UPDATE que sobrescribe o crea si no existe
    supabase.storage.from_(bucket).update(path, data)

    # Obtener URL pública
    public_url = supabase.storage.from_(bucket).get_public_url(path)
    return public_url, filename, path


def delete_image_from_supabase(path):
    """
    Elimina una imagen del bucket de Supabase.
    """
    try:
        supabase.storage.from_(bucket).remove(path)
    except Exception as e:
        print(f"Error eliminando imagen de Supabase: {e}")
