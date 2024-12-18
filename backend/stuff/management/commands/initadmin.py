from django.core.management.base import BaseCommand
from env_config import env

help_string = "Create admin user from env variables: DJANGO_SUPERUSER_USERNAME, DJANGO_SUPERUSER_EMAIL, DJANGO_SUPERUSER_PASSWORD"


class Command(BaseCommand):
    help = help_string

    def handle(self, *args, **options):
        from django.contrib.auth import get_user_model

        User = get_user_model()

        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser(
                username=env.get_env.DJANGO_SUPERUSER_USERNAME,
                email=env.get_env.DJANGO_SUPERUSER_EMAIL,
                password=env.get_env.DJANGO_SUPERUSER_PASSWORD,
            )

            self.stdout.write(self.style.SUCCESS("Admin created"))
        else:
            self.stdout.write(self.style.ERROR("Admin already exists"))


Command.__doc__ = help_string
