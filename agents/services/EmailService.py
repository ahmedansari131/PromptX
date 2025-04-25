from email.mime.text import MIMEText
import base64
from google.oauth2.credentials import Credentials
import requests
import os
from googleapiclient.discovery import build
import requests
from flask import g


class EmailService:
    def __init__(self):
        self.service = self.get_gmail_service()
        self.user_email = None

    def get_authenticated_email(self):
        headers = {
            "Cookie": f"access={g.access_token}",
        }

        try:
            response = requests.get(
                url=f'{os.environ.get("DEVELOPMENT_SERVER_URL")}/auth/user/',
                headers=headers,
            )
            if response.status_code == 200:
                data = response.json()
                if "data" in data:
                    self.user_email = data["data"].get("email")
                    return self.user_email
                else:
                    raise ValueError("Invalid response structure from server.")
        except Exception as e:
            print("Error getting authenticated user email:", e)
            return None

    def get_gmail_token(self):
        url = os.environ.get("DEVELOPMENT_SERVER_URL")

        if not url:
            raise ValueError(
                "DEVELOPMENT_SERVER_URL is not set in environment variables."
            )
        headers = {
            "Cookie": f"access={g.access_token}",
        }
        response = requests.get(f"{url}/auth/gmail-token/", headers=headers)
        if response.status_code == 200:
            data = response.json()
            if "data" in data:
                return data["data"]
            else:
                raise ValueError("Invalid response structure from server.")
        else:
            raise ValueError(
                f"Failed to fetch token from server. Status code: {response.status_code}"
            )

    def get_gmail_service(self):
        token = self.get_gmail_token()
        creds = Credentials(
            token["access_token"],
            refresh_token=token["refresh_token"],
            token_uri=token["token_uri"],
            client_id=token["client_id"],
            client_secret=token["client_secret"],
        )

        if creds.expired and creds.refresh_token:
            print("Creds are expired...")

        service = build("gmail", "v1", credentials=creds)
        # print(f"Authenticated as: {self.user_email}")
        return service
        # TODO: Uncomment this if you want to refresh the token automatically
        # Refresh token if expired
        # if creds.expired and creds.refresh_token:
        #     creds.refresh(Request())

        #     # Update token in the database
        #     token.access_token = creds.token
        #     token.expiry = datetime.datetime.now() + datetime.timedelta(seconds=3600)
        #     token.save()

    def get_unread_emails(self, limit=5):
        if not self.service:
            return []

        try:
            results = (
                self.service.users()
                .messages()
                .list(userId="me", labelIds=["INBOX"], q="is:unread")
                .execute()
            )
            messages = results.get("messages", [])
            emails = []

            for msg in messages[:limit]:
                msg_data = (
                    self.service.users()
                    .messages()
                    .get(userId="me", id=msg["id"])
                    .execute()
                )
                payload = msg_data.get("payload", {})
                snippet = msg_data.get("snippet", "")
                headers = payload.get("headers", [])

                subject = next(
                    (h["value"] for h in headers if h["name"] == "Subject"), ""
                )
                from_email = next(
                    (h["value"] for h in headers if h["name"] == "From"), ""
                )

                emails.append(
                    {
                        "from": from_email,
                        "subject": subject,
                        "body": get_email_body(payload),
                    }
                )

            return emails
        except Exception as e:
            print(f"Email fetch error: {e}")
            return []

    def send_email(self, to_email, subject, body):
        print("Sending email....")
        if not self.service:
            return "Gmail service not authenticated."

        try:
            message = MIMEText(body)
            message["to"] = to_email
            message["from"] = self.user_email
            message["subject"] = subject
            raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()

            sent_message = (
                self.service.users()
                .messages()
                .send(userId="me", body={"raw": raw_message})
                .execute()
            )

            return (
                f"Email sent successfully to {to_email} with ID: {sent_message['id']}"
            )

        except Exception as e:
            print(f"Error sending email: {e}")
            return f"Error sending email: {e}"

    def get_emails(self, label_ids=["INBOX"], limit=5):
        if not self.service:
            return []

        emails = []
        next_page_token = None
        import json

        try:
            while len(emails) < limit:
                print("EMAILS -> ", json.dumps(emails, indent=2))
                results = (
                    self.service.users()
                    .messages()
                    .list(
                        userId="me",
                        labelIds=label_ids,
                        maxResults=limit,
                        pageToken=next_page_token,
                    )
                    .execute()
                )

                messages = results.get("messages", [])
                next_page_token = results.get("nextPageToken")

                for msg in messages:
                    if len(emails) >= limit:
                        break

                    msg_data = (
                        self.service.users()
                        .messages()
                        .get(userId="me", id=msg["id"])
                        .execute()
                    )
                    payload = msg_data.get("payload", {})
                    snippet = msg_data.get("snippet", "")
                    headers = payload.get("headers", [])

                    subject = next(
                        (h["value"] for h in headers if h["name"] == "Subject"), ""
                    )
                    from_email = next(
                        (h["value"] for h in headers if h["name"] == "From"), ""
                    )

                    emails.append(
                        {
                            "from": from_email,
                            "subject": subject,
                            "body": get_email_body(payload),
                        }
                    )

                # Break if no more pages
                if not next_page_token:
                    break

            return emails
        except Exception as e:
            print(f"Email fetch error: {e}")
            return []

    def get_spam_emails(self, limit=5):
        return self.get_emails(label_ids=["SPAM"], limit=limit)

    def get_important_emails(self, limit=5):
        return self.get_emails(label_ids=["IMPORTANT"], limit=limit)


