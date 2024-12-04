import uuid
from typing import Any, Dict

from django.conf import settings
from django.db.models import QuerySet
from django.http import HttpRequest, HttpResponse
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from django_otp import devices_for_user
from django_otp.plugins.otp_static.models import StaticDevice, StaticToken
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt import tokens

from stuff.utils import send_email, suggest_username

from . import exceptions, serializers, stuff_logic
from .models import EmailVerificationToken, PasswordResetToken, WalletUser
from .types import Action


class Auth:
    @staticmethod
    # TODO: add email verification, add username creation and first/last names
    def sign_up(request: HttpRequest):
        serializer = serializers.SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        instance = serializer.save()
        if not instance:
            raise TypeError(_("Failed to create user!"))

        user = WalletUser.objects.filter(email=instance.email).first()

        send_email(
            email=user.email,
            subject=_("Welcome!"),
            body=_("Thanks for registration in a super vault of your secrets!"),
        )

        return Response(
            {"detail": _("You have been registered successfully!")},
            status=status.HTTP_201_CREATED,
        )

    @staticmethod
    def sign_in(data: Dict[str, str | bool], request: HttpRequest) -> Response:
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
            csrf_response = stuff_logic.set_csrf_cookie(
                request=request, response=auth_response
            )
            return csrf_response

        raise exceptions.AuthenticationFailed(_("User is not active"))

    @staticmethod
    def sign_out(data: Dict[str, str]):
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

        jwt_tokens = stuff_logic.get_custom_jwt(user=user, action=Action.oauth2)

        return Response(
            data={"access": jwt_tokens["access"], "refresh": jwt_tokens["refresh"]},
            status=status.HTTP_200_OK
        )


class TOTPDeviceController:
    @staticmethod
    def create_totp_device(request: HttpRequest):
        # new response
        response = Response()
        # configure device
        user = request.user
        device = stuff_logic.get_user_totp_device(user)
        if not device:
            device = user.totpdevice_set.create(confirmed=False)
        url = device.config_url
        # DOESN'T WORK IN FRONTEND
        # create qr
        # two_fa_img = stuff_logic.generate_2fa_key_in_qr_code(url)
        # use it in response
        # response.headers["Content-Type"] = "multipart/mixed; boundary=boundary"
        # two_fa_img.save(response, "PNG")
        # last preparations for the response
        response.status_code = status.HTTP_200_OK
        # 2fa configuration key is necessary too
        # two_fa_config_key = re.findall(r"secret=(.*)&algorithm", url)[0]
        response.data = {"config_key": url}
        return response

    @staticmethod
    def verify_totp_device(data: Dict[str, str], user: WalletUser):
        otp_token = data.get("token")
        if not otp_token:
            return Response(
                {"error": _("Token is missing.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        device = stuff_logic.get_user_totp_device(user)
        if device is not None and device.verify_token(token=otp_token):
            if not device.confirmed:
                device.confirmed = True
                device.save()

                user.is_two_factor_enabled = True
                user.save()
            tokens = stuff_logic.get_custom_jwt(user, device, action=Action.verify)
            response = Response(status=status.HTTP_200_OK)
            # new_token_response = stuff_logic.set_auth_cookies(
            #     response=response,
            #     jwt_tokens={"access": tokens["access"], "refresh": tokens["refresh"]},
            # )
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
        device = stuff_logic.get_user_static_device(request.user)
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
        device = stuff_logic.get_user_static_device(user)
        if device is not None and device.verify_token(otp_token):
            token = stuff_logic.get_custom_jwt(user, device)
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

        tokens = stuff_logic.get_custom_jwt(user, None, Action.delete)
        response = Response(status=status.HTTP_200_OK)
        response.data = {"detail": _("Device detached from 2FA")}

        # new_token_response = stuff_logic.set_auth_cookies(
        #     response=response,
        #     jwt_tokens={"access": tokens["access"], "refresh": tokens["refresh"]},
        # )

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
    def change_email_request(validated_data: Dict[str, str], user: WalletUser):
        email = validated_data.get("email")

        old_records = EmailVerificationToken.objects.filter(user=user)
        if old_records.exists():
            old_records.update(is_active=False)

        record = EmailVerificationToken.objects.create(user=user, email=email)

        send_email(
            email=email,
            subject=_("Change email verification"),
            body=f"Please verify your email by this link: {settings.FRONTEND_URL}/verify-email?token={record.token}",
        )

        return Response(
            {"detail": _("A token has been sent to your new email")},
            status=status.HTTP_200_OK,
        )

    @staticmethod
    def verify_email_change(validated_data: Dict[str, str]):
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
    def change_password(data: Dict[str, str]) -> Response:
        """Change user password."""
        user = WalletUser.objects.filter(public_id=data.get("public_id")).first()
        if not user:
            raise TypeError(_("User not found"))

        user.set_password(data.get("password"))
        user.save()

        return Response({"detail": _("Password changed!")}, status=status.HTTP_200_OK)

    @staticmethod
    def create_reset_password_request(data: Dict[str, str]) -> Response:
        """Forgot password."""
        email = data.get("email")
        username = data.get("username")

        user = WalletUser.objects.filter(email=email).first()

        if not user:
            raise TypeError(_("User not found"))

        old_records = PasswordResetToken.objects.filter(user=user)
        if old_records.exists():
            old_records.update(is_active=False)

        record = PasswordResetToken.objects.create(user=user)

        send_email(
            email=user.email,
            subject=_("Reset your password"),
            body=f"Please reset your password by this link: {settings.FRONTEND_URL}/reset-password?token={record.token}",
        )

        return Response(
            {"detail": _("Password reset link sent to your email!")},
            status=status.HTTP_200_OK,
        )

    @staticmethod
    def create_new_password(data: Dict[str, str | int]) -> Response:
        user = WalletUser.objects.filter(public_id=data.get("public_id")).first()
        password = data.get("password")

        if not user:
            raise TypeError(_("User not found"))

        user.set_password(password)
        user.save()

        return Response(
            {"detail": _("Password changed!")},
            status=status.HTTP_200_OK,
        )

    @staticmethod
    def username_suggestions(data: Dict[str, str | int]) -> Response:
        username = data.get("username")
        roll_count = data.get("count")

        if not username:
            raise TypeError(_("Please provide username in query params"))

        user = WalletUser.objects.filter(username=username).first()
        if user:
            suggest_usernames = suggest_username(username, roll_count)
            return Response({"username": suggest_usernames}, status=status.HTTP_200_OK)

        return Response({"username": username}, status=status.HTTP_200_OK)

    @staticmethod
    def destroy(validated_data: Dict[str, str] | None, public_id: Any) -> None:
        user: WalletUser = WalletUser.objects.filter(public_id=public_id).first()

        if user.is_two_factor_enabled:
            token = validated_data.get("token")
            device = stuff_logic.get_user_totp_device(user)
            if device is not None and device.verify_token(token):
                device.delete()
                user.delete()
                return

            raise TypeError(_("Invalid token"))

        user.delete()
        return
