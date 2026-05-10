import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, Send, Copy, RotateCcw, Trash2, ChevronDown,
  CheckCheck, Zap, Globe, Wallet, MapPin, Cloud, Utensils,
  Package, FileText, AlertCircle, Wand2,
} from 'lucide-react';
import { callOpenAI, TRAVEL_SYSTEM_PROMPT } from '../utils/aiService';

// ── Preset prompt chips ────────────────────────────────────────────────────
const PRESETS = [
  { icon: MapPin,   label: 'Hidden gems',       prompt: 'What are the top 5 hidden gems in Tokyo that most tourists miss? Include practical tips and costs.' },
  { icon: Wallet,   label: 'Budget breakdown',  prompt: 'Create a detailed daily budget breakdown for 7 days in Paris on a $1,500 total budget. Include food, transport, accommodation, and activities.' },
  { icon: Globe,    label: 'Itinerary',          prompt: 'Generate a perfect 5-day itinerary for Bali, Indonesia. Include morning, afternoon, and evening plans with estimated costs.' },
  { icon: Cloud,    label: 'Best time to visit', prompt: 'What is the best time to visit Japan considering weather, crowds, festivals, and value for money? Give month-by-month advice.' },
  { icon: Utensils, label: 'Food guide',         prompt: 'Create a food lover\'s guide to Bangkok — must-try dishes, best street food areas, top restaurants for every budget, and local etiquette tips.' },
  { icon: Package,  label: 'Packing list',       prompt: 'Create a smart packing list for a 2-week backpacking trip through Southeast Asia in monsoon season. Include carry-on tips.' },
  { icon: FileText, label: 'Visa guide',         prompt: 'Explain the visa requirements, process, and tips for Indian citizens traveling to Europe (Schengen) and Japan. Include processing times and costs.' },
  { icon: Zap,      label: 'Safety tips',        prompt: 'What are the top 10 safety tips every solo traveler should know when visiting Southeast Asia? Include scam awareness and emergency contacts.' },
];

