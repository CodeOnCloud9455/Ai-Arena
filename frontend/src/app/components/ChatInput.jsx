import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";

export default function ChatInput({ onSend, disabled }) {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!input.trim() || disabled) return;

    const problem = input.trim();

    setInput("");

    await onSend(problem);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <form
        onSubmit={handleSend}
        className="relative flex items-end gap-3 bg-snitch-gray-light border border-snitch-border rounded-xl p-3 shadow-lg transition-all focus-within:border-snitch-gold focus-within:ring-1 focus-within:ring-snitch-gold/50"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a coding problem to evaluate two solutions..."
          disabled={disabled}
          className="flex-1 bg-transparent text-gray-200 placeholder-snitch-text-muted resize-none outline-none max-h-[200px] py-1 px-2 scrollbar-thin scrollbar-thumb-snitch-border scrollbar-track-transparent"
          rows={1}
        />

        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="p-3 bg-snitch-gray text-snitch-gold border border-snitch-border rounded-lg hover:bg-snitch-dark hover:border-snitch-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed group flex-shrink-0"
        >
          {disabled ? (
            <Sparkles className="w-5 h-5 animate-pulse" />
          ) : (
            <Send className="w-5 h-5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          )}
        </button>
      </form>
    </div>
  );
}