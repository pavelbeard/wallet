import uuid
from typing import Any, Dict

from django.conf import settings
from django.db.models import QuerySet
from django.http import HttpRequest, HttpResponse
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django_otp import devices_for_user
from django_otp.plugins.otp_static.models import StaticDevice, StaticToken
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt import tokens

from stuff.utils import send_email, suggest_username

from . import exceptions, serializers, two_factor_utils
from .models import EmailVerificationToken, PasswordResetToken, WalletUser
from .types import Action


class Auth:
    @staticmethod
    def sign_up(request: HttpRequest) -> Response:
        serializer = serializers.SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        master_password = serializer.validated_data.get("master_password")

        user = WalletUser.objects.filter(email=instance.email).first()

        context = {
            "welcome_title": _("Welcome!"),
            "welcome_text": _(
                "Thanks for registration in a super vault of your secrets!"
            ),
            "master_password_text_1": _("Your master password is:"),
            "master_password_text_2": _(
                "Please save this password in a safe physical place."
            ),
            "master_password": master_password,
            "team": _("Thanks again! Your Cartera team."),
            "year": timezone.now().year,
            "all_rights_reserved": _("All rights reserved."),
        }

        send_email(
            email=user.email,
            subject=str(_("Welcome!")),
            body=render_to_string("stuff/templates/welcome.html", context),
        )

        return Response(status=status.HTTP_201_CREATED)

    @staticmethod
    def sign_in(request: HttpRequest) -> Response:
        serializer = serializers.TwoFactorJWTSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data: Dict[str, str | bool] = serializer.validated_data

        response = Response()
        access_token = data["access"]
        refresh_token = data["refresh"]
        user_is_active = data["user_is_active"]

        if user_is_active:
            response.data = {
                "access": access_token,
                "refresh": refresh_token,
            }
            auth_response = response
            csrf_response = two_factor_utils.set_csrf_cookie(
                request=request, response=auth_response
            )
            return csrf_response

        raise exceptions.AuthenticationFailed(_("User is not active"))

    @staticmethod
    def sign_out(request: HttpRequest) -> Response:
        serializer = serializers.SignOutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data: Dict[str, str] = serializer.validated_data

        refresh_token = data.get("refresh_token")

        token = tokens.RefreshToken(refresh_token)
        token.blacklist()

        return Response({"detail": _("You're logged out!")}, status=status.HTTP_200_OK)


class Oauth2Auth:
    @staticmethod
    def signin_with_google(request: HttpRequest, response: HttpResponse) -> Response:
        # TOKEN Doesn't work in frontend
        response_user_data = response.data.get("user")
        user = WalletUser.objects.get(pk=response_user_data.get("pk"))

        user.email = response_user_data.get("email")
        user.first_name = response_user_data.get("first_name")
        user.last_name = response_user_data.get("last_name")
        user.is_oauth_user = True
        user.email_verified = True
        user.save()

        jwt_tokens = two_factor_utils.get_custom_jwt(user=user, action=Action.oauth2)

        return Response(
            data={"access": jwt_tokens["access"], "refresh": jwt_tokens["refresh"]},
            status=status.HTTP_200_OK,
        )


