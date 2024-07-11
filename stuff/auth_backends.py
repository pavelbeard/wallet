from django.conf import settings
from django.contrib.auth.backends import ModelBackend


class WalletAuthBackend(ModelBackend):
    def authenticate(self, username=None, password=None, telegram_id=None, telegram_username=None, **kwargs):
        if username is not None:
            try:
                user = settings.AUTH_USER_MODEL.objects.get(username=username)
                if user.check_password(password):
                    return user
            except settings.AUTH_USER_MODEL.DoesNotExist:
                return None
        elif telegram_id is not None:
            try:
                user = settings.AUTH_USER_MODEL.objects.get(telegram_id=telegram_id)
                if user.check_password(password):
                    return user
            except settings.AUTH_USER_MODEL.DoesNotExist:
                return None
            
        else:
            return None
