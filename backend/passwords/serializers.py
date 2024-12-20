from rest_framework import serializers

from utils.password_utils import decrypt
from stuff.models import WalletUser
from passwords.models import PasswordRecord


class PasswordRecordSerializer(serializers.ModelSerializer):    
    password = serializers.SerializerMethodField()
    
    def get_password(self, obj: PasswordRecord):
        decrypted_password = decrypt(obj.password, obj.salt, obj.wallet_user.master_password)
        return decrypted_password
    
    class Meta:
        model = PasswordRecord
        fields = (
            "id",
            "label",
            "login",
            "password",
            "url",
            "notes",
            "tags",
            "created",
            "edited",
        )
        
    def create(self, validated_data):
        user_pk = self.context.get("pk")
        user = WalletUser.objects.get(pk=user_pk)
        
        validated_data["wallet_user"] = user
        return PasswordRecord.objects.create(**validated_data)
        
        
