import os

from abstract.managers import AbstractManager
from django.apps import apps
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.hashers import make_password
from django.template.loader import render_to_string
from django.utils.translation import gettext_lazy as _
from utils.email_utils import send_email
from utils.password_utils import generate_master_password, hash_master_password

from utils.template_messages import create_welcome_context


class WalletUserManager(BaseUserManager, AbstractManager):
    def _create_user(self, username=None, email=None, password=None, **extra_fields):
        """
        Create and save a user with the given username/email and password.
        """
        first_name = extra_fields.get("first_name")
        last_name = extra_fields.get("last_name")

        if not (username or first_name or last_name or email):
            raise ValueError("Username/first_name/last_name/email are required.")
        # Lookup the real model class from the global app registry, so this
        # manager method can be used in migrations. This is fine because
        # managers are, by definition, working on the real model.
        GlobalUserModel = apps.get_model(
            self.model._meta.app_label, self.model._meta.object_name
        )

        user_data = {**extra_fields}
        if username:
            user_data["username"] = GlobalUserModel.normalize_username(username)
        if email:
            user_data["email"] = self.normalize_email(email)
        if user_data.get("master_password"):
            user_data["master_password"] = hash_master_password(
                master_password=user_data.get("master_password"),
                salt=os.urandom(16).hex(),
            )

        user = self.model(**user_data)
        if password and not extra_fields.get("is_oauth_user"):
            user.password = make_password(password)
        elif not extra_fields.get("is_superuser") or (
            not password and not extra_fields.get("is_oauth_user")
        ):
            raise TypeError(_("Password or oauth creation method are required."))

        if extra_fields.get("is_oauth_user"):
            user.is_oauth_user = True

        user.save(using=self._db)
        return user

    def create_user(self, username=None, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        extra_fields.setdefault("is_oauth_user", False)

        return self._create_user(username, email, password, **extra_fields)

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        master_password = generate_master_password()

        context = create_welcome_context(master_password, "Cartera admin")

        send_email(
            email=email,
            subject=str(_("Welcome!")),
            body=render_to_string("stuff/templates/welcome.html", context),
        )

        extra_fields.setdefault("master_password", master_password)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(
            username=username, email=email, password=password, **extra_fields
        )
