import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const MarkdownViewer = ({ content }) => {
  const CodeBlock = ({ inline, className, children, ...props }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(children);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    };

    if (inline) {
      return (
        <code className="break-words bg-gray-800 rounded px-1" {...props}>
          {children}
        </code>
      );
    }

    return (
      <div className="relative group">
        <pre className="break-words whitespace-pre-wrap overflow-x-auto bg-blue border border-light rounded-2xl p-4 pr-12 font-secondary">
          <code {...props}>{children}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 transition text-gray-300 text-sm bg-gray-700 rounded-md px-2 py-1 flex items-center gap-1"
        >
          <ContentCopyIcon style={{ fontSize: "1rem" }} />
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    );
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ node, ...props }) => (
          <p className="break-words whitespace-pre-wrap" {...props} />
        ),
        code: CodeBlock,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownViewer;
