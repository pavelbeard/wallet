from django.db.models.signals import post_save
from django.dispatch import receiver
from django.forms import model_to_dict

from stuff.utils import super_logger

from .models import WalletUserDevice

logger = super_logger(__name__)


@receiver(post_save, sender=WalletUserDevice)
def update_devices(sender, instance, **kwargs):
    wallet_user_devices = WalletUserDevice.objects.filter(
        wallet_user__public_id=instance.wallet_user.public_id
    )
    
    wallet_user_devices.filter(pk=instance.pk).update(is_actual_device=True)

    logger.debug(f"wallet_user_devices: {[model_to_dict(device) for device in wallet_user_devices]}")

    wallet_user_devices.exclude(pk=instance.pk).update(is_actual_device=False)
