import React from "react";
import {
  ChatContainer,
  MessageContainer,
  Navbar,
  Sidebar,
} from "../../components";

const Chat = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-start">
        {/* <div className="w-1/6">
          <Sidebar />
        </div> */}

        <div className="h-screen w-full relative">
          <Navbar />
          <div className="h-full w-full">
            <MessageContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
