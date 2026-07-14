
// // import { useState, useRef, useEffect } from "react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import { useTheme } from "../../context/ThemeContext";
// // import api from "../../services/api";

// // // ── AI Agent definitions ─────────────────────────────────────────────────────
// // const AGENTS = [
// //   {
// //     id: "planner",
// //     name: "Experiment Planner",
// //     icon: "🧠",
// //     color: "from-brand-violet to-purple-600",
// //     desc: "Turns a business goal into a fully structured experiment",
// //     placeholder: "e.g. I want to increase checkout conversions on my pricing page",
// //     systemPrompt: `You are an expert experimentation strategist for ExperimentX, an AI-powered A/B testing SaaS.
// // When given a business goal, respond with a fully structured experiment plan in this exact JSON format:
// // {
// //   "name": "...",
// //   "hypothesis": "If we change X, then Y will improve because Z",
// //   "primary_metric": "...",
// //   "secondary_metrics": ["...", "..."],
// //   "guardrail_metrics": ["...", "..."],
// //   "variants": [{"label": "A", "name": "...", "description": "..."}, {"label": "B", "name": "...", "description": "..."}],
// //   "target_audience": "...",
// //   "estimated_duration_days": 14,
// //   "recommended_traffic_pct": 50,
// //   "estimated_sample_size": 10000,
// //   "risk_level": "Low|Medium|High",
// //   "confidence_score": 85,
// //   "reasoning": "..."
// // }
// // Return ONLY valid JSON, no markdown, no extra text.`,
// //   },
// //   {
// //     id: "variant",
// //     name: "Variant Generator",
// //     icon: "✍️",
// //     color: "from-brand-blue to-cyan-500",
// //     desc: "Generates copy, CTA, and design variants for any element",
// //     placeholder: "e.g. Generate 5 CTA button variants for a SaaS pricing page",
// //     systemPrompt: `You are a world-class conversion copywriter and UX strategist for ExperimentX.
// // When asked to generate variants, respond in this JSON format:
// // {
// //   "element": "...",
// //   "variants": [
// //     {"label": "A", "name": "Control", "copy": "...", "rationale": "...", "predicted_lift": "..."},
// //     {"label": "B", "name": "...", "copy": "...", "rationale": "...", "predicted_lift": "..."},
// //     {"label": "C", "name": "...", "copy": "...", "rationale": "...", "predicted_lift": "..."},
// //     {"label": "D", "name": "...", "copy": "...", "rationale": "...", "predicted_lift": "..."},
// //     {"label": "E", "name": "...", "copy": "...", "rationale": "...", "predicted_lift": "..."}
// //   ],
// //   "recommended": "B",
// //   "reasoning": "..."
// // }
// // Return ONLY valid JSON, no markdown, no extra text.`,
// //   },
// //   {
// //     id: "reviewer",
// //     name: "Experiment Reviewer",
// //     icon: "🔍",
// //     color: "from-emerald-500 to-teal-500",
// //     desc: "Reviews your experiment for issues before you launch",
// //     placeholder: "e.g. Experiment: Test shorter form. Goal: signup. Duration: 3 days. Traffic: 5%",
// //     systemPrompt: `You are a rigorous experimentation quality reviewer for ExperimentX.
// // When given experiment details, respond in this JSON format:
// // {
// //   "passed": ["...", "..."],
// //   "warnings": ["...", "..."],
// //   "errors": ["...", "..."],
// //   "confidence_score": 78,
// //   "ready_to_launch": true,
// //   "suggestions": ["...", "..."],
// //   "estimated_duration_fix": "..."
// // }
// // Be specific. Flag short durations, low traffic, missing guardrail metrics, weak hypotheses.
// // Return ONLY valid JSON, no markdown.`,
// //   },
// //   {
// //     id: "analyst",
// //     name: "Analytics Interpreter",
// //     icon: "📊",
// //     color: "from-amber-500 to-orange-500",
// //     desc: "Explains results and statistical significance in plain English",
// //     placeholder: "e.g. Variant A: 1000 visitors, 87 conversions. Variant B: 1000 visitors, 112 conversions. p-value: 0.021",
// //     systemPrompt: `You are an expert statistician and data analyst for ExperimentX.
// // When given experiment results, respond in this JSON format:
// // {
// //   "summary": "...",
// //   "winner": "A|B|None",
// //   "lift": "...",
// //   "confidence": "...",
// //   "plain_english": "...",
// //   "key_insights": ["...", "...", "..."],
// //   "recommendation": "Deploy|Keep Running|Stop",
// //   "recommendation_reason": "...",
// //   "segments_to_check": ["...", "..."],
// //   "next_experiment": "..."
// // }
// // Write the plain_english as if explaining to a non-technical product manager.
// // Return ONLY valid JSON, no markdown.`,
// //   },
// //   {
// //     id: "guardian",
// //     name: "Experiment Guardian",
// //     icon: "🚨",
// //     color: "from-red-500 to-rose-500",
// //     desc: "Monitors for anomalies, regressions, and when to stop",
// //     placeholder: "e.g. Day 5: Variant B conversion rate dropped from 8% to 3.1% overnight. Sample size: 4200",
// //     systemPrompt: `You are an experiment monitoring specialist for ExperimentX.
// // When given experiment status data, respond in this JSON format:
// // {
// //   "status": "Healthy|Warning|Critical",
// //   "anomalies": ["...", "..."],
// //   "probable_causes": ["...", "..."],
// //   "revenue_impact": "...",
// //   "recommended_action": "Continue|Pause|Stop Immediately",
// //   "action_reason": "...",
// //   "estimated_hours_to_decide": 24,
// //   "alerts": [{"severity": "high|medium|low", "message": "..."}]
// // }
// // Return ONLY valid JSON, no markdown.`,
// //   },
// //   {
// //     id: "chat",
// //     name: "AI Copilot Chat",
// //     icon: "💬",
// //     color: "from-fuchsia-500 to-brand-violet",
// //     desc: "Ask anything about A/B testing, experiments, or optimization",
// //     placeholder: "Ask me anything about your experiments...",
// //     systemPrompt: `You are ExperimentX's AI Copilot — an expert in A/B testing, experimentation, conversion optimization, and product analytics. 
// // Be concise (under 120 words), practical, and actionable. Use bullet points when listing things.
// // You have access to general knowledge about statistical testing, product experimentation best practices, and conversion optimization.`,
// //   },
// // ];

// // // ── Renders structured JSON output beautifully ──────────────────────────────
// // function StructuredOutput({ data, agentId, isDark }) {
// //   const cardCls = `p-3 rounded-xl ${isDark ? "bg-white/[0.04] border border-white/[0.07]" : "bg-gray-50 border border-gray-200"}`;
// //   const labelCls = `text-[10px] font-semibold uppercase tracking-wider mb-1.5 ${isDark ? "text-white/30" : "text-gray-400"}`;
// //   const valueCls = `text-sm font-medium ${isDark ? "text-white/85" : "text-gray-800"}`;

// //   if (agentId === "planner") {
// //     return (
// //       <div className="space-y-3">
// //         <div className={cardCls}>
// //           <p className={labelCls}>Experiment name</p>
// //           <p className={valueCls}>{data.name}</p>
// //         </div>
// //         <div className={cardCls}>
// //           <p className={labelCls}>Hypothesis</p>
// //           <p className={`text-sm italic ${isDark ? "text-white/70" : "text-gray-600"}`}>{data.hypothesis}</p>
// //         </div>
// //         <div className="grid grid-cols-2 gap-3">
// //           <div className={cardCls}>
// //             <p className={labelCls}>Primary metric</p>
// //             <p className={valueCls}>{data.primary_metric}</p>
// //           </div>
// //           <div className={cardCls}>
// //             <p className={labelCls}>Risk level</p>
// //             <p className={`text-sm font-medium ${data.risk_level === "Low" ? "text-emerald-500" : data.risk_level === "Medium" ? "text-amber-500" : "text-red-400"}`}>
// //               {data.risk_level}
// //             </p>
// //           </div>
// //           <div className={cardCls}>
// //             <p className={labelCls}>Duration</p>
// //             <p className={valueCls}>{data.estimated_duration_days} days</p>
// //           </div>
// //           <div className={cardCls}>
// //             <p className={labelCls}>Traffic</p>
// //             <p className={valueCls}>{data.recommended_traffic_pct}%</p>
// //           </div>
// //         </div>
// //         <div className={cardCls}>
// //           <p className={labelCls}>Variants</p>
// //           <div className="flex gap-2">
// //             {data.variants?.map((v) => (
// //               <div key={v.label} className={`flex-1 p-2 rounded-lg ${isDark ? "bg-white/[0.04]" : "bg-white"} border ${isDark ? "border-white/[0.06]" : "border-gray-200"}`}>
// //                 <span className={`text-xs font-bold ${v.label === "A" ? "text-brand-violet" : "text-brand-blue"}`}>Variant {v.label}</span>
// //                 <p className={`text-xs mt-0.5 ${isDark ? "text-white/60" : "text-gray-600"}`}>{v.name}</p>
// //                 <p className={`text-[10px] mt-0.5 ${isDark ? "text-white/30" : "text-gray-400"}`}>{v.description}</p>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //         <div className={cardCls}>
// //           <div className="flex items-center justify-between mb-1">
// //             <p className={labelCls}>AI confidence score</p>
// //             <span className="text-sm font-bold text-brand-violet">{data.confidence_score}%</span>
// //           </div>
// //           <div className={`h-1.5 rounded-full ${isDark ? "bg-white/[0.06]" : "bg-gray-100"}`}>
// //             <div className="h-full rounded-full bg-gradient-to-r from-brand-violet to-brand-blue"
// //               style={{ width: `${data.confidence_score}%` }} />
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (agentId === "variant") {
// //     return (
// //       <div className="space-y-2">
// //         <p className={labelCls}>Generated variants for: {data.element}</p>
// //         {data.variants?.map((v) => (
// //           <div key={v.label} className={`${cardCls} ${data.recommended === v.label ? "ring-1 ring-emerald-500/40" : ""}`}>
// //             <div className="flex items-start justify-between gap-2">
// //               <div className="flex-1">
// //                 <div className="flex items-center gap-2 mb-1">
// //                   <span className={`text-xs font-bold ${v.label === "A" ? "text-brand-violet" : v.label === "B" ? "text-brand-blue" : v.label === "C" ? "text-emerald-500" : v.label === "D" ? "text-amber-500" : "text-rose-500"}`}>
// //                     {v.label}
// //                   </span>
// //                   <span className={`text-xs ${isDark ? "text-white/40" : "text-gray-500"}`}>{v.name}</span>
// //                   {data.recommended === v.label && (
// //                     <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">RECOMMENDED</span>
// //                   )}
// //                 </div>
// //                 <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>"{v.copy}"</p>
// //                 <p className={`text-xs mt-1 ${isDark ? "text-white/35" : "text-gray-500"}`}>{v.rationale}</p>
// //               </div>
// //               <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex-shrink-0">
// //                 {v.predicted_lift}
// //               </span>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     );
// //   }

// //   if (agentId === "reviewer") {
// //     return (
// //       <div className="space-y-3">
// //         <div className="flex items-center gap-3">
// //           <div className={`flex-1 flex items-center justify-between p-3 rounded-xl ${
// //             data.ready_to_launch ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-400/10 border border-red-400/20"
// //           }`}>
// //             <span className={`text-sm font-bold ${data.ready_to_launch ? "text-emerald-500" : "text-red-400"}`}>
// //               {data.ready_to_launch ? "✓ Ready to launch" : "✗ Not ready to launch"}
// //             </span>
// //             <span className="text-sm font-bold text-brand-violet">{data.confidence_score}%</span>
// //           </div>
// //         </div>
// //         {data.passed?.length > 0 && (
// //           <div className={cardCls}>
// //             <p className={labelCls}>Passed checks</p>
// //             {data.passed.map((p, i) => (
// //               <p key={i} className="text-xs text-emerald-500 flex items-center gap-1.5 mt-1">
// //                 <span>✓</span> {p}
// //               </p>
// //             ))}
// //           </div>
// //         )}
// //         {data.warnings?.length > 0 && (
// //           <div className={cardCls}>
// //             <p className={labelCls}>Warnings</p>
// //             {data.warnings.map((w, i) => (
// //               <p key={i} className="text-xs text-amber-500 flex items-center gap-1.5 mt-1">
// //                 <span>⚠</span> {w}
// //               </p>
// //             ))}
// //           </div>
// //         )}
// //         {data.errors?.length > 0 && (
// //           <div className={cardCls}>
// //             <p className={labelCls}>Errors</p>
// //             {data.errors.map((e, i) => (
// //               <p key={i} className="text-xs text-red-400 flex items-center gap-1.5 mt-1">
// //                 <span>✗</span> {e}
// //               </p>
// //             ))}
// //           </div>
// //         )}
// //         {data.suggestions?.length > 0 && (
// //           <div className={cardCls}>
// //             <p className={labelCls}>Suggestions</p>
// //             {data.suggestions.map((s, i) => (
// //               <p key={i} className={`text-xs mt-1 ${isDark ? "text-white/60" : "text-gray-600"}`}>→ {s}</p>
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     );
// //   }