class TOTPDeviceController:
    @staticmethod
    def create_totp_device(request: HttpRequest):
        # new response
        response = Response()
        # configure device
        user = request.user
        device = two_factor_utils.get_user_totp_device(user)
        if not device:
            device = user.totpdevice_set.create(confirmed=False)
        url = device.config_url
        response.status_code = status.HTTP_200_OK
        response.data = {"config_key": url}
        return response

    @staticmethod
    def verify_totp_device(request: HttpRequest) -> Response:
        serializer = serializers.VerifyTOTPDeviceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user: WalletUser = request.user
        data: Dict[str, str] = serializer.validated_data

        otp_token = data.get("token")
        if not otp_token:
            return Response(
                {"error": _("Token is missing.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        device = two_factor_utils.get_user_totp_device(user)
        if device is not None and device.verify_token(token=otp_token):
            if not device.confirmed:
                device.confirmed = True
                device.save()

                user.is_two_factor_enabled = True
                user.save()
            tokens = two_factor_utils.get_custom_jwt(user, device, action=Action.verify)
            response = Response(status=status.HTTP_200_OK)
            response.data = {
                "access": tokens["access"],
                "refresh": tokens["refresh"],
            }
            new_token_response = response
            return new_token_response

        raise exceptions.VerifyTokenError(_("Invalid token"))

    @staticmethod
    def create_backup_tokens(request: HttpRequest):
        number_of_codes = 12
        device = two_factor_utils.get_user_static_device(request.user)
        if not device:
            device = StaticDevice.objects.create(user=request.user, name="Static")

        device.token_set.all().delete()
        tokens = []
        for i in range(number_of_codes):
            token = StaticToken.random_token()
            device.token_set.create(token=token)
            tokens.append(token)

        return Response(tokens, status=status.HTTP_201_CREATED)

    @staticmethod
    def verify_backup_token(request: HttpRequest):
        otp_token = request.data.get("token")
        if not otp_token:
            return Response(
                {"error": _("Token is missing.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user
        device = two_factor_utils.get_user_static_device(user)
        if device is not None and device.verify_token(otp_token):
            token = two_factor_utils.get_custom_jwt(user, device)
            # TODO: update refresh token
            return Response({"access": token}, status=status.HTTP_200_OK)

        raise exceptions.VerifyBackupTokenError(_("Invalid token"))

    @staticmethod
    def delete_totp_device(request: HttpRequest):
        user: WalletUser = request.user
        serializer = serializers.PasswordSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        devices = devices_for_user(user)
        for device in devices:
            device.delete()

        user.jwt_secret = uuid.uuid4()
        user.is_two_factor_enabled = False
        user.save()

        tokens = two_factor_utils.get_custom_jwt(user, None, Action.delete)
        response = Response(status=status.HTTP_200_OK)
        response.data = {"detail": _("Device detached from 2FA")}

        response.data = {
            **response.data,
            "access": tokens["access"],
            "refresh": tokens["refresh"],
        }
        new_token_response = response
        return new_token_response


class WalletUserController:
    @staticmethod
    def check_user_by_username(
        request: HttpRequest, qs: QuerySet[WalletUser], **kwargs
    ):
        param = request.query_params.get("username")
        if not param:
            raise TypeError()
        user = get_object_or_404(qs, username=param)
        data = serializers.WalletUserSerializer(user).data
        return Response(data, status=status.HTTP_200_OK)

    @staticmethod
    def check_user_by_email(request: HttpRequest, qs: QuerySet[WalletUser], **kwargs):
        param = request.query_params.get("email")
        if not param:
            raise TypeError()
        user = get_object_or_404(qs, email=param)
        data = serializers.WalletUserSerializer(user).data
        return Response(data, status=status.HTTP_200_OK)

    @staticmethod
    def change_email_request(request: HttpRequest) -> Response:
        serializer = serializers.ChangeEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user: WalletUser = request.user
        validated_data: Dict[str, str] = serializer.validated_data

        email = validated_data.get("email")

        old_records = EmailVerificationToken.objects.filter(user=user)
        if old_records.exists():
            old_records.update(is_active=False)

        record = EmailVerificationToken.objects.create(user=user, email=email)
        
        context = {
            "change_email_title": _("Change email request"),
            "change_email_text_1": _("Please verify your email by this"),
            "change_email_link": f"{settings.FRONTEND_URL}/verify-email?token={record.token}",
            "change_email_link_text": _("link"),
            "change_email_text_2": _(
                "If you didn't request this, please ignore this email."
            ),
            "year": timezone.now().year,
            "all_rights_reserved": _("All rights reserved."),
            "team": _("Thanks again! Your Cartera team."),
        }

        send_email(
            email=email,
            subject=str(_("Change email verification")),
            body=render_to_string("stuff/templates/change_email.html", context),
        )

        return Response(
            {"detail": _("A token has been sent to your new email")},
            status=status.HTTP_200_OK,
        )

    @staticmethod
    def verify_email_change(request: HttpRequest) -> Response:
        serializer = serializers.VerifyEmailChangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data: Dict[str, str] = serializer.validated_data

        email = validated_data.get("email")
        user = WalletUser.objects.filter(pk=validated_data.get("user_pk")).first()

        user.email = email
        user.save()

        return Response(
            {
                "new_email": email,
            },
            status=status.HTTP_200_OK,
        )

    @staticmethod
    def change_password(request: HttpRequest, pk: str) -> Response:
        """Change user password."""
        serializer = serializers.ChangePasswordSerializer(
            data=request.data, context={"public_id": pk}
        )
        serializer.is_valid(raise_exception=True)

        validated_data: Dict[str, str] = serializer.validated_data

        user = WalletUser.objects.filter(
            public_id=validated_data.get("public_id")
        ).first()
        if not user:
            raise TypeError(_("User not found"))

        user.set_password(validated_data.get("password"))
        user.save()

        return Response({"detail": _("Password changed!")}, status=status.HTTP_200_OK)

    @staticmethod
    def create_reset_password_request(request: HttpRequest) -> Response:
        """Forgot password."""
        serializer = serializers.CreateResetPasswordRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data: Dict[str, str] = serializer.validated_data

        email = validated_data.get("email")

        user = WalletUser.objects.filter(email=email).first()

        if not user:
            raise TypeError(_("User not found"))

        old_records = PasswordResetToken.objects.filter(user=user)
        if old_records.exists():
            old_records.update(is_active=False)

        record = PasswordResetToken.objects.create(user=user)

        context = {
            "reset_password_title": _("Reset password request"),
            "reset_password_text_1": _("Please reset your password by this"),
            "reset_password_link": f"{settings.FRONTEND_URL}/reset-password?token={record.token}",
            "reset_password_link_text": _("link"),
            "reset_password_text_2": _(
                "If you didn't request this, please ignore this email."
            ),
            "year": timezone.now().year,
            "all_rights_reserved": _("All rights reserved."),
            "team": _("Thanks again! Your Cartera team."),
        }

        send_email(
            email=user.email,
            subject=str(_("Reset your password")),
            body=render_to_string("stuff/templates/reset_password.html", context),
        )

        return Response(
            {"detail": _("Password reset link sent to your email!")},
            status=status.HTTP_200_OK,
        )

    @staticmethod
    def create_new_password(request: HttpRequest) -> Response:
        serializer = serializers.CreateNewPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data: Dict[str, str | int] = serializer.validated_data

        user = WalletUser.objects.filter(
            public_id=validated_data.get("public_id")
        ).first()
        password = validated_data.get("password")

        if not user:
            raise TypeError(_("User not found"))

        user.set_password(password)
        user.save()

        return Response(
            {"detail": _("Password changed!")},
            status=status.HTTP_200_OK,
        )

    @staticmethod
    def username_suggestions(request: HttpRequest) -> Response:
        serializer = serializers.UsernameSuggestionsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data: Dict[str, str | int] = serializer.validated_data

        username = validated_data.get("username")
        roll_count = validated_data.get("count")

        if not username:
            raise TypeError(_("Please provide username in query params"))

        user = WalletUser.objects.filter(username=username).first()
        if user:
            suggest_usernames = suggest_username(username, roll_count)
            return Response({"username": suggest_usernames}, status=status.HTTP_200_OK)

        return Response({"username": username}, status=status.HTTP_200_OK)

    @staticmethod
    def destroy(request: HttpRequest, pk: Any) -> None:
        serializer = serializers.DeleteAccountSerializer(
            data=request.data, context={"public_id": pk}
        )
        serializer.is_valid(raise_exception=True)

        validated_data: Dict[str, str] = serializer.validated_data

        user: WalletUser = WalletUser.objects.filter(public_id=pk).first()

        if user.is_two_factor_enabled:
            token = validated_data.get("token")
            device = two_factor_utils.get_user_totp_device(user)
            if device is not None and device.verify_token(token):
                device.delete()
                user.delete()
                return

            raise TypeError(_("Invalid token"))

        user.delete()
        return
