from typing import Dict, Any

from django.contrib.auth import get_user_model, authenticate
from django_otp.plugins.otp_email.conf import settings
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt import serializers as jwt_serializers
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken

from stuff import stuff_logic

WalletUser = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'})

    class Meta:
        model = WalletUser
        fields = ('username', 'email', 'password', 'password2')
        extra_kwargs = {
            'password': {'write_only': True},
            'password2': {'write_only': True}
        }

    def save(self, **kwargs):
        username = self.validated_data.get('username')
        password = self.validated_data.get('password')
        password2 = self.validated_data.get('password2')
        email = self.validated_data.get('email')

        if password != password2:
            raise ValidationError({'detail': 'Passwords don`t match'})

        if username and password:
            if '@' in username:
                user = WalletUser(
                    email=username,
                    password=password,
                )
            else:
                user = WalletUser(
                    username=username,
                    password=password,
                )
        elif email and password:
            user = WalletUser(
                email=email,
                password=password,
            )
        else:
            raise ValidationError({'detail': 'You need to provide one of this fields: [username/email]'})

        user.set_password(password)
        user.save()

        return user


class CustomTokenObtainSerializer(jwt_serializers.TokenObtainSerializer):
    def __init__(self, *args, **kwargs):
        super(CustomTokenObtainSerializer, self).__init__(*args, **kwargs)
    
        self.fields[self.username_field] = serializers.CharField(required=False)
        self.fields['password'] = serializers.CharField(style={"input_type": "password"})
        self.fields['email'] = serializers.EmailField(required=False)
        
    def validate(self, attrs):
        authenticate_kwargs = {
            'password': attrs.get('password')
        }

        if attrs.get(self.username_field):
            authenticate_kwargs[self.username_field] = attrs[self.username_field]

        if attrs.get('email'):
            authenticate_kwargs['email'] = attrs.get('email')

        try:
            authenticate_kwargs["request"] = self.context["request"]
        except KeyError:
            pass

        self.user = authenticate(**authenticate_kwargs)

        if not api_settings.USER_AUTHENTICATION_RULE(self.user):
            raise AuthenticationFailed(
                self.error_messages["no_active_account"],
                "no_active_account",
            )
        
        return {}


class SigninSerializer(jwt_serializers.TokenObtainPairSerializer, CustomTokenObtainSerializer):
    @classmethod
    def get_token(cls, user):
        payload = stuff_logic.jwt_otp_payload(user)
        token = super().get_token(user)

        for k, v in payload.items():
            if k == 'exp' and token.token_type == 'refresh':
                continue
            token[k] = v

        return token


class WalletUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletUser
        fields = ('userid', 'username', 'email')


class CookieTokenRefreshSerializer(jwt_serializers.TokenRefreshSerializer):
    refresh = None

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, str]:
        attrs['refresh'] = self.context['request'].COOKIES.get(settings.SIMPLE_JWT['AUTH_REFRESH_COOKIE'])
        if attrs['refresh']:
            return super().validate(attrs)
        else:
            raise InvalidToken("There isn't a refresh token in the cookies.")
