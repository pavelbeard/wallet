from django.utils.translation import gettext_lazy as _
from django.db import models

from stuff.models import WalletUser, Tag
from utils.password_utils import encrypt

# Create your models here.


class PasswordRecordManager(models.Manager):
    def create(self, **kwargs):
        password = kwargs.pop("password")
        user = kwargs.get("wallet_user")
        master_password = user.master_password
        data = encrypt(password, master_password)
        kwargs["password"] = data["encrypted_data"]
        kwargs["salt"] = data["salt"]
        
        return super().create(**kwargs)


class PasswordRecord(models.Model):
    wallet_user = models.ForeignKey(WalletUser, on_delete=models.CASCADE)
    label = models.CharField(max_length=255)
    url = models.URLField(max_length=255, blank=True, null=True)
    login = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    salt = models.CharField(max_length=255)
    notes = models.TextField(blank=True, null=True)
    tags = models.ManyToManyField(Tag, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    edited = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Password")
        verbose_name_plural = _("Passwords")

    def __str__(self):
        return self.label

    objects = PasswordRecordManager()
