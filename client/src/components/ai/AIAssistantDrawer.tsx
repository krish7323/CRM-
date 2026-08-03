import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Sparkles, X, Send, Bot, User as UserIcon, Zap, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

const defaultPrompts = [
  'Which leads need follow-up calls today?',
  'Show top performing language courses',
  'Who is overdue on fee installments?',
  'Calculate current month net profit',
];

export const AIAssistantDrawer: React.FC = () => {
  const { isAiDrawerOpen, toggleAiDrawer, leads, fees, expenses, students } = useAppStore();
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: 'Guten Tag! I am your ELH AI Assistant. Ask me anything about student leads, upcoming follow-ups, pending fees, or language course metrics.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    // Rule-based instant intelligent analysis
    setTimeout(() => {
      let responseText = '';
      const lower = query.toLowerCase();

      if (lower.includes('follow-up') || lower.includes('leads')) {
        const todayLeads = leads.filter((l) => l.status === 'Follow-up' || l.status === 'New');
        responseText = `You currently have **${todayLeads.length} active leads** requiring attention today. Highlights: ${todayLeads
          .slice(0, 3)
          .map((l) => `${l.name} (${l.course} ${l.level})`)
          .join(', ')}.`;
      } else if (lower.includes('fee') || lower.includes('overdue') || lower.includes('pending')) {
        const pendingFees = fees.filter((f) => f.status !== 'Paid');
        const totalPending = pendingFees.reduce((acc, f) => acc + f.remainingTotal, 0);
        responseText = `There are **${pendingFees.length} students** with pending fees totaling **€${totalPending.toLocaleString()}** / **₹${totalPending.toLocaleString()}**. Recommend triggering WhatsApp fee reminders.`;
      } else if (lower.includes('profit') || lower.includes('revenue') || lower.includes('expense')) {
        const totalPaid = fees.reduce((acc, f) => acc + f.paidTotal, 0);
        const totalExp = expenses.reduce((acc, e) => acc + e.amount, 0);
        const profit = totalPaid - totalExp;
        responseText = `Monthly Collection: **€${totalPaid.toLocaleString()}**, Total Expenses: **€${totalExp.toLocaleString()}**. Current Net Profit: **€${profit.toLocaleString()}** (${((profit / (totalPaid || 1)) * 100).toFixed(1)}% margin).`;
      } else {
        responseText = `Analysis complete for "${query}": The European Language Hub CRM has ${students.length} active enrolled students across German, French, and Spanish batches with 94.2% average attendance.`;
      }

      const aiMsg: ChatMessage = {
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <AnimatePresence>
      {isAiDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleAiDrawer}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-500 text-slate-950 font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                    ELH AI Assistant
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30">
                      v2.4
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Instant Institute Intelligence & Insights</p>
                </div>
              </div>

              <button
                onClick={toggleAiDrawer}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div className="p-3 bg-slate-950/30 border-b border-slate-800/60 overflow-x-auto flex gap-2">
              {defaultPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  className="shrink-0 text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-700/60 text-slate-300 transition flex items-center gap-1"
                >
                  <Zap className="w-3 h-3 text-cyan-400" />
                  {p}
                </button>
              ))}
            </div>

            {/* Chat Conversation Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-cyan-600 text-white rounded-br-none shadow-lg shadow-cyan-600/20'
                        : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-bl-none'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] opacity-75 font-semibold">
                      {m.sender === 'user' ? (
                        <>
                          <span>You</span>
                          <UserIcon className="w-3 h-3" />
                        </>
                      ) : (
                        <>
                          <Bot className="w-3 h-3 text-cyan-400" />
                          <span className="text-cyan-400">ELH AI</span>
                        </>
                      )}
                      <span className="ml-auto">{m.timestamp}</span>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/80">
              <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-1.5">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask ELH AI assistant..."
                  className="flex-1 bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                />
                <button
                  onClick={() => handleSend()}
                  className="p-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
