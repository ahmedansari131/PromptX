from django.conf import settings
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from django.utils.timezone import make_aware
from .models import User, GmailToken
import os

SCOPES = [
      "https://www.googleapis.com/auth/gmail.readonly",
      "openid",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/gmail.send"
    ]



class GoogleOAuthProvider:
    def exchange_auth_code(self, code, redirect_uri):
        os.environ["OAUTHLIB_RELAX_TOKEN_SCOPE"] = "1"
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "redirect_uris": [redirect_uri],
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                }
            },
            scopes=SCOPES,
        )
        flow.redirect_uri = redirect_uri
        authorization_url, state = flow.authorization_url(
            access_type="offline",
            prompt="consent",  # 👈 forces re-consent
            include_granted_scopes=False,  # 👈 force new scopes to override old ones
        )
        print("🔗 Visit this URL:", authorization_url)
        try:
            flow.fetch_token(code=code)
        except Exception as e:
            print("Error during token fetch:", str(e))
            raise
        creds = flow.credentials
        print("Granted scopes:", creds.scopes)
        return creds

    def get_user_info(self, access_token):
        creds = Credentials(token=access_token)
        service = build("oauth2", "v2", credentials=creds)
        return service.userinfo().get().execute()

    def create_or_get_user(self, user_email, username, profile_url):
        print("creating user -> ", profile_url)
        user, _ = User.objects.get_or_create(
            email=user_email,
            defaults={"username": username, "profile_url": profile_url},
        )
        return user

    def save_credentials(self, user, creds):
        try:
            GmailToken.objects.update_or_create(
                user=user,
                defaults={
                    "access_token": creds.token,
                    "refresh_token": creds.refresh_token,
                    "token_uri": creds.token_uri,
                    "client_id": creds.client_id,
                    "client_secret": creds.client_secret,
                    "expiry": make_aware(creds.expiry),
                },
            )
        except Exception as error:
            print(f"Error saving credentials: {error}")
            return
