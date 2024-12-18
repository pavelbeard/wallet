from abstract.serializers import AbstractSerializer
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework_simplejwt import serializers as jwt_serializers
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from rest_framework_simplejwt.settings import api_settings

from stuff import two_factor_utils
from stuff.controller import WalletUserController
from stuff.types import Action

from .models import (
    DDevice,
    EmailVerificationToken,
    PasswordResetToken,
    WalletUser,
    WalletUserDevice,
)


class WalletUserSerializerStrict(serializers.ModelSerializer):
    class Meta:
        model = WalletUser
        fields = (
            "public_id",
            "username",
        )


class DDeviceSerializerStrict(serializers.ModelSerializer):
    icon = serializers.SerializerMethodField()

    def get_icon(self, obj: DDevice):
        if obj.icon:
            return obj.icon.url

    class Meta:
        model = DDevice
        fields = "__all__"


class WalletUserSerializer(AbstractSerializer):
    class Meta:
        model = WalletUser
        fields = (
            "public_id",
            "username",
            "first_name",
            "last_name",
            "email",
            "email_verified",
            "is_two_factor_enabled",
            "is_oauth_user",
            "is_active",
            "date_joined",
        )
        read_only_fields = ("is_active",)


class WalletUserDeviceSerializer(serializers.ModelSerializer):
    wallet_user = WalletUserSerializerStrict()
    d_device = DDeviceSerializerStrict()

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
            "is_actual_device",
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
        fields = (
            "public_id",
            "username",
            "first_name",
            "last_name",
            "email",
            "password",
            "password2",
        )

    def validate(self, data):
        if not data.get("first_name") and not data.get("last_name"):
            raise serializers.ValidationError(_("Please provide first and last name"))
        if not data.get("username"):
            username_suggested = WalletUserController.username_suggestions(
                {
                    "username": f"{data.get('first_name')}_{data.get('last_name')}",
                    "count": 1,
                }
            )
            if isinstance(username_suggested, list):
                data["username"] = username_suggested[0]
            else:
                data["username"] = username_suggested
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

        return {
            "user_is_active": self.user.is_active,
        }


class TwoFactorJWTSerializer(
    jwt_serializers.TokenObtainPairSerializer, CustomTokenObtainSerializer
):
    @classmethod
    def get_token(cls, user: WalletUser):
        device = user.totpdevice_set.first()
        payload = two_factor_utils.jwt_custom_payload(
            user=user, device=device, Action=Action.sign_in
        )
        tokens = super().get_token(user)

        for k, v in payload.items():
            if k == "exp" and tokens.token_type == "refresh":
                continue
            tokens[k] = v

        return tokens


# class CookieTokenRefreshSerializer(jwt_serializers.TokenRefreshSerializer):
#     refresh = None

#     def validate(self, attrs: Dict[str, Any]) -> Dict[str, str]:
#         attrs["refresh"] = self.context["request"].COOKIES.get(
#             settings.SIMPLE_JWT["AUTH_REFRESH_COOKIE"]
#         )
#         if attrs["refresh"]:
#             tokens = super().validate(attrs)
#             return tokens
#         else:
#             raise InvalidToken("There isn't a refresh token in the cookies.")


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


class ChangePasswordSerializer(serializers.Serializer):
    actualPassword = serializers.CharField(min_length=8, max_length=20)
    password = serializers.CharField(min_length=8, max_length=20)
    password2 = serializers.CharField(min_length=8, max_length=20)

    def validate(self, attrs):
        actual_password = attrs.get("actualPassword")
        password = attrs.get("password")
        password2 = attrs.get("password2")

        public_id = self.context.get("public_id")
        user = WalletUser.objects.filter(public_id=public_id).first()

        if not user:
            raise serializers.ValidationError("User not found.")

        if not user.check_password(actual_password):
            raise serializers.ValidationError("Wrong password.")

        if not password:
            raise serializers.ValidationError("Password is required.")

        if password != password2:
            raise serializers.ValidationError("Passwords do not match.")

        del attrs["password2"]
        attrs["public_id"] = public_id

        return attrs


class UsernameSuggestionsSerializer(serializers.Serializer):
    username = serializers.CharField()
    count = serializers.IntegerField(default=3, required=False)

    def validate(self, attrs):
        username = attrs.get("username")

        if not username:
            raise serializers.ValidationError("Please provide username")

        return attrs


class VerifyTOTPDeviceSerializer(serializers.Serializer):
    token = serializers.CharField()


class ChangeEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate(self, attrs):
        email = attrs.get("email")

        if not email:
            raise serializers.ValidationError(_("Please provide email"))

        user = WalletUser.objects.filter(email=email).first()
        if user:
            raise serializers.ValidationError(_("Email is already in use"))

        return attrs


class VerifyEmailChangeSerializer(serializers.Serializer):
    token = serializers.CharField()

    def validate(self, attrs):
        token = attrs.get("token")

        if not token:
            raise serializers.ValidationError(_("Please provide token"))

        record = EmailVerificationToken.objects.filter(token=token).first()
        if not record or not record.is_valid() or not record.is_active:
            raise serializers.ValidationError(_("Token is not valid"))

        del attrs["token"]

        attrs["email"] = record.email
        attrs["user_pk"] = record.user.pk

        record.is_active = False
        record.save()

        return attrs


class DeleteAccountSerializer(serializers.Serializer):
    token = serializers.CharField(required=False)

    def validate(self, attrs):
        public_id = self.context["public_id"]
        user: WalletUser = WalletUser.objects.filter(public_id=public_id).first()

        if not user:
            raise TypeError(_("User not found"))

        if user.is_two_factor_enabled:
            token = attrs.get("token")

            if not token:
                raise serializers.ValidationError(_("Please provide token"))

            return attrs

        return {}


class SignOutSerializer(serializers.Serializer):
    refresh_token = serializers.CharField(required=False)

    def validate(self, attrs):
        refresh_token = attrs.get("refresh_token")
        if not refresh_token:
            raise serializers.ValidationError(_("Please provide refresh token"))
        return attrs


class CreateResetPasswordRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    username = serializers.CharField(required=False)

    def validate(self, attrs):
        email = attrs.get("email")
        username = attrs.get("username")
        if not email and not username:
            raise serializers.ValidationError(_("Please provide email or username"))
        return attrs


class CreateNewPasswordSerializer(serializers.Serializer):
    token = serializers.CharField()
    password = serializers.CharField()
    password2 = serializers.CharField()

    def validate(self, attrs):
        token = attrs.get("token")
        password = attrs.get("password")
        password2 = attrs.get("password2")

        if not token:
            raise serializers.ValidationError(_("Please provide token"))
        if not password:
            raise serializers.ValidationError(_("Please provide password"))
        if not password2:
            raise serializers.ValidationError(_("Please provide password2"))
        if password != password2:
            raise serializers.ValidationError(_("Passwords do not match"))

        record: PasswordResetToken = PasswordResetToken.objects.filter(
            token=token
        ).first()

        if not record or not record.is_valid() or not record.is_active:
            raise serializers.ValidationError(_("Token is not valid"))

        record.is_active = False
        record.save()

        return {
            "public_id": record.user.public_id,
            "password": password,
        }
