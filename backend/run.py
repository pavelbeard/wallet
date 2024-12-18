import logging
import os
import subprocess
import sys

from django.core.management import CommandError, execute_from_command_line
from env_config import env

def check_db(
    args, post_args: list | tuple, db: str, seconds: int = 0, attempts: int = 5
) -> bool:
    """Checking db"""
    _args = args + post_args
    _args.append(db)

    if seconds > 0:
        _args += ["--seconds", f"{seconds}"]
    if attempts > 0:
        _args += ["--attempts", f"{attempts}"]

    try:
        execute_from_command_line(_args)
        return True
    except Exception as e:
        logging.error("Error: ", e)
        return False


def migrate():
    """Apply migrations to DB"""
    execute_from_command_line(["manage.py", "migrate"])


def createsuperuser():
    """Create superuser"""
    try:
        execute_from_command_line(
            [
                "manage.py",
                "initadmin",
            ]
        )
    except CommandError as e:
        logging.info("Info: ", e)


def collectstatic():
    """Colocation staticfiles on nginx"""
    execute_from_command_line(["manage.py", "collectstatic", "--noinput", "--clear"])


def create_devices():
    """Create devices"""
    execute_from_command_line(["manage.py", "loaddata", "devices.json"])


def main(app_name):
    """Managing stages of app"""
    if not app_name:
        raise ValueError("app_name cannot be empty")

    if check_db(["manage.py"], post_args=["checkdb", "--database"], db="default"):
        migrate()
        createsuperuser()
        collectstatic()
        create_devices()
        p = subprocess.Popen(
            args=[
                "uvicorn",
                f"{app_name}",
                "--host",
                f"{env.get_env.SERVER_ADDRESS}",
                "--port",
                f"{env.get_env.SERVER_PORT}",
            ]
        )
        p.communicate()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    os.environ["DJANGO_SETTINGS_MODULE"] = "wallet.settings"
    main(app_name="wallet.asgi:application")