// //   if (agentId === "analyst") {
// //     return (
// //       <div className="space-y-3">
// //         <div className={`p-4 rounded-xl ${
// //           data.winner !== "None"
// //             ? "bg-emerald-500/10 border border-emerald-500/20"
// //             : isDark ? "bg-white/[0.04] border border-white/[0.07]" : "bg-gray-50 border border-gray-200"
// //         }`}>
// //           <div className="flex items-center justify-between mb-2">
// //             <span className={`text-sm font-bold ${data.winner !== "None" ? "text-emerald-500" : isDark ? "text-white" : "text-gray-900"}`}>
// //               {data.winner !== "None" ? `🏆 Variant ${data.winner} wins` : "No winner yet"}
// //             </span>
// //             <span className="text-sm font-medium text-brand-violet">{data.lift} lift</span>
// //           </div>
// //           <p className={`text-sm ${isDark ? "text-white/70" : "text-gray-700"}`}>{data.plain_english}</p>
// //         </div>
// //         <div className={cardCls}>
// //           <p className={labelCls}>Recommendation</p>
// //           <p className={`text-sm font-bold ${
// //             data.recommendation === "Deploy" ? "text-emerald-500"
// //               : data.recommendation === "Stop" ? "text-red-400"
// //               : "text-amber-500"
// //           }`}>{data.recommendation}</p>
// //           <p className={`text-xs mt-1 ${isDark ? "text-white/40" : "text-gray-500"}`}>{data.recommendation_reason}</p>
// //         </div>
// //         {data.key_insights?.length > 0 && (
// //           <div className={cardCls}>
// //             <p className={labelCls}>Key insights</p>
// //             {data.key_insights.map((insight, i) => (
// //               <p key={i} className={`text-xs mt-1.5 flex items-start gap-1.5 ${isDark ? "text-white/65" : "text-gray-600"}`}>
// //                 <span className="text-brand-violet mt-0.5">•</span> {insight}
// //               </p>
// //             ))}
// //           </div>
// //         )}
// //         {data.next_experiment && (
// //           <div className={cardCls}>
// //             <p className={labelCls}>Next experiment to run</p>
// //             <p className={`text-xs ${isDark ? "text-white/60" : "text-gray-600"}`}>{data.next_experiment}</p>
// //           </div>
// //         )}
// //       </div>
// //     );
// //   }

// //   if (agentId === "guardian") {
// //     const statusColor = data.status === "Healthy" ? "text-emerald-500" : data.status === "Warning" ? "text-amber-500" : "text-red-400";
// //     const statusBg = data.status === "Healthy" ? "bg-emerald-500/10 border-emerald-500/20" : data.status === "Warning" ? "bg-amber-500/10 border-amber-500/20" : "bg-red-400/10 border-red-400/20";
// //     return (
// //       <div className="space-y-3">
// //         <div className={`p-3 rounded-xl border ${statusBg}`}>
// //           <div className="flex items-center justify-between">
// //             <span className={`text-sm font-bold ${statusColor}`}>
// //               {data.status === "Healthy" ? "✓" : data.status === "Warning" ? "⚠" : "🚨"} {data.status}
// //             </span>
// //             <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
// //               data.recommended_action === "Continue" ? "bg-emerald-500/10 text-emerald-500"
// //                 : data.recommended_action === "Pause" ? "bg-amber-500/10 text-amber-500"
// //                 : "bg-red-400/10 text-red-400"
// //             }`}>{data.recommended_action}</span>
// //           </div>
// //           <p className={`text-xs mt-1 ${isDark ? "text-white/50" : "text-gray-500"}`}>{data.action_reason}</p>
// //         </div>
// //         {data.alerts?.length > 0 && (
// //           <div className="space-y-2">
// //             {data.alerts.map((a, i) => (
// //               <div key={i} className={`px-3 py-2 rounded-lg text-xs flex items-start gap-2 ${
// //                 a.severity === "high" ? "bg-red-400/10 text-red-400"
// //                   : a.severity === "medium" ? "bg-amber-500/10 text-amber-500"
// //                   : "bg-brand-blue/10 text-brand-blue"
// //               }`}>
// //                 <span className="font-bold uppercase">{a.severity}</span>
// //                 <span>{a.message}</span>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //         {data.revenue_impact && (
// //           <div className={cardCls}>
// //             <p className={labelCls}>Revenue impact</p>
// //             <p className={`text-sm font-bold text-red-400`}>{data.revenue_impact}</p>
// //           </div>
// //         )}
// //       </div>
// //     );
// //   }

// //   return null;
// // }

// // // ── Chat message bubble ─────────────────────────────────────────────────────
// // function ChatBubble({ msg, isDark }) {
// //   return (
// //     <motion.div
// //       initial={{ opacity: 0, y: 8 }}
// //       animate={{ opacity: 1, y: 0 }}
// //       className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-3`}
// //     >
// //       {msg.role === "assistant" && (
// //         <div className="w-7 h-7 rounded-full bg-gradient-to-br from-fuchsia-500 to-brand-violet flex items-center justify-center text-white text-[10px] font-bold mr-2 flex-shrink-0 mt-0.5">
// //           AI
// //         </div>
// //       )}
// //       <div className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
// //         msg.role === "user"
// //           ? "bg-gradient-to-r from-brand-violet to-brand-blue text-white rounded-br-sm"
// //           : isDark
// //             ? "bg-white/[0.06] text-white/85 rounded-bl-sm"
// //             : "bg-gray-100 text-gray-800 rounded-bl-sm"
// //       }`}>
// //         {msg.content}
// //       </div>
// //     </motion.div>
// //   );
// // }

// // export default function AIInsights() {
// //   const { theme } = useTheme();
// //   const isDark = theme === "dark";
// //   const [activeAgent, setActiveAgent] = useState(AGENTS[0]);
// //   const [input, setInput] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [result, setResult] = useState(null);
// //   const [error, setError] = useState("");
// //   const [chatMessages, setChatMessages] = useState([
// //     { role: "assistant", content: "Hi! I'm your AI Copilot. Ask me anything about A/B testing, experiment strategy, or conversion optimization." }
// //   ]);
// //   const messagesEndRef = useRef(null);

// //   useEffect(() => {
// //     if (activeAgent.id === "chat") {
// //       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //     }
// //   }, [chatMessages, activeAgent.id]);

// //   const callAI = async (messages) => {
// //     const res = await fetch("https://api.anthropic.com/v1/messages", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({
// //         model: "claude-sonnet-4-6",
// //         max_tokens: 1000,
// //         system: activeAgent.systemPrompt,
// //         messages,
// //       }),
// //     });
// //     const data = await res.json();
// //     return data.content?.[0]?.text || "";
// //   };

// //   const handleSubmit = async (e) => {
// //     e?.preventDefault();
// //     if (!input.trim() || loading) return;
// //     const userInput = input.trim();
// //     setInput("");
// //     setError("");
// //     setLoading(true);

// //     if (activeAgent.id === "chat") {
// //       const newMessages = [...chatMessages, { role: "user", content: userInput }];
// //       setChatMessages(newMessages);
// //       try {
// //         const reply = await callAI(newMessages.map((m) => ({ role: m.role, content: m.content })));
// //         setChatMessages((prev) => [...prev, { role: "assistant", content: reply }]);
// //       } catch {
// //         setChatMessages((prev) => [...prev, { role: "assistant", content: "Network error — please try again." }]);
// //       }
// //     } else {
// //       setResult(null);
// //       try {
// //         const raw = await callAI([{ role: "user", content: userInput }]);
// //         const cleaned = raw.replace(/```json|```/g, "").trim();
// //         const parsed = JSON.parse(cleaned);
// //         setResult(parsed);
// //       } catch {
// //         setError("AI response couldn't be parsed. Try rephrasing your input.");
// //       }
// //     }
// //     setLoading(false);
// //   };

// //   const cardCls = `rounded-2xl border transition-colors ${
// //     isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"
// //   }`;

// //   return (
// //     <div className="space-y-5">
// //       <div>
// //         <h1 className={`text-xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
// //           AI Copilot
// //         </h1>
// //         <p className={`text-sm mt-0.5 ${isDark ? "text-white/35" : "text-gray-500"}`}>
// //           Specialized AI agents for every stage of experimentation
// //         </p>
// //       </div>

// //       {/* Agent selector */}
// //       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
// //         {AGENTS.map((agent) => (
// //           <button
// //             key={agent.id}
// //             onClick={() => { setActiveAgent(agent); setResult(null); setError(""); setInput(""); }}
// //             className={`p-3 rounded-xl border text-left transition-all ${
// //               activeAgent.id === agent.id
// //                 ? "ring-1 ring-brand-violet/50 " + (isDark ? "bg-brand-violet/10 border-brand-violet/30" : "bg-brand-violet/5 border-brand-violet/20")
// //                 : isDark ? "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]" : "bg-white border-gray-200 hover:border-gray-300"
// //             }`}
// //           >
// //             <span className="text-lg block mb-1">{agent.icon}</span>
// //             <p className={`text-xs font-medium leading-tight ${isDark ? "text-white/70" : "text-gray-700"}`}>
// //               {agent.name}
// //             </p>
// //           </button>
// //         ))}
// //       </div>

// //       {/* Active agent panel */}
// //       <div className={cardCls}>
// //         {/* Agent header */}
// //         <div className={`flex items-center gap-3 px-5 py-4 border-b ${isDark ? "border-white/[0.06]" : "border-gray-100"}`}>
// //           <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${activeAgent.color} flex items-center justify-center text-lg`}>
// //             {activeAgent.icon}
// //           </div>
// //           <div>
// //             <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{activeAgent.name}</p>
// //             <p className={`text-xs ${isDark ? "text-white/35" : "text-gray-400"}`}>{activeAgent.desc}</p>
// //           </div>
// //           {activeAgent.id !== "chat" && (
// //             <div className={`ml-auto text-xs px-2.5 py-1 rounded-full ${isDark ? "bg-brand-violet/10 text-brand-violet" : "bg-brand-violet/5 text-brand-violet border border-brand-violet/20"}`}>
// //               Structured Output
// //             </div>
// //           )}
// //         </div>

