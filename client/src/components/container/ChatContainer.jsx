import React, { useState } from "react";
import { ChatInput, MessageContainer, Navbar } from "../index";

const ChatContainer = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="w-full h-full rounded-xl flex flex-col justify-center bg-pink-300 gap-5">
      <MessageContainer />
    </div>
  );
};

export default ChatContainer;
