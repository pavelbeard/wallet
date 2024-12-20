from datetime import timedelta
import uuid

from abstract.models import AbstractModel
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.core.validators import FileExtensionValidator

from . import managers

# Create your models here.


class Tag(models.Model):
    name = models.CharField(max_length=255)

    class Meta:
        verbose_name = _("Tag")
        verbose_name_plural = _("Tags")

    def __str__(self):
        return self.name


class WalletUser(AbstractModel, AbstractUser):
    username_validator = RegexValidator(
        r"^[a-z0-9_]+$",
        _(
            "Enter a valid username consisting of lowercase letters, number and underscores only."
        ),
        "invalid",
    )

    username = models.CharField(
        max_length=250,
        blank=True,
        null=True,
        unique=True,
        validators=[username_validator],
    )
    image = models.ImageField(
        upload_to="users/images",
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=["png", "jpg", "jpeg"])],
    )
    password = models.CharField(max_length=250, blank=True, null=True)
    master_password = models.CharField(max_length=250)
    email = models.EmailField(unique=True)
    email_verified = models.BooleanField(default=False)
    is_oauth_user = models.BooleanField(default=False)
    is_first_oauth_login = models.BooleanField(default=False)
    provider = models.CharField(max_length=250, blank=True, null=True)
    is_two_factor_enabled = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.username == "":
            self.username = None

        if self.email == "":
            self.email = None

        if self.last_login is None:
            self.is_first_oauth_login = True
        else:
            self.is_first_oauth_login = False

        if not (self.username or self.email):
            raise ValueError("Username or Email must be set")

        super().save(*args, **kwargs)

    def __str__(self):
        if self.username:
            return self.username
        elif self.email:
            return self.email
        else:
            return "_____"

    objects = managers.WalletUserManager()


class EmailVerificationToken(AbstractModel, models.Model):
    token = models.UUIDField(
        max_length=32, editable=False, serialize=False, default=uuid.uuid4
    )
    user = models.ForeignKey(WalletUser, on_delete=models.CASCADE)
    email = models.EmailField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now=True)
    until = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.until = timezone.now() + timedelta(hours=1)

        super(EmailVerificationToken, self).save(*args, **kwargs)

    def is_valid(self):
        if self.is_active:
            return timezone.now() < self.until
        return False

    class Meta:
        verbose_name = _("Email Verification Token")
        verbose_name_plural = _("Email Verification Tokens")
        unique_together = (("user", "token"),)


class PasswordResetToken(AbstractModel, models.Model):
    token = models.UUIDField(
        max_length=32, editable=False, serialize=False, default=uuid.uuid4
    )
    user = models.ForeignKey(WalletUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now=True)
    until = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.until = timezone.now() + timedelta(hours=1)

        super(PasswordResetToken, self).save(*args, **kwargs)

    def is_valid(self):
        if self.is_active:
            return timezone.now() < self.until
        return False

    class Meta:
        verbose_name = _("Password Reset Token")
        verbose_name_plural = _("Password Reset Tokens")
        unique_together = (("user", "token"),)


class DDevice(models.Model):
    d_name = models.CharField(max_length=250, blank=True, null=True)
    icon = models.ImageField(
        upload_to="device_icons",
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=["svg", "webp", "png"])],
    )

    def __str__(self):
        return self.d_name

    class Meta:
        verbose_name = _("Device")
        verbose_name_plural = _("Devices")


class WalletUserDevice(models.Model):
    # TODO: add is actual device field
    wallet_user = models.ForeignKey(WalletUser, on_delete=models.CASCADE)
    d_device = models.ForeignKey(DDevice, on_delete=models.CASCADE)
    operational_system = models.CharField(max_length=250, blank=True, null=True)
    d_ip_address = models.GenericIPAddressField(protocol="IPv4")
    location = models.CharField(max_length=250, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_access = models.DateTimeField(auto_now_add=True)
    is_actual_device = models.BooleanField(default=True)

    def __str__(self):
        return self.d_device.d_name

    class Meta:
        unique_together = (("wallet_user", "d_device"),)
        verbose_name = _("Wallet User Device")
        verbose_name_plural = _("Wallet User Devices")
