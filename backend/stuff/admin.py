from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .forms import WalletUserCreationForm, WalletUserUpdateForm
from .models import WalletUser


# Register your models here.

@admin.register(WalletUser)
class UserAdmin(BaseUserAdmin):
    form = WalletUserUpdateForm
    add_form = WalletUserCreationForm
    
    list_display = ('username', 'email', 'is_two_factor_enabled', 'is_active', 'is_staff', 'is_superuser')

    fieldsets = (
        (None, {'fields': ('username', 'email', 'password', 'is_two_factor_enabled')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
        ('Groups', {'fields': ('groups', )}),
        ('User permissions', {'fields': ('user_permissions', )}),
    )
