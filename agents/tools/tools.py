import subprocess
from services.EmailService import EmailService
import re
from utillity.utils import limit_emails


USER_DATA_DIR = "smart_os_user_profile"


def run_command(command, cwd=None):
    try:
        result = subprocess.run(
            command, shell=True, cwd=cwd, check=True, capture_output=True, text=True
        )
        print(f"Command: {result.stdout.strip()} \n  {result.stderr.strip()}")
        return result.stdout.strip() + "\n" + result.stderr.strip()
    except subprocess.CalledProcessError as e:
        return f"❌ Error: {e.stderr.strip()}"


def show_unread_emails(limit=None):
    emails = EmailService().get_unread_emails()
    return limit_emails(emails, limit)


def show_all_emails(limit=None):
    emails = EmailService().get_emails()
    return limit_emails(emails, limit)


def show_spam_emails(limit=None):
    emails = EmailService().get_spam_emails()
    return limit_emails(emails, limit)


def show_important_emails(limit=None):
    emails = EmailService().get_important_emails()
    return limit_emails(emails, limit)


def send_email(to, subject, body):
    return EmailService().send_email(to, subject, body)


def clean_email_body(body):
    # Remove URLs and unnecessary formatting
    body = re.sub(r"https?://\S+", "", body)  # Remove URLs
    body = re.sub(r"\r\n|\n", " ", body)  # Remove line breaks
    body = re.sub(r"<[^>]+>", "", body)  # Remove HTML tags

    # Remove common salutations and signatures
    body = re.sub(
        r"(Dear|Hello)[^,]*,?\s*", "", body
    )  # Remove salutations (e.g., "Dear Mr. X,")
    body = re.sub(r"Regards?,?\s*", "", body)  # Remove "Regards", "Sincerely", etc.
    body = re.sub(r"Tel\.?:\s*\+?[0-9\-\(\)\s]+", "", body)  # Remove phone numbers
    body = re.sub(r"E-Mails?:\s*\S+", "", body)  # Remove email addresses
    body = re.sub(r"Visit us at.*", "", body)  # Remove website references
    body = re.sub(
        r"([A-Za-z]+@(?:[A-Za-z]+\.)+[A-Za-z]{2,})", "", body
    )  # Remove email addresses

    # Remove any unnecessary lines (based on length or content)
    body = re.sub(r"(\s*[-_]+)+\s*", "", body)  # Remove lines with dashes/underscores

    body = body.strip()  # Clean leading/trailing spaces
    return body


