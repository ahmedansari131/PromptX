from rest_framework import serializers
from .models import User, GmailToken


class UserProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = "__all__"


class GmailTokenSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)

    class Meta:
        model = GmailToken
        fields = "__all__"
