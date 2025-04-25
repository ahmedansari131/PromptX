import React, { useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { useChatMutation } from "../../services/api/chatApi";
import axios from "axios";

const ChatInput = (props) => {
  const { setMessage } = props;
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chatHandler = async () => {
    const formData = new FormData();
    formData.append("query", input);

    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:5000/chat",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log(response);
      if (response.status == 200) {
        setIsLoading(false);
        setMessage(response.data.response);
      }
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  return (
    <div className="relative">
      <textarea
        onChange={(e) => setInput(e.target.value)}
        value={input}
        className="w-full rounded-full resize-none px-5 py-2 text-[1rem] overflow-hidden text-custom-dark outline-none border border-custom-dark border-opacity-20"
        placeholder="Tell me what do you want?"
        rows={1}
      ></textarea>

      <SendIcon
        onClick={chatHandler}
        className="text-custom-white absolute top-1/2 -translate-y-[23px] right-1 cursor-pointer bg-custom-green rounded-full p-2"
        style={{ fontSize: "2.5rem" }}
      />
    </div>
  );
};

export default ChatInput;
