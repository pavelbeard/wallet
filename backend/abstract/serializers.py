from rest_framework import serializers

class AbstractSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='public_id', read_only=True)
    