def get_email_body(payload):
    parts = payload.get("parts")

    if not parts:
        # Simple message, try to decode body directly
        body_data = payload.get("body", {}).get("data")
        if body_data:
            return base64.urlsafe_b64decode(body_data).decode("utf-8", errors="ignore")
        return ""

    # Multipart message
    for part in parts:
        if part.get("mimeType") == "text/plain":
            body_data = part.get("body", {}).get("data")
            if body_data:
                return base64.urlsafe_b64decode(body_data).decode(
                    "utf-8", errors="ignore"
                )

    return ""


class GoogleServices:
    def get_user_email(self):
        return self.user_email

    def get_google_service(self, service_name, version):
        token = self.get_google_access_token()
        creds = Credentials(
            token["access_token"],
            refresh_token=token["refresh_token"],
            token_uri=token["token_uri"],
            client_id=token["client_id"],
            client_secret=token["client_secret"],
        )

        if creds.expired and creds.refresh_token:
            print("Creds are expired...")

        service = build(service_name, version, credentials=creds)
        return service

        # TODO: Uncomment this if you want to refresh the token automatically
        # Refresh token if expired
        # if creds.expired and creds.refresh_token:
        #     creds.refresh(Request())

        #     # Update token in the database
        #     token.access_token = creds.token
        #     token.expiry = datetime.datetime.now() + datetime.timedelta(seconds=3600)
        #     token.save()

    def get_google_access_token(self):
        url = os.environ.get("DEVELOPMENT_SERVER_URL")
        headers = {
            "Cookie": f"access={g.access_token}",
        }
        response = requests.get(
            f"{url}/auth/gmail-token/", headers=headers
        )  # TODO: need to change the endpoint to google-access-token
        if response.status_code == 200:
            data = response.json()
            if "data" in data:
                return data["data"]
            else:
                raise ValueError("Invalid response structure from server.")
        else:
            raise ValueError(
                f"Failed to fetch token from server. Status code: {response.status_code}"
            )


class CalendarService:
    def __init__(self):
        google_services = GoogleServices()
        self.service = google_services.get_google_service("calendar", "v3")

    def get_events(self, calendar_id="primary", time_min=None, time_max=None):
        events_result = (
            self.service.events()
            .list(
                calendarId=calendar_id,
                timeMin=time_min,
                timeMax=time_max,
                singleEvents=True,
                orderBy="startTime",
            )
            .execute()
        )
        events = events_result.get("items", [])
        return events

    def create_event(self, event_details):
        print("In create event method")
        event = self.service.events().insert(calendarId="primary", body=event_details).execute()
        return event


# class EmailService:
#     def __init__(self):
#         google_services = GoogleServices()
#         self.service = google_services.get_google_service("gmail", "v1")
