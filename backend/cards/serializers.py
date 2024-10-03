from rest_framework import serializers

from . import models


class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Card
        fields = '__all__'
        depth = 2


class StrictCardSerializer(CardSerializer):
    class Meta:
        model = models.Card
        fields = '__all__'
