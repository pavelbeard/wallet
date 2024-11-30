from typing import Any, Dict

from abstract.serializers import AbstractSerializer
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from django_otp.plugins.otp_email.conf import settings
from rest_framework import serializers
from rest_framework_simplejwt import serializers as jwt_serializers
from rest_framework_simplejwt.exceptions import AuthenticationFailed, InvalidToken
from rest_framework_simplejwt.settings import api_settings

from stuff.utils import Action
from stuff import stuff_logic

from .models import WalletUser, WalletUserDevice


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


class WalletUserDeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletUserDevice
        fields = (
            "wallet_user",
            "d_device",
            "operational_system",
            "d_ip_address",
            "location",
            "created_at",
            "last_access",
        )
        depth = 2


class WalletUserDeviceSerializerCreate(serializers.ModelSerializer):
    class Meta:
        model = WalletUserDevice
        fields = (
            "wallet_user",
            "d_device",
            "operational_system",
            "d_ip_address",
            "location",
            "created_at",
            "last_access",
        )


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


class TwoFactorJWTSerializer(
    jwt_serializers.TokenObtainPairSerializer, CustomTokenObtainSerializer
):
    @classmethod
    def get_token(cls, user):
        device = user.totpdevice_set.first()
        payload = stuff_logic.jwt_custom_payload(
            user=user, device=device, Action=Action.sign_in
        )
        tokens = super().get_token(user)

        for k, v in payload.items():
            if k == "exp" and tokens.token_type == "refresh":
                continue
            tokens[k] = v

        return tokens


class CookieTokenRefreshSerializer(jwt_serializers.TokenRefreshSerializer):
    refresh = None

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, str]:
        attrs["refresh"] = self.context["request"].COOKIES.get(
            settings.SIMPLE_JWT["AUTH_REFRESH_COOKIE"]
        )
        if attrs["refresh"]:
            tokens = super().validate(attrs) 
            return tokens
        else:
            raise InvalidToken("There isn't a refresh token in the cookies.")


class PasswordSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=8, max_length=32, write_only=True)

    def validate(self, attrs):
        password = attrs.get("password")
        if not password:
            raise serializers.ValidationError("Password is required.")

        user: WalletUser = self.context["request"].user
        is_valid = user.check_password(password)

        if not is_valid:
            raise serializers.ValidationError("Invalid password.")

        return attrs
