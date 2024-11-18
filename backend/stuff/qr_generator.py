import os

import qrcode
from qrcode import main as qrcode_main


def generate_2fa_key_in_qr_code(data):
    qr = qrcode_main.QRCode(
        version=2,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=5,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)

    return qr.make_image(fill="black", back_color="white")


if __name__ == "__main__":
    test_data = "otpauth://totp/testuser?secret=7JHJUOZQN4PBQK4ZTJONKSGQUYGGDESL&algorithm=SHA1&digits=6&period=30"
    qr = generate_2fa_key_in_qr_code(test_data)

    qr_dir = "/Users/pavelbeard/Documents/ProgImages"

    if not os.path.dirname(qr_dir):
        os.mkdir(qr_dir)

    with open(os.path.join(qr_dir, "qr.png"), "wb") as image:
        qr.save(image)
