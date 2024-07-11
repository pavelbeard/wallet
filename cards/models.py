from django.contrib.auth.models import User
from django.contrib.sessions.models import Session
from django.db import models

from .luhn import LuhnAlgorithm

from . import managers

# Create your models here.


class Card(models.Model):
    card_number = models.CharField(max_length=19, unique=True)
    card_holder_name = models.CharField(max_length=100)
    month = models.CharField(max_length=2)
    year = models.CharField(max_length=4)
    cvv = models.CharField(max_length=3, blank=True, null=True)
    note = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    payment_system = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f'{self.card_number.replace(self.card_number[5:-4], "*" * len(self.card_number[5:-4]))}'

    def get_payment_system(self):
        card_number = self.card_number
        if card_number[:2] in ['34', '37']:
            return 'American Express'
        elif card_number[:2] == '62':
            return 'UnionPay'
        elif 3528 <= int(card_number[:4]) <= 3589:
            return 'JCB'
        elif card_number[:4] in ['5018', '5020', '5038', '5893', '6304', '6759', '6761', '6762', '6763']:
            return 'Maestro'
        elif 51 <= int(card_number[:2]) <= 55 or 2200 <= int(card_number[:4]) <= 2204:
            return 'MasterCard'
        elif card_number[:1] == '4':
            return 'Visa'
        else:
            return 'Unknown'

    objects = managers.CardObjectManager()
