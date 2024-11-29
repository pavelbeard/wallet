from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .forms import WalletUserCreationForm, WalletUserUpdateForm
from .models import DDevice, WalletUser, WalletUserDevice

# Register your models here.


@admin.register(WalletUser)
class UserAdmin(BaseUserAdmin):
    form = WalletUserUpdateForm
    add_form = WalletUserCreationForm

    list_display = (
        "username",
        "public_id",
        "email",
        "is_two_factor_enabled",
        "is_active",
        "is_staff",
        "is_superuser",
    )

    fieldsets = (
        (None, {"fields": ("username", "email", "password", "is_two_factor_enabled")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser")}),
        ("Groups", {"fields": ("groups",)}),
        ("User permissions", {"fields": ("user_permissions",)}),
    )


@admin.register(DDevice)
class DDeviceAdmin(admin.ModelAdmin):
    list_display = ("d_name", "icon")


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
    )
