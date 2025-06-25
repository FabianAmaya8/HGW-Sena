import pymysql.cursors
from flask import current_app

def get_db():
    """
    Devuelve una conexión MySQL válida.
    Si la conexión guardada está muerta, la recrea automáticamente.
    """
    conn = current_app.config['MYSQL_CONNECTION']
    try:
        # ping(reconnect=True) sólo reconecta si el socket murió
        conn.ping(reconnect=True)
    except Exception:
        # si falla el ping, cierro la vieja y creo una nueva
        try:
            conn.close()
        except Exception:
            pass

        conn = pymysql.connect(
            host=current_app.config['MYSQL_HOST'],
            user=current_app.config['MYSQL_USER'],
            password=current_app.config['MYSQL_PASSWORD'],
            database=current_app.config['MYSQL_DB'],
            port=current_app.config['MYSQL_PORT'],
            cursorclass=pymysql.cursors.DictCursor,
            autocommit=True
        )
        current_app.config['MYSQL_CONNECTION'] = conn

    return conn
