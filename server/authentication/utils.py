from .models import User
from rest_framework_simplejwt.backends import TokenBackend
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
import os
from django.conf import settings
import requests
from rest_framework.validators import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import timedelta
from django.http import JsonResponse
from rest_framework.response import Response


def get_existing_user(user_id):
    try:
        user = User.objects.get(id=user_id)
        return user
    except User.DoesNotExist:
        return "User does not exist"
    except Exception as error:
        return error


def verify_simple_jwt(token):
    try:
        # Verify the token
        UntypedToken(token)

        # Decode token to get data
        token_backend = TokenBackend(
            algorithm="HS256", signing_key=os.environ.get("JWT_SECRET")
        )
        valid_data = token_backend.decode(token, verify=True)
        return valid_data
    except TokenError as e:
        raise InvalidToken(e)


def set_cookie_helper(
    response, key, value, life, path="/", httponly=True, samesite="None", secure=True
):
    response.set_cookie(
        key,
        value,
        max_age=life,
        path=path,
        httponly=httponly,
        samesite=samesite,
        secure=secure,
    )
    return response


def google_get_access_token(*, code: str, redirect_uri: str) -> str:
    data = {
        "code": code,
        "client_id": settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY,
        "client_secret": settings.SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET,
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code",
    }

    response = requests.post("https://oauth2.googleapis.com/token", data=data)

    if not response.ok:
        raise ValidationError("Failed to obtain access token from Google.")

    access_token = response.json()

    return access_token


class GoogleOAuthProvider:
    def exchange_auth_code(self, code, redirect_uri):
        token_url = "https://oauth2.googleapis.com/token"
        token_data = {
            "code": code,
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code",
        }
        token_response = requests.post(token_url, data=token_data)
        token_response_data = token_response.json()

        if "error" in token_response_data:
            raise ValidationError(token_response_data)

        access_token = token_response_data["access_token"]
        return access_token

    def get_user_info(self, access_token):
        user_info_url = "https://www.googleapis.com/oauth2/v2/userinfo"
        user_info_response = requests.get(
            user_info_url, headers={"Authorization": f"Bearer {access_token}"}
        )
        user_info = user_info_response.json()

        if "error" in user_info:
            raise ValidationError(user_info)

        return user_info

    def create_or_get_user(self, user_email):
        try:
            user = User.objects.filter(email=user_email).first()
            if user:
                return user

            user = User.objects.create(
                email=user_email,
                username=user_email.split("@")[0],
                is_active=True,
            )

            return user
        except Exception as error:
            print("Error occurred while creating or getting the user -> ", error)
            raise ValidationError(str(error))


class GenerateAndSetJWT:
    def __init__(self, user):
        self.user = user
        self.__access_token_life = timedelta(
            minutes=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds() / 60
        )
        self.__refresh_token_life = timedelta(
            days=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].days
        )
        self.__refresh_token = ""

    def generate_refresh_token(self):
        try:
            if not self.user:
                raise ValidationError("User is not defined.")

            refresh = RefreshToken.for_user(self.user)
            refresh["username"] = self.user.username
            refresh["email"] = self.user.email

            self.__refresh_token = refresh

            self.user.refresh_token = self.__refresh_token
            self.user.access_token = self.__refresh_token.access_token
            self.user.is_active = True
            self.user.save()

            return self.__refresh_token

        except User.DoesNotExist:
            raise ValidationError("User does not exist.")
        except Exception as error:
            raise ValidationError(str(error))

    def set_jwt_cookie(self):
        cookies = [
            {
                "key": "access",
                "value": str(self.__refresh_token.access_token),
                "life": self.__access_token_life,
            },
            {
                "key": "refresh",
                "value": str(self.__refresh_token),
                "life": self.__refresh_token_life,
            },
        ]

        # response = JsonResponse(
        #     {"status": 200, "message": "You are now signed in to your account."}
        # )
        response = Response({"message": "Login successful"})
        for cookie in cookies:
            response = set_cookie_helper(
                key=cookie["key"],
                value=cookie["value"],
                life=cookie["life"],
                response=response,
            )

        return response
