
from typing import Dict

from abstract.managers import AbstractManager
from django.apps import apps
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.hashers import make_password
from django.utils.translation import gettext_lazy as _


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

        user = self.model(**user_data)
        if password and not extra_fields.get("is_oauth_user"):
            user.password = make_password(password)

        if not password and not extra_fields.get("is_oauth_user"):
            raise TypeError(_("Password or oauth creation method are required."))

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

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(
            username=username, email=email, password=password, **extra_fields
        )
