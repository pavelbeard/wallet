import enum
from enum import Enum


class Action(enum.Enum):
    verify = "verify"
    delete = "delete"

class LOGIN_TYPE(Enum):
    CREDENTIALS: str = "credentials"
    OAUTH2: str = "oauth2"
