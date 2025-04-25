import React from "react";

const ChatHistoryTab = (props) => {
  const { chat } = props;

  return (
    <div className="cursor-pointer">
      <div className="relative max-w-full overflow-hidden whitespace-nowrap">
        <span className="font-[poppins] text-sm text-custom-white text-opacity-70 hover:bg-custom-white hover:bg-opacity-10 rounded-full p-3 transition-all duration-200 ease-in-out">
          {chat}
        </span>
        <div className="absolute right-0 top-1/2 h-full  w-10 bg-gradient-to-l from-[#132031] to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

export default ChatHistoryTab;
