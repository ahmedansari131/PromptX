import os
from google import genai
from dotenv import load_dotenv

load_dotenv()


class GeminiClient:
    def __init__(self):
        self.client = self.client()
        self.model = "gemini-2.0-flash"
        self.messages = []

    def client(self):
        client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY_V2"))
        return client

    def set_messages(self, messages):
        self.messages = messages

    def get_message(self):
        return self.messages
