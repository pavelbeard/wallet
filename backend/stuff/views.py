# Create your views here.
from typing import Type

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.views import OAuth2Adapter
from dj_rest_auth.registration import views as dj_rest_auth_views
from django.http import HttpRequest
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from . import models, serializers
from . import permissions as stuff_permissions
from .controller import (
    Auth,
    Oauth2Auth,
    TOTPDeviceController,
    WalletUserController,
)
from .utils import get_user_info, handle_exception, super_logger

logger = super_logger(__name__)


class AuthViewSet(viewsets.ViewSet):
    @action(detail=False, methods=["POST"], permission_classes=[permissions.AllowAny])
    @handle_exception
    def signup(self, request):
        result = Auth.sign_up(request=request)
        return result

    @action(detail=False, methods=["POST"], permission_classes=[permissions.AllowAny])
    @handle_exception
    def signin(self, request):
        result = Auth.sign_in(request=request)
        return result

    @action(detail=False, methods=["POST"])
    @handle_exception
    def signout(self, request):
        result = Auth.sign_out(request=request)
        return result


class OAuth2ViewSet(viewsets.ViewSet, dj_rest_auth_views.SocialLoginView):
    adapter_class: Type[OAuth2Adapter]

    @action(detail=False, methods=["POST"], permission_classes=[permissions.AllowAny])
    @handle_exception
    def signin_with_google(self, request, *args, **kwargs):
        self.adapter_class = GoogleOAuth2Adapter
        response = super().post(request, *args, **kwargs)
        result = Oauth2Auth.signin_with_google(request=request, response=response)
        return result


class TwoFactorAuthViewSet(viewsets.ViewSet):
    @action(detail=False, methods=["POST"])
    @handle_exception
    def create_totp_device(self, request):
        """Set up a new TOTP device."""
        result = TOTPDeviceController.create_totp_device(request=request)
        return result

    @action(detail=False, methods=["POST"], permission_classes=[permissions.IsAuthenticated])
    @handle_exception
    def verify_totp_device(self, request):
        """Verify/enable a TOTP device."""
        result = TOTPDeviceController.verify_totp_device(request=request)
        return result

    @action(
        detail=False,
        methods=["POST"],
        permission_classes=[
            permissions.IsAuthenticated,
            stuff_permissions.IsOtpVerified,
        ],
    )
    @handle_exception
    def create_backup_tokens(self, request):
        result = TOTPDeviceController.create_backup_tokens(request=request)
        return result

    @action(detail=False, methods=["POST"])
    @handle_exception
    def verify_backup_token(self, request):
        result = TOTPDeviceController.verify_backup_token(request=request)
        return result

    @action(
        detail=False,
        methods=["DELETE"],
        permission_classes=[
            permissions.IsAuthenticated,
            stuff_permissions.IsOtpVerified,
        ],
    )
    @handle_exception
    def delete_totp_device(self, request):
        result = TOTPDeviceController.delete_totp_device(request=request)
        return result


class WalletUserViewSet(viewsets.ModelViewSet):
    queryset = models.WalletUser.objects.all()
    serializer_class = serializers.WalletUserSerializer
    lookup_field = "public_id"
    allowed_methods = (
        "list",
        "check_user_by_username",
        "check_user_by_email",
        "change_email",
        "change_password",
        "create_reset_password_request",
        "create_new_password",
        "partial_update",
        "username_suggestions",
        "destroy",
        "check_master_password",
    )

    @action(detail=False, methods=["GET"], permission_classes=[permissions.AllowAny])
    @handle_exception
    def check_user_by_username(self, request):
        result = WalletUserController.check_user_by_username(
            request=request, qs=self.queryset
        )
        return result

    @action(detail=False, methods=["GET"], permission_classes=[permissions.AllowAny])
    @handle_exception
    def check_user_by_email(self, request):
        result = WalletUserController.check_user_by_email(
            request=request, qs=self.queryset
        )
        return result

    @action(detail=False, methods=["POST"])
    @handle_exception
    def create_change_email_request(self, request):
        result = WalletUserController.change_email_request(request=request)
        return result

    @action(detail=False, methods=["POST"])
    @handle_exception
    def verify_email_change(self, request):
        result = WalletUserController.verify_email_change(request=request)
        return result

    @action(detail=True, methods=["POST"])
    @handle_exception
    def change_password(self, request, **kwargs):
        """Change user password."""
        result = WalletUserController.change_password(
            request=request, pk=kwargs.get("public_id")
        )
        return result

    @action(detail=False, methods=["POST"], permission_classes=[permissions.AllowAny])
    @handle_exception
    def create_reset_password_request(self, request):
        result = WalletUserController.create_reset_password_request(request=request)
        return result

    @action(detail=False, methods=["POST"], permission_classes=[permissions.AllowAny])
    @handle_exception
    def create_new_password(self, request):
        result = WalletUserController.create_new_password(request=request)
        return result

    @action(detail=False, methods=["POST"], permission_classes=[permissions.AllowAny])
    @handle_exception
    def username_suggestions(self, request):
        result = WalletUserController.username_suggestions(request=request)
        return result

    @handle_exception
    def destroy(self, request, **kwargs):
        WalletUserController.destroy(
            request=request,
            pk=kwargs.get("public_id"),
        )
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=["POST"], permission_classes=[permissions.IsAuthenticated])
    @handle_exception
    def check_master_password(self, request):
        result = WalletUserController.check_master_password(
            request=request,
        )
        return result


class WalletUserDeviceViewSet(viewsets.ModelViewSet):
    queryset = models.WalletUserDevice.objects.all()
    serializer_class = serializers.WalletUserDeviceSerializer
    allowed_methods = ("list",)

    @handle_exception
    def list(self, request: HttpRequest):
        get_user_info(request=request, user=request.user)

        qs = self.queryset.filter(wallet_user=request.user).order_by("-last_access")[:5]
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