// //         {/* Chat mode */}
// //         {activeAgent.id === "chat" ? (
// //           <>
// //             <div className="p-5 h-72 overflow-y-auto">
// //               {chatMessages.map((msg, i) => (
// //                 <ChatBubble key={i} msg={msg} isDark={isDark} />
// //               ))}
// //               <AnimatePresence>
// //                 {loading && (
// //                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex mb-3">
// //                     <div className="w-7 h-7 rounded-full bg-gradient-to-br from-fuchsia-500 to-brand-violet flex items-center justify-center text-white text-[10px] font-bold mr-2 flex-shrink-0">AI</div>
// //                     <div className={`px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center ${isDark ? "bg-white/[0.06]" : "bg-gray-100"}`}>
// //                       {[0, 0.2, 0.4].map((d) => (
// //                         <motion.div key={d} className="w-1.5 h-1.5 rounded-full bg-brand-violet"
// //                           animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d }} />
// //                       ))}
// //                     </div>
// //                   </motion.div>
// //                 )}
// //               </AnimatePresence>
// //               <div ref={messagesEndRef} />
// //             </div>
// //             <div className={`px-5 pb-4 pt-3 border-t ${isDark ? "border-white/[0.05]" : "border-gray-100"}`}>
// //               <form onSubmit={handleSubmit} className="flex gap-2">
// //                 <input value={input} onChange={(e) => setInput(e.target.value)}
// //                   placeholder={activeAgent.placeholder}
// //                   className={`flex-1 px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-brand-violet/25 ${
// //                     isDark ? "bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25" : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
// //                   }`} />
// //                 <button type="submit" disabled={!input.trim() || loading}
// //                   className="px-4 py-2.5 rounded-xl text-sm text-white font-medium bg-gradient-to-r from-brand-violet to-brand-blue disabled:opacity-40 hover:opacity-90 transition-opacity">
// //                   Send
// //                 </button>
// //               </form>
// //             </div>
// //           </>
// //         ) : (
// //           /* Structured agent mode */
// //           <div className="p-5 space-y-4">
// //             <form onSubmit={handleSubmit} className="flex gap-2">
// //               <input value={input} onChange={(e) => setInput(e.target.value)}
// //                 placeholder={activeAgent.placeholder}
// //                 className={`flex-1 px-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-brand-violet/25 ${
// //                   isDark ? "bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25" : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
// //                 }`} />
// //               <button type="submit" disabled={!input.trim() || loading}
// //                 className={`px-5 py-3 rounded-xl text-sm text-white font-medium bg-gradient-to-r ${activeAgent.color} disabled:opacity-40 hover:opacity-90 transition-opacity flex items-center gap-2`}>
// //                 {loading ? (
// //                   <motion.div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent"
// //                     animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
// //                 ) : activeAgent.icon}
// //                 {loading ? "Thinking…" : "Run"}
// //               </button>
// //             </form>

// //             {error && (
// //               <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
// //                 className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-lg">
// //                 {error}
// //               </motion.p>
// //             )}

// //             <AnimatePresence>
// //               {result && (
// //                 <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
// //                   <div className={`text-xs font-medium mb-2 ${isDark ? "text-white/30" : "text-gray-400"}`}>
// //                     AI Response — {activeAgent.name}
// //                   </div>
// //                   <StructuredOutput data={result} agentId={activeAgent.id} isDark={isDark} />
// //                 </motion.div>
// //               )}
// //             </AnimatePresence>

// //             {!result && !loading && (
// //               <div className={`text-center py-8 ${isDark ? "text-white/15" : "text-gray-300"}`}>
// //                 <p className="text-3xl mb-2">{activeAgent.icon}</p>
// //                 <p className="text-xs">Enter your query above to run this agent</p>
// //               </div>
// //             )}
// //           </div>
// //         )}
// //       </div>

// //       {/* Agent capability cards */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //         {[
// //           { icon: "🧠", title: "Plan experiments from a goal", desc: "Type a business goal — AI generates a complete experiment plan with hypothesis, metrics, variants, and duration." },
// //           { icon: "✍️", title: "Generate 5 variant copies instantly", desc: "Paste your element (headline, CTA, form) and get 5 optimized variants with predicted lift for each." },
// //           { icon: "🔍", title: "Pre-launch experiment review", desc: "Paste your experiment config — AI checks for weak hypotheses, short durations, and missing guardrails." },
// //           { icon: "📊", title: "Explain results in plain English", desc: "Paste your stats — AI explains significance, declares a winner, and recommends what to do next." },
// //         ].map((card) => (
// //           <div key={card.title} className={`flex items-start gap-3 p-4 rounded-xl border ${
// //             isDark ? "bg-white/[0.02] border-white/[0.06]" : "bg-white border-gray-200"
// //           }`}>
// //             <span className="text-xl flex-shrink-0">{card.icon}</span>
// //             <div>
// //               <p className={`text-sm font-medium ${isDark ? "text-white/80" : "text-gray-800"}`}>{card.title}</p>
// //               <p className={`text-xs mt-0.5 ${isDark ? "text-white/30" : "text-gray-400"}`}>{card.desc}</p>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }



















































// import { useState, useRef, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useTheme } from "../../context/ThemeContext";
// import api from "../../services/api";
// import {
//   Brain,
//   PenSquare,
//   SearchCheck,
//   BarChart3,
//   ShieldAlert,
//   MessageSquare,
//   CheckCircle,
//   XCircle,
//   TriangleAlert,
//   Sparkles,
// } from "lucide-react";

// // ── AI Agent definitions ─────────────────────────────────────────────────────
// const AGENTS = [
//   {
//     id: "planner",
//     name: "Planner",
//     icon: Brain,
//     color: "from-indigo-500 to-violet-600",
//     desc: "Turns a business goal into a structured experiment",
//     placeholder: "e.g. I want to increase checkout conversions on my pricing page",
//     systemPrompt: `You are an expert experimentation strategist for ExperimentX, an AI-powered A/B testing SaaS.
// When given a business goal, respond with a fully structured experiment plan in this exact JSON format:
// {
//   "name": "...",
//   "hypothesis": "If we change X, then Y will improve because Z",
//   "primary_metric": "...",
//   "secondary_metrics": ["...", "..."],
//   "guardrail_metrics": ["...", "..."],
//   "variants": [{"label": "A", "name": "...", "description": "..."}, {"label": "B", "name": "...", "description": "..."}],
//   "target_audience": "...",
//   "estimated_duration_days": 14,
//   "recommended_traffic_pct": 50,
//   "estimated_sample_size": 10000,
//   "risk_level": "Low|Medium|High",
//   "confidence_score": 85,
//   "reasoning": "..."
// }
// Return ONLY valid JSON, no markdown, no extra text.`,
//   },
//   {
//     id: "variant",
//     name: "Variant Generator",
//     icon: PenSquare,
//     color: "from-blue-500 to-cyan-600",
//     desc: "Generates copy, CTA, and design variants",
//     placeholder: "e.g. Generate 5 CTA button variants for a SaaS pricing page",
//     systemPrompt: `You are a world-class conversion copywriter and UX strategist for ExperimentX.
// When asked to generate variants, respond in this JSON format:
// {
//   "element": "...",
//   "variants": [
//     {"label": "A", "name": "Control", "copy": "...", "rationale": "...", "predicted_lift": "..."},
//     {"label": "B", "name": "...", "copy": "...", "rationale": "...", "predicted_lift": "..."},
//     {"label": "C", "name": "...", "copy": "...", "rationale": "...", "predicted_lift": "..."},
//     {"label": "D", "name": "...", "copy": "...", "rationale": "...", "predicted_lift": "..."},
//     {"label": "E", "name": "...", "copy": "...", "rationale": "...", "predicted_lift": "..."}
//   ],
//   "recommended": "B",
//   "reasoning": "..."
// }
// Return ONLY valid JSON, no markdown, no extra text.`,
//   },
//   {
//     id: "reviewer",
//     name: "Reviewer",
//     icon: SearchCheck,
//     color: "from-emerald-500 to-teal-600",
//     desc: "Reviews your experiment for issues before launch",
//     placeholder: "e.g. Experiment: Test shorter form. Goal: signup. Duration: 3 days. Traffic: 5%",
//     systemPrompt: `You are a rigorous experimentation quality reviewer for ExperimentX.
// When given experiment details, respond in this JSON format:
// {
//   "passed": ["...", "..."],
//   "warnings": ["...", "..."],
//   "errors": ["...", "..."],
//   "confidence_score": 78,
//   "ready_to_launch": true,
//   "suggestions": ["...", "..."],
//   "estimated_duration_fix": "..."
// }
// Be specific. Flag short durations, low traffic, missing guardrail metrics, weak hypotheses.
// Return ONLY valid JSON, no markdown.`,
//   },
//   {
//     id: "analyst",
//     name: "Analytics",
//     icon: BarChart3,
//     color: "from-amber-500 to-orange-600",
//     desc: "Explains results and statistical significance",
//     placeholder: "e.g. Variant A: 1000 visitors, 87 conversions. Variant B: 1000 visitors, 112 conversions. p-value: 0.021",
//     systemPrompt: `You are an expert statistician and data analyst for ExperimentX.
// When given experiment results, respond in this JSON format:
// {
//   "summary": "...",
//   "winner": "A|B|None",
//   "lift": "...",
//   "confidence": "...",
//   "plain_english": "...",
//   "key_insights": ["...", "...", "..."],
//   "recommendation": "Deploy|Keep Running|Stop",
//   "recommendation_reason": "...",
//   "segments_to_check": ["...", "..."],
//   "next_experiment": "..."
// }
// Write the plain_english as if explaining to a non-technical product manager.
// Return ONLY valid JSON, no markdown.`,
//   },
//   {
//     id: "guardian",
//     name: "Guardian",
//     icon: ShieldAlert,
//     color: "from-rose-500 to-pink-600",
//     desc: "Monitors anomalies, regressions, and stop conditions",
//     placeholder: "e.g. Day 5: Variant B conversion rate dropped from 8% to 3.1% overnight. Sample size: 4200",
//     systemPrompt: `You are an experiment monitoring specialist for ExperimentX.
// When given experiment status data, respond in this JSON format:
// {
//   "status": "Healthy|Warning|Critical",
//   "anomalies": ["...", "..."],
//   "probable_causes": ["...", "..."],
//   "revenue_impact": "...",
//   "recommended_action": "Continue|Pause|Stop Immediately",
//   "action_reason": "...",
//   "estimated_hours_to_decide": 24,
//   "alerts": [{"severity": "high|medium|low", "message": "..."}]
// }
// Return ONLY valid JSON, no markdown.`,
//   },
//   {
//     id: "chat",
//     name: "Copilot Chat",
//     icon: MessageSquare,
//     color: "from-indigo-400 to-violet-500",
//     desc: "Ask anything about A/B testing or optimization",
//     placeholder: "Describe your experiment or ask a question...",
//     systemPrompt: `You are ExperimentX's AI Copilot — an expert in A/B testing, experimentation, conversion optimization, and product analytics. 
// Be concise (under 120 words), practical, and actionable. Use bullet points when listing things.
// You have access to general knowledge about statistical testing, product experimentation best practices, and conversion optimization.`,
//   },
// ];

// // ── Renders structured JSON output beautifully ──────────────────────────────
// function StructuredOutput({ data, agentId, isDark }) {
//   const cardCls = `p-3 rounded-xl ${isDark ? "bg-white/[0.04] border border-white/[0.07]" : "bg-gray-50 border border-gray-200"}`;
//   const labelCls = `text-[10px] font-semibold uppercase tracking-wider mb-1.5 ${isDark ? "text-white/30" : "text-gray-400"}`;
//   const valueCls = `text-sm font-medium ${isDark ? "text-white/85" : "text-gray-800"}`;

