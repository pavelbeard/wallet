"""
Django settings for wallet project.

Generated by 'django-admin startproject' using Django 5.0.6.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

import environ
import os
import re
from pathlib import Path

from django.utils import timezone

# Build paths inside the project like this: BASE_DIR / 'subdir'.

env = environ.Env(
    DJANGO_SETTINGS_DEBUG_MODE=(bool, False),
    FRONTEND_URL=(str, "http://localhost:3000"),
    RESEND_API_KEY=(str, os.environ.get("RESEND_TEST_API_KEY")),
)

BASE_DIR = Path(__file__).resolve().parent.parent

environ.Env.read_env(os.path.join(BASE_DIR, ".env.local"), overwrite=True)

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env("DJANGO_SETTINGS_DEBUG_MODE")


# dotenv


ALLOWED_HOSTS = ["*"]

# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # local
    "cards",
    "stuff",
    # third party,
    "check_db",
    "corsheaders",
    "singleton",
    "rest_framework",
    "nanoid_field",
    "django_extensions",
    # auth
    "rest_framework.authtoken",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "dj_rest_auth",
    "dj_rest_auth.registration",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
    # 2fa
    "django_otp",
    "django_otp.plugins.otp_totp",
    "django_otp.plugins.otp_static",
]

MIDDLEWARE = [
    "allauth.account.middleware.AccountMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django_otp.middleware.OTPMiddleware",
    "stuff.middleware.UserInfoMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "corsheaders.middleware.CorsMiddleware",
]

ROOT_URLCONF = "wallet.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "wallet.wsgi.application"

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

if DEBUG:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }
elif not DEBUG:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": env("POSTGRES_DB_NAME"),
            "USER": env("POSTGRES_DB_USER"),
            "PASSWORD": env("POSTGRES_DB_PASSWORD"),
            "HOST": env("POSTGRES_DB_HOST"),
            "PORT": env("POSTGRES_DB_PORT"),
        }
    }

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "Europe/Madrid"

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_ROOT = BASE_DIR / "media"

# static
if DEBUG:
    STATIC_URL = "/static/"
else:
    STATIC_URL = "/backend/static/"

# media

if DEBUG:
    MEDIA_URL = "/media/"
else:
    MEDIA_URL = "/backend/media/"
    

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# HTTPS
if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    USE_X_FORWARDED_PROTO = True

if DEBUG:
    INTERNAL_IPS = ["127.0.0.1", "localhost"]

# CSRF

CSRF_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_NAME = "csrfmiddlewaretoken"
CSRF_COOKIE_HTTPONLY = True

if DEBUG:
    CSRF_COOKIE_SECURE = False
else:
    CSRF_COOKIE_SECURE = True

if DEBUG:
    CSRF_TRUSTED_ORIGINS = [
        "http://localhost:3000",
        "http://localhost:3010",
        "https://localhost",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3010",
        "https://127.0.0.1",
    ]
else:
    CSRF_TRUSTED_ORIGINS = re.split(r",|\s", env("ALLOWED_ORIGINS"))

# CORS

if DEBUG:
    CORS_ORIGIN_ALLOW_ALL = True
else:
    CORS_ALLOWED_ORIGINS = re.split(r",|\s", env("ALLOWED_ORIGINS"))

CORS_ALLOWED_METHODS = ["GET", "POST", "PUT", "OPTIONS", "DELETE"]
CORS_ALLOW_CREDENTIALS = True

# DRF

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    "PAGE_SIZE": 9,
    "DEFAULT_FILTER_BACKENDS": ("django_filters.rest_framework.DjangoFilterBackend",),
    # "DEFAULT_THROTTLE_RATES": {"anon": "100/day", "user": "1000/day"},
}

# JWT

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timezone.timedelta(minutes=10)
    if DEBUG
    else timezone.timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timezone.timedelta(hours=12),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "VERIFYING_KEY": None,
    "AUTH_HEADER_TYPES": ["JWT", "Bearer"],
    "USER_ID_FIELD": "public_id",
    "USER_ID_CLAIM": "public_id",
    "AUTH_TOKEN_CLASSES": ["rest_framework_simplejwt.tokens.AccessToken"],
    "TOKEN_TYPE_CLAIM": "token_type",
    
    "AUTH_ACCESS_COOKIE": "__clientid",
    "AUTH_REFRESH_COOKIE": "__rclientid",
    "AUTH_COOKIE_DOMAIN": None,
    "AUTH_COOKIE_SECURE": False,
    "AUTH_COOKIE_HTTP_ONLY": True,
    "AUTH_COOKIE_PATH": "/",
    "AUTH_COOKIE_SAMESITE": "Lax",
    
    "TOKEN_OBTAIN_SERIALIZER": "stuff.serializers.TwoFactorJWTSerializer",
}

# custom user˘

AUTH_USER_MODEL = "stuff.WalletUser"

# custom auth backends

AUTHENTICATION_BACKENDS = (
    "django.contrib.auth.backends.ModelBackend",
    "stuff.auth_backends.WalletAuthBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
)

# dj rest auth

SITE_ID = 1

REST_AUTH = {
    "USE_JWT": True,
    "JWT_AUTH_HTTPONLY": False,
}

# social account

if DEBUG:
    SOCIALACCOUNT_EMAIL_VERIFICATION = "none"
    SOCIALACCOUNT_EMAIL_REQUIRED = False

SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "SCOPE": [
            "profile",
            "email",
        ],
        "APP": {
            "client_id": env("AUTH_GOOGLE_ID"),
            "secret": env("AUTH_GOOGLE_SECRET"),
            "key": "",
        },
        "AUTH_PARAMS": {
            "access_type": "online",
        },
        "VERIFIED_EMAIL": True,
        "FETCH_USERINFO": True,
    }
}

FRONTEND_URL = env("FRONTEND_URL")

# email

EMAIL_HOST_USER = "onboarding@resend.dev"
RESEND_API_KEY = env("RESEND_API_KEY")