// ── Simple markdown renderer ───────────────────────────────────────────────
function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      nodes.push(<div key={i} className="h-3" />);
      i++;
      continue;
    }

    // H1/H2/H3
    if (line.startsWith('### ')) {
      nodes.push(
        <h3 key={i} className="text-sm font-bold text-[#2A4D3A] mt-4 mb-1.5 flex items-center gap-1.5">
          <span className="w-1 h-4 bg-[#F5B041] rounded-full inline-block flex-shrink-0" />
          {inlineFormat(line.slice(4))}
        </h3>
      );
      i++; continue;
    }
    if (line.startsWith('## ')) {
      nodes.push(
        <h2 key={i} className="text-base font-bold text-[#2A4D3A] mt-5 mb-2 pb-1.5 border-b border-[#2A4D3A]/10">
          {inlineFormat(line.slice(3))}
        </h2>
      );
      i++; continue;
    }
    if (line.startsWith('# ')) {
      nodes.push(
        <h1 key={i} className="text-lg font-bold text-[#2A4D3A] mt-4 mb-2">
          {inlineFormat(line.slice(2))}
        </h1>
      );
      i++; continue;
    }

    // Bullet list
    if (line.match(/^[-*•]\s/)) {
      const bullets: string[] = [];
      while (i < lines.length && lines[i].match(/^[-*•]\s/)) {
        bullets.push(lines[i].replace(/^[-*•]\s/, ''));
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} className="space-y-1.5 my-2">
          {bullets.map((b, bi) => (
            <li key={bi} className="flex items-start gap-2 text-slate-700 text-sm leading-relaxed">
              <span className="w-5 h-5 rounded-full bg-[#F5B041]/20 text-[#2A4D3A] flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold">
                {bi + 1}
              </span>
              {inlineFormat(b)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (line.match(/^\d+\.\s/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
        items.push(lines[i].replace(/^\d+\.\s/, ''));
        i++;
      }
      nodes.push(
        <ol key={`ol-${i}`} className="space-y-1.5 my-2">
          {items.map((item, ii) => (
            <li key={ii} className="flex items-start gap-2 text-slate-700 text-sm leading-relaxed">
              <span className="w-5 h-5 rounded-full bg-[#2A4D3A]/10 text-[#2A4D3A] flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold">
                {ii + 1}
              </span>
              {inlineFormat(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Blockquote / tip box
    if (line.startsWith('> ')) {
      nodes.push(
        <div key={i} className="border-l-4 border-[#F5B041] bg-[#F5B041]/8 rounded-r-xl px-4 py-2.5 my-2 text-sm text-slate-700 italic">
          {inlineFormat(line.slice(2))}
        </div>
      );
      i++; continue;
    }

    // Regular paragraph
    nodes.push(
      <p key={i} className="text-slate-700 text-sm leading-relaxed">
        {inlineFormat(line)}
      </p>
    );
    i++;
  }

  return nodes;
}

// Inline formatting: **bold**, *italic*, `code`
function inlineFormat(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i} className="font-semibold text-[#2A4D3A]">{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*'))
      return <em key={i} className="italic text-slate-600">{part.slice(1, -1)}</em>;
    if (part.startsWith('`') && part.endsWith('`'))
      return <code key={i} className="bg-slate-100 text-[#2A4D3A] px-1.5 py-0.5 rounded text-[12px] font-mono">{part.slice(1, -1)}</code>;
    return part;
  });
}

// ── Word-by-word stream simulation ────────────────────────────────────────
function useWordStream(fullText: string, active: boolean) {
  const [displayed, setDisplayed] = useState('');
  const idx = useRef(0);

  useEffect(() => {
    if (!active || !fullText) { setDisplayed(fullText); return; }
    idx.current = 0;
    setDisplayed('');
    const words = fullText.split(' ');
    const interval = setInterval(() => {
      if (idx.current >= words.length) { clearInterval(interval); return; }
      setDisplayed(words.slice(0, idx.current + 1).join(' '));
      idx.current++;
    }, 18);
    return () => clearInterval(interval);
  }, [fullText, active]);

  return displayed;
}

// ── Main component ─────────────────────────────────────────────────────────
export const AIStudio: React.FC = () => {
  const [prompt, setPrompt]       = useState('');
  const [output, setOutput]       = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [copied, setCopied]       = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [elapsed, setElapsed]     = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);

  const streamedOutput = useWordStream(output, streaming);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 260)}px`;
  }, [prompt]);

  const generate = async (text = prompt) => {
    if (!text.trim() || loading) return;
    setError('');
    setOutput('');
    setLoading(true);
    setStreaming(false);
    setElapsed(0);
    setWordCount(0);

    // Elapsed timer
    const start = Date.now();
    timerRef.current = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 100) / 10), 100);

    try {
      const result = await callOpenAI(
        [
          {
            role: 'system',
            content: `${TRAVEL_SYSTEM_PROMPT}\n\nIMPORTANT: Format your response clearly using markdown — use ## for main sections, ### for sub-sections, - for bullet points, and **bold** for key terms. Use emojis generously. Be detailed and comprehensive (up to 500 words).`,
          },
          { role: 'user', content: text.trim() },
        ],
        { max_tokens: 900, temperature: 0.78 }
      );

      clearInterval(timerRef.current!);
      setOutput(result);
      setStreaming(true);
      setWordCount(result.split(' ').length);
    } catch (err) {
      clearInterval(timerRef.current!);
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(
        msg === 'RATE_LIMIT'
          ? 'Rate limit reached — please wait a moment and try again.'
          : 'AI request failed. Check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (p: string) => {
    setPrompt(p);
    generate(p);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setPrompt('');
    setOutput('');
    setError('');
    setStreaming(false);
  };

  const hasOutput = !!output;

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-[#2A4D3A] flex items-center justify-center shadow-lg">
            <Wand2 size={20} className="text-[#F5B041]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI Travel Studio</h1>
            <p className="text-slate-500 text-sm">Ask anything — get instant, expert travel intelligence</p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-700 text-xs font-semibold">Ring 2.6 · Live</span>
          </div>
        </div>
      </motion.div>

      {/* ── Prompt Box ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="p-4 pb-2">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) generate();
            }}
            placeholder="Ask me anything about travel… e.g. &quot;Plan a 10-day Japan trip for $3,000&quot;"
            rows={3}
            className="w-full bg-transparent text-slate-800 placeholder-slate-400 resize-none focus:outline-none text-sm leading-relaxed"
            style={{ minHeight: 72 }}
          />
        </div>
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{prompt.length} chars</span>
            <span>·</span>
            <span className="hidden sm:inline">⌘ + Enter to send</span>
          </div>
          <div className="flex items-center gap-2">
            {(prompt || hasOutput) && (
              <button
                onClick={clear}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-500 transition-colors px-2 py-1.5 rounded-lg hover:bg-rose-50"
              >
                <Trash2 size={13} /> Clear
              </button>
            )}
            <button
              onClick={() => generate()}
              disabled={!prompt.trim() || loading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-semibold px-5 py-2.5 rounded-2xl transition-all active:scale-95 shadow-md disabled:shadow-none"
            >
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating…</>
                : <><Send size={15} /> Generate</>}
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Quick Presets ── */}
      {!hasOutput && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">Try a quick prompt</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESETS.map(({ icon: Icon, label, prompt: p }) => (
              <button
                key={label}
                onClick={() => handlePreset(p)}
                className="flex items-center gap-2 bg-white border border-slate-200 hover:border-[#2A4D3A]/40 hover:bg-[#2A4D3A]/5 rounded-2xl px-3 py-2.5 text-left transition-all group"
              >
                <div className="w-7 h-7 rounded-xl bg-[#2A4D3A]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#2A4D3A]/20 transition-colors">
                  <Icon size={14} className="text-[#2A4D3A]" />
                </div>
                <span className="text-xs font-medium text-slate-600 group-hover:text-indigo-700 leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Loading skeleton ── */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2A4D3A] flex items-center justify-center">
                <Sparkles size={16} className="text-[#F5B041] animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Ring 2.6 is thinking…</p>
                <p className="text-xs text-slate-400">{elapsed.toFixed(1)}s elapsed</p>
              </div>
              <div className="ml-auto flex gap-1.5">
                {[0, 120, 240].map(d => (
                  <div key={d} className="w-2 h-2 rounded-full bg-indigo-300 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
            <div className="space-y-3 pt-1">
              {[100, 85, 92, 60, 88, 75, 45].map((w, i) => (
                <div key={i} className="h-3.5 bg-slate-100 rounded-full animate-pulse" style={{ width: `${w}%`, animationDelay: `${i * 80}ms` }} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Error ── */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3"
          >
            <AlertCircle size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
            <p className="text-rose-700 text-sm flex-1">{error}</p>
            <button onClick={() => setError('')} className="text-rose-400 hover:text-rose-600 text-xs">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Output ── */}
      <AnimatePresence>
        {hasOutput && !loading && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-[#2A4D3A]/5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-[#2A4D3A] flex items-center justify-center">
                  <Sparkles size={13} className="text-[#F5B041]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#2A4D3A]">AI Response</p>
                  <p className="text-[10px] text-slate-400">~{wordCount} words · {elapsed.toFixed(1)}s · Ring 2.6</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => generate()} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#2A4D3A] bg-slate-100 hover:bg-[#2A4D3A]/10 rounded-xl px-2.5 py-1.5 transition-all">
                  <RotateCcw size={12} /> Redo
                </button>
                <button onClick={copyOutput} className={`flex items-center gap-1.5 text-xs font-medium rounded-xl px-3 py-1.5 transition-all ${
                  copied ? 'bg-emerald-100 text-emerald-700' : 'bg-[#2A4D3A]/10 text-[#2A4D3A] hover:bg-[#2A4D3A]/20'
                }`}>
                  {copied ? <><CheckCheck size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                </button>
              </div>
            </div>
            <div className="px-6 py-5 space-y-0.5 max-h-[65vh] overflow-y-auto scroll-smooth">
              {renderMarkdown(streamedOutput)}
            </div>
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <p className="text-xs text-slate-400">Want to dig deeper?</p>
              <div className="flex gap-2 flex-wrap justify-end">
                {['Give more detail', 'Make it a list', 'Add costs'].map(follow => (
                  <button key={follow} onClick={() => { const fp = `${follow}: ${prompt}`; setPrompt(fp); generate(fp); }}
                    className="text-[11px] px-2.5 py-1 bg-white border border-slate-200 rounded-full text-slate-600 hover:border-[#2A4D3A]/40 hover:text-[#2A4D3A] transition-colors font-medium"
                  >
                    {follow}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Empty state ── */}
      {!hasOutput && !loading && !error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-center py-10 text-slate-400 select-none"
        >
          <div className="w-16 h-16 rounded-3xl bg-[#2A4D3A]/8 flex items-center justify-center mx-auto mb-4">
            <Wand2 size={28} className="text-[#2A4D3A]/30" />
          </div>
          <p className="text-sm font-medium text-slate-500">Your AI response will appear here</p>
          <p className="text-xs text-slate-400 mt-1">Type a prompt above or pick a quick suggestion</p>
        </motion.div>
      )}
    </div>
  );
};