//   if (agentId === "planner") {
//     return (
//       <div className="space-y-3">
//         <div className={cardCls}>
//           <p className={labelCls}>Experiment name</p>
//           <p className={valueCls}>{data.name}</p>
//         </div>
//         <div className={cardCls}>
//           <p className={labelCls}>Hypothesis</p>
//           <p className={`text-sm italic ${isDark ? "text-white/70" : "text-gray-600"}`}>{data.hypothesis}</p>
//         </div>
//         <div className="grid grid-cols-2 gap-3">
//           <div className={cardCls}>
//             <p className={labelCls}>Primary metric</p>
//             <p className={valueCls}>{data.primary_metric}</p>
//           </div>
//           <div className={cardCls}>
//             <p className={labelCls}>Risk level</p>
//             <p className={`text-sm font-medium ${data.risk_level === "Low" ? "text-emerald-500" : data.risk_level === "Medium" ? "text-amber-500" : "text-red-400"}`}>
//               {data.risk_level}
//             </p>
//           </div>
//           <div className={cardCls}>
//             <p className={labelCls}>Duration</p>
//             <p className={valueCls}>{data.estimated_duration_days} days</p>
//           </div>
//           <div className={cardCls}>
//             <p className={labelCls}>Traffic</p>
//             <p className={valueCls}>{data.recommended_traffic_pct}%</p>
//           </div>
//         </div>
//         <div className={cardCls}>
//           <p className={labelCls}>Variants</p>
//           <div className="flex gap-2">
//             {data.variants?.map((v) => (
//               <div key={v.label} className={`flex-1 p-2 rounded-lg ${isDark ? "bg-white/[0.04]" : "bg-white"} border ${isDark ? "border-white/[0.06]" : "border-gray-200"}`}>
//                 <span className={`text-xs font-bold ${v.label === "A" ? "text-brand-violet" : "text-brand-blue"}`}>Variant {v.label}</span>
//                 <p className={`text-xs mt-0.5 ${isDark ? "text-white/60" : "text-gray-600"}`}>{v.name}</p>
//                 <p className={`text-[10px] mt-0.5 ${isDark ? "text-white/30" : "text-gray-400"}`}>{v.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className={cardCls}>
//           <div className="flex items-center justify-between mb-1">
//             <p className={labelCls}>Confidence</p>
//             <span className="text-sm font-bold text-brand-violet">{data.confidence_score}%</span>
//           </div>
//           <div className={`h-1.5 rounded-full ${isDark ? "bg-white/[0.06]" : "bg-gray-100"}`}>
//             <div className="h-full rounded-full bg-gradient-to-r from-brand-violet to-brand-blue"
//               style={{ width: `${data.confidence_score}%` }} />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (agentId === "variant") {
//     return (
//       <div className="space-y-2">
//         <p className={labelCls}>Generated variants for: {data.element}</p>
//         {data.variants?.map((v) => (
//           <div key={v.label} className={`${cardCls} ${data.recommended === v.label ? "ring-1 ring-emerald-500/40" : ""}`}>
//             <div className="flex items-start justify-between gap-2">
//               <div className="flex-1">
//                 <div className="flex items-center gap-2 mb-1">
//                   <span className={`text-xs font-bold ${v.label === "A" ? "text-brand-violet" : v.label === "B" ? "text-brand-blue" : v.label === "C" ? "text-emerald-500" : v.label === "D" ? "text-amber-500" : "text-rose-500"}`}>
//                     {v.label}
//                   </span>
//                   <span className={`text-xs ${isDark ? "text-white/40" : "text-gray-500"}`}>{v.name}</span>
//                   {data.recommended === v.label && (
//                     <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">RECOMMENDED</span>
//                   )}
//                 </div>
//                 <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>"{v.copy}"</p>
//                 <p className={`text-xs mt-1 ${isDark ? "text-white/35" : "text-gray-500"}`}>{v.rationale}</p>
//               </div>
//               <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex-shrink-0">
//                 {v.predicted_lift}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (agentId === "reviewer") {
//     return (
//       <div className="space-y-3">
//         <div className="flex items-center gap-3">
//           <div className={`flex-1 flex items-center justify-between p-3 rounded-xl ${
//             data.ready_to_launch ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-400/10 border border-red-400/20"
//           }`}>
//             <span className={`text-sm font-bold flex items-center gap-2 ${data.ready_to_launch ? "text-emerald-500" : "text-red-400"}`}>
//               {data.ready_to_launch ? <CheckCircle size={18} /> : <XCircle size={18} />}
//               {data.ready_to_launch ? "Ready to launch" : "Not ready to launch"}
//             </span>
//             <span className="text-sm font-bold text-brand-violet">{data.confidence_score}%</span>
//           </div>
//         </div>
//         {data.passed?.length > 0 && (
//           <div className={cardCls}>
//             <p className={labelCls}>Passed checks</p>
//             {data.passed.map((p, i) => (
//               <p key={i} className="text-xs text-emerald-500 flex items-center gap-1.5 mt-1">
//                 <CheckCircle size={14} /> {p}
//               </p>
//             ))}
//           </div>
//         )}
//         {data.warnings?.length > 0 && (
//           <div className={cardCls}>
//             <p className={labelCls}>Warnings</p>
//             {data.warnings.map((w, i) => (
//               <p key={i} className="text-xs text-amber-500 flex items-center gap-1.5 mt-1">
//                 <TriangleAlert size={14} /> {w}
//               </p>
//             ))}
//           </div>
//         )}
//         {data.errors?.length > 0 && (
//           <div className={cardCls}>
//             <p className={labelCls}>Errors</p>
//             {data.errors.map((e, i) => (
//               <p key={i} className="text-xs text-red-400 flex items-center gap-1.5 mt-1">
//                 <XCircle size={14} /> {e}
//               </p>
//             ))}
//           </div>
//         )}
//         {data.suggestions?.length > 0 && (
//           <div className={cardCls}>
//             <p className={labelCls}>Suggestions</p>
//             {data.suggestions.map((s, i) => (
//               <p key={i} className={`text-xs mt-1 ${isDark ? "text-white/60" : "text-gray-600"}`}>→ {s}</p>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   }

//   if (agentId === "analyst") {
//     return (
//       <div className="space-y-3">
//         <div className={`p-4 rounded-xl ${
//           data.winner !== "None"
//             ? "bg-emerald-500/10 border border-emerald-500/20"
//             : isDark ? "bg-white/[0.04] border border-white/[0.07]" : "bg-gray-50 border border-gray-200"
//         }`}>
//           <div className="flex items-center justify-between mb-2">
//             <span className={`text-sm font-bold ${data.winner !== "None" ? "text-emerald-500" : isDark ? "text-white" : "text-gray-900"}`}>
//               {data.winner !== "None" ? `🏆 Variant ${data.winner} wins` : "No winner yet"}
//             </span>
//             <span className="text-sm font-medium text-brand-violet">{data.lift} lift</span>
//           </div>
//           <p className={`text-sm ${isDark ? "text-white/70" : "text-gray-700"}`}>{data.plain_english}</p>
//         </div>
//         <div className={cardCls}>
//           <p className={labelCls}>Recommendation</p>
//           <p className={`text-sm font-bold ${
//             data.recommendation === "Deploy" ? "text-emerald-500"
//               : data.recommendation === "Stop" ? "text-red-400"
//               : "text-amber-500"
//           }`}>{data.recommendation}</p>
//           <p className={`text-xs mt-1 ${isDark ? "text-white/40" : "text-gray-500"}`}>{data.recommendation_reason}</p>
//         </div>
//         {data.key_insights?.length > 0 && (
//           <div className={cardCls}>
//             <p className={labelCls}>Key insights</p>
//             {data.key_insights.map((insight, i) => (
//               <p key={i} className={`text-xs mt-1.5 flex items-start gap-1.5 ${isDark ? "text-white/65" : "text-gray-600"}`}>
//                 <span className="text-brand-violet mt-0.5">•</span> {insight}
//               </p>
//             ))}
//           </div>
//         )}
//         {data.next_experiment && (
//           <div className={cardCls}>
//             <p className={labelCls}>Next experiment to run</p>
//             <p className={`text-xs ${isDark ? "text-white/60" : "text-gray-600"}`}>{data.next_experiment}</p>
//           </div>
//         )}
//       </div>
//     );
//   }

//   if (agentId === "guardian") {
//     const statusColor = data.status === "Healthy" ? "text-emerald-500" : data.status === "Warning" ? "text-amber-500" : "text-red-400";
//     const statusBg = data.status === "Healthy" ? "bg-emerald-500/10 border-emerald-500/20" : data.status === "Warning" ? "bg-amber-500/10 border-amber-500/20" : "bg-red-400/10 border-red-400/20";
//     return (
//       <div className="space-y-3">
//         <div className={`p-3 rounded-xl border ${statusBg}`}>
//           <div className="flex items-center justify-between">
//             <span className={`text-sm font-bold flex items-center gap-2 ${statusColor}`}>
//               {data.status === "Healthy" ? <CheckCircle size={18} /> : data.status === "Warning" ? <TriangleAlert size={18} /> : <XCircle size={18} />}
//               {data.status}
//             </span>
//             <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
//               data.recommended_action === "Continue" ? "bg-emerald-500/10 text-emerald-500"
//                 : data.recommended_action === "Pause" ? "bg-amber-500/10 text-amber-500"
//                 : "bg-red-400/10 text-red-400"
//             }`}>{data.recommended_action}</span>
//           </div>
//           <p className={`text-xs mt-1 ${isDark ? "text-white/50" : "text-gray-500"}`}>{data.action_reason}</p>
//         </div>
//         {data.alerts?.length > 0 && (
//           <div className="space-y-2">
//             {data.alerts.map((a, i) => (
//               <div key={i} className={`px-3 py-2 rounded-lg text-xs flex items-start gap-2 ${
//                 a.severity === "high" ? "bg-red-400/10 text-red-400"
//                   : a.severity === "medium" ? "bg-amber-500/10 text-amber-500"
//                   : "bg-brand-blue/10 text-brand-blue"
//               }`}>
//                 <span className="font-bold uppercase">{a.severity}</span>
//                 <span>{a.message}</span>
//               </div>
//             ))}
//           </div>
//         )}
//         {data.revenue_impact && (
//           <div className={cardCls}>
//             <p className={labelCls}>Revenue impact</p>
//             <p className={`text-sm font-bold text-red-400`}>{data.revenue_impact}</p>
//           </div>
//         )}
//       </div>
//     );
//   }

//   return null;
// }

// // ── Chat message bubble ─────────────────────────────────────────────────────
// function ChatBubble({ msg, isDark }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 8 }}
//       animate={{ opacity: 1, y: 0 }}
//       className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-3`}
//     >
//       {msg.role === "assistant" && (
//         <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white mr-2 flex-shrink-0 mt-0.5">
//           <Sparkles size={14} />
//         </div>
//       )}
//       <div className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
//         msg.role === "user"
//           ? "bg-gradient-to-r from-brand-violet to-brand-blue text-white rounded-br-sm"
//           : isDark
//             ? "bg-white/[0.06] text-white/85 rounded-bl-sm"
//             : "bg-gray-100 text-gray-800 rounded-bl-sm"
//       }`}>
//         {msg.content}
//       </div>
//     </motion.div>
//   );
// }

// export default function AIInsights() {
//   const { theme } = useTheme();
//   const isDark = theme === "dark";
//   const [activeAgent, setActiveAgent] = useState(AGENTS[0]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState("");
//   const [chatMessages, setChatMessages] = useState([
//     { role: "assistant", content: "Hi! I'm your AI Copilot. Ask me anything about A/B testing, experiment strategy, or conversion optimization." }
//   ]);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     if (activeAgent.id === "chat") {
//       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [chatMessages, activeAgent.id]);

//   const callAI = async (messages) => {
//     const res = await fetch("https://api.anthropic.com/v1/messages", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         model: "claude-sonnet-4-6",
//         max_tokens: 1000,
//         system: activeAgent.systemPrompt,
//         messages,
//       }),
//     });
//     const data = await res.json();
//     return data.content?.[0]?.text || "";
//   };

//   const handleSubmit = async (e) => {
//     e?.preventDefault();
//     if (!input.trim() || loading) return;
//     const userInput = input.trim();
//     setInput("");
//     setError("");
//     setLoading(true);

