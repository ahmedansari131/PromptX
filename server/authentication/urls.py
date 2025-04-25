from django.urls import path
from .views import (
    GoogleOAuthView,
    # GmailLogin,
    UserProfile,
    UserSignout,
    GetGmailToken,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)


urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    # path("google-login/", GmailLogin.as_view(), name="google_login"),
    path("callback/", GoogleOAuthView.as_view(), name="google_callback"),
    path("user/", UserProfile.as_view(), name="user_identity"),
    path("signout/", UserSignout.as_view(), name="signout"),
    path("gmail-token/", GetGmailToken.as_view(), name="gmail_token"),
]
