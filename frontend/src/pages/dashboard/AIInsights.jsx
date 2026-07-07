import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const SUGGESTIONS = [
  "What experiment should I run next on my pricing page?",
  "Why might Variant B be underperforming?",
  "How do I improve my conversion rate?",
  "What's a good sample size for my experiment?",
];

export default function AIInsights() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your AI experiment assistant. Ask me anything about your A/B tests, what to test next, or how to improve your conversion rates.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (text) => {
    const userMsg = text || input;
    if (!userMsg.trim()) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: "You are an expert A/B testing consultant for ExperimentX, an AI-powered A/B testing SaaS platform. Give concise, practical advice about experiments, conversion optimization, and statistical testing. Keep responses under 150 words and always be actionable.",
          messages: [...messages, { role: "user", content: userMsg }]
            .filter((m) => m.role !== "system")
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't generate a response.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Network error — please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const cardClass = `rounded-2xl border ${
    isDark ? "bg-white/[0.03] border-white/10" : "bg-white border-gray-200 shadow-sm"
  }`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>AI Insights</h1>
        <p className={`text-sm mt-1 ${isDark ? "text-white/40" : "text-gray-500"}`}>Ask anything about your experiments</p>
      </div>

      <div className={`${cardClass} flex flex-col`} style={{ height: "calc(100vh - 260px)", minHeight: 400 }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-violet to-brand-blue
                                flex items-center justify-center text-white text-[10px] font-bold mr-2 flex-shrink-0 mt-0.5">
                  AI
                </div>
              )}
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-gradient-to-r from-brand-violet to-brand-blue text-white rounded-br-sm"
                  : isDark
                    ? "bg-white/[0.06] text-white/90 rounded-bl-sm"
                    : "bg-gray-100 text-gray-800 rounded-bl-sm"
              }`}>
                {m.content}
              </div>
            </motion.div>
          ))}
          <AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-violet to-brand-blue
                                flex items-center justify-center text-white text-[10px] font-bold mr-2 flex-shrink-0">AI</div>
                <div className={`px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center ${
                  isDark ? "bg-white/[0.06]" : "bg-gray-100"
                }`}>
                  {[0, 0.2, 0.4].map((d) => (
                    <motion.div key={d} className="w-1.5 h-1.5 rounded-full bg-brand-violet"
                      animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d }} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick suggestions */}
        <div className={`px-5 py-3 border-t flex gap-2 overflow-x-auto ${
          isDark ? "border-white/5" : "border-gray-100"
        }`}>
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => send(s)}
              className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full border flex-shrink-0 transition-colors ${
                isDark
                  ? "border-white/10 text-white/50 hover:text-white hover:border-white/20"
                  : "border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300"
              }`}>
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className={`p-4 border-t ${isDark ? "border-white/5" : "border-gray-100"}`}>
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Ask about your experiments…"
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-brand-violet/30 ${
                isDark
                  ? "bg-white/[0.04] border-white/10 text-white placeholder:text-white/30"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
              }`}
            />
            <button onClick={() => send()}
              disabled={!input.trim() || loading}
              className="px-4 py-2.5 rounded-xl text-sm text-white font-medium
                         bg-gradient-to-r from-brand-violet to-brand-blue
                         disabled:opacity-40 hover:opacity-90 transition-opacity">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}