import os
import random
import string
from base64 import urlsafe_b64encode
from functools import cache

from cryptography.fernet import Fernet
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.hashes import SHA256
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from django.contrib.auth.hashers import check_password, make_password


@cache
def derive_key(master_password: str, salt: bytes, iterations: int = 100000) -> str:
    kdf = PBKDF2HMAC(
        algorithm=SHA256(),
        length=32,
        backend=default_backend(),
        salt=salt,
        iterations=iterations,
    )

    return urlsafe_b64encode(kdf.derive(master_password.encode("utf-8")))


def encrypt(plaintext: str, master_password: str) -> bytes:
    salt = os.urandom(16)
    key = derive_key(master_password, salt)
    cipher = Fernet(key)
    encrypted_data = cipher.encrypt(plaintext.encode("utf-8"))
    return {
        "salt": salt.hex(),
        "encrypted_data": encrypted_data.decode("utf-8"),
    }


def decrypt(encrypted_data: str, salt: str, master_password: str) -> str:
    salt_bytes = bytes.fromhex(salt)
    key = derive_key(master_password, salt_bytes)
    cipher = Fernet(key)
    decrypted_data = cipher.decrypt(encrypted_data.encode("utf-8"))
    return decrypted_data.decode("utf-8")


def compare_passwords(password: str, hashed_password: str) -> bool:
    """Compares a plain password with an hashed password.

    Args:
        password (str): The plain password to compare.
        hashed_password (str): The hashed password to compare against.

    Returns:
        bool: True if the passwords match, False otherwise.
    """

    return check_password(password, hashed_password)


def hash_master_password(master_password: str, salt: str) -> str:
    """Hashes a master password using the Argon2 algorithm.

    Args:
        master_password (str): The master password to hash.
        salt (str): The salt to use for hashing.

    Returns:
        str: The hashed master password.
    """
    hashed_master_password = make_password(
        password=master_password, salt=salt, hasher="argon2"
    )
    return hashed_master_password


def generate_master_password():
    """Generate a random master password."""
    password = ""
    for i in range(7):
        if i == 0:
            password += (
                "".join(
                    [
                        random.choice(string.ascii_uppercase + string.digits)
                        for _ in range(2)
                    ]
                )
                + "-"
            )
        else:
            password += (
                "".join(
                    [
                        random.choice(string.ascii_uppercase + string.digits)
                        for _ in range(6)
                    ]
                )
                + "-"
            )

    return password[:-1]
