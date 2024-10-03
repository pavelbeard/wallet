from django.utils.translation import gettext_lazy as _
from django_otp import user_has_device
from rest_framework import permissions


class IsOtpVerified(permissions.BasePermission):
    """Obligate to user to have verified an OTP device"""
    message = _("You don't have permission to perform this action. You need to verify your OTP device.")
    def has_permission(self, request, view):
        if user_has_device(request.user):
            return True

        return False