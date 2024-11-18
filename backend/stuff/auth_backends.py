from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

User = get_user_model()


class WalletAuthBackend(ModelBackend):
    def authenticate(self, username=None, email=None, password=None, **kwargs):
        user = None

        if username:
            try:
                if "@" in username:
                    user = User.objects.get(email=username)
                else:
                    user = User.objects.get(username=username)
            except User.DoesNotExist:
                pass

        if not user and email:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                pass

        if user and user.check_password(password):
            return user

        if user and user.password is None:
            return user

        return None
