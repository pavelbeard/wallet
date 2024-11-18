from enum import Enum


class LOGIN_TYPE(Enum):
    CREDENTIALS: str = "credentials"
    OAUTH2: str = "oauth2"
