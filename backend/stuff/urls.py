from django.urls import path
from rest_framework import routers
from rest_framework_simplejwt import views as jwt_views

from . import views

router = routers.DefaultRouter()
router.register(r'users', views.WalletUserViewSet)
router.register(r'auth', views.AuthViewSet, basename='stuff-auth')
router.register(r'2fa', views.TwoFactorAuthViewSet, basename='stuff-two-factor')

urlpatterns = [
    path('refresh/', views.CookieTokenRefreshView.as_view(), name='refresh-cookie'),
    path('verify/', jwt_views.TokenVerifyView.as_view(), name='verify'),
]

urlpatterns += router.urls
