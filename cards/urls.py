from rest_framework import routers

from cards.views import CardViewSet

router = routers.DefaultRouter()
router.register(r'cards', CardViewSet)