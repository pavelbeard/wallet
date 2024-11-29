import enum
from enum import Enum


class Action(enum.Enum):
    sign_in = "sign_in"
    verify = "verify"
    delete = "delete"

class LOGIN_TYPE(Enum):
    CREDENTIALS: str = "credentials"
    OAUTH2: str = "oauth2"
