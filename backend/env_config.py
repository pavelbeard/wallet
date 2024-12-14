import os
from pathlib import Path


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
            SECRET_KEY_FILE = "/run/secrets/SECRET_KEY_CUSEC"
            POSTGRES_DB_PASSWORD_FILE = "/run/secrets/POSTGRES_DB_PASSWORD_CUSEC"
            RESEND_API_KEY_FILE = "/run/secrets/RESEND_API_KEY_CUSEC"
            AUTH_GOOGLE_ID_FILE = "/run/secrets/AUTH_GOOGLE_ID_CUSEC"
            AUTH_GOOGLE_SECRET_FILE = "/run/secrets/AUTH_GOOGLE_SECRET_CUSEC"

            if os.path.exists(SECRET_KEY_FILE):
                with open(SECRET_KEY_FILE, "r") as f:
                    self.SECRET_KEY = f.read()
            else:
                self.SECRET_KEY = os.environ.get("SECRET_KEY")

            if os.path.exists(POSTGRES_DB_PASSWORD_FILE):
                with open(POSTGRES_DB_PASSWORD_FILE, "r") as f:
                    self.POSTGRES_DB_PASSWORD = f.read()
            else:
                self.POSTGRES_DB_PASSWORD = os.environ.get("POSTGRES_DB_PASSWORD")

            if os.path.exists(RESEND_API_KEY_FILE):
                with open(RESEND_API_KEY_FILE, "r") as f:
                    self.RESEND_API_KEY = f.read()
            else:
                self.RESEND_API_KEY = os.environ.get("RESEND_TEST_API_KEY")

            if os.path.exists(AUTH_GOOGLE_ID_FILE):
                with open(AUTH_GOOGLE_ID_FILE, "r") as f:
                    self.AUTH_GOOGLE_ID = f.read()
            else:
                self.AUTH_GOOGLE_ID = os.environ.get("AUTH_GOOGLE_ID")

            if os.path.exists(AUTH_GOOGLE_SECRET_FILE):
                with open(AUTH_GOOGLE_SECRET_FILE, "r") as f:
                    self.AUTH_GOOGLE_SECRET = f.read()
            else:
                self.AUTH_GOOGLE_SECRET = os.environ.get("AUTH_GOOGLE_SECRET")

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
