from rest_framework import viewsets, permissions

from . import models, serializers


# Create your views here.

class CardViewSet(viewsets.ModelViewSet):
    queryset = models.Card.objects.all()
    serializer_class = serializers.CardSerializer
    permission_classes = (permissions.IsAuthenticated,)
