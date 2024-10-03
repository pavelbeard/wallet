# Create your views here.
import logging
import re
import sys
import uuid

from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import JsonResponse, HttpResponse
from django.utils.translation import gettext_lazy as _
from django_otp import devices_for_user
from django_otp.plugins.otp_static.models import StaticDevice, StaticToken
from rest_framework import status, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError, AuthenticationFailed
from rest_framework_simplejwt.views import TokenRefreshView

from . import permissions as stuff_permissions
from . import serializers, models, stuff_logic
from .stuff_logic import get_custom_jwt

User = get_user_model()

logging.basicConfig(stream=sys.stdout, level=logging.INFO)
logger = logging.getLogger(__name__)



class AuthViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['POST'], permission_classes=[permissions.AllowAny])
    def signup(self, request):
        try:
            serializer = serializers.SignupSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            instance = serializer.save()
            if not instance:
                return AuthenticationFailed(_('Failed to create signup!'))

            user = User.objects.get(email=serializer.validated_data.data['email'])
            stuff_logic.verify_email_logic(request, user)

            return Response({"detail": _("You have been registered successfully!")}, status=status.HTTP_201_CREATED)
        except ValidationError:
            logger.error(_('Failed to create wallet user'), exc_info=True)
            return Response(status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'], permission_classes=[permissions.AllowAny])
    def signin(self, request):
        try:
            serializer = serializers.SigninSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            # The result is None and with an error data or Response 200 with a success message
            result, data = stuff_logic.signin_logic(serializer.validated_data, request)

            if result is None:
                return Response(data, status=status.HTTP_400_BAD_REQUEST)

            return result
        except AuthenticationFailed:
            return Response({'error': _('Bad credentials.')}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError:
            logger.error(_('Failed to sign in user'), exc_info=True)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(_('Something went wrong...'), exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    @action(detail=False, methods=['POST'])
    def signout(self, request):
        try:
            # Push out the user from the system.
            return stuff_logic.signout_logic(request)
        except TokenError:
            logger.exception(_('Token is blacklisted'), exc_info=True)
            return JsonResponse({'error': _('Token is blacklisted')}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class CookieTokenRefreshView(TokenRefreshView):
    serializer_class = serializers.CookieTokenRefreshSerializer

    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get('refresh') and response.status_code == status.HTTP_200_OK:
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_ACCESS_COOKIE'],
                value=response.data['access'],
                max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            )
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_REFRESH_COOKIE'],
                value=response.data['refresh'],
                max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            )

            del response.data['refresh']

        return super().finalize_response(request, response, *args, **kwargs)


class WalletUserViewSet(viewsets.ModelViewSet):
    queryset = models.WalletUser.objects.all()
    serializer_class = serializers.WalletUserSerializer
    lookup_field = 'userid'

    @action(detail=False, methods=['GET'], permission_classes=[permissions.AllowAny])
    def check_user_by_username(self, request, **kwargs):
        param = request.query_params.get('username')
        if not param:
            return Response(
                data={'error': _('Please provide username in query params')},
                status=status.HTTP_400_BAD_REQUEST
            )
        user = get_object_or_404(self.get_queryset(), username=param)
        data = serializers.WalletUserSerializer(user).data
        return Response(data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['GET'], permission_classes=[permissions.AllowAny])
    def check_user_by_email(self, request, **kwargs):
        param = request.query_params.get('email')
        if not param:
            return Response(
                data={'error': _('Please provide email in query params')},
                status=status.HTTP_400_BAD_REQUEST
            )
        user = get_object_or_404(self.get_queryset(), email=param)
        data = serializers.WalletUserSerializer(user).data
        return Response(data, status=status.HTTP_200_OK)


class TwoFactorAuthViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['GET'])
    def create_totp_device(self, request, **kwargs):
        """Set up a new TOTP device."""
        try:
            # new response
            response = HttpResponse()
            # configure device
            user = request.user
            device = stuff_logic.get_user_totp_device(user)
            if not device:
                device = user.totpdevice_set.create(confirmed=False)
            url = device.config_url
            # create qr
            two_fa_img = stuff_logic.generate_2fa_key_in_qr_code(url)
            # use it in response
            response.headers['Content-Type'] = 'multipart/mixed; boundary=boundary'
            two_fa_img.save(response, "PNG")
            # user has enable 2fa
            user.is_two_factor_enabled = True
            user.save()
            # last preparations for the response
            response.status_code = status.HTTP_200_OK
            # 2fa configuration key is necessary too
            two_fa_config_key = re.findall(r"secret=(.*)&algorithm", url)[0]
            response.data = two_fa_config_key
            return response
        except Exception as e:
            logger.exception(_('Something went wrong...'), exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['POST'])
    def verify_totp_device(self, request, **kwargs):
        """Verify/enable a TOTP device."""
        try:
            token = request.data.get('token')
            if not token:
                return Response({'error': _('Token is missing.')}, status=status.HTTP_400_BAD_REQUEST)

            user = request.user
            device = stuff_logic.get_user_totp_device(user)
            if not device is None and device.verify_token(token=token):
                if not device.confirmed:
                    device.confirmed = True
                    device.save()
                token = stuff_logic.get_custom_jwt(user, device)
                return Response({'access': token}, status=status.HTTP_200_OK)
            return Response({'error': _('Invalid TOTP token.')}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.exception(_('Something went wrong...'), exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['GET'], permission_classes=[
        permissions.IsAuthenticated,
        stuff_permissions.IsOtpVerified
    ])
    def create_backup_tokens(self, request, **kwargs):
        try:
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
        except Exception as e:
            logger.exception(_('Something went wrong...'), exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['POST'],)
    def verify_backup_token(self, request, **kwargs):
        try:
            token = request.data.get('token')
            if not token:
                return Response({'error': _('Token is missing.')}, status=status.HTTP_400_BAD_REQUEST)

            user = request.user
            device = stuff_logic.get_user_static_device(user)
            if not device is None and device.verify_token(token):
                token = stuff_logic.get_custom_jwt(user, device)
                return Response({'access': token}, status=status.HTTP_200_OK)
            else:
                return Response({'error': _('Invalid token.')}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.exception(_('Something went wrong...'), exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['DELETE'], permission_classes=[
        permissions.IsAuthenticated,
        stuff_permissions.IsOtpVerified
    ])
    def delete_totp_device(self, request, **kwargs):
        try:
            user = request.user
            devices = devices_for_user(user)
            for device in devices:
                device.delete()

            user.jwt_secret = uuid.uuid4()
            user.save()
            token = get_custom_jwt(user, None)
            return Response({'access': token, 'detail': _('Device detached from 2FA')}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.exception(_('Something went wrong...'), exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
