from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    SECRET_KEY = 'CLAVE'
    MYSQL_HOST = os.getenv("MYSQL_HOST")
    MYSQL_USER = "root"
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
    MYSQL_DB = "HGW_database"
    MYSQL_PORT = int(os.getenv("MYSQL_PORT", 3306))
    SESSION_COOKIE_SECURE = False
