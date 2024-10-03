from rest_framework import viewsets

from stuff import permissions
from . import models, serializers


# Create your views here.

class CardViewSet(viewsets.ModelViewSet):
    queryset = models.Card.objects.all()
    serializer_class = serializers.CardSerializer
    permission_classes = [permissions.IsOtpVerified]

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.CardSerializer
        elif self.action in ['create', 'retrieve', 'update', 'partial_update', 'destroy']:
            return serializers.StrictCardSerializer
