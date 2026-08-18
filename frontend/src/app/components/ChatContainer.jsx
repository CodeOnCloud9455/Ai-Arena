import { useState, useRef, useEffect } from "react";
import ChatInput from "./ChatInput";
import MessageBlock from "./MessageBlock";
import { Cpu } from "lucide-react";
import axios from "axios";

export default function ChatContainer() {
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (problemText) => {
    const loadingMessage = {
      status: "loading",
      problem: problemText,
    };

    setMessages((prev) => [...prev, loadingMessage]);
    setIsGenerating(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/invoke",
        {
          input: problemText,
        }
      );

      console.log("Backend response:", response.data);

      const result = response.data.result;

      setMessages((prev) => {
        const newMessages = [...prev];

        newMessages[newMessages.length - 1] = {
          ...result,
          status: "complete",
        };

        return newMessages;
      });
    } catch (error) {
      console.error("Graph request failed:", error);

      setMessages((prev) => {
        const newMessages = [...prev];

        newMessages[newMessages.length - 1] = {
          problem: problemText,
          status: "error",
          error: "Failed to generate solutions.",
        };

        return newMessages;
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-snitch-dark">

      <header className="flex-shrink-0 flex items-center justify-center p-4 border-b border-snitch-border bg-snitch-darker">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-snitch-gold/10 border border-snitch-gold flex items-center justify-center">
            <Cpu className="w-6 h-6 text-snitch-gold" />
          </div>

          <h1 className="text-xl font-bold text-gray-100 tracking-wider uppercase">
            AI Arena
          </h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-snitch-border scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">

            <div className="w-24 h-24 mb-6 rounded-full border border-snitch-border bg-snitch-gray flex items-center justify-center shadow-2xl">
              <Cpu className="w-12 h-12 text-snitch-gold opacity-50" />
            </div>

            <h2 className="text-3xl font-bold text-gray-200 mb-4 tracking-wide">
              Welcome to the Arena
            </h2>

            <p className="text-gray-400 max-w-lg text-lg leading-relaxed">
              Drop a coding problem below. I will generate two competing
              solutions and judge them side-by-side.
            </p>

          </div>
        ) : (
          <div className="pb-8">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  index !== 0
                    ? "border-t border-snitch-border/50"
                    : ""
                }
              >
                <MessageBlock data={msg} />
              </div>
            ))}

            <div ref={bottomRef} />
          </div>
        )}
      </main>

      <div className="flex-shrink-0 bg-gradient-to-t from-snitch-darker to-snitch-dark pt-4 pb-6 px-4 border-t border-snitch-border">
        <ChatInput
          onSend={handleSend}
          disabled={isGenerating}
        />
      </div>
    </div>
  );
}