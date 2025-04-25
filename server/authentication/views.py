from rest_framework.views import APIView
from server.response.api_response import ApiResponse
from .utils import (
    GenerateAndSetJWT,
)
from .providers import GoogleOAuthProvider
from google_auth_oauthlib.flow import Flow
from django.conf import settings
from .serializers import UserProfileSerializer, GmailTokenSerializer
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from .models import GmailToken


REDIRECT_URI = "http://127.0.0.1:8000/api/v1/auth/callback/"
SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "openid",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/gmail.send",
]


# class GmailLogin(APIView):
#     """Returns Google OAuth login URL"""

#     authentication_classes = []

#     def get(self, request):
#         flow = Flow.from_client_config(
#             {
#                 "web": {
#                     "client_id": settings.GOOGLE_CLIENT_ID,
#                     "client_secret": settings.GOOGLE_CLIENT_SECRET,
#                     "redirect_uris": [REDIRECT_URI],
#                     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
#                     "token_uri": "https://oauth2.googleapis.com/token",
#                 }
#             },
#             scopes=SCOPES,
#         )
#         flow.redirect_uri = REDIRECT_URI

#         auth_url, _ = flow.authorization_url(
#             access_type="offline", include_granted_scopes="true", prompt="consent"
#         )
#         return ApiResponse.response_succeed(
#             message="Success", data={"auth_url": auth_url}, status=200, success=True
#         )


class GoogleOAuthView(APIView):
    authentication_classes = []

    def post(self, request):
        code = request.data.get("code")
        redirect_uri = request.data.get("redirect_uri")
        if not code or not redirect_uri:
            return ApiResponse.response_failed(
                message="Code and redirect_uri are required.", status=400
            )

        try:
            google_auth = GoogleOAuthProvider()
            creds = google_auth.exchange_auth_code(code, redirect_uri)
            user_info = google_auth.get_user_info(access_token=creds.token)
            user_email = user_info.get("email")
            profile_pic = user_info.get("picture")
            username = user_email.split("@")[0]
            user = google_auth.create_or_get_user(
                user_email=user_email, username=username, profile_url=profile_pic
            )
            google_auth.save_credentials(user, creds)

            tokens = GenerateAndSetJWT(user=user)
            tokens.generate_refresh_token()
            response = tokens.set_jwt_cookie()

            return response
        except Exception as e:
            return ApiResponse.response_failed(message=str(e), status=500)


class UserProfile(APIView):
    def get(self, request):
        user = request.user

        if user:
            serializer = UserProfileSerializer(user)
            return ApiResponse.response_succeed(
                message="User found.", data=serializer.data, status=200, success=True
            )

        return ApiResponse.response_failed(
            message="Please sign in to proceed further.", success=False, status=401
        )


class UserSignout(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            response = JsonResponse({"message": "Signed out successfully."})
            response.set_cookie(
                "access",
                "",
                max_age=0,
                path="/",
                httponly=False,
                samesite="None",
                secure=True,
            )

            response.set_cookie(
                "refresh",
                "",
                max_age=0,
                path="/",
                httponly=False,
                samesite="None",
                secure=True,
            )

            return response
        except Exception as error:
            print("Error occurred while signing out the user -> ", error)
            return ApiResponse.response_failed(
                message="Error occurred on server while signing out the user. Please try again in sometime!",
                status=500,
            )


class GetGmailToken(APIView):
    def get(self, request):
        user = request.user
        try:
            token = GmailToken.objects.get(user=user)
        except GmailToken.DoesNotExist:
            return None

        serializer = GmailTokenSerializer(token)

        return ApiResponse.response_succeed(
            message="Gmail service retrieved successfully.",
            data=serializer.data,
            status=200,
            success=True,
        )
