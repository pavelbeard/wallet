from rest_framework import routers

from passwords.views import PasswordViewSet

router = routers.DefaultRouter()
router.register(r'', PasswordViewSet, 'passwords')

urlpatterns = router.urls