import logging
from django.conf import settings
import resend

logger = logging.getLogger(__name__)


def send_email(email: str, subject: str, body: str,):
    try:
        resend.api_key = settings.RESEND_API_KEY

        params: resend.Emails.SendParams = {
            "from": settings.EMAIL_HOST_USER,
            "to": [email],
            "subject": subject,
            "html": body,
        }

        r = resend.Emails.send(params)
        return r
    except Exception as e:
        logger.error(e.args[0], exc_info=True)
        return None
