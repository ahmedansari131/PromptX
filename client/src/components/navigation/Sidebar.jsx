import React from "react";
import { Button, ChatHistory } from "../../components";
import ChatIcon from "@mui/icons-material/Chat";

const Sidebar = () => {
  return (
    <div className="w-full min-h-screen px-5 py-5 gap-8 flex flex-col overflow-y-auto border-r border-light">
      <div>
        <Button
          className={
            "flex items-center gap-2 w-full justify-center p-1 border border-light"
          }
          buttonType={"PRIMARY"}
        >
          <span>
            <ChatIcon style={{ fontSize: "1.5rem" }} />
          </span>
          <span>New Chat</span>
        </Button>
      </div>

      <ChatHistory />
    </div>
  );
};

export default Sidebar;
