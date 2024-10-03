from django.apps import apps
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.hashers import make_password


class WalletUserManager(BaseUserManager):
    def _create_user(
            self, username=None, email=None, password=None, **extra_fields
    ):
        """
        Create and save a user with the given username/email and password.
        """
        if not (username or email):
            raise ValueError("Username/email cannot be empty.")
        # Lookup the real model class from the global app registry, so this
        # manager method can be used in migrations. This is fine because
        # managers are, by definition, working on the real model.
        GlobalUserModel = apps.get_model(
            self.model._meta.app_label, self.model._meta.object_name
        )

        user_data = {**extra_fields}
        if username:
            user_data['username'] = GlobalUserModel.normalize_username(username)
        if email:
            user_data['email'] = self.normalize_email(email)

        user = self.model(**user_data)
        if password:
            user.password = make_password(password)
        user.save(using=self._db)
        return user

    def create_user(
            self, username=None, email=None, password=None, **extra_fields
    ):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(username, email, password, **extra_fields)

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(username=username, email=email, password=password, **extra_fields)
