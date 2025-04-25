from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .models import Chat
from server.response.api_response import ApiResponse
from .serializers import ChatSerializer


class ChatMessage(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        user_query = request.data.get("user_query")
        ai_response = request.data.get("ai_response")

        chat_message = {
            "user_query": user_query,
            "ai_response": ai_response,
        }

        chat, created = Chat.objects.get_or_create(
            user=user,
            defaults={"messages": [chat_message]},  # message added only if new chat
        )

        if not created:
            # If chat already existed, append the new message
            chat.messages.append(chat_message)
            chat.save()

        return ApiResponse.response_succeed(
            message="Chat created successfully",
            status=201,
            success=True,
        )

    def get(self, request):
        user = request.user
        chat = Chat.objects.filter(user=user)

        if not chat:
            return ApiResponse.response_succeed(
                message="No chat found",
                status=404,
                success=False,
            )

        serializer = ChatSerializer(chat, many=True)
        previous_messages = serializer.data[0]["messages"]
        return ApiResponse.response_succeed(
            message="Chat retrieved successfully",
            status=200,
            success=True,
            data=previous_messages,
        )
