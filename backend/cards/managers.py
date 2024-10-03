from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _

from .luhn import LuhnAlgorithm


class BaseCardManager:
    @staticmethod
    def verifier(card_number):
        luhn_algorithm = LuhnAlgorithm(card_number)
        return luhn_algorithm.verify()


class CardQuerySet(models.QuerySet, BaseCardManager):
    def custom_update(self, **kwargs):
        card_number = kwargs.get('card_number')
        if card_number and self.verifier(card_number):
            super().update(**kwargs)
        elif not card_number:
            super().update(**kwargs)
        else:
            raise ValidationError(_('Invalid card number'))

    def update(self, **kwargs):
        return self.custom_update(**kwargs)


class CardObjectManager(models.Manager, BaseCardManager):
    def get_queryset(self):
        return CardQuerySet(self.model, using=self._db)

    def create(self, **kwargs):
        card_number = kwargs.get('card_number')
        if self.verifier(card_number):
            obj = self.model(**kwargs)
            obj.payment_system = obj.get_payment_system()
            obj.save()
            return obj

        raise ValidationError(_('Invalid card number'))

    def get_or_create(self, defaults=None, **kwargs):
        card_number = kwargs.get('card_number')
        if self.verifier(card_number):
            return super().get_or_create(defaults, **kwargs)

        raise ValidationError(_('Invalid card number'))

    def update(self, **kwargs):
        return self.get_queryset().custom_update(**kwargs)

    def update_or_create(self, defaults=None, create_defaults=None, **kwargs):
        card_number = kwargs.get('card_number')
        if card_number and self.verifier(card_number):
            return super().update_or_create(defaults, create_defaults, **kwargs)
        elif not card_number:
            return super().update_or_create(defaults, create_defaults, **kwargs)
        else:
            raise ValidationError(_('Invalid card number'))
