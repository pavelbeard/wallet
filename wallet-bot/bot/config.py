import os

DEBUG = bool(int(os.environ.get('DEBUG', 1)))
PRE_PRODUCTION = bool(int(os.environ.get('PRE_PRODUCTION', 0)))
BOT_KEY = os.environ.get('WALLET_BOT')
BACKEND_URL = os.environ.get('WALLET_BACKEND_URL', 'http://localhost:8000')
