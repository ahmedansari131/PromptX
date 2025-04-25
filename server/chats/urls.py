from django.urls import path
from .views import (
    ChatMessage
)


urlpatterns = [
    path("chat/", ChatMessage.as_view(), name="chat"),
]
