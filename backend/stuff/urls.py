from django.urls import path
from rest_framework import routers
from rest_framework_simplejwt import views as jwt_views

from . import views

router = routers.DefaultRouter()
router.register(r"users", views.WalletUserViewSet)
router.register(r"auth", views.AuthViewSet, basename="stuff-auth")
router.register(r"oauth2", views.OAuth2ViewSet, basename="stuff-oauth")
router.register(r"2fa", views.TwoFactorAuthViewSet, basename="stuff-two-factor")
router.register(r"devices", views.WalletUserDeviceViewSet, basename="stuff-devices")

urlpatterns = [
    path("refresh/", jwt_views.TokenRefreshView.as_view(), name="refresh-cookie"),
    path("verify/", jwt_views.TokenVerifyView.as_view(), name="verify"),
]

urlpatterns += router.urls