//     if (activeAgent.id === "chat") {
//       const newMessages = [...chatMessages, { role: "user", content: userInput }];
//       setChatMessages(newMessages);
//       try {
//         const reply = await callAI(newMessages.map((m) => ({ role: m.role, content: m.content })));
//         setChatMessages((prev) => [...prev, { role: "assistant", content: reply }]);
//       } catch {
//         setChatMessages((prev) => [...prev, { role: "assistant", content: "Network error — please try again." }]);
//       }
//     } else {
//       setResult(null);
//       try {
//         const raw = await callAI([{ role: "user", content: userInput }]);
//         const cleaned = raw.replace(/```json|```/g, "").trim();
//         const parsed = JSON.parse(cleaned);
//         setResult(parsed);
//       } catch {
//         setError("AI response couldn't be parsed. Try rephrasing your input.");
//       }
//     }
//     setLoading(false);
//   };

//   const cardCls = `rounded-2xl border transition-colors ${
//     isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"
//   }`;

//   return (
//     <div className="space-y-5">
//       <div>
//         <h1 className={`text-xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
//           AI Copilot
//         </h1>
//         <p className={`text-sm mt-0.5 ${isDark ? "text-white/35" : "text-gray-500"}`}>
//           Experiment planning • Variant generation • Statistical analysis
//         </p>
//       </div>

//       {/* Agent selector – horizontal tabs with improved contrast */}
//       <div className="flex overflow-x-auto gap-1 pb-1 no-scrollbar">
//         {AGENTS.map((agent) => {
//           const Icon = agent.icon;
//           const isActive = activeAgent.id === agent.id;
//           return (
//             <button
//               key={agent.id}
//               onClick={() => { setActiveAgent(agent); setResult(null); setError(""); setInput(""); }}
//               className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
//                 isActive
//                   ? isDark
//                     ? "bg-brand-violet/20 text-brand-violet ring-1 ring-brand-violet/30"
//                     : "bg-brand-violet/10 text-brand-violet ring-1 ring-brand-violet/20"
//                   : isDark
//                     ? "text-white/60 hover:text-white hover:bg-white/[0.05]"
//                     : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
//               }`}
//             >
//               <Icon size={16} strokeWidth={1.5} />
//               {agent.name}
//             </button>
//           );
//         })}
//       </div>

//       {/* Active agent panel */}
//       <div className={cardCls}>
//         {/* Agent header */}
//         <div className={`flex items-center gap-3 px-5 py-4 border-b ${isDark ? "border-white/[0.06]" : "border-gray-100"}`}>
//           <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${activeAgent.color} flex items-center justify-center text-white`}>
//             {(() => {
//               const Icon = activeAgent.icon;
//               return <Icon size={18} />;
//             })()}
//           </div>
//           <div>
//             <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{activeAgent.name}</p>
//             <p className={`text-xs ${isDark ? "text-white/35" : "text-gray-400"}`}>{activeAgent.desc}</p>
//           </div>
//           {activeAgent.id !== "chat" && (
//             <div className={`ml-auto text-xs px-2.5 py-1 rounded-full ${isDark ? "bg-brand-violet/10 text-brand-violet" : "bg-brand-violet/5 text-brand-violet border border-brand-violet/20"}`}>
//               Structured Result
//             </div>
//           )}
//         </div>

//         {/* Chat mode */}
//         {activeAgent.id === "chat" ? (
//           <>
//             <div className="p-5 h-72 overflow-y-auto">
//               {chatMessages.map((msg, i) => (
//                 <ChatBubble key={i} msg={msg} isDark={isDark} />
//               ))}
//               <AnimatePresence>
//                 {loading && (
//                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex mb-3">
//                     <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white mr-2 flex-shrink-0">
//                       <Sparkles size={14} />
//                     </div>
//                     <div className={`px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center ${isDark ? "bg-white/[0.06]" : "bg-gray-100"}`}>
//                       {[0, 0.2, 0.4].map((d) => (
//                         <motion.div key={d} className="w-1.5 h-1.5 rounded-full bg-brand-violet"
//                           animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d }} />
//                       ))}
//                       <span className="ml-2 text-xs text-brand-violet">Analyzing…</span>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//               <div ref={messagesEndRef} />
//             </div>
//             <div className={`px-5 pb-4 pt-3 border-t ${isDark ? "border-white/[0.05]" : "border-gray-100"}`}>
//               <form onSubmit={handleSubmit} className="flex gap-2">
//                 <input value={input} onChange={(e) => setInput(e.target.value)}
//                   placeholder={activeAgent.placeholder}
//                   className={`flex-1 px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-brand-violet/25 ${
//                     isDark ? "bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25" : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
//                   }`} />
//                 <button type="submit" disabled={!input.trim() || loading}
//                   className="px-4 py-2.5 rounded-xl text-sm text-white font-medium bg-gradient-to-r from-brand-violet to-brand-blue disabled:opacity-40 hover:opacity-90 transition-opacity">
//                   Send
//                 </button>
//               </form>
//             </div>
//           </>
//         ) : (
//           /* Structured agent mode */
//           <div className="p-5 space-y-4">
//             <form onSubmit={handleSubmit} className="flex gap-2">
//               <input value={input} onChange={(e) => setInput(e.target.value)}
//                 placeholder={activeAgent.placeholder}
//                 className={`flex-1 px-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-brand-violet/25 ${
//                   isDark ? "bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25" : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
//                 }`} />
//               <button type="submit" disabled={!input.trim() || loading}
//                 className={`px-5 py-3 rounded-xl text-sm text-white font-medium bg-gradient-to-r ${activeAgent.color} disabled:opacity-40 hover:opacity-90 transition-opacity flex items-center gap-2`}>
//                 {loading ? (
//                   <motion.div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent"
//                     animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
//                 ) : (
//                   (() => {
//                     const Icon = activeAgent.icon;
//                     return <Icon size={18} />;
//                   })()
//                 )}
//                 {loading ? "Analyzing…" : "Run"}
//               </button>
//             </form>

//             {error && (
//               <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
//                 className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-lg">
//                 {error}
//               </motion.p>
//             )}

