import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore.js';
import {
  MessageCircle,
  Send,
  User,
  Paperclip,
  Search,
  CheckCheck,
  Circle,
  Sparkles,
} from 'lucide-react';

export const ChatPage = () => {
  const { chatMessages, sendChatMessage, users, currentUser } = useAppStore();

  const [selectedRecipientId, setSelectedRecipientId] = useState('usr-teacher');
  const [messageInput, setMessageInput] = useState('');

  const activeRecipient = users.find((u) => u.id === selectedRecipientId) || users[1];

  const handleSend = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    sendChatMessage(selectedRecipientId, messageInput);
    setMessageInput('');
  };

  const currentChatLogs = chatMessages.filter(
    (m) => m.recipientId === selectedRecipientId || m.senderName === currentUser.name
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-indigo-400" /> Enterprise Internal Chat & Group Messaging
        </h1>
        <p className="text-xs text-slate-400">1-to-1 direct messaging, faculty group channels, and instant broadcast workspace</p>
      </div>

      {/* Chat Container */}
      <div className="glass-panel rounded-3xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 overflow-hidden h-[75vh]">
        {/* Left Contacts List */}
        <div className="bg-slate-950/80 border-r border-slate-800 p-4 space-y-3 overflow-y-auto">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Staff & Faculty Directory</h3>

          <div className="space-y-1">
            {users.map((u) => (
              <button
                key={u.id}
                onClick={() => setSelectedRecipientId(u.id)}
                className={`w-full p-2.5 rounded-xl text-left flex items-center space-x-3 transition ${
                  selectedRecipientId === u.id
                    ? 'bg-slate-900 border border-indigo-500/40 text-slate-100'
                    : 'hover:bg-slate-900/60 text-slate-400'
                }`}
              >
                <div className="relative">
                  <img
                    src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={u.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-200 truncate">{u.name}</p>
                  <p className="text-[10px] text-amber-400 font-semibold truncate">{u.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Active Conversation Workspace */}
        <div className="md:col-span-2 flex flex-col h-full bg-slate-950/40">
          {/* Active Header */}
          <div className="p-4 border-b border-slate-800 flex items-center space-x-3 bg-slate-950/90">
            <img
              src={activeRecipient?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={activeRecipient?.name}
              className="w-9 h-9 rounded-full object-cover border border-indigo-500/30"
            />
            <div>
              <h3 className="text-xs font-bold text-slate-100">{activeRecipient?.name}</h3>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Online • {activeRecipient?.role}
              </p>
            </div>
          </div>

          {/* Messages Timeline */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {currentChatLogs.map((msg) => {
              const isMine = msg.senderName === currentUser.name;
              return (
                <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs p-3 rounded-2xl text-xs space-y-1 ${
                      isMine
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-slate-100 rounded-br-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    <p className="text-[10px] font-bold text-amber-300">{msg.senderName} ({msg.senderRole})</p>
                    <p className="leading-relaxed">{msg.text}</p>
                    <p className="text-[9px] text-slate-400 text-right font-mono">{msg.createdAt}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-800 flex items-center gap-2 bg-slate-950">
            <input
              type="text"
              placeholder={`Message ${activeRecipient?.name}...`}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-slate-950 font-bold hover:scale-105 transition shadow-lg shadow-indigo-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
