import React, { useEffect, useRef } from "react";

const AutoResizingTextarea = (props) => {
  const { input, setInput, transcript } = props;
  const textareaRef = useRef(null);
  const maxRows = 5;

  const inputChangeHandler = (e) => {
    setInput(e.target.value);

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.rows = 1;
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
      const scrollHeight = textarea.scrollHeight;
      const currentRows = Math.floor(scrollHeight / lineHeight);
      const rowsToSet = Math.min(currentRows, maxRows);

      textarea.rows = rowsToSet;

      if (currentRows > maxRows) {
        textarea.style.overflowY = "auto";
      } else {
        textarea.style.overflowY = "hidden";
      }
    }
  };

  useEffect(() => {
    setInput(transcript);
  }, [transcript]);

  return (
    <textarea
      ref={textareaRef}
      onChange={inputChangeHandler}
      value={input}
      className="w-full pl-1 bg-transparent resize-none py-2 leading-5 text-[1rem] overflow-y-auto text-custom-dark outline-none border-opacity-20"
      placeholder="Tell me what do you want?"
      rows={1}
      style={{ maxHeight: `${maxRows * 1.5}rem` }}
    ></textarea>
  );
};

export default AutoResizingTextarea;
