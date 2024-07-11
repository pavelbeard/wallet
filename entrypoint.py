import os
import subprocess

SERVER_ADDRESS = os.environ.get('SERVER_ADDRESS', '0.0.0.0')
SERVER_PORT = os.environ.get('SERVER_PORT', '8080')
DJANGO_SETTINGS_DEBUG_MODE = bool(os.environ.get('DJANGO_SETTINGS_DEBUG_MODE', 0))
DJANGO_SETTINGS_PRE_PRODUCTION_MODE = bool(os.environ.get('DJANGO_SETTINGS_PRE_PRODUCTION_MODE', 0))


def call_django_functions(args, post_args: list | tuple):
    p = subprocess.Popen(args + post_args)
    p.communicate()