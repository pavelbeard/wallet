import os
from pathlib import Path


def get_secret(key, default=None):
    value = os.environ.get(key, default)
    
    if value is None:
        return default
    
    if os.path.isfile(value):
        with open(value, "r") as f:
            return f.read().strip()
        
    return value.strip()


class Environment:
    @property
    def base_dir(self):
        self.BASE_DIR = Path(__file__).resolve().parent
        return self.BASE_DIR

    @property
    def debug_mode(self):
        if os.environ.get("DJANGO_SETTINGS_DEBUG_MODE", "True") == "True":
            return True

        return False

    @property
    def get_env(self):
        if self.debug_mode:
            self.SECRET_KEY = os.environ.get("SECRET_KEY_TEST")
            self.FRONTEND_URL = "http://localhost:3000"
            self.RESEND_API_KEY = os.environ.get("RESEND_TEST_API_KEY")
            self.AUTH_GOOGLE_ID = os.environ.get("AUTH_GOOGLE_ID_TEST")
            self.AUTH_GOOGLE_SECRET = os.environ.get("AUTH_GOOGLE_SECRET_TEST")
            self.DJANGO_SUPERUSER_USERNAME = os.environ.get("DJANGO_SUPERUSER_USERNAME_TEST", "admin")
            self.DJANGO_SUPERUSER_EMAIL = os.environ.get("DJANGO_SUPERUSER_EMAIL_TEST", "admin@example.com")

            return self
        else:
            self.SECRET_KEY = get_secret("SECRET_KEY")
            self.POSTGRES_DB_PASSWORD = get_secret("POSTGRES_DB_PASSWORD")
            self.RESEND_API_KEY = get_secret("RESEND_API_KEY")
            self.AUTH_GOOGLE_ID = get_secret("AUTH_GOOGLE_ID")
            self.AUTH_GOOGLE_SECRET = get_secret("AUTH_GOOGLE_SECRET")
            self.DJANGO_SUPERUSER_PASSWORD = get_secret("DJANGO_SUPERUSER_PASSWORD")

            self.FRONTEND_URL = os.environ.get("FRONTEND_URL")
            self.POSTGRES_DB_NAME = os.environ.get("POSTGRES_DB_NAME")
            self.POSTGRES_DB_USER = os.environ.get("POSTGRES_DB_USER")
            self.POSTGRES_DB_HOST = os.environ.get("POSTGRES_DB_HOST")
            self.POSTGRES_DB_PORT = os.environ.get("POSTGRES_DB_PORT")
            self.ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS")
            self.DJANGO_SUPERUSER_USERNAME=os.environ.get("DJANGO_SUPERUSER_USERNAME", "admin")
            self.DJANGO_SUPERUSER_EMAIL=os.environ.get("DJANGO_SUPERUSER_EMAIL", "admin@example.com")
            self.SERVER_ADDRESS=os.environ.get("SERVER_ADDRESS", "0.0.0.0")
            self.SERVER_PORT=os.environ.get("SERVER_PORT", 8000)

            return self


env = Environment()
