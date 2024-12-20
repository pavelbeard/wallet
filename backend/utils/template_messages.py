from django.utils import timezone
from django.utils.translation import gettext_lazy as _


def create_welcome_context(master_password: str, first_last_name: str, oauth_user: bool = False) -> str:
    oauth_text = _("You are registered as an OAuth user.") if oauth_user else ""

    context = {
        "welcome_title": _("Welcome, ") + first_last_name  + "!",
        "welcome_text": _("Thanks for registration in a super vault of your secrets!"),
        "master_password_text_1": _("Your master password is:"),
        "master_password_text_2": _(
            "Please save this password in a safe physical place."
        ),
        "master_password_text_3": " Master password gives you ONLY ONE TIME. If you lose it, you will not be able to access your wallet.",
        "master_password": master_password,
        "oauth_text": oauth_text,
        "team": _("Thanks again! Your Cartera team."),
        "year": timezone.now().year,
        "all_rights_reserved": _("All rights reserved."),
    }

    return context
