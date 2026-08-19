import { useState, useRef, useEffect } from "react";
import ChatInput from "./ChatInput";
import MessageBlock from "./MessageBlock";
import Sidebar from "./Sidebar";
import { Cpu, LogOut } from "lucide-react";
import axios from "axios";

const generateId = () => Math.random().toString(36).substring(2, 15);

export default function ChatContainer({ onNavigate, isLoggedIn, setIsLoggedIn, user, setUser }) {
  const chatKey = user ? `ai-arena-chats-${user.id}` : "ai-arena-chats";
  const activeChatKey = user ? `ai-arena-active-chat-${user.id}` : "ai-arena-active-chat";

  const [chats, setChats] = useState(() => {
    if (!user) return [];
    const saved = localStorage.getItem(chatKey);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeChatId, setActiveChatId] = useState(() => {
    if (!user) return null;
    const saved = localStorage.getItem(activeChatKey);
    return saved || null;
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (user) {
      const savedChats = localStorage.getItem(chatKey);
      setChats(savedChats ? JSON.parse(savedChats) : []);
      const savedActiveChat = localStorage.getItem(activeChatKey);
      setActiveChatId(savedActiveChat || null);
    } else {
      setChats([]);
      setActiveChatId(null);
    }
  }, [chatKey, activeChatKey, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(chatKey, JSON.stringify(chats));
    }
  }, [chats, chatKey, user]);

  useEffect(() => {
    if (user) {
      if (activeChatId) {
        localStorage.setItem(activeChatKey, activeChatId);
      } else {
        localStorage.removeItem(activeChatKey);
      }
    }
  }, [activeChatId, activeChatKey, user]);

  const activeChat = chats.find(c => c.id === activeChatId);
  const messages = activeChat?.messages || [];

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewChat = () => {
    const newChat = {
      id: generateId(),
      title: "New Chat",
      messages: [],
      createdAt: Date.now()
    };
    setChats([newChat, ...chats]);
    setActiveChatId(newChat.id);
  };

  const handleDeleteChat = (id) => {
    setChats(prev => prev.filter(c => c.id !== id));
    if (activeChatId === id) {
      setActiveChatId(null);
    }
  };

  const handleRenameChat = (id, newTitle) => {
    setChats(prev => prev.map(c => 
      c.id === id ? { ...c, title: newTitle } : c
    ));
  };

  const handleSend = async (problemText) => {
    let currentChatId = activeChatId;
    let currentChats = [...chats];

    if (!currentChatId) {
      const newChat = {
        id: generateId(),
        title: problemText.slice(0, 30) + (problemText.length > 30 ? "..." : ""),
        messages: [],
        createdAt: Date.now()
      };
      currentChats = [newChat, ...currentChats];
      setChats(currentChats);
      setActiveChatId(newChat.id);
      currentChatId = newChat.id;
    } else if (currentChats.find(c => c.id === currentChatId)?.messages.length === 0) {
       currentChats = currentChats.map(c => 
          c.id === currentChatId ? { ...c, title: problemText.slice(0, 30) + (problemText.length > 30 ? "..." : "") } : c
       );
       setChats(currentChats);
    }

    const loadingMessage = {
      status: "loading",
      problem: problemText,
    };

    setChats(prev => prev.map(c => 
      c.id === currentChatId 
        ? { ...c, messages: [...c.messages, loadingMessage] } 
        : c
    ));
    
    setIsGenerating(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/invoke",
        { input: problemText }
      );

      const result = response.data.result;

      setChats(prev => prev.map(c => {
        if (c.id === currentChatId) {
          const newMessages = [...c.messages];
          newMessages[newMessages.length - 1] = {
            ...result,
            status: "complete",
          };
          return { ...c, messages: newMessages };
        }
        return c;
      }));
    } catch (error) {
      console.error("Graph request failed:", error);

      setChats(prev => prev.map(c => {
        if (c.id === currentChatId) {
          const newMessages = [...c.messages];
          newMessages[newMessages.length - 1] = {
            problem: problemText,
            status: "error",
            error: "Failed to generate solutions.",
          };
          return { ...c, messages: newMessages };
        }
        return c;
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-row h-screen w-full bg-snitch-dark overflow-hidden">
      <Sidebar 
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={setActiveChatId}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-snitch-border bg-snitch-darker">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-snitch-gold/10 border border-snitch-gold flex items-center justify-center">
              <Cpu className="w-6 h-6 text-snitch-gold" />
            </div>

            <h1 className="text-xl font-bold text-gray-100 tracking-wider uppercase">
              AI Arena
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center focus:outline-none focus:ring-2 focus:ring-snitch-gold rounded-full transition-transform hover:scale-105"
                >
                  <img 
                    src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=D4AF37&color=050505&bold=true`} 
                    alt={user?.name || 'User'} 
                    className="w-10 h-10 rounded-full border-2 border-snitch-gold shadow-md"
                  />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-56 bg-snitch-darker border border-snitch-border rounded-xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-snitch-border/50">
                      <p className="text-sm font-semibold text-gray-100">{user?.name || 'Guest User'}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email || 'guest@snitch.com'}</p>
                    </div>
                    <div className="p-2">
                      <button 
                        onClick={() => {
                          setShowDropdown(false);
                          setIsLoggedIn(false);
                          if (setUser) setUser(null);
                        }}
                        className="flex w-full items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-red-400 hover:bg-snitch-border/30 rounded-lg transition-colors group"
                      >
                        <LogOut className="w-4 h-4 group-hover:text-red-400 transition-colors" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => onNavigate('login')}
                className="bg-snitch-gold hover:bg-snitch-gold-hover text-snitch-darker font-bold py-2 px-4 rounded-lg transition-all shadow-[0_0_10px_rgba(212,175,55,0.2)] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
              >
                Login
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-snitch-border scrollbar-track-transparent relative z-0">
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
    </div>
  );
}