import logging
import os
import subprocess
import sys

import uvicorn
from django.core.management import execute_from_command_line, CommandError

SERVER_ADDRESS = os.environ.get('SERVER_ADDRESS', '0.0.0.0')
SERVER_PORT = os.environ.get('SERVER_PORT', '8000')
DJANGO_SETTINGS_DEBUG_MODE = bool(os.environ.get('DJANGO_SETTINGS_DEBUG_MODE', 0))
DJANGO_SETTINGS_PRODUCTION_MODE = bool(os.environ.get('DJANGO_SETTINGS_PRODUCTION_MODE', 0))


def check_db(args, post_args: list | tuple, db: str, seconds: int = 0, attempts: int = 5) -> bool:
    """Checking db"""
    _args = args + post_args
    _args.append(db)

    if seconds > 0:
        _args += ["--seconds", f"{seconds}"]
    if attempts > 0:
        _args += ["--attempts", f"{attempts}"]

    p = subprocess.Popen(_args)
    p.communicate()

    exit_code = p.returncode

    logging.info(msg=f"Task has returned exit code: {exit_code}")

    return exit_code == 0


def migrate():
    """Apply migrations to DB"""
    execute_from_command_line(['manage.py', 'migrate'])


def createsuperuser():
    """Create superuser"""
    try:
        from django.contrib.auth import get_user_model
        User = get_user_model()
        if not User.objects.filter(username=os.getenv('DJANGO_SUPERUSER_USERNAME')).exists():
            execute_from_command_line(['manage.py', 'createsuperuser',
                                       '--username', os.getenv("DJANGO_SUPERUSER_USERNAME", "admin"),
                                       '--noinput',
                                       '--email', os.getenv("DJANGO_SUPERUSER_EMAIL", "admin@example.com")])
    except CommandError as e:
        logging.info(f"Info: ", e)


def collectstatic():
    """Colocation staticfiles on nginx"""
    execute_from_command_line(['manage.py', 'collectstatic', '--noinput', '--clear'])


def main(app_name):
    """Managing stages of app"""
    if not app_name:
        raise ValueError('app_name cannot be empty')

    if check_db(["python", "manage.py"], post_args=["checkdb", "--database"], db="default"):
        migrate()
        createsuperuser()
        collectstatic()
        p = subprocess.Popen(f'uvicorn {app_name} --host {SERVER_ADDRESS} --port {SERVER_PORT}'.split())
        p.communicate()


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    os.environ['DJANGO_SETTINGS_MODULE'] = 'wallet.settings'
    main(app_name="wallet.asgi:application")
