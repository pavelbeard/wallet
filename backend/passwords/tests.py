from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

from passwords.models import PasswordRecord
from stuff.models import WalletUser
from utils.two_factor_utils import jwt_decode_handler
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your tests here.
class PasswordsTests(APITestCase):
    def test_sign_in_with_master_password_flow(self):
        johndoe = User.objects.create_user(
            username="johndoe",
            email="johndoe2020@testdomain.com",
            password="Rt3$YiOO",
            is_active=True,
            master_password="12345678",
        )

        response = self.client.post(
            reverse("stuff-auth-signin"),
            data={"username": "johndoe", "password": "Rt3$YiOO"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.json())

        access_token = response.json().get("access")
        decoded_token = jwt_decode_handler(response.json().get("access"))
        self.assertEqual(decoded_token.get("verified"), False)

        check_master_password_url = reverse("walletuser-check-master-password")
        response = self.client.post(
            check_master_password_url,
            data={"masterPassword": "12345678"},
            headers={"Authorization": f"Bearer {access_token}"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.json())

        access_token = response.json().get("access")
        decoded_token = jwt_decode_handler(access_token)
        self.assertEqual(decoded_token.get("verified"), True)

        # check permission
        PasswordRecord.objects.create(
            wallet_user=johndoe, password="12345678", label="test"
        )

        passwords_url = reverse("passwords-list")
        response = self.client.get(
            passwords_url,
            format="json",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        content = response.json()
        
        self.assertIn("password", content[0])
        self.assertNotIn("salt", content[0])
        
        print(content)

    def test_signin_without_master_password_check(self):
        WalletUser.objects.create_user(
            username="johndoe",
            email="test@testdomain.com",
            password="Rt3$YiOO",
            is_active=True,
            master_password="1234567890",
        )
        
        response = self.client.post(
            reverse("stuff-auth-signin"),
            data={
                "email": "test@testdomain.com",
                "password": "Rt3$YiOO",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        decode_token = jwt_decode_handler(response.json()["access"])
        
        self.assertEqual(decode_token["verified"], False)
        
        response = self.client.get(
            reverse("passwords-list"),
            format="json",
            headers={"Authorization": f"Bearer {response.json()['access']}"},
        )
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)