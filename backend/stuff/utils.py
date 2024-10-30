from enum import Enum

from attr import dataclass
from django.contrib.auth import get_user_model

from stuff.models import WalletUser

User: WalletUser = get_user_model()

class LOGIN_TYPE(Enum):
    CREDENTIALS: str = 'credentials'
    OAUTH2: str = 'oauth2'
