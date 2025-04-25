from rest_framework import serializers
from .models import Chat
from authentication.serializers import UserProfileSerializer


class ChatSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)

    class Meta:
        model = Chat
        fields = "__all__"

