import time
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from qrcode.image.pil import PilImage
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.state import token_backend
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

from stuff.models import EmailVerificationToken, PasswordResetToken, WalletUser
from stuff.two_factor_utils import (
    generate_2fa_key_in_qr_code,
    override_api_settings,
)

User = get_user_model()


# Create your tests here.


class StuffTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.login_url = reverse("stuff-auth-signin")
        self.signup_url = reverse("stuff-auth-signup")
        password = "P@assW0rd!"
        self.password = password

        self.user_with_username = User.objects.create_user(
            username="testuser",
            password=password,
        )
        self.user_with_email = User.objects.create_user(
            email="testuser@example.com",
            password=password,
        )
        self.user = User.objects.create_user(
            username="testuser_new",
            email="testuser_new@example.com",
            password=password,
        )

    # login
    def test_with_username(self):
        data = {
            "username": "testuser",
            "password": self.password,
        }

        response = self.client.post(self.login_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.json())

    def test_with_email(self):
        data = {
            "email": "testuser@example.com",
            "password": self.password,
        }

        response = self.client.post(self.login_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.json())

    def test_with_email_as_username(self):
        data = {
            "username": "testuser@example.com",
            "password": self.password,
        }

        response = self.client.post(self.login_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("detail", response.json())

    # signup
    def test_signup_with_username(self):
        data = {
            "username": "testuser_new1",
            "email": "testuser_new1@example.com",
            "first_name": "test",
            "last_name": "test",
            "password": self.password,
            "password2": self.password,
        }

        response = self.client.post(self.signup_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        obj = WalletUser.objects.first()
        for field in obj._meta.fields:
            print(field.name, ": ", getattr(obj, field.name))

    def test_signup_without_username(self):
        data = {
            "email": "testuser_new1@example.com",
            "first_name": "test",
            "last_name": "test",
            "password": self.password,
            "password2": self.password,
        }

        response = self.client.post(self.signup_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("detail", response.json())

        obj = WalletUser.objects.last()
        for field in obj._meta.fields:
            print(field.name, ": ", getattr(obj, field.name))

    def test_signup_only_with_email(self):
        data = {
            "email": "testuser1@example.com",
        }
        response = self.client.post(self.signup_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_signup_with_email_as_username(self):
        data = {
            "username": "testuser_new1@example.com",
            "password": self.password,
            "password2": self.password,
        }

        response = self.client.post(self.signup_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("detail", response.json())

    def test_signup_with_email(self):
        data = {
            "email": "testuser_new11@example.com",
            "password": self.password,
            "password2": self.password,
        }

        response = self.client.post(self.signup_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("detail", response.json())

    # missing credentials

    # check_user
    def test_check_url_wallet_user_list(self):
        url = reverse("walletuser-list")
        self.assertEqual(url, "/api/users/")

    def test_check_user_by_username(self):
        url = reverse("walletuser-check-user-by-username")
        query = {"username": self.user_with_username.username}
        response = self.client.get(url, query_params=query, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("username", response.json())

    def test_check_user_by_email(self):
        url = reverse("walletuser-check-user-by-email")
        query = {"email": self.user_with_email.email}
        response = self.client.get(url, query_params=query, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("email", response.json())

    @override_api_settings(ACCESS_TOKEN_LIFETIME=timedelta(seconds=1))
    def test_login_logout(self):
        # setup
        card_url = reverse("card-list")
        logout_url = reverse("stuff-auth-signout")
        data = {
            "username": "testuser",
            "password": self.password,
        }
        # login
        token = RefreshToken.for_user(User.objects.get(username=data.get("username")))
        __clientid: AccessToken = token.access_token
        __rclientid = str(token)
        setattr(__clientid, "lifetime", timedelta(seconds=1))
        __clientid.payload["exp"] = __clientid.payload["iat"] + 1
        self.client.cookies.load({"__rclientid": __rclientid})
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {__clientid}")

        # set credentials
        # test api accessibility
        response1 = self.client.get(
            card_url,
            format="json",
        )
        self.assertEqual(response1.status_code, status.HTTP_200_OK)

        # access token expired
        time.sleep(1.1)
        wrong_response = self.client.get(card_url)
        self.assertEqual(wrong_response.status_code, status.HTTP_401_UNAUTHORIZED)

        # refresh token
        refresh_url = reverse("refresh")
        refresh_response = self.client.post(refresh_url, format="json")
        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)

        print(refresh_response.json())

        # test api accessibility
        new_response = self.client.get(card_url)
        self.assertEqual(new_response.status_code, status.HTTP_200_OK)

        # logout
        response2 = self.client.post(logout_url, refresh_response.json(), format="json")
        self.assertEqual(response2.status_code, status.HTTP_200_OK)

        # test api accessibility
        response3 = self.client.get(card_url, format="json")
        self.assertEqual(response3.status_code, status.HTTP_401_UNAUTHORIZED)



class DeleteAccountTestCase(APITestCase):
    def setUp(self):
        user = WalletUser.objects.create_user(
            username="testuser",
            email="test@testdomain.com",
            password="Rt3$YiOO",
            is_active=True,
        )

        self.user = user
        response = self.client.post(
            reverse("stuff-auth-signin"),
            data={"email": user.email, "password": "Rt3$YiOO"},
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Test-Agent": "True",
            },
            format="json",
        )

        print(response)
        authData = {
            "refresh": response.data.get("refresh"),
            "access": response.data.get("access"),
        }

        self.headers = {
            "Authorization": f"Bearer {authData['access']}",
            "Test-Agent": "True",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

    def test_delete_account_fail_with_oauth(self):
        self.user.is_oauth_user = True
        self.user.save()

        url = reverse(
            "walletuser-detail",
            kwargs={"public_id": self.user.public_id},
        )

        response = self.client.delete(url, headers=self.headers, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_account_fail_with_token(self):
        self.user.is_two_factor_enabled = True
        self.user.save()

        url = reverse(
            "walletuser-detail",
            kwargs={"public_id": self.user.public_id},
        )

        response = self.client.delete(
            url, headers=self.headers, data={"token": "123"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_account_success(self):
        url = reverse(
            "walletuser-detail",
            kwargs={"public_id": self.user.public_id},
        )
        response = self.client.delete(url, headers=self.headers, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class CLIENTID_COOKIE_DoesNotExistsException(BaseException):
    pass


class TokensVerificationTestCase(APITestCase):
    def setUp(self):
        username = "testuser"
        email = "test@testdomain.com"
        password = "Rt3$YiOO"

        self.user = User.objects.create_user(
            username="testuser",
            email="test@testdomain.com",
            password=password,
        )

        self.username = username
        self.email = email
        self.password = password

    def test_password_verification_flow(self):
        pass

    @override_api_settings(USER_ID_FIELD="public_id")
    def test_two_factor_verification_flow(self):
        user = self.user
        user.is_two_factor_enabled = True
        user.save()

        # set up the test
        signin_url = reverse("stuff-auth-signin")
        response = self.client.post(
            signin_url, {"username": user.username, "password": self.password}
        )
        # if it is all good
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        if not response.cookies.get("__clientid"):
            raise CLIENTID_COOKIE_DoesNotExistsException

        self.client.cookies.load({"__clientid": response.cookies.get("__clientid")})

        # testing a totp device creation
        totp_device_creation_url = reverse("stuff-two-factor-create-totp-device")
        response = self.client.get(totp_device_creation_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(isinstance(response.data, str), True)

        print(response.data)
        print(response.content)

        # testing totp login
        totp_device_verification_url = reverse("stuff-two-factor-verify-totp-device")
        response = self.client.post(totp_device_verification_url, {"token": "017229"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content, True)

    def test_two_factor_verification_qr(self):
        test_data = "otpauth://totp/testuser?secret=7JHJUOZQN4PBQK4ZTJONKSGQUYGGDESL&algorithm=SHA1&digits=6&period=30"
        result = generate_2fa_key_in_qr_code(test_data)

        self.assertEqual(type(result), PilImage)


class JWTRefreshTokenTestCase(APITestCase):
    def setUp(self):
        username = "testuser"
        email = "test@testdomain.com"
        password = "<PASSWORD>"
        self.user = User.objects.create_user(
            username="testuser",
            email="test@testdomain.com",
            password=password,
        )
        self.username = username
        self.email = email
        self.password = password

    def test_refresh_token_flow(self):
        token = RefreshToken.for_user(User.objects.get(username=self.username))
        __clientid: AccessToken = token.access_token
        __rclientid = str(token)
        __clientid.payload["exp"] = __clientid.payload["iat"] + 1
        self.client.cookies.load({"__rclientid": __rclientid})
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {__clientid}")

        protected_url = reverse("passwords-test-password")
        refresh_url = reverse("refresh-cookie")

        self.client.cookies.load({"__rclientid": __rclientid, "__clientid": __clientid})
        protected_response = self.client.get(protected_url)
        self.assertEqual(protected_response.status_code, status.HTTP_200_OK)
        time.sleep(1.1)
        refresh_response = self.client.post(refresh_url)
        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)
        print(refresh_response.cookies)

    def test_signin_and_refresh_token_flow_cookies(self):
        signin_url = reverse("stuff-auth-signin")
        refresh_url = reverse("refresh-cookie")

        signin_response = self.client.post(
            signin_url, {"username": self.username, "password": self.password}
        )
        self.assertEqual(signin_response.status_code, status.HTTP_200_OK)

        refresh_response = self.client.post(refresh_url)
        print(BlacklistedToken.objects.all())
        print(
            "First refreshed __rclientid: ",
            refresh_response.cookies["__rclientid"].value,
        )
        print(
            "Exp time 1: ",
            token_backend.decode(refresh_response.cookies["__clientid"].value),
        )
        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)

        time.sleep(1.1)

        refresh_response = self.client.post(refresh_url)
        print(BlacklistedToken.objects.all())
        print(
            "Second refreshed __rclientid: ",
            refresh_response.cookies["__rclientid"].value,
        )
        print(
            "Exp time 2: ",
            token_backend.decode(refresh_response.cookies["__clientid"].value),
        )
        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)

        time.sleep(1.1)

        refresh_response = self.client.post(refresh_url)
        print(BlacklistedToken.objects.all())
        print(
            "Third refreshed __rclientid: ",
            refresh_response.cookies["__rclientid"].value,
        )
        print(
            "Exp time 3: ",
            token_backend.decode(refresh_response.cookies["__clientid"].value),
        )
        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)

    def test_signin_and_refresh_token_flow_body(self):
        signin_url = reverse("stuff-auth-signin")
        refresh_url = reverse("refresh-cookie")

        signin_response = self.client.post(
            signin_url, {"username": self.username, "password": self.password}
        )
        self.assertEqual(signin_response.status_code, status.HTTP_200_OK)

        refresh_response = self.client.post(
            refresh_url, {"refresh": signin_response.cookies["__rclientid"].value}
        )
        print(BlacklistedToken.objects.all())
        print(
            "First refreshed __rclientid: ",
            refresh_response.cookies["__rclientid"].value,
        )
        print(
            "Exp time 1: ",
            token_backend.decode(refresh_response.cookies["__clientid"].value),
        )
        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)

        time.sleep(1.1)

        refresh_response = self.client.post(
            refresh_url, {"refresh": refresh_response.cookies["__rclientid"].value}
        )
        print(BlacklistedToken.objects.all())
        print(
            "Second refreshed __rclientid: ",
            refresh_response.cookies["__rclientid"].value,
        )
        print(
            "Exp time 2: ",
            token_backend.decode(refresh_response.cookies["__clientid"].value),
        )
        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)


class EmailChangeTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@testdomain.com",
            password="Rt3$YiOO",
            is_active=True,
        )

        User.objects.create_user(
            username="testuser2",
            email="test2@testdomain.com",
            password="Rt3$YiOO",
            is_active=True,
        )

        User.objects.create_user(
            username="testuser3",
            email="test3@testdomain.com",
            password="Rt3$YiOO",
            is_active=True,
        )

        User.objects.create_user(
            username="testuser4",
            email="test4@testdomain.com",
            password="Rt3$YiOO",
            is_active=True,
        )

    def test_email_verification(self):
        signin_url = reverse("stuff-auth-signin")
        response = self.client.post(
            path=signin_url,
            data={"username": self.user.username, "password": "Rt3$YiOO"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        access_token = response.data.get("access")

        url = reverse("walletuser-create-change-email-request")
        response = self.client.post(
            path=url,
            headers={"Authorization": f"Bearer {access_token}"},
            data={"email": "test10@testdomain.com"},
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print(response.content)

        token = EmailVerificationToken.objects.get(user=self.user)

        url2 = reverse("walletuser-verify-email-change")
        response2 = self.client.post(
            url2,
            headers={"Authorization": f"Bearer {access_token}"},
            data={"token": token.token},
        )
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertEqual(
            WalletUser.objects.get(email="test10@testdomain.com").email,
            "test10@testdomain.com",
        )


class PasswordResetTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@testdomain.com",
            password="Rt3$YiOO",
            is_active=True,
        )

    def test_password_reset_flow(self):
        url = reverse("walletuser-create-reset-password-request")
        url2 = reverse("walletuser-create-new-password")

        response = self.client.post(url, {"email": self.user.email})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        token = PasswordResetToken.objects.get(user=self.user)

        print(response.content)
        print(token)

        response2 = self.client.post(
            url2,
            {
                "token": token.token,
                "password": "AbraCadabra@123",
                "password2": "AbraCadabra@123",
            },
        )

        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertIn("detail", response2.json())

        print(response2.content)


class UtilsTestCase(TestCase):
    def test_generate_master_password(self):
        from stuff.utils import generate_master_password

        password = generate_master_password()

        self.assertEqual(7, len(password.split("-")))
