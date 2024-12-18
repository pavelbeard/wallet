# Create your views here.
from typing import Type

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.views import OAuth2Adapter
from dj_rest_auth.registration import views as dj_rest_auth_views
from django.http import HttpRequest, JsonResponse
from django.utils.translation import gettext_lazy as _
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import AuthenticationFailed, TokenError

from . import models, serializers
from . import permissions as stuff_permissions
from .controller import (
    Auth,
    Oauth2Auth,
    TOTPDeviceController,
    WalletUserController,
)
from .utils import get_user_info, super_logger

logger = super_logger(__name__)


class AuthViewSet(viewsets.ViewSet):
    @action(detail=False, methods=["POST"], permission_classes=[permissions.AllowAny])
    def signup(self, request):
        try:
            result = Auth.sign_up(request=request)
            return result
        except TypeError as e:
            logger.error(msg=e.args[0], exc_info=True)
            return Response(
                {"error": {"detail": e.args}}, status=status.HTTP_400_BAD_REQUEST
            )
        except ValidationError as e:
            logger.error(msg=e.args[0], exc_info=True)
            return Response(
                data={"error": e.detail}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception:
            logger.error(msg=_("Something went wrong..."), exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["POST"], permission_classes=[permissions.AllowAny])
    def signin(self, request):
        try:
            result = Auth.sign_in(request=request)
            return result
        except AuthenticationFailed as e:
            logger.error(msg=e.args[0], exc_info=True)
            return Response(
                {"error": _("Bad credentials.")}, status=status.HTTP_400_BAD_REQUEST
            )
        except ValidationError as e:
            logger.error(_("Failed to sign in user"), exc_info=True)
            return Response(
                data={"error": e.detail}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception:
            logger.error(_("Something went wrong..."), exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["POST"])
    def signout(self, request):
        try:
            result = Auth.sign_out(request=request)
            return result
        except TokenError:
            logger.exception(_("Token is blacklisted"), exc_info=True)
            return JsonResponse(
                {"error": _("Token is blacklisted")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception:
            logger.error(_("Something went wrong..."), exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class OAuth2ViewSet(viewsets.ViewSet, dj_rest_auth_views.SocialLoginView):
    adapter_class: Type[OAuth2Adapter]

    @action(detail=False, methods=["POST"], permission_classes=[permissions.AllowAny])
    def signin_with_google(self, request, *args, **kwargs):
        self.adapter_class = GoogleOAuth2Adapter
        try:
            response = super().post(request, *args, **kwargs)
            result = Oauth2Auth.signin_with_google(request=request, response=response)
            return result
        except TypeError as e:
            logger.error(msg=e.args[0], exc_info=True)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            logger.error(msg=e.args[0], exc_info=True)
            return Response(
                data={"error": e.detail},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception:
            logger.error(_("Something went wrong..."), exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TwoFactorAuthViewSet(viewsets.ViewSet):
    @action(detail=False, methods=["POST"])
    def create_totp_device(self, request):
        """Set up a new TOTP device."""
        try:
            result = TOTPDeviceController.create_totp_device(request=request)
            return result
        except Exception:
            logger.exception(_("Something went wrong..."), exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["POST"])
    def verify_totp_device(self, request):
        """Verify/enable a TOTP device."""
        try:
            result = TOTPDeviceController.verify_totp_device(request=request)
            return result
        except TypeError:
            return Response(
                {"error": _("Invalid TOTP token.")}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception:
            logger.exception(_("Something went wrong..."), exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(
        detail=False,
        methods=["POST"],
        permission_classes=[
            permissions.IsAuthenticated,
            stuff_permissions.IsOtpVerified,
        ],
    )
    def create_backup_tokens(self, request):
        try:
            result = TOTPDeviceController.create_backup_tokens(request=request)
            return result
        except Exception:
            logger.exception(_("Something went wrong..."), exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["POST"])
    def verify_backup_token(self, request):
        try:
            result = TOTPDeviceController.verify_backup_token(request=request)
            return result
        except TypeError:
            return Response(
                {"error": _("Invalid token.")}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception:
            logger.exception(_("Something went wrong..."), exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(
        detail=False,
        methods=["DELETE"],
        permission_classes=[
            permissions.IsAuthenticated,
            stuff_permissions.IsOtpVerified,
        ],
    )
    def delete_totp_device(self, request):
        try:
            result = TOTPDeviceController.delete_totp_device(request=request)
            return result
        except Exception:
            logger.exception(_("Something went wrong..."), exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
    )

    @action(detail=False, methods=["GET"], permission_classes=[permissions.AllowAny])
    def check_user_by_username(self, request):
        try:
            result = WalletUserController.check_user_by_username(
                request=request, qs=self.queryset
            )
            return result
        except TypeError:
            return Response(
                data={"error": _("Please provide username in query params")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception:
            logger.error(_("Something went wrong..."), exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["GET"], permission_classes=[permissions.AllowAny])
    def check_user_by_email(self, request):
        try:
            result = WalletUserController.check_user_by_email(
                request=request, qs=self.queryset
            )
            return result
        except TypeError:
            return Response(
                data={"error": _("Please provide email in query params")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception:
            logger.error(_("Something went wrong..."), exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["POST"])
    def create_change_email_request(self, request):
        try:
            result = WalletUserController.change_email_request(request=request)
            return result
        except TypeError as e:
            return Response(
                data={"error": e.args[0]},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception:
            logger.error(_("Something went wrong..."), exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["POST"])
    def verify_email_change(self, request):
        try:
            result = WalletUserController.verify_email_change(request=request)
            return result
        except TypeError as e:
            return Response(
                data={"error": e.args[0]},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception:
            logger.error(_("Something went wrong..."), exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=["POST"])
    def change_password(self, request, **kwargs):
        """Change user password."""
        try:
            result = WalletUserController.change_password(
                request=request, pk=kwargs.get("public_id")
            )
            return result
        except TypeError as e:
            logger.error(msg=e.args[0], exc_info=True)
            return Response(
                data={"error": {"detail": e.args}}, status=status.HTTP_400_BAD_REQUEST
            )
        except ValidationError as e:
            return Response(
                data={"error": e.detail},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception:
            logger.error(_("Something went wrong..."), exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["POST"], permission_classes=[permissions.AllowAny])
    def create_reset_password_request(self, request):
        try:
            result = WalletUserController.create_reset_password_request(request=request)
            return result
        except ValidationError as e:
            return Response(
                data={"error": e.detail},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception:
            logger.error(_("Something went wrong..."), exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["POST"], permission_classes=[permissions.AllowAny])
    def create_new_password(self, request):
        try:
            result = WalletUserController.create_new_password(request=request)
            return result
        except ValidationError as e:
            return Response(
                data={"error": e.detail},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception:
            logger.error(_("Something went wrong..."), exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["POST"], permission_classes=[permissions.AllowAny])
    def username_suggestions(self, request):
        try:
            result = WalletUserController.username_suggestions(request=request)
            return result
        except TypeError:
            return Response(
                data={"error": _("Please provide username in query params")},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception:
            logger.error(_("Something went wrong..."), exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, **kwargs):
        try:
            WalletUserController.destroy(
                request=request,
                pk=kwargs.get("public_id"),
            )
            return Response(status=status.HTTP_204_NO_CONTENT)
        except TypeError as e:
            logger.error(msg=e.args[0], exc_info=True)
            return Response(
                data={"error": {"detail": e.args}},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except ValidationError as e:
            logger.error(msg=e.args[0], exc_info=True)
            return Response(
                data={"error": e.detail},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception:
            logger.error(_("Something went wrong..."), exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class WalletUserDeviceViewSet(viewsets.ModelViewSet):
    queryset = models.WalletUserDevice.objects.all()
    serializer_class = serializers.WalletUserDeviceSerializer
    allowed_methods = ("list",)

    def list(self, request: HttpRequest):
        get_user_info(request=request, user=request.user)

        qs = self.queryset.filter(wallet_user=request.user).order_by("-last_access")[:5]
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
