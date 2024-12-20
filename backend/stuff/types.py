import enum
from enum import Enum
from typing import Generic, Iterator, TypeVar, Union

from django.db.models import QuerySet

T = TypeVar("T")


class Action(enum.Enum):
    sign_in = "sign_in"
    verify = "verify"
    delete = "delete"
    oauth2 = "oauth2"
    master_password = "master_password"


class LOGIN_TYPE(Enum):
    CREDENTIALS: str = "credentials"
    OAUTH2: str = "oauth2"


class ModelType(Generic[T]):
    def __iter__(self) -> Iterator[Union[T, QuerySet]]:
        pass
