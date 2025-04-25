import React, { useState, useRef, useEffect } from "react";
import { useChatMutation } from "../../services/api/authApi";
import MicIcon from "@mui/icons-material/Mic";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

export default function VoiceRecorder(props) {
  const { recording, setRecording, setTranscript } = props;
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const [recordAudio, { isLoading, isSuccess }] = useChatMutation();

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunks.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunks.current.push(e.data);
      }
    };

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(audioChunks.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", blob, "voice.webm");
      formData.append("input_type", "audio");

      const data = await audioDataHandler(formData);
      console.log("DATA -> ", data);
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const audioDataHandler = async (data) => {
    try {
      const response = await recordAudio(data);
      if (response.data) return response.data;
    } catch (error) {
      console.log("Error fetching audio data:", error);
      return;
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <>
      {recording ? (
        <>
          <div
            className="w-10 h-10 text-gray-800 rounded-xl p-2 mr-2 hover:bg-gray-300 border border-gray-300 cursor-pointer flex justify-center items-center"
            onClick={() => setRecording(false)}
          >
            <CloseIcon style={{ fontSize: "1.5rem" }} />
          </div>
          <div
            className="w-10 h-10 bg-custom-green text-custom-white rounded-xl p-2 hover:bg-opacity-80 cursor-pointer flex justify-center items-center"
            onClick={stopRecording}
          >
            <CheckIcon style={{ fontSize: "1.5rem" }} />
          </div>
        </>
      ) : (
        <div
          className="cursor-pointer text-blue rounded-xl p-2 mr-2 hover:bg-gray-300 border border-gray-300 flex justify-center items-center"
          onClick={startRecording}
        >
          <MicIcon style={{ fontSize: "1.5rem" }} />
        </div>
      )}
    </>
  );
}
