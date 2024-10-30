### module for complicated logic ###
import contextlib
from calendar import timegm
from typing import List, Any

import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import EmailMessage
from django.middleware import csrf
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django_otp import devices_for_user
from django_otp.models import Device
from django_otp.plugins.otp_static.models import StaticDevice
from django_otp.plugins.otp_totp.models import TOTPDevice
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework_simplejwt import authentication as jwt_authentication
from rest_framework_simplejwt import tokens
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken

from stuff import qr_generator
from stuff.models import WalletUser
from stuff.utils import LOGIN_TYPE, User


@contextlib.contextmanager
def override_api_settings(**settings):
    """Using for unit tests"""
    old_settings = {}

    for key, value in settings.items():
        try:
            old_settings[key] = api_settings.user_settings[key]
        except KeyError:
            pass

        api_settings.user_settings[key] = value

        try:
            delattr(api_settings, key)
        except AttributeError:
            pass

    try:
        yield
    finally:
        for key in settings.keys():
            api_settings.user_settings.pop(key)

            try:
                api_settings.user_settings[key] = old_settings[key]
            except KeyError:
                pass

            try:
                delattr(api_settings, key)
            except AttributeError:
                pass

def get_user_totp_device(user, confirmed=None) -> TOTPDevice | None:
    devices: List[Device] = devices_for_user(user, confirmed=confirmed)
    for device in devices:
        if isinstance(device, TOTPDevice):
            return device

def jwt_otp_payload(user: User, device: Device=None) -> dict:
    """Optionally includes an OTP device in JWT"""
    payload = {
        'username': '',
        'email': '',
        'exp': timezone.now() + settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
    }

    if getattr(user, 'username') is not None:
        payload['username'] = user.username
    if getattr(user, 'email') is not None:
        payload['email'] = user.email

    if settings.SIMPLE_JWT.get('ROTATE_REFRESH_TOKENS'):
        payload['orig_iat'] = timegm(timezone.now().utctimetuple())

    if settings.SIMPLE_JWT.get('AUDIENCE'):
        payload['aud'] = settings.SIMPLE_JWT['AUDIENCE']

    if settings.SIMPLE_JWT.get('ISSUER'):
        payload['iss'] = settings.SIMPLE_JWT['ISSUER']

    if (user is not None) and( device is not None) and (device.user_id == user.public_id) and (device.confirmed is True):
        payload['otp_device_id'] = device.persistent_id
    else:
        payload['otp_device_id'] = None

    return payload

def jwt_encode_handler(payload):
    """Helps to encode data to JWT"""
    key = settings.SIMPLE_JWT['SIGNING_KEY']
    return jwt.encode(payload, key, algorithm=settings.SIMPLE_JWT.get('ALGORITHM')).encode('utf-8')

def jwt_decode_handler(token) -> Any:
    """Helps to decode data from JWT"""
    options = {
        'verify_exp': True,
    }
    secret_key = settings.SIMPLE_JWT['SIGNING_KEY']
    return jwt.decode(
        jwt=token,
        key=secret_key,
        options=options,
        # leeway=settings.SIMPLE_JWT.get('LEEWAY'),
        audience=settings.SIMPLE_JWT.get('AUDIENCE'),
        issuer=settings.SIMPLE_JWT.get('ISSUER'),
        algorithms=settings.SIMPLE_JWT.get('ALGORITHM'),
    )

def get_custom_jwt(user: WalletUser, device: Device=None) -> str:
    """Using for include 2FA into JWT"""
    payload = jwt_otp_payload(user, device)
    return jwt_encode_handler(payload)

def otp_is_verified(request: Request):
    """Help to determine if user have verified OTP."""
    auth = jwt_authentication.JWTAuthentication()
    authorization_header = request.headers.get('Authorization') or request.META.get('HTTP_AUTHORIZATION')
    jwt_value = auth.get_raw_token(header=authorization_header)
    if jwt_value is None:
        return False

    payload = jwt_decode_handler(jwt_value)
    persistent_id = payload.get('otp_device_id')

    if persistent_id:
        device = Device.from_persistent_id(persistent_id=persistent_id)
        if (device is not None) and (device.user_id != request.user.public_id):
            return False
        else:
            return True
    else:
        return False

def get_user_static_device(user: User, confirmed=None) -> StaticDevice | None:
    devices = devices_for_user(user, confirmed=confirmed)
    for device in devices:
        if isinstance(device, StaticDevice):
            return device

def signin_logic(request, validated_data=None, login_type=LOGIN_TYPE.CREDENTIALS):
    response = Response()
    if login_type == LOGIN_TYPE.OAUTH2:
        user = request.user
        jwt_tokens = RefreshToken.for_user(user)
        access_token = str(jwt_tokens.access_token)
        refresh_token = str(jwt_tokens)
    else:
        access_token = validated_data['access']
        refresh_token = validated_data['refresh']

        access_token_obj = tokens.AccessToken(validated_data['access'])
        user = User.objects.get_object_by_public_id(public_id=access_token_obj.payload['public_id'])

    if user.is_active:
        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_ACCESS_COOKIE'],
            value=access_token,
            max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
        )
        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_REFRESH_COOKIE'],
            value=refresh_token,
            max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
        )
        response.set_cookie(
            key=settings.CSRF_COOKIE_NAME,
            value=csrf.get_token(request),
            secure=settings.CSRF_COOKIE_SECURE,
            httponly=settings.CSRF_COOKIE_HTTPONLY,
            samesite=settings.CSRF_COOKIE_SAMESITE,
        )
        response.data = {'access': access_token}
        response.status = status.HTTP_200_OK
        return response, None
    else:
        return None, {"error": _("Inactive user")}

def signout_logic(request):
    refresh_token = request.COOKIES.get('__rclientid')
    token = tokens.RefreshToken(refresh_token)
    token.blacklist()
    response = Response()
    response.delete_cookie(key=settings.SIMPLE_JWT['AUTH_ACCESS_COOKIE'])
    response.delete_cookie(key=settings.SIMPLE_JWT['AUTH_REFRESH_COOKIE'])
    response.delete_cookie(key='csrfmiddlewaretoken')
    response.data = {"detail": _("You're logged out!")}
    response.status = status.HTTP_200_OK
    return response

def verify_email_logic(request, user):
    html_string = render_to_string('')

    email = EmailMessage(
        subject=_('Welcome'),
        body=html_string
    )
    email.from_email = settings.EMAIL_HOST_USER
    email.to = [user.email]

def generate_2fa_key_in_qr_code(data):
    """Proxy function"""
    return qr_generator.generate_2fa_key_in_qr_code(data)