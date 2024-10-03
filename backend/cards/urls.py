from rest_framework import routers

from cards.views import CardViewSet

router = routers.DefaultRouter()
router.register(r'items', CardViewSet)

urlpatterns = router.urls
