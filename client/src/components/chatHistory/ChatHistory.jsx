import React from "react";
import { ChatHistoryTab } from "../";

const ChatHistory = () => {
  const chatHistory = [
    {
      time: "Today",
      chatPreview: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      ],
    },
    {
      time: "Yesterday",
      chatPreview: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      ],
    },
    {
      time: "Previous",
      chatPreview: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-12">
      {chatHistory.map((chat, index) => (
        <div className="flex flex-col" key={index + 1}>
          <span className="font-[poppins] text-xs text-custom-white text-opacity-70 uppercase">
            {chat.time}
          </span>
          <div className="flex flex-col gap-3">
            {chat.chatPreview.map((preview, index) => (
              <ChatHistoryTab key={index} chat={preview} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;
