import os
import sys
import pytest
import warnings

# ---------------------------------
# FILTRAR WARNINGS PARA LOS TESTS
# ---------------------------------
warnings.filterwarnings("ignore", category=DeprecationWarning)
warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=RuntimeWarning)

# Asegurar que el root de la app esté en sys.path
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from app import create_app

# ------------------------------
# Dummy Cursor
# ------------------------------
class DummyCursor:
    def __init__(self, parent_conn):
        self.parent = parent_conn
        self._fetchone_index = 0
        self._fetchall_index = 0

    @property
    def lastrowid(self):
        return self.parent.lastrowid

    def execute(self, sql, params=None):
        self.parent.executed_queries.append((sql, params))

    def fetchone(self):
        if self._fetchone_index < len(self.parent.fetchone_responses):
            value = self.parent.fetchone_responses[self._fetchone_index]
            self._fetchone_index += 1
            return value
        return None

    def fetchall(self):
        if self._fetchall_index < len(self.parent.fetchall_responses):
            value = self.parent.fetchall_responses[self._fetchall_index]
            self._fetchall_index += 1
            return value
        return []

    def set_fetchone_responses(self, responses):
        self.parent.set_fetchone_responses(responses)

    def set_fetchall_responses(self, responses):
        self.parent.set_fetchall_responses(responses)

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False

# ------------------------------
# Dummy Connection
# ------------------------------
class DummyConnection:
    def __init__(self):
        self.fetchone_responses = []
        self.fetchall_responses = []
        self.executed_queries = []
        self.commit_count = 0

    def cursor(self, *args, **kwargs):
        return DummyCursor(self)

    def commit(self):
        self.commit_count += 1

    def ping(self, reconnect=False):
        pass

    def set_fetchone_responses(self, responses):
        self.fetchone_responses = list(responses)

    def set_fetchall_responses(self, responses):
        self.fetchall_responses = list(responses)

    def reset(self):
        self.fetchone_responses = []
        self.fetchall_responses = []
        self.executed_queries = []
        self.commit_count = 0

# ------------------------------
# FIXTURES DE FLASK
# ------------------------------
@pytest.fixture
def app():
    os.environ["FLASK_ENV"] = "testing"
    os.environ["TESTING"] = "1"

    app = create_app()

    app.config["TESTING"] = True
    app.config["SECRET_KEY"] = "test_secret_key"

    return app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def fake_conn():
    return DummyConnection()
