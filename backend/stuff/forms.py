from django import forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.utils.translation import gettext_lazy as _
from django_svg_image_form_field import SvgAndImageFormField

from .models import DDevice, WalletUser


class WalletUserCreationForm(forms.ModelForm):
    email = forms.EmailField(
        label=_("Email"),
        widget=forms.EmailInput(attrs={"placeholder": "Email"}),
        required=False,
    )
    password1 = forms.CharField(label=_("Password"), widget=forms.PasswordInput)
    password2 = forms.CharField(label=_("Password confirm"), widget=forms.PasswordInput)

    class Meta:
        model = WalletUser
        fields = ("username", "email", "password1", "password2")


class WalletUserUpdateForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = WalletUser
        fields = (
            "username",
            "email",
        )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["email"].required = False


class DDeviceCreationForm(forms.ModelForm):
    class Meta:
        model = DDevice
        exclude = []
        field_classes = {"icon": SvgAndImageFormField}
