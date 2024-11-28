import uuid

from django.db.models import QuerySet
from django.http import HttpRequest, HttpResponse
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from django_otp import devices_for_user
from django_otp.plugins.otp_static.models import StaticDevice, StaticToken
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response

from . import exceptions, serializers, stuff_logic
from .models import WalletUser
from .utils import LOGIN_TYPE


class Auth:
    @staticmethod
    def sign_up(request: HttpRequest):
        username = request.data.get("username")
        if username is not None and "@" in username:
            request.data["email"] = request.data["username"]
            del request.data["username"]
        serializer = serializers.SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        instance = serializer.save()
        if not instance:
            raise TypeError(_("Failed to create user!"))

        # user = WalletUser.objects.filter(email=instance.email).first()
        # stuff_logic.verify_email_logic(request, user)

        return Response(
            {"detail": _("You have been registered successfully!")},
            status=status.HTTP_201_CREATED,
        )

    @staticmethod
    def sign_in(request: HttpRequest):
        serializer = serializers.TwoFactorJWTSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # The result is None and with an error data or Response 200 with a success message
        result, data = stuff_logic.signin_logic(request, serializer.validated_data)

        if result is None:
            return AuthenticationFailed(data)

        return result


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
    def change_email(request: HttpRequest):
        email = request.data.get("email")
        if not email:
            raise TypeError(_("Please provide email in query params"))

        check_email = WalletUser.objects.filter(email=email).first()
        if check_email:
            raise TypeError(_("Email is already in use"))

        user = WalletUser.objects.filter(public_id=request.user.public_id).first()
        if not user:
            raise TypeError(_("User not found"))

        user.email = email
        user.save()

        return Response({"new_email": email}, status=status.HTTP_200_OK)
    
    @staticmethod
    def change_password(request: HttpRequest, pk=None):
        """Change user password."""
        data = request.data
        user = WalletUser.objects.filter(public_id=pk).first()
        if not user:
            raise TypeError(_("User not found"))
        
        if not user.check_password(data.get("actualPassword")):
            raise TypeError(_("Wrong password"))
        
        user.set_password(data.get("password"))
        user.save()
        
        return Response(status=status.HTTP_200_OK)
        
        


class Oauth2Auth:
    @staticmethod
    def signin_with_google(request: HttpRequest, response: HttpResponse):
        response_user_data = response.data.get("user")
        user = WalletUser.objects.get(pk=response_user_data.get("pk"))
        if user.is_oauth_user is not True:
            user.is_oauth_user = True
            user.is_email_verified = True
            user.save()

        result, data = stuff_logic.signin_logic(
            request=request, login_type=LOGIN_TYPE.OAUTH2
        )
        if result is None:
            raise TypeError(data)

        return result


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
        # user has enable 2fa
        user.is_two_factor_enabled = True
        user.save()
        # last preparations for the response
        response.status_code = status.HTTP_200_OK
        # 2fa configuration key is necessary too
        # two_fa_config_key = re.findall(r"secret=(.*)&algorithm", url)[0]
        response.data = {"config_key": url}
        return response

    @staticmethod
    def verify_totp_device(request: HttpRequest):
        otp_token = request.data.get("token")
        if not otp_token:
            return Response(
                {"error": _("Token is missing.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user
        device = stuff_logic.get_user_totp_device(user)
        if device is not None and device.verify_token(token=otp_token):
            if not device.confirmed:
                device.confirmed = True
                device.save()
            tokens = stuff_logic.get_custom_jwt(user, device)
            response = Response(status=status.HTTP_200_OK)
            new_token_response = stuff_logic.set_auth_cookies(
                response=response,
                jwt_tokens={"access": tokens["access"], "refresh": tokens["refresh"]},
            )
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

        tokens = stuff_logic.get_custom_jwt(user, None)
        response = Response(status=status.HTTP_200_OK)
        response.data = {"detail": _("Device detached from 2FA")}
        new_token_response = stuff_logic.set_auth_cookies(
            response=response,
            jwt_tokens={"access": tokens["access"], "refresh": tokens["refresh"]},
        )
        return new_token_response
