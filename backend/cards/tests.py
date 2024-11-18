from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase

from . import luhn, models

User = get_user_model()


# Create your tests here.


class TestCardNumber(TestCase):
    def setUp(self):
        self.card_number1 = "4188202145836985"
        self.card_number2 = "4444 5555 6666 8989"

    def test_card_number(self):
        verifier = luhn.LuhnAlgorithm(self.card_number1)
        result1 = verifier.verify()

        verifier.new_number(self.card_number2)
        result2 = verifier.verify()

        self.assertEqual(result1, True)
        self.assertEqual(result2, False)

    def test_verifier_in_model(self):
        user = User.objects.create_user(
            username="pavel", email="user@user.com", password="Admin@123"
        )
        models.Card.objects.create(
            card_number=self.card_number1,
            card_holder_name="PABLO BARBADO",
            month="01",
            year="2020",
            cvv="111",
            user=user,
        )

        self.assertEqual(models.Card.objects.count(), 1)

        new_user = User.objects.create_user(
            username="pavel1", email="user@use1.com", password="@dmin123"
        )

        try:
            models.Card.objects.get_or_create(
                card_number=self.card_number2,
                card_holder_name="PABLO BARBADO",
                month="01",
                year="2020",
                cvv="111",
                user=new_user,
            )
        except ValidationError:
            self.assertEqual(True, True)

    def test_update_or_create_object(self):
        user = User.objects.create_user(
            username="pavel", email="user@user.com", password="Admin@123"
        )
        obj = models.Card.objects.create(
            card_number=self.card_number1,
            card_holder_name="PABLO BARBADO",
            month="01",
            year="2020",
            cvv="111",
            user=user,
        )
        print(obj)

        try:
            obj, created = models.Card.objects.update_or_create(
                card_number=self.card_number1,
                defaults={"card_number": self.card_number2},
            )

        except ValidationError:
            self.assertEqual(True, True)

    def test_get_or_create(self):
        obj, created = models.Card.objects.get_or_create(
            card_number=self.card_number1,
            card_holder_name="PABLO BARBADO",
            month="01",
            year="2020",
            cvv="111",
            user=User.objects.create_user(
                username="pavel", email="user@user.com", password="Admin@123"
            ),
        )
        print(obj)
        self.assertEqual(created, True)

    def test_update_and_raise_validation_error(self):
        obj, created = models.Card.objects.get_or_create(
            card_number=self.card_number1,
            card_holder_name="PABLO BARBADO",
            month="01",
            year="2020",
            cvv="111",
            user=User.objects.create_user(
                username="pavel", email="user@user.com", password="Admin@123"
            ),
        )

        self.assertTrue(created)
        self.assertEqual(obj.card_number, self.card_number1)

        with self.assertRaises(ValidationError):
            try:
                models.Card.objects.filter(pk=1).update(
                    card_number=self.card_number2,
                )
            except ValidationError as e:
                print(e)
                raise
