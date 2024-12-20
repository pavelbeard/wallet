from django.utils.translation import gettext_lazy as _
from django_otp import user_has_device
from rest_framework import permissions
from utils import two_factor_utils


class IsOtpVerified(permissions.BasePermission):
    """Obligate to user to have verified an OTP device"""

    message = _(
        "You don't have permission to perform this action. You need to verify your OTP device."
    )

    def has_permission(self, request, view):
        if user_has_device(request.user):
            return True

        return False


class IsUserVerified(permissions.BasePermission):
    """User must be verified"""

    message = _(
        "You don't have permission to perform this action. You need to verify your identity with master password or OTP."
    )

    def has_permission(self, request, view):
        token = request.META.get("HTTP_AUTHORIZATION")

        decoded_token = two_factor_utils.jwt_decode_handler(token.split(" ")[1])

        if decoded_token.get("verified"):
            return True

        return False

    # TODO: continue tomorrow
