import { useState } from "react";
import { Plus, Search, MessageSquare, Trash2, Edit2, Check, X } from "lucide-react";

export default function Sidebar({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditClick = (chat, e) => {
    e.stopPropagation();
    setEditingId(chat.id);
    setEditTitle(chat.title);
  };

  const handleEditSave = (id, e) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameChat(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleEditCancel = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-snitch-darker border-r border-snitch-border flex flex-col h-full z-10">
      <div className="p-4 border-b border-snitch-border">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-snitch-gold hover:bg-snitch-gold-hover text-snitch-darker font-bold py-2.5 px-4 rounded-lg transition-all shadow-[0_0_10px_rgba(212,175,55,0.1)] hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]"
        >
          <Plus className="w-5 h-5" />
          <span>New Chat</span>
        </button>
      </div>

      <div className="p-3 border-b border-snitch-border/50">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-snitch-gray border border-snitch-border/50 rounded-lg py-2 pl-9 pr-3 text-sm text-gray-200 focus:outline-none focus:border-snitch-gold/50 focus:ring-1 focus:ring-snitch-gold/50 transition-all placeholder-gray-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-snitch-border scrollbar-track-transparent p-2 space-y-1">
        {filteredChats.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-4">
            No chats found.
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`group flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all ${
                activeChatId === chat.id
                  ? "bg-snitch-gray-light border border-snitch-border text-white"
                  : "hover:bg-snitch-gray text-gray-400 hover:text-gray-200"
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden flex-1">
                <MessageSquare
                  className={`w-4 h-4 flex-shrink-0 ${
                    activeChatId === chat.id ? "text-snitch-gold" : ""
                  }`}
                />
                {editingId === chat.id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEditSave(chat.id, e);
                      if (e.key === "Escape") handleEditCancel(e);
                    }}
                    autoFocus
                    className="flex-1 bg-snitch-darker border border-snitch-gold/50 rounded px-2 py-0.5 text-sm text-white focus:outline-none w-full"
                  />
                ) : (
                  <span className="truncate text-sm font-medium">
                    {chat.title}
                  </span>
                )}
              </div>

              {editingId === chat.id ? (
                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                  <button
                    onClick={(e) => handleEditSave(chat.id, e)}
                    className="text-green-500 hover:text-green-400 p-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="text-red-500 hover:text-red-400 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="hidden group-hover:flex items-center gap-1 ml-2 flex-shrink-0">
                  <button
                    onClick={(e) => handleEditClick(chat, e)}
                    className="text-gray-500 hover:text-snitch-gold transition-colors p-1"
                    title="Rename"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    className="text-gray-500 hover:text-red-500 transition-colors p-1"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
