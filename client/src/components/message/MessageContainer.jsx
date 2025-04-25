import React, { useEffect, useRef, useState } from "react";
import {
  useChatMutation,
  usePreviousChatQuery,
} from "../../services/api/authApi";
import MarkdownViewer from "../markdown/MarkdownViewer";
import ProfileImage from "../profile/ProfileImage";
import { useSelector } from "react-redux";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { AutoResizingTextArea, Spinner, VoiceRecorder } from "..";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import StopIcon from "@mui/icons-material/Stop";
import MarkdownView from "react-showdown";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

const MessageContainer = (props) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [chat, { isLoading: chatLoader }] = useChatMutation();
  const { data } = usePreviousChatQuery();
  const profileURL = useSelector((state) => state.user.user?.data?.profile_url);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const messagesEndRef = useRef(null);
  const fileRef = useRef(null);
  const [formData] = useState(() => new FormData());
  const [inputType, setInputType] = useState("text");
  const [fileObj, setFileObj] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const chatHandler = async () => {
    if (inputType === "text-file") {
      setInput("");
      formData.set("input_type", inputType);
      formData.set("file", fileRef.current.files[0]);
      formData.set("query", input);
    } else if (inputType === "text") {
      setInput("");
      formData.set("query", input);
      formData.set("input_type", inputType);
    }
    try {
      const response = await chat(formData);

      if (response.data) {
        const responseData = response.data.response;
        if (Array.isArray(responseData)) {
          setMessages(responseData);
        } else {
          setMessages([responseData]);
        }
        setInput("");
      }

      if (fileObj) setFileObj(null);
      if (fileRef.current.value) fileRef.current.value = "";
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  const fileHandler = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const fileChangeHandler = () => {
    const file = fileRef.current.files[0];
    if (file) {
      setInputType("text-file");
      setFileObj(file);
      console.log(file);
    }
  };

  const removeFileHandler = () => {
    setFileObj(null);
    setInputType("text");
    fileRef.current.value = "";
  };

  const downHandler = () => {
    console.log("Function called");
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  };

  useEffect(() => {
    if (data && Array.isArray(data?.data)) {
      setMessages(data.data);
    } else if (data?.data) {
      setMessages([data.data]);
    }
  }, [data]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      downHandler();
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (transcript) console.log("Transcript -> ", transcript);
  }, [transcript]);

  return (
    <>
      <div className="w-full rounded-xl p-3 text-[1rem] text-custom-blue overflow-y-auto break-words whitespace-pre-wrap h-[75%]">
        <div className="w-2/3 m-auto">
          {!messages.length ? (
            <div className="text-custom-white flex justify-center items-center text-3xl font-secondary mt-10 flex-col ">
              <span className="text-lg text-gray-400">Hey! I am PromptX.</span>
              What can I help you with?
            </div>
          ) : (
            Array.isArray(messages) &&
            messages.map((chat, index) => (
              <div key={index} className="flex flex-col gap-10 mb-10">
                <div className="flex justify-end items-start gap-3 ">
                  <div className="text-right bg-mintExtreme-400 bg-opacity text-white text-opacity-70 border border-light backdrop-blur-lg px-4 py-3 rounded-2xl w-1/3 max-w-1/2">
                    <div className="w-[90%] text-left leading-6">
                      {chat?.user_query}
                    </div>
                  </div>
                  <div className="w-7 h-7">
                    <ProfileImage profileURL={profileURL} />
                  </div>
                </div>

                <div className="flex justify-start items-start text-white text-opacity-70 gap-3 ">
                  <div className="w-[90%] text-left leading-6">
                    <MarkdownViewer content={chat?.ai_response} />
                  </div>
                </div>
              </div>
            ))
          )}

          {chatLoader && (
            <Spinner className="text-white">Processing...</Spinner>
          )}
          <div ref={messagesEndRef}></div>
        </div>

        <div
          className="absolute bottom-5 w-2/4 m-auto bg-custom-white rounded-2xl left-1/2 -translate-x-1/2"
          style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
        >
          <span
            className="absolute -top-7 left-1/2 -translate-x-1/2 cursor-pointer w-8 h-8 flex justify-center items-center rounded-lg p-4 bg-mintExtreme-500 hover:bg-mintExtreme-400 transition-all duration-300 border border-light z-[100]"
            style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
            onClick={downHandler}
          >
            <ArrowDownwardOutlinedIcon
              className="text-gray-300 pointer-events-none"
              style={{ fontSize: "1.5rem" }}
            />
          </span>
          <div className="flex p-2 flex-col gap-2">
            {fileObj && (
              <div className="relative p-1 pr-10 border w-fit rounded-xl bg-gray-200 flex items-center gap-3 font-secondary border-mintExtreme-300 border-opacity-30">
                <span
                  className="absolute -right-3 -top-4  rounded-full p-1 cursor-pointer"
                  onClick={removeFileHandler}
                >
                  <CloseOutlinedIcon
                    style={{ fontSize: "1.4rem" }}
                    className="rounded-full bg-mintExtreme-300 p-1 text-white hover:bg-opacity-90 transition-all duration-300 border-2 border-white"
                  />
                </span>
                <div className="bg-mintExtreme-300 p-1 rounded-lg flex justify-center items-center h-10 w-10">
                  <DescriptionOutlinedIcon
                    className="text-gray-300 "
                    style={{ fontSize: "1.4rem" }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-700 text-sm font-bold">
                    {fileObj?.name}
                  </span>
                  <span className="text-gray-700 text-sm">PDF</span>
                </div>
              </div>
            )}

            <div className="flex items-center">
              <input
                ref={fileRef}
                className="absolute opacity-0 hidden"
                type="file"
                accept="application/pdf"
                onChange={fileChangeHandler}
              />
              <AttachFileIcon
                className="px-2 cursor-pointer rotate-45 rounded-md"
                style={{ fontSize: "2.3rem" }}
                onClick={fileHandler}
              />
              <AutoResizingTextArea
                input={input}
                setInput={setInput}
                transcript={transcript}
              />
            </div>
          </div>

          <div className="flex justify-end p-1 items-center transition-all duration-300">
            <VoiceRecorder
              recording={recording}
              setRecording={setRecording}
              setTranscript={setTranscript}
            />
            {!recording && (
              <div className="w-10 h-10 bg-custom-green rounded-xl p-2 hover:bg-opacity-80 cursor-pointer flex justify-center items-center">
                {!chatLoader ? (
                  <ArrowUpwardIcon
                    onClick={chatHandler}
                    className="text-custom-white "
                    style={{ fontSize: "1.5rem" }}
                  />
                ) : (
                  <StopIcon className="text-white" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageContainer;
