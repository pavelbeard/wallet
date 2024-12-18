from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from .forms import DDeviceCreationForm, WalletUserCreationForm, WalletUserUpdateForm
from .models import (
    DDevice,
    EmailVerificationToken,
    PasswordResetToken,
    WalletUser,
    WalletUserDevice,
)

# Register your models here.


@admin.register(WalletUser)
class UserAdmin(BaseUserAdmin):
    form = WalletUserUpdateForm
    add_form = WalletUserCreationForm

    list_display = (
        "username",
        "public_id",
        "email",
        "email_verified",
        "is_two_factor_enabled",
        "is_oauth_user",
        "is_active",
        "is_staff",
        "is_superuser",
    )

    fieldsets = (
        (None, {"fields": ("username", "email", "password")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser")}),
        ("Groups", {"fields": ("groups",)}),
        ("User permissions", {"fields": ("user_permissions",)}),
    )


@admin.register(DDevice)
class DDeviceAdmin(admin.ModelAdmin):
    list_display = ("d_name", "icon")
    search_fields = ("d_name",)
    form = DDeviceCreationForm


@admin.register(WalletUserDevice)
class WalletUserDeviceAdmin(admin.ModelAdmin):
    list_display = (
        "wallet_user",
        "d_device",
        "operational_system",
        "d_ip_address",
        "location",
        "created_at",
        "last_access",
        "is_actual_device",
    )


@admin.register(EmailVerificationToken)
class EmailVerificationTokenAdmin(admin.ModelAdmin):
    list_display = ("email", "token", "created_at", "until", "is_valid", "is_active")
    search_fields = ("email", "token", "created_at", "until")

    @admin.display(boolean=True, description=_("Is token valid"))
    def is_valid(self, obj: EmailVerificationToken):
        return obj.is_valid()


@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ("user", "token", "created_at", "until", "is_valid", "is_active")
    search_fields = ("user", "token", "created_at", "until")

    @admin.display(boolean=True, description=_("Is token valid"))
    def is_valid(self, obj: PasswordResetToken):
        return obj.is_valid()
