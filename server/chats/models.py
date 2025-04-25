from django.db import models
from authentication.models import User


class Chat(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    messages = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Message of {self.user.username}"


# {
#     "user_query": "What is the weather today?",
#     "assistant_response": "The weather today is sunny with a high of 75°F.",
# }
