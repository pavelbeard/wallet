from cryptography.fernet import Fernet


def encrypt_password(password: str, master_password) -> bytes:
    f = Fernet(master_password)

    encrypted_password = f.encrypt(password)
    return encrypted_password


def decrypt_password(password: str, master_password) -> str:
    f = Fernet(master_password)

    decrypted_password = f.decrypt(password)
    return decrypted_password
