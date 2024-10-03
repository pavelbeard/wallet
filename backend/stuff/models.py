from datetime import timedelta

import nanoid_field
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from . import managers


# Create your models here.

class WalletUser(AbstractUser):
    username_validator = RegexValidator(
        r'^[a-z0-9_]+$',
        _('Enter a valid username consisting of lowercase letters, number and underscores only.'),
        'invalid'
    )

    userid = nanoid_field.NanoidField(max_length=16, primary_key=True, editable=False, serialize=False)
    username = models.CharField(max_length=250, blank=True, null=True, unique=True, validators=[username_validator])
    password = models.CharField(max_length=250, blank=True, null=True)
    email = models.EmailField(blank=True, null=True, unique=True)
    email_verified = models.BooleanField(default=False)
    is_two_factor_enabled = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.username == '':
            self.username = None

        if self.email == '':
            self.email = None

        if not (self.username or self.email):
            raise ValueError('Username or Email must be set')

        super().save(*args, **kwargs)

    def __str__(self):
        if self.username:
            return self.username
        elif self.email:
            return self.email
        else:
            return "_____"

    objects = managers.WalletUserManager()


class EmailVerificationToken(models.Model):
    token = nanoid_field.NanoidField(max_length=16, primary_key=True, editable=False, serialize=False)
    user = models.ForeignKey(WalletUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    until = models.DateTimeField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.until = self.created_at + timedelta(hours=1)

        super(EmailVerificationToken, self).save(*args, **kwargs)

    def is_valid(self):
        return timezone.now() > self.until

    class Meta:
        verbose_name = _('Email Verification Token')
        verbose_name_plural = _('Email Verification Tokens')
        unique_together = (('user', 'token'),)


class PasswordResetToken(models.Model):
    token = nanoid_field.NanoidField(max_length=16, primary_key=True, editable=False, serialize=False)
    user = models.ForeignKey(WalletUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    until = models.DateTimeField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.until = self.created_at + timedelta(hours=1)

        super(PasswordResetToken, self).save(*args, **kwargs)

    def is_valid(self):
        return timezone.now() > self.until

    class Meta:
        verbose_name = _('Password Reset Token')
        verbose_name_plural = _('Password Reset Tokens')
        unique_together = (('user', 'token'),)
