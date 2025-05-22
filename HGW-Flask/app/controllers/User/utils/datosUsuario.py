from flask import session, redirect, url_for, current_app
from decimal import Decimal

def obtener_usuario_actual(identificador=1):
    connection = current_app.config['MYSQL_CONNECTION']
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT * FROM usuarios
                JOIN membresias ON usuarios.membresia = membresias.id_membresia
                WHERE id_usuario = %s
            """, (identificador,))
            user = cursor.fetchone()
            if not user:
                return "Usuario no encontrado"

            cursor.execute("""
                SELECT COALESCE(SUM(pc.cantidad_producto), 0) AS total_carrito
                FROM carrito_compras c
                JOIN productos_carrito pc ON c.id_carrito = pc.carrito
                WHERE c.id_usuario = %s
            """, (identificador,))
            carrito = cursor.fetchone()
            total_carrito = carrito['total_carrito'] if carrito else 0

            user['total_carrito'] = total_carrito

            # Convertir cualquier Decimal en el diccionario a float
            for key, value in user.items():
                if isinstance(value, Decimal):
                    user[key] = float(value)

            return user

    except Exception as e:
        return str(e)