//             <AnimatePresence>
//               {result && (
//                 <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
//                   <div className={`text-xs font-medium mb-2 ${isDark ? "text-white/30" : "text-gray-400"}`}>
//                     Structured Result — {activeAgent.name}
//                   </div>
//                   <StructuredOutput data={result} agentId={activeAgent.id} isDark={isDark} />
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {!result && !loading && (
//               <div className={`text-center py-8 ${isDark ? "text-white/15" : "text-gray-300"}`}>
//                 {(() => {
//                   const Icon = activeAgent.icon;
//                   return <Icon size={32} className="mx-auto mb-2 opacity-40" />;
//                 })()}
//                 <p className="text-xs">Enter your query above to run this agent</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Capability cards with explicit icon colors */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {[
//           { icon: Brain, title: "Plan experiments from a goal", desc: "Type a business goal — AI generates a complete experiment plan with hypothesis, metrics, variants, and duration." },
//           { icon: PenSquare, title: "Generate 5 variant copies instantly", desc: "Paste your element (headline, CTA, form) and get 5 optimized variants with predicted lift for each." },
//           { icon: SearchCheck, title: "Pre-launch experiment review", desc: "Paste your experiment config — AI checks for weak hypotheses, short durations, and missing guardrails." },
//           { icon: BarChart3, title: "Explain results in plain English", desc: "Paste your stats — AI explains significance, declares a winner, and recommends what to do next." },
//         ].map((card) => {
//           const Icon = card.icon;
//           return (
//             <div key={card.title} className={`flex items-start gap-3 p-4 rounded-xl border ${
//               isDark ? "bg-white/[0.02] border-white/[0.06]" : "bg-white border-gray-200"
//             }`}>
//               <Icon size={20} className={`flex-shrink-0 mt-0.5 ${isDark ? "text-white/70" : "text-gray-700"}`} strokeWidth={1.5} />
//               <div>
//                 <p className={`text-sm font-medium ${isDark ? "text-white/80" : "text-gray-800"}`}>{card.title}</p>
//                 <p className={`text-xs mt-0.5 ${isDark ? "text-white/30" : "text-gray-400"}`}>{card.desc}</p>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }









































// import { useState, useRef, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useTheme } from "../../context/ThemeContext";
// import api from "../../services/api";

// const AGENTS = [
//   {
//     id: "planner", name: "Experiment Planner", icon: "🧠",
//     color: "from-purple-500 to-brand-violet",
//     desc: "Turns a business goal into a complete experiment plan",
//     placeholder: "e.g. I want to increase checkout conversions on my pricing page",
//     endpoint: "/ai/plan-experiment",
//     bodyKey: "goal",
//   },
//   {
//     id: "variant", name: "Variant Generator", icon: "✍️",
//     color: "from-brand-blue to-cyan-500",
//     desc: "Generates optimized copy variants for any element",
//     placeholder: "e.g. Generate 5 CTA button variants for a SaaS pricing page",
//     endpoint: "/ai/generate-variants",
//     bodyKey: "element",
//   },
//   {
//     id: "reviewer", name: "Experiment Reviewer", icon: "🔍",
//     color: "from-emerald-500 to-teal-500",
//     desc: "Reviews your experiment config before you launch",
//     placeholder: "e.g. Homepage headline test, goal: signup, 14 days, 50% traffic",
//     endpoint: "/ai/review-experiment",
//     bodyKey: "name",
//   },
//   {
//     id: "analyst", name: "Analytics Interpreter", icon: "📊",
//     color: "from-amber-500 to-orange-500",
//     desc: "Explains your real experiment results in plain English",
//     placeholder: "Select an experiment below to interpret its real results",
//     endpoint: "/ai/interpret-results",
//     bodyKey: "experiment_id",
//   },
//   {
//     id: "report", name: "Report Generator", icon: "📄",
//     color: "from-rose-500 to-pink-500",
//     desc: "Writes a full professional report from your real data",
//     placeholder: "Select an experiment below to generate its report",
//     endpoint: "/ai/generate-report",
//     bodyKey: "experiment_id",
//   },
//   {
//     id: "chat", name: "AI Copilot Chat", icon: "💬",
//     color: "from-fuchsia-500 to-brand-violet",
//     desc: "Ask anything about A/B testing or optimization",
//     placeholder: "Ask me anything about your experiments...",
//     endpoint: "/ai/chat",
//     bodyKey: "message",
//   },
// ];

// function StructuredResult({ data, agentId, isDark }) {
//   const card = `p-3 rounded-xl border mb-3 ${isDark ? "bg-white/[0.04] border-white/[0.08]" : "bg-gray-50 border-gray-200"}`;
//   const label = `text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isDark ? "text-white/30" : "text-gray-400"}`;
//   const val = `text-sm font-medium ${isDark ? "text-white/80" : "text-gray-800"}`;

//   if (agentId === "planner") return (
//     <div className="space-y-3">
//       <div className={card}><p className={label}>Experiment name</p><p className={val}>{data.name}</p></div>
//       <div className={card}><p className={label}>Hypothesis</p><p className={`text-sm italic ${isDark ? "text-white/65" : "text-gray-600"}`}>{data.hypothesis}</p></div>
//       <div className="grid grid-cols-2 gap-2">
//         {[["Primary metric", data.primary_metric], ["Risk", data.risk_level], ["Duration", `${data.estimated_duration_days} days`], ["Traffic", `${data.recommended_traffic_pct}%`]].map(([k, v]) => (
//           <div key={k} className={card}><p className={label}>{k}</p><p className={val}>{v}</p></div>
//         ))}
//       </div>
//       <div className={card}>
//         <p className={label}>Variants</p>
//         <div className="flex gap-2">
//           {data.variants?.map((v) => (
//             <div key={v.label} className={`flex-1 p-2 rounded-lg ${isDark ? "bg-white/[0.04]" : "bg-white border border-gray-200"}`}>
//               <span className={`text-xs font-bold ${v.label === "A" ? "text-brand-violet" : "text-brand-blue"}`}>Variant {v.label}</span>
//               <p className={`text-xs mt-0.5 ${isDark ? "text-white/55" : "text-gray-600"}`}>{v.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className={card}>
//         <div className="flex justify-between mb-1"><p className={label}>AI confidence</p><span className="text-sm font-bold text-brand-violet">{data.confidence_score}%</span></div>
//         <div className={`h-1.5 rounded-full ${isDark ? "bg-white/10" : "bg-gray-200"}`}>
//           <div className="h-full rounded-full bg-gradient-to-r from-brand-violet to-brand-blue" style={{width:`${data.confidence_score}%`}} />
//         </div>
//       </div>
//     </div>
//   );

//   if (agentId === "variant") return (
//     <div className="space-y-2">
//       {data.variants?.map((v) => (
//         <div key={v.label} className={`${card} flex items-start justify-between gap-3`}>
//           <div className="flex-1">
//             <div className="flex items-center gap-2 mb-1">
//               <span className={`text-xs font-bold ${v.label === "A" ? "text-brand-violet" : v.label === "B" ? "text-brand-blue" : "text-emerald-500"}`}>{v.label}</span>
//               <span className={`text-xs ${isDark ? "text-white/35" : "text-gray-400"}`}>{v.name}</span>
//               {data.recommended === v.label && <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">RECOMMENDED</span>}
//             </div>
//             <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>"{v.copy}"</p>
//             <p className={`text-xs mt-1 ${isDark ? "text-white/35" : "text-gray-500"}`}>{v.rationale}</p>
//           </div>
//           <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex-shrink-0">{v.predicted_lift}</span>
//         </div>
//       ))}
//     </div>
//   );

//   if (agentId === "reviewer") return (
//     <div className="space-y-3">
//       <div className={`flex items-center justify-between p-3 rounded-xl border ${data.ready_to_launch ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-400/10 border-red-400/20"}`}>
//         <span className={`text-sm font-bold ${data.ready_to_launch ? "text-emerald-500" : "text-red-400"}`}>{data.ready_to_launch ? "✓ Ready to launch" : "✗ Not ready"}</span>
//         <span className="text-sm font-bold text-brand-violet">{data.confidence_score}%</span>
//       </div>
//       {data.passed?.length > 0 && <div className={card}><p className={label}>Passed</p>{data.passed.map((p,i)=><p key={i} className="text-xs text-emerald-500 mt-1">✓ {p}</p>)}</div>}
//       {data.warnings?.length > 0 && <div className={card}><p className={label}>Warnings</p>{data.warnings.map((w,i)=><p key={i} className="text-xs text-amber-500 mt-1">⚠ {w}</p>)}</div>}
//       {data.errors?.length > 0 && <div className={card}><p className={label}>Errors</p>{data.errors.map((e,i)=><p key={i} className="text-xs text-red-400 mt-1">✗ {e}</p>)}</div>}
//       {data.suggestions?.length > 0 && <div className={card}><p className={label}>Suggestions</p>{data.suggestions.map((s,i)=><p key={i} className={`text-xs mt-1 ${isDark?"text-white/55":"text-gray-600"}`}>→ {s}</p>)}</div>}
//     </div>
//   );

//   if (agentId === "analyst") return (
//     <div className="space-y-3">
//       <div className={`p-4 rounded-xl ${data.winner !== "None" ? "bg-emerald-500/10 border border-emerald-500/20" : card}`}>
//         <div className="flex justify-between mb-2">
//           <span className={`text-sm font-bold ${data.winner !== "None" ? "text-emerald-500" : isDark ? "text-white" : "text-gray-900"}`}>
//             {data.winner !== "None" ? `🏆 Variant ${data.winner} wins` : "No winner yet"}
//           </span>
//           <span className="text-sm font-medium text-brand-violet">{data.lift}</span>
//         </div>
//         <p className={`text-sm ${isDark ? "text-white/65" : "text-gray-700"}`}>{data.plain_english}</p>
//       </div>
//       <div className={card}><p className={label}>Recommendation</p>
//         <p className={`text-sm font-bold ${data.recommendation === "Deploy" ? "text-emerald-500" : data.recommendation === "Stop" ? "text-red-400" : "text-amber-500"}`}>{data.recommendation}</p>
//         <p className={`text-xs mt-1 ${isDark ? "text-white/35" : "text-gray-500"}`}>{data.recommendation_reason}</p>
//       </div>
//       {data.key_insights?.length > 0 && (
//         <div className={card}><p className={label}>Key insights</p>
//           {data.key_insights.map((ins,i) => <p key={i} className={`text-xs mt-1.5 ${isDark ? "text-white/60" : "text-gray-600"}`}>• {ins}</p>)}
//         </div>
//       )}
//     </div>
//   );

//   if (agentId === "report") return (
//     <div className={card}>
//       <p className={label}>Generated report — {data.experiment_name}</p>
//       <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isDark ? "text-white/70" : "text-gray-700"}`}>{data.report}</p>
//     </div>
//   );

//   return null;
// }

// export default function AIInsights() {
//   const { theme } = useTheme();
//   const isDark = theme === "dark";
//   const [activeAgent, setActiveAgent] = useState(AGENTS[0]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState("");
//   const [experiments, setExperiments] = useState([]);
//   const [selectedExpId, setSelectedExpId] = useState("");
//   const [chatMessages, setChatMessages] = useState([
//     { role: "assistant", content: "Hi! I'm your AI Copilot running on Llama 3.1 70B. Ask me anything about A/B testing, experiment strategy, or conversion optimization." }
//   ]);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     api.get("/experiments/").then(r => {
//       setExperiments(r.data);
//       if (r.data.length > 0) setSelectedExpId(r.data[0].id);
//     }).catch(() => {});
//   }, []);

//   useEffect(() => {
//     if (activeAgent.id === "chat") {
//       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [chatMessages, activeAgent.id]);

//   const handleSubmit = async (e) => {
//     e?.preventDefault();
//     const needsExpId = activeAgent.id === "analyst" || activeAgent.id === "report";
//     const value = needsExpId ? selectedExpId : input.trim();
//     if (!value || loading) return;

//     setError(""); setResult(null); setLoading(true);

//     if (activeAgent.id === "chat") {
//       const newMessages = [...chatMessages, { role: "user", content: input }];
//       setChatMessages(newMessages);
//       setInput("");
//       try {
//         const res = await api.post("/ai/chat", {
//           message: input,
//           history: chatMessages.filter(m => m.role !== "system"),
//         });
//         setChatMessages(prev => [...prev, { role: "assistant", content: res.data.reply }]);
//       } catch {
//         setChatMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
//       }
//     } else {
//       const body = needsExpId
//         ? { experiment_id: value }
//         : activeAgent.id === "reviewer"
//           ? { name: input, goal: "conversion", duration_days: 14, traffic_pct: 50, variants: [{ label: "A" }, { label: "B" }] }
//           : activeAgent.id === "variant"
//             ? { element: input, count: 5 }
//             : { [activeAgent.bodyKey]: input };

//       try {
//         const res = await api.post(activeAgent.endpoint, body);
//         setResult(res.data);
//         if (!needsExpId) setInput("");
//       } catch (err) {
//         const detail = err.response?.data?.detail;
//         setError(Array.isArray(detail) ? detail.map(d => d.msg).join(", ") : detail || "AI request failed — check your Groq API key in .env");
//       }
//     }
//     setLoading(false);
//   };

//   const cardCls = `rounded-2xl border transition-colors ${isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"}`;
//   const inputCls = `flex-1 px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-brand-violet/25 ${isDark ? "bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25" : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"}`;
//   const needsExpId = activeAgent.id === "analyst" || activeAgent.id === "report";

//   return (
//     <div className="space-y-5">
//       <div>
//         <h1 className={`text-xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>AI Copilot</h1>
//         <p className={`text-sm mt-0.5 ${isDark ? "text-white/35" : "text-gray-500"}`}>
//           Powered by Llama 3.1 70B via Groq — free, fast, private
//         </p>
//       </div>

//       {/* Agent selector */}
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
//         {AGENTS.map((agent) => (
//           <button
//             key={agent.id}
//             onClick={() => { setActiveAgent(agent); setResult(null); setError(""); setInput(""); }}
//             className={`p-3 rounded-xl border text-left transition-all ${
//               activeAgent.id === agent.id
//                 ? isDark ? "bg-brand-violet/10 border-brand-violet/30" : "bg-brand-violet/5 border-brand-violet/20"
//                 : isDark ? "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]" : "bg-white border-gray-200 hover:border-gray-300"
//             }`}
//           >
//             <span className="text-lg block mb-1">{agent.icon}</span>
//             <p className={`text-xs font-medium leading-tight ${isDark ? "text-white/70" : "text-gray-700"}`}>{agent.name}</p>
//           </button>
//         ))}
//       </div>

//       {/* Active agent */}
//       <div className={cardCls}>
//         <div className={`flex items-center gap-3 px-5 py-4 border-b ${isDark ? "border-white/[0.06]" : "border-gray-100"}`}>
//           <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${activeAgent.color} flex items-center justify-center text-lg`}>
//             {activeAgent.icon}
//           </div>
//           <div>
//             <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{activeAgent.name}</p>
//             <p className={`text-xs ${isDark ? "text-white/35" : "text-gray-400"}`}>{activeAgent.desc}</p>
//           </div>
//           <div className={`ml-auto text-xs px-2.5 py-1 rounded-full ${isDark ? "bg-emerald-500/10 text-emerald-500" : "bg-emerald-50 text-emerald-600 border border-emerald-200"}`}>
//             Free • Llama 3.1 70B
//           </div>
//         </div>

//         {/* Chat mode */}
//         {activeAgent.id === "chat" ? (
//           <>
//             <div className="p-5 h-72 overflow-y-auto space-y-3">
//               {chatMessages.map((msg, i) => (
//                 <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
//                   className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
//                   {msg.role === "assistant" && (
//                     <div className="w-7 h-7 rounded-full bg-gradient-to-br from-fuchsia-500 to-brand-violet flex items-center justify-center text-white text-[10px] font-bold mr-2 flex-shrink-0 mt-0.5">AI</div>
//                   )}
//                   <div className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
//                     msg.role === "user"
//                       ? "bg-gradient-to-r from-brand-violet to-brand-blue text-white rounded-br-sm"
//                       : isDark ? "bg-white/[0.06] text-white/85 rounded-bl-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"
//                   }`}>{msg.content}</div>
//                 </motion.div>
//               ))}
//               <AnimatePresence>
//                 {loading && (
//                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex">
//                     <div className="w-7 h-7 rounded-full bg-gradient-to-br from-fuchsia-500 to-brand-violet flex items-center justify-center text-white text-[10px] font-bold mr-2 flex-shrink-0">AI</div>
//                     <div className={`px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center ${isDark ? "bg-white/[0.06]" : "bg-gray-100"}`}>
//                       {[0, 0.2, 0.4].map((d) => (
//                         <motion.div key={d} className="w-1.5 h-1.5 rounded-full bg-brand-violet"
//                           animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d }} />
//                       ))}
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//               <div ref={messagesEndRef} />
//             </div>
//             <div className={`px-5 pb-4 pt-3 border-t ${isDark ? "border-white/[0.05]" : "border-gray-100"}`}>
//               <form onSubmit={handleSubmit} className="flex gap-2">
//                 <input value={input} onChange={e => setInput(e.target.value)} placeholder={activeAgent.placeholder} className={inputCls} />
//                 <button type="submit" disabled={!input.trim() || loading}
//                   className="px-4 py-2.5 rounded-xl text-sm text-white font-medium bg-gradient-to-r from-brand-violet to-brand-blue disabled:opacity-40 hover:opacity-90 transition-opacity">
//                   Send
//                 </button>
//               </form>
//             </div>
//           </>
//         ) : (
//           <div className="p-5 space-y-4">
//             {needsExpId ? (
//               <div>
//                 <label className={`block text-xs font-medium mb-1.5 ${isDark ? "text-white/45" : "text-gray-600"}`}>
//                   Select experiment to analyze
//                 </label>
//                 <select
//                   value={selectedExpId}
//                   onChange={e => setSelectedExpId(e.target.value)}
//                   className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-brand-violet/25 ${
//                     isDark ? "bg-white/[0.04] border-white/[0.08] text-white" : "bg-white border-gray-200 text-gray-900"
//                   }`}
//                 >
//                   {experiments.length === 0
//                     ? <option>No experiments yet — create one first</option>
//                     : experiments.map(e => <option key={e.id} value={e.id}>{e.name}</option>)
//                   }
//                 </select>
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit} className="flex gap-2">
//                 <input value={input} onChange={e => setInput(e.target.value)} placeholder={activeAgent.placeholder} className={inputCls} />
//                 <button type="submit" disabled={!input.trim() || loading}
//                   className={`px-5 py-2.5 rounded-xl text-sm text-white font-medium bg-gradient-to-br ${activeAgent.color} disabled:opacity-40 hover:opacity-90 transition-opacity flex items-center gap-2`}>
//                   {loading ? (
//                     <motion.div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent"
//                       animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
//                   ) : activeAgent.icon}
//                   {loading ? "Thinking…" : "Run"}
//                 </button>
//               </form>
//             )}

//             {needsExpId && (
//               <button onClick={handleSubmit} disabled={!selectedExpId || loading || experiments.length === 0}
//                 className={`w-full py-2.5 rounded-xl text-sm text-white font-medium bg-gradient-to-br ${activeAgent.color} disabled:opacity-40 hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}>
//                 {loading ? (
//                   <motion.div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent"
//                     animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} />
//                 ) : activeAgent.icon}
//                 {loading ? "Analyzing real data…" : activeAgent.id === "report" ? "Generate Report" : "Interpret Results"}
//               </button>
//             )}

//             {error && (
//               <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
//                 className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2.5 rounded-xl">
//                 {error}
//               </motion.p>
//             )}

//             <AnimatePresence>
//               {result && (
//                 <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
//                   <p className={`text-xs font-medium mb-2 ${isDark ? "text-white/30" : "text-gray-400"}`}>
//                     {activeAgent.name} — result
//                   </p>
//                   <StructuredResult data={result} agentId={activeAgent.id} isDark={isDark} />
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {!result && !loading && (
//               <div className={`text-center py-8 ${isDark ? "text-white/15" : "text-gray-300"}`}>
//                 <p className="text-3xl mb-2">{activeAgent.icon}</p>
//                 <p className="text-xs">{needsExpId ? "Select an experiment above and click Run" : "Enter your query above to run this agent"}</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }















































import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Pen,
  Search,
  BarChart,
  FileText,
  MessageSquare,
  Trophy,
  Sparkles,
  Send,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  Target,
  Users,
  AlertCircle,
  Zap,
  Activity,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import api from "../../services/api";

const AGENTS = [
  {
    id: "planner",
    name: "Experiment Planner",
    icon: Brain,
    color: "from-purple-500 to-brand-violet",
    desc: "Turns a business goal into a complete experiment plan",
    placeholder: "e.g. I want to increase checkout conversions on my pricing page",
    endpoint: "/ai/plan-experiment",
    bodyKey: "goal",
  },
  {
    id: "variant",
    name: "Variant Generator",
    icon: Pen,
    color: "from-brand-blue to-cyan-500",
    desc: "Generates optimized copy variants for any element",
    placeholder: "e.g. Generate 5 CTA button variants for a SaaS pricing page",
    endpoint: "/ai/generate-variants",
    bodyKey: "element",
  },
  {
    id: "reviewer",
    name: "Experiment Reviewer",
    icon: Search,
    color: "from-emerald-500 to-teal-500",
    desc: "Reviews your experiment config before you launch",
    placeholder: "e.g. Homepage headline test, goal: signup, 14 days, 50% traffic",
    endpoint: "/ai/review-experiment",
    bodyKey: "name",
  },
  {
    id: "analyst",
    name: "Analytics Interpreter",
    icon: BarChart,
    color: "from-amber-500 to-orange-500",
    desc: "Explains your real experiment results in plain English",
    placeholder: "Select an experiment below to interpret its real results",
    endpoint: "/ai/interpret-results",
    bodyKey: "experiment_id",
  },
  {
    id: "report",
    name: "Report Generator",
    icon: FileText,
    color: "from-rose-500 to-pink-500",
    desc: "Writes a full professional report from your real data",
    placeholder: "Select an experiment below to generate its report",
    endpoint: "/ai/generate-report",
    bodyKey: "experiment_id",
  },
  {
    id: "chat",
    name: "AI Copilot Chat",
    icon: MessageSquare,
    color: "from-fuchsia-500 to-brand-violet",
    desc: "Ask anything about A/B testing or optimization",
    placeholder: "Ask me anything about your experiments...",
    endpoint: "/ai/chat",
    bodyKey: "message",
  },
];

const EXAMPLE_PROMPTS = [
  "Increase checkout conversion",
  "Generate CTA variants",
  "Review my pricing page experiment",
  "Explain why Variant B won",
];

// Typing effect hook
const useTyping = (text, speed = 20) => {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text.charAt(index));
        setIndex(index + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);

  useEffect(() => {
    setDisplayText("");
    setIndex(0);
  }, [text]);

  return displayText;
};

// Metric card component – icons are in circles
function MetricCard({ label, value, icon: Icon, color, subtext, progress }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border bg-white/5 border-white/10 backdrop-blur-sm flex-1 min-w-[100px]">
      <div className={`p-2 rounded-full bg-gradient-to-br ${color} text-white shadow-lg`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">{label}</p>
        <p className="text-sm font-semibold text-white/90">{value}</p>
        {subtext && <p className="text-[10px] text-white/30 mt-0.5">{subtext}</p>}
        {progress !== undefined && (
          <div className="h-1 w-full bg-white/10 rounded-full mt-1">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-violet to-brand-blue" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}

function StructuredResult({ data, agentId, isDark }) {
  const [expanded, setExpanded] = useState(true);
  const toggleExpand = () => setExpanded(!expanded);

  const cardBase = `p-3 rounded-xl border mb-3 transition-all ${
    isDark
      ? "bg-white/5 border-white/10 backdrop-blur-sm"
      : "bg-white/80 border-gray-200/80 backdrop-blur-sm shadow-sm"
  }`;
  const label = `text-[10px] font-bold uppercase tracking-wider mb-1.5 ${
    isDark ? "text-white/30" : "text-gray-400"
  }`;
  const val = `text-sm font-medium ${isDark ? "text-white/80" : "text-gray-800"}`;

  if (agentId === "planner") {
    const steps = [
      { icon: Target, label: "Goal", value: data.name },
      { icon: Brain, label: "Hypothesis", value: data.hypothesis },
      { icon: Users, label: "Variants", value: data.variants?.map(v => v.label).join(", ") },
      { icon: BarChart, label: "Primary Metric", value: data.primary_metric },
      { icon: Clock, label: "Duration", value: `${data.estimated_duration_days} days` },
      { icon: Activity, label: "Traffic", value: `${data.recommended_traffic_pct}%` },
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex justify-between items-center">
          <p className="text-xs font-medium text-white/30">Workflow</p>
          <button onClick={toggleExpand} className="p-1 rounded hover:bg-white/10">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 overflow-hidden"
            >
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-violet to-brand-blue flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/30">{step.label}</p>
                    <p className={`text-sm font-medium ${isDark ? "text-white/80" : "text-gray-800"}`}>{step.value}</p>
                  </div>
                </div>
              ))}
              <div className="mt-2 p-3 rounded-xl border border-white/10 bg-white/5">
                <div className="flex justify-between mb-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/30">Confidence</p>
                  <span className="text-sm font-bold text-brand-violet">{data.confidence_score}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-violet to-brand-blue" style={{ width: `${data.confidence_score}%` }} />
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-brand-violet to-brand-blue text-white shadow-lg hover:shadow-xl transition-shadow"
              >
                Create Experiment →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  if (agentId === "variant") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        {data.variants?.map((v, idx) => (
          <motion.div
            key={v.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`${cardBase} flex items-start justify-between gap-3`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs font-bold ${
                    v.label === "A"
                      ? "text-brand-violet"
                      : v.label === "B"
                      ? "text-brand-blue"
                      : "text-emerald-500"
                  }`}
                >
                  {v.label}
                </span>
                <span className={`text-xs ${isDark ? "text-white/35" : "text-gray-400"}`}>
                  {v.name}
                </span>
                {data.recommended === v.label && (
                  <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                    RECOMMENDED
                  </span>
                )}
              </div>
              <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                "{v.copy}"
              </p>
              <p className={`text-xs mt-1 ${isDark ? "text-white/35" : "text-gray-500"}`}>
                {v.rationale}
              </p>
            </div>
            <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex-shrink-0">
              {v.predicted_lift}
            </span>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (agentId === "reviewer") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <div
          className={`flex items-center justify-between p-3 rounded-xl border ${
            data.ready_to_launch
              ? "bg-emerald-500/10 border-emerald-500/20"
              : "bg-red-400/10 border-red-400/20"
          }`}
        >
          <span
            className={`text-sm font-bold ${
              data.ready_to_launch ? "text-emerald-500" : "text-red-400"
            }`}
          >
            {data.ready_to_launch ? (
              <><CheckCircle size={16} className="inline mr-1" /> Ready to launch</>
            ) : (
              <><AlertCircle size={16} className="inline mr-1" /> Not ready</>
            )}
          </span>
          <span className="text-sm font-bold text-brand-violet">
            {data.confidence_score}% confidence
          </span>
        </div>
        {data.passed?.length > 0 && (
          <div className={cardBase}>
            <p className={label}>Passed</p>
            {data.passed.map((p, i) => (
              <p key={i} className="text-xs text-emerald-500 mt-1">
                <CheckCircle size={12} className="inline mr-1" /> {p}
              </p>
            ))}
          </div>
        )}
        {data.warnings?.length > 0 && (
          <div className={cardBase}>
            <p className={label}>Warnings</p>
            {data.warnings.map((w, i) => (
              <p key={i} className="text-xs text-amber-500 mt-1">
                <AlertCircle size={12} className="inline mr-1" /> {w}
              </p>
            ))}
          </div>
        )}
        {data.errors?.length > 0 && (
          <div className={cardBase}>
            <p className={label}>Errors</p>
            {data.errors.map((e, i) => (
              <p key={i} className="text-xs text-red-400 mt-1">
                ✗ {e}
              </p>
            ))}
          </div>
        )}
        {data.suggestions?.length > 0 && (
          <div className={cardBase}>
            <p className={label}>Suggestions</p>
            {data.suggestions.map((s, i) => (
              <p
                key={i}
                className={`text-xs mt-1 ${isDark ? "text-white/55" : "text-gray-600"}`}
              >
                → {s}
              </p>
            ))}
          </div>
        )}
      </motion.div>
    );
  }

  if (agentId === "analyst") {
    const metrics = [
      { label: "Winner", value: data.winner !== "None" ? `Variant ${data.winner}` : "None", icon: Trophy, color: "from-emerald-500 to-teal-500" },
      { label: "Lift", value: data.lift, icon: Zap, color: "from-amber-500 to-orange-500" },
      { label: "Confidence", value: "96%", icon: Activity, color: "from-brand-violet to-brand-blue", progress: 96 },
      { label: "Recommendation", value: data.recommendation, icon: Target, color: data.recommendation === "Deploy" ? "from-emerald-500 to-teal-500" : "from-rose-500 to-pink-500" },
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <div className="grid grid-cols-2 gap-2">
          {metrics.map((m, idx) => (
            <MetricCard
              key={idx}
              label={m.label}
              value={m.value}
              icon={m.icon}
              color={m.color}
              progress={m.progress}
              subtext={m.label === "Recommendation" ? data.recommendation_reason : undefined}
            />
          ))}
        </div>
        <div className={cardBase}>
          <p className={label}>Plain English</p>
          <p className={`text-sm ${isDark ? "text-white/65" : "text-gray-700"}`}>
            {data.plain_english}
          </p>
        </div>
        {data.key_insights?.length > 0 && (
          <div className={cardBase}>
            <p className={label}>Key Insights</p>
            {data.key_insights.map((ins, i) => (
              <p key={i} className={`text-xs mt-1.5 ${isDark ? "text-white/60" : "text-gray-600"}`}>
                • {ins}
              </p>
            ))}
          </div>
        )}
      </motion.div>
    );
  }

  if (agentId === "report") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cardBase}
      >
        <p className={label}>Generated report — {data.experiment_name}</p>
        <p
          className={`text-sm leading-relaxed whitespace-pre-wrap ${
            isDark ? "text-white/70" : "text-gray-700"
          }`}
        >
          {data.report}
        </p>
      </motion.div>
    );
  }

  return null;
}

export default function AIInsights() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeAgent, setActiveAgent] = useState(AGENTS[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [experiments, setExperiments] = useState([]);
  const [selectedExpId, setSelectedExpId] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI Copilot running on openai/gpt-oss-120b. Ask me anything about A/B testing, experiment strategy, or conversion optimization.",
    },
  ]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    api
      .get("/experiments/")
      .then((r) => {
        setExperiments(r.data);
        if (r.data.length > 0) setSelectedExpId(r.data[0].id);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (activeAgent.id === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, activeAgent.id]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const needsExpId = activeAgent.id === "analyst" || activeAgent.id === "report";
    const value = needsExpId ? selectedExpId : input.trim();
    if (!value || loading) return;

    setError("");
    setResult(null);
    setLoading(true);

    if (activeAgent.id === "chat") {
      const newMessages = [...chatMessages, { role: "user", content: input }];
      setChatMessages(newMessages);
      setInput("");
      try {
        const res = await api.post("/ai/chat", {
          message: input,
          history: chatMessages.filter((m) => m.role !== "system"),
        });
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: res.data.reply },
        ]);
      } catch {
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Something went wrong. Please try again." },
        ]);
      }
    } else {
      const body = needsExpId
        ? { experiment_id: value }
        : activeAgent.id === "reviewer"
        ? {
            name: input,
            goal: "conversion",
            duration_days: 14,
            traffic_pct: 50,
            variants: [{ label: "A" }, { label: "B" }],
          }
        : activeAgent.id === "variant"
        ? { element: input, count: 5 }
        : { [activeAgent.bodyKey]: input };

      try {
        const res = await api.post(activeAgent.endpoint, body);
        setResult(res.data);
        if (!needsExpId) setInput("");
      } catch (err) {
        const detail = err.response?.data?.detail;
        setError(
          Array.isArray(detail)
            ? detail.map((d) => d.msg).join(", ")
            : detail || "AI request failed — check your API key"
        );
      }
    }
    setLoading(false);
  };

  const handleExampleClick = (prompt) => {
    setInput(prompt);
    if (inputRef.current) inputRef.current.focus();
  };

  const cardCls = `rounded-2xl border transition-all ${
    isDark
      ? "bg-[#0D0E1A]/80 border-white/10 backdrop-blur-xl shadow-2xl"
      : "bg-white/80 border-gray-200/80 backdrop-blur-xl shadow-2xl"
  }`;
  const inputCls = `flex-1 px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-brand-violet/25 transition-shadow ${
    isDark
      ? "bg-white/5 border-white/10 text-white placeholder:text-white/25"
      : "bg-gray-50/80 border-gray-200/80 text-gray-900 placeholder:text-gray-400"
  }`;
  const needsExpId = activeAgent.id === "analyst" || activeAgent.id === "report";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-2xl font-display font-bold flex items-center gap-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            <Sparkles size={28} className="text-brand-violet" />
            ExperimentX AI Copilot
          </h1>
          <p className={`text-sm mt-0.5 ${isDark ? "text-white/35" : "text-gray-500"}`}>
            Plan · Generate · Review · Analyze · Report — all in one workspace
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-emerald-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Online
          </span>
          <span className={`text-xs px-3 py-1 rounded-full ${
            isDark ? "bg-white/5 text-white/60" : "bg-gray-100 text-gray-600"
          }`}>
            openai/gpt-oss-120b
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            isDark ? "bg-white/5 text-white/40" : "bg-gray-100 text-gray-400"
          }`}>
            ~0.6s avg
          </span>
        </div>
      </div>

      {/* Agent selector - pills without square boxes */}
      <div className="flex flex-wrap gap-2 items-center bg-white/5 rounded-2xl p-1 border border-white/10 backdrop-blur-sm">
        {AGENTS.map((agent) => {
          const Icon = agent.icon;
          const isActive = activeAgent.id === agent.id;
          return (
            <motion.button
              key={agent.id}
              onClick={() => {
                setActiveAgent(agent);
                setResult(null);
                setError("");
                setInput("");
              }}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive
                  ? isDark
                    ? "bg-brand-violet/20 text-white shadow-lg shadow-brand-violet/20"
                    : "bg-brand-violet/10 text-brand-violet shadow-lg shadow-brand-violet/10"
                  : isDark
                  ? "text-white/50 hover:text-white/80 hover:bg-white/5"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
              }`}
            >
              <Icon size={16} />
              <span>{agent.name}</span>
              {isActive && (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0 rounded-xl border-2 border-brand-violet/60 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {isActive && (
                <span className="ml-1 text-[10px] font-bold text-brand-violet bg-brand-violet/10 px-1.5 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      <motion.div
        layout
        className={cardCls}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div
          className={`flex items-center gap-3 px-5 py-4 border-b ${
            isDark ? "border-white/5" : "border-gray-200/50"
          }`}
        >
          <div
            className={`w-9 h-9 rounded-full bg-gradient-to-br ${activeAgent.color} flex items-center justify-center text-white shadow-lg`}
          >
            {(() => {
              const Icon = activeAgent.icon;
              return <Icon size={20} />;
            })()}
          </div>
          <div>
            <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
              {activeAgent.name}
            </p>
            <p className={`text-xs ${isDark ? "text-white/35" : "text-gray-400"}`}>
              {activeAgent.desc}
            </p>
          </div>
        </div>

        {/* Chat mode */}
        {activeAgent.id === "chat" ? (
          <>
            <div className="p-5 h-72 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-brand-violet/20">
              {chatMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-fuchsia-500 to-brand-violet flex items-center justify-center text-white text-[10px] font-bold mr-2 flex-shrink-0 mt-0.5">
                      AI
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-brand-violet to-brand-blue text-white rounded-br-sm"
                        : isDark
                        ? "bg-white/10 text-white/85 rounded-bl-sm backdrop-blur-sm"
                        : "bg-gray-100/80 text-gray-800 rounded-bl-sm backdrop-blur-sm"
                    }`}
                  >
                    {msg.role === "assistant" && i === chatMessages.length - 1 && loading
                      ? useTyping(msg.content, 15)
                      : msg.content}
                  </div>
                </motion.div>
              ))}
              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-fuchsia-500 to-brand-violet flex items-center justify-center text-white text-[10px] font-bold mr-2 flex-shrink-0">
                      AI
                    </div>
                    <div
                      className={`px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center ${
                        isDark ? "bg-white/10" : "bg-gray-100/80"
                      }`}
                    >
                      {[0, 0.2, 0.4].map((d) => (
                        <motion.div
                          key={d}
                          className="w-1.5 h-1.5 rounded-full bg-brand-violet"
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: d,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
            <div
              className={`px-5 pb-4 pt-3 border-t ${
                isDark ? "border-white/5" : "border-gray-200/50"
              }`}
            >
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={activeAgent.placeholder}
                  className={inputCls}
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2.5 rounded-xl text-sm text-white font-medium bg-gradient-to-r from-brand-violet to-brand-blue disabled:opacity-40 hover:shadow-lg transition-shadow flex items-center gap-2"
                >
                  <Send size={16} />
                  Send
                </motion.button>
              </form>
            </div>
          </>
        ) : (
          <div className="p-5 space-y-4">
            {needsExpId ? (
              <div>
                <label
                  className={`block text-xs font-medium mb-1.5 ${
                    isDark ? "text-white/45" : "text-gray-600"
                  }`}
                >
                  Select experiment to analyze
                </label>
                <select
                  value={selectedExpId}
                  onChange={(e) => setSelectedExpId(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-brand-violet/25 ${
                    isDark
                      ? "bg-white/5 border-white/10 text-white"
                      : "bg-white/80 border-gray-200/80 text-gray-900"
                  }`}
                >
                  {experiments.length === 0 ? (
                    <option>No experiments yet — create one first</option>
                  ) : (
                    experiments.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={activeAgent.placeholder}
                    className={inputCls}
                  />
                  <motion.button
                    type="submit"
                    disabled={!input.trim() || loading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-5 py-2.5 rounded-xl text-sm text-white font-medium bg-gradient-to-br ${activeAgent.color} disabled:opacity-40 hover:shadow-lg transition-shadow flex items-center gap-2`}
                  >
                    {loading ? (
                      <motion.div
                        className="w-4 h-4 rounded-full border-2 border-white border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    ) : (
                      (() => {
                        const Icon = activeAgent.icon;
                        return <Icon size={18} />;
                      })()
                    )}
                    {loading ? "Thinking…" : "Run"}
                  </motion.button>
                </form>
                {!result && !loading && !input && !error && (
                  <div className="mt-4">
                    <p className={`text-xs font-medium mb-2 ${isDark ? "text-white/30" : "text-gray-400"}`}>
                      Try one:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {EXAMPLE_PROMPTS.map((prompt) => (
                        <motion.button
                          key={prompt}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleExampleClick(prompt)}
                          className={`text-xs px-3 py-1.5 rounded-full border ${
                            isDark
                              ? "border-white/10 hover:border-white/20 text-white/60 hover:text-white"
                              : "border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          {prompt}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {needsExpId && (
              <motion.button
                onClick={handleSubmit}
                disabled={!selectedExpId || loading || experiments.length === 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-2.5 rounded-xl text-sm text-white font-medium bg-gradient-to-br ${activeAgent.color} disabled:opacity-40 hover:shadow-lg transition-shadow flex items-center justify-center gap-2`}
              >
                {loading ? (
                  <motion.div
                    className="w-4 h-4 rounded-full border-2 border-white border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                ) : (
                  (() => {
                    const Icon = activeAgent.icon;
                    return <Icon size={18} />;
                  })()
                )}
                {loading
                  ? "Analyzing real data…"
                  : activeAgent.id === "report"
                  ? "Generate Report"
                  : "Interpret Results"}
              </motion.button>
            )}

            {error && (
              <motion.p
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2.5 rounded-xl"
              >
                {error}
              </motion.p>
            )}

            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <p
                    className={`text-xs font-medium mb-2 ${
                      isDark ? "text-white/30" : "text-gray-400"
                    }`}
                  >
                    {activeAgent.name} — result
                  </p>
                  <StructuredResult
                    data={result}
                    agentId={activeAgent.id}
                    isDark={isDark}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {!result && !loading && !input && !error && !needsExpId && (
              <div
                className={`text-center py-8 ${
                  isDark ? "text-white/15" : "text-gray-300"
                }`}
              >
                {(() => {
                  const Icon = activeAgent.icon;
                  return <Icon size={36} className="mx-auto mb-2 opacity-30" />;
                })()}
                <p className="text-xs">
                  Enter a prompt above or try one of the examples below
                </p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}