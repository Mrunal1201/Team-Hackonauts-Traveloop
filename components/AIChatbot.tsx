import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Send, Sparkles, TrendingUp, MapPin, Cloud, AlertCircle } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { callOpenAI, TRAVEL_SYSTEM_PROMPT } from '../utils/aiService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_QUESTIONS = ['Budget forecast?', 'Tokyo tips?', 'Optimize route?', 'Packing list?'];

// ── Component ──────────────────────────────────────────────────────────────
export const AIChatbot: React.FC = () => {
  const { activeTrip } = useTrip();

  const [isOpen, setIsOpen]     = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi! I'm your AI Travel Assistant 🌍\n\nI've loaded your ${activeTrip?.name || 'trip'} details. Ask me anything about your itinerary, budget, packing, weather, or local tips!`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput]       = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiError, setApiError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;
    setApiError('');

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const conversationHistory = messages
        .slice(-8)
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

      const systemPrompt = `${TRAVEL_SYSTEM_PROMPT}\n\nContext: The user is planning "${activeTrip?.name || 'a trip'}" with a $${activeTrip?.budget?.toLocaleString() || '5,000'} budget. Be helpful, concise, and travel-focused.`;

      const response = await callOpenAI(
        [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: text.trim() },
        ],
        { max_tokens: 450, temperature: 0.75 }
      );

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }]);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      if (errMsg === 'RATE_LIMIT') {
        setApiError('Rate limit reached — please try again in a moment.');
      } else {
        setApiError('Could not reach AI — check your connection and try again.');
      }
    }

    setIsTyping(false);
  };

  return (
    <>
      {/* ── FAB ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-50 w-14 h-14 bg-gradient-to-br from-[#2A4D3A] to-[#1a3328] rounded-2xl shadow-xl flex items-center justify-center text-white"
          >
            <span className="absolute inset-0 rounded-2xl animate-ping bg-[#F5B041]/30 pointer-events-none" />
            <Bot size={24} className="relative z-10" />
            {/* Always-on live dot */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="fixed bottom-24 md:bottom-8 right-3 md:right-8 z-50 w-[calc(100vw-1.5rem)] md:w-[420px] h-[560px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#2A4D3A] to-[#1d3d2c] p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F5B041] flex items-center justify-center shadow-md">
                  <Sparkles size={20} className="text-[#2A4D3A]" />
                </div>
                <div>
                  <h3 className="text-white font-bold tracking-tight">Traveloop AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full inline-block bg-emerald-400 animate-pulse" />
                    <span className="text-white/60 text-[11px]">🔮 Ring 2.6 · Live</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/50 hover:text-white transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Context chips */}
            <div className="flex gap-2 px-4 py-2 bg-[#f7f9f8] border-b border-slate-100 flex-shrink-0 overflow-x-auto scrollbar-none">
              {[
                { icon: MapPin,     label: 'Tokyo + Paris', color: 'text-[#2A4D3A]' },
                { icon: TrendingUp, label: '$5,000 budget', color: 'text-[#F5B041]' },
                { icon: Cloud,      label: 'June weather',  color: 'text-blue-500'  },
              ].map(({ icon: Icon, label, color }) => (
                <div
                  key={label}
                  className={`flex items-center gap-1.5 text-[11px] font-medium ${color} bg-white border border-slate-100 rounded-full px-2.5 py-1 whitespace-nowrap shadow-sm`}
                >
                  <Icon size={11} />
                  {label}
                </div>
              ))}
            </div>

            {/* API error banner */}
            <AnimatePresence>
              {apiError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mx-3 mt-1.5 flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl px-3 py-2 flex-shrink-0"
                >
                  <AlertCircle size={13} className="text-red-500 flex-shrink-0" />
                  <p className="text-red-600 text-xs flex-1">{apiError}</p>
                  <button onClick={() => setApiError('')} className="text-red-400 hover:text-red-600">
                    <X size={13} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FDFBF7]">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2A4D3A] to-[#1a3328] flex items-center justify-center flex-shrink-0 mb-0.5">
                      <Sparkles size={13} className="text-[#F5B041]" />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-[#2A4D3A] text-white rounded-br-sm shadow-md'
                        : 'bg-white border border-slate-100 text-slate-700 shadow-sm rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2A4D3A] to-[#1a3328] flex items-center justify-center flex-shrink-0">
                    <Sparkles size={13} className="text-[#F5B041]" />
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1 items-center">
                      {[0, 150, 300].map(delay => (
                        <div
                          key={delay}
                          className="w-2 h-2 rounded-full bg-slate-300 animate-bounce"
                          style={{ animationDelay: `${delay}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick questions */}
            <div className="px-4 py-2 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto flex-shrink-0 scrollbar-none">
              {QUICK_QUESTIONS.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  disabled={isTyping}
                  className="whitespace-nowrap text-[11px] px-3 py-1.5 bg-[#FDFBF7] border border-slate-200 rounded-full text-slate-600 hover:border-[#2A4D3A] hover:text-[#2A4D3A] transition-colors flex-shrink-0 font-medium disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-slate-100 flex-shrink-0">
              <div className="flex gap-2 bg-[#FDFBF7] rounded-xl border border-slate-200 p-2 focus-within:border-[#2A4D3A]/40 transition-colors">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                  placeholder="Ask anything about your trip…"
                  className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isTyping}
                  className="p-2 bg-[#2A4D3A] rounded-lg text-white disabled:opacity-40 hover:bg-[#1f382a] transition-all active:scale-95"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
