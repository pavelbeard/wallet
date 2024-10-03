from django import forms
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.forms import UserCreationForm, ReadOnlyPasswordHashField

from .models import WalletUser


class WalletUserCreationForm(forms.ModelForm):
    email = forms.EmailField(label=_('Email'), widget=forms.EmailInput(attrs={'placeholder': 'Email'}), required=False)
    password1 = forms.CharField(label=_("Password"), widget=forms.PasswordInput)
    password2 = forms.CharField(label=_("Password confirm"), widget=forms.PasswordInput)

    class Meta:
        model = WalletUser
        fields = ('username', 'email', 'password1', 'password2')


class WalletUserUpdateForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = WalletUser
        fields = ('username', 'email',)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['email'].required = False
