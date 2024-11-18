from typing import Dict, Any
from django.utils.translation import gettext_lazy as _
from django_otp.plugins.otp_email.conf import settings
from django.contrib.auth import get_user_model, authenticate
from rest_framework import serializers
from rest_framework_simplejwt import serializers as jwt_serializers
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from rest_framework_simplejwt.settings import api_settings

from abstract.serializers import AbstractSerializer
from stuff import stuff_logic

WalletUser = get_user_model()


class WalletUserSerializer(AbstractSerializer):
    class Meta:
        model = WalletUser
        fields = (
            "public_id",
            "username",
            "email",
            "email_verified",
            "is_two_factor_enabled",
            "is_oauth_user",
            "is_active",
            "date_joined",
        )
        read_only_fields = ("is_active",)


class SignupSerializer(WalletUserSerializer):
    password2 = serializers.CharField(
        min_length=8, max_length=32, write_only=True, required=True
    )

    class Meta:
        model = WalletUser
        fields = ("public_id", "username", "email", "password", "password2")

    def validate(self, data):
        if data["password"] != data["password2"]:
            raise serializers.ValidationError(_("Passwords do not match!"))

        del data["password2"]

        return super().validate(data)

    def create(self, validated_data):
        return self.Meta.model.objects.create_user(**validated_data)


class CustomTokenObtainSerializer(jwt_serializers.TokenObtainSerializer):
    def __init__(self, *args, **kwargs):
        super(CustomTokenObtainSerializer, self).__init__(*args, **kwargs)

        self.fields[self.username_field] = serializers.CharField(required=False)
        self.fields["password"] = serializers.CharField(
            style={"input_type": "password"}
        )
        self.fields["email"] = serializers.EmailField(required=False)

    def validate(self, attrs):
        authenticate_kwargs = {"password": attrs.get("password")}

        if attrs.get(self.username_field) is not None and "@" in attrs.get(
            self.username_field
        ):
            authenticate_kwargs["email"] = attrs.get(self.username_field)
        elif attrs.get("email"):
            authenticate_kwargs["email"] = attrs.get("email")
        elif attrs.get(self.username_field):
            authenticate_kwargs[self.username_field] = attrs[self.username_field]

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


class SigninSerializer(
    jwt_serializers.TokenObtainPairSerializer, CustomTokenObtainSerializer
):
    @classmethod
    def get_token(cls, user):
        payload = stuff_logic.jwt_otp_payload(user)
        token = super().get_token(user)

        for k, v in payload.items():
            if k == "exp" and token.token_type == "refresh":
                continue
            token[k] = v

        return token


class CookieTokenRefreshSerializer(jwt_serializers.TokenRefreshSerializer):
    refresh = None

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, str]:
        attrs["refresh"] = self.context["request"].COOKIES.get(
            settings.SIMPLE_JWT["AUTH_REFRESH_COOKIE"]
        )
        if attrs["refresh"]:
            return super().validate(attrs)
        else:
            raise InvalidToken("There isn't a refresh token in the cookies.")
