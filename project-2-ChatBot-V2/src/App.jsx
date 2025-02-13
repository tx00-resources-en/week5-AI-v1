import { useState, useRef, useEffect } from "react";
import { IoIosSend } from "react-icons/io";
import { generateContent } from "./ChatModel";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // For tables, lists, and strikethroughs
import remarkBreaks from "remark-breaks"; // Ensures line breaks work
import rehypeRaw from "rehype-raw"; // Allows rendering HTML inside Markdown
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"; // Code block theme
import "./App.css";

function App() {
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null);

  // Use useEffect to auto-scroll when messages update:
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [response]);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleClear = () => {
    setUserInput("");
    setResponse([]);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    // Trim User Input Before Checking for Empty Message
    if (!userInput.trim()) {
      setResponse((prevResponse) => [
        ...prevResponse,
        { type: "system", message: "Please enter a valid prompt." },
      ]);
      return;
    }

    // The type (system, user, bot) in the code is primarily for styling and UI management in the chat interface. It helps differentiate between the user's input, the bot's response, and any system messages (like error messages or prompts).
    setIsLoading(true);
    try {
      const res = await generateContent(userInput);
      setResponse((prevResponse) => [
        ...prevResponse,
        { type: "user", message: userInput },
        { type: "bot", message: res },
      ]);
      setUserInput("");
    } catch (err) {
      console.error("Error generating response:", err);
      setResponse((prevResponse) => [
        ...prevResponse,
        {
          type: "system",
          message: `Error: ${err.message || "Failed to generate response"}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  // Input Should Allow Multi-Line Messages: Shift + Enter for new lines
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-container">
      {response.length === 0 ? (
        <h1>
          Ask me anything <br />
          I've got the answers!
        </h1>
      ) : (
        <div className="chat-history" ref={chatRef}>
          {response.map((msg, index) => (
            <div key={index} className={`message ${msg.type}`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={dracula}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {msg.message}
              </ReactMarkdown>
            </div>
          ))}
          {isLoading && <p className="loading-text">Generating response...</p>}
        </div>
      )}

      <div className="input-container">
        <button onClick={handleClear} className="clear-btn">
          Clear
        </button>

        <input
          type="text"
          value={userInput}
          onChange={handleUserInput}
          onKeyDown={handleKeyPress}
          placeholder="Type your message here..."
          className="chat-input"
        />

        {/* Disable Button While Loading */}
        <button
          onClick={handleSubmit}
          className="send-btn"
          disabled={isLoading}
        >
          <IoIosSend />
        </button>
      </div>
    </div>
  );
}

export default App;
