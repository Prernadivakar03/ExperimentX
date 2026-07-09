// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useTheme } from "../../context/ThemeContext";
// import api from "../../services/api";
// // import { Copy, Check } from "lucide-react";
// import {
//   Copy,
//   Check,
//   User,
//   GitBranch,
//   Target,
//   BarChart3,
//   BadgeCheck,
//   ArrowRight,
// } from "lucide-react";
// import {
//   SiReact,
//   SiNextdotjs,
//   SiVuedotjs,
//   SiJavascript,
//   SiNodedotjs,
//   SiPython,
// } from "react-icons/si";

// const FRAMEWORKS = [
//   { id: "react", label: "React", icon: <SiReact/> },
//   { id: "nextjs", label: "Next.js", icon: <SiNodedotjs/> },
//   { id: "vue", label: "Vue", icon: <SiVuedotjs/> },
//   { id: "vanilla", label: "JavaScript", icon: <SiJavascript/> },
//   { id: "node", label: "Node.js", icon: <SiNodedotjs/> },
//   { id: "python", label: "Python", icon: <SiPython/> },
// ];

// const CODE = {
//   react: (key, expId) => `// 1. Install
// npm install experimentx-sdk

// // 2. Initialize (App.jsx or index.jsx)
// import { ExperimentXProvider } from 'experimentx-sdk';

// function App() {
//   return (
//     <ExperimentXProvider apiKey="${key}">
//       <YourApp />
//     </ExperimentXProvider>
//   );
// }

// // 3. Use in any component
// import { useVariant, useTrack } from 'experimentx-sdk';

// function HeroSection() {
//   const variant = useVariant('${expId}');
//   const track = useTrack();

//   if (variant === 'B') {
//     return (
//       <div>
//         <h1>New headline for Variant B</h1>
//         <button onClick={() => track('button_click', '${expId}')}>
//           Buy Now
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h1>Original headline — Variant A</h1>
//       <button onClick={() => track('button_click', '${expId}')}>
//         Get Started
//       </button>
//     </div>
//   );
// }`,

//   nextjs: (key, expId) => `// 1. Install
// npm install experimentx-sdk

// // 2. Initialize (app/layout.tsx)
// import { ExperimentXProvider } from 'experimentx-sdk';

// export default function RootLayout({ children }) {
//   return (
//     <html>
//       <body>
//         <ExperimentXProvider apiKey="${key}">
//           {children}
//         </ExperimentXProvider>
//       </body>
//     </html>
//   );
// }

// // 3. Use in a page or component (client-side)
// 'use client';
// import { useVariant, useTrack } from 'experimentx-sdk';

// export default function PricingPage() {
//   const variant = useVariant('${expId}');
//   const track = useTrack();

//   return (
//     <section>
//       {variant === 'B' ? (
//         <h2>Special offer — save 30%</h2>
//       ) : (
//         <h2>Flexible pricing for every team</h2>
//       )}
//       <button onClick={() => track('signup', '${expId}')}>
//         Start free trial
//       </button>
//     </section>
//   );
// }`,

//   vue: (key, expId) => `// 1. Install
// npm install experimentx-sdk

// // 2. Initialize (main.js)
// import { createApp } from 'vue';
// import { ExperimentXPlugin } from 'experimentx-sdk/vue';
// import App from './App.vue';

// createApp(App)
//   .use(ExperimentXPlugin, { apiKey: '${key}' })
//   .mount('#app');

// // 3. Use in a component (SFC)
// <template>
//   <div>
//     <h1 v-if="variant === 'B'">
//       New headline for Variant B
//     </h1>
//     <h1 v-else>
//       Original headline — Variant A
//     </h1>
//     <button @click="track('click', '${expId}')">
//       Get Started
//     </button>
//   </div>
// </template>

// <script setup>
// import { useVariant, useTrack } from 'experimentx-sdk/vue';

// const variant = useVariant('${expId}');
// const track = useTrack();
// </script>`,

//   vanilla: (key, expId) => `<!-- 1. Add the script to your HTML -->
// <script src="https://cdn.experimentx.io/sdk/v1/experimentx.min.js"></script>

// <script>
//   // 2. Initialize
//   ExperimentX.init({ apiKey: '${key}' });

//   // 3. Assign visitor to variant
//   const variant = await ExperimentX.getVariant('${expId}');

//   if (variant === 'B') {
//     document.querySelector('#headline').textContent = 'New headline';
//     document.querySelector('#cta').textContent = 'Buy Now';
//   }

//   // 4. Track events
//   document.querySelector('#cta').addEventListener('click', () => {
//     ExperimentX.track('button_click', '${expId}');
//   });

//   // 5. Track conversions
//   ExperimentX.trackConversion('purchase', '${expId}');
// </script>`,

//   node: (key, expId) => `// 1. Install
// npm install experimentx-sdk

// // 2. Server-side variant assignment
// import { ExperimentXClient } from 'experimentx-sdk/node';

// const client = new ExperimentXClient({ apiKey: '${key}' });

// // Express.js example
// app.get('/pricing', async (req, res) => {
//   const userId = req.user?.id || req.cookies.visitorId;

//   const variant = await client.getVariant('${expId}', {
//     userId,
//     attributes: {
//       country: req.headers['cf-ipcountry'],
//       device: req.device.type,
//     }
//   });

//   res.render('pricing', { variant });
// });

// // Track conversions from backend
// app.post('/purchase', async (req, res) => {
//   await client.trackConversion('purchase', '${expId}', {
//     userId: req.user.id,
//     value: req.body.amount,
//   });
// });`,

//   python: (key, expId) => `# 1. Install
// pip install experimentx-sdk

// # 2. Initialize
// from experimentx import ExperimentXClient

// client = ExperimentXClient(api_key="${key}")

// # 3. Flask / Django example
// @app.route('/pricing')
// def pricing():
//     user_id = session.get('user_id') or request.cookies.get('visitor_id')

//     variant = client.get_variant(
//         experiment_id="${expId}",
//         user_id=user_id,
//         attributes={
//             "country": request.headers.get("CF-IPCountry"),
//             "device": "mobile" if request.user_agent.is_mobile else "desktop",
//         }
//     )

//     return render_template('pricing.html', variant=variant)

// # 4. Track conversion
// @app.route('/purchase', methods=['POST'])
// def purchase():
//     client.track_conversion(
//         event="purchase",
//         experiment_id="${expId}",
//         user_id=session['user_id'],
//         value=request.json['amount']
//     )`,
// };

// function CopyButton({ text, isDark }) {
//   const [copied, setCopied] = useState(false);
//   return (
//     <button
//       onClick={() => {
//         navigator.clipboard.writeText(text);
//         setCopied(true);
//         setTimeout(() => setCopied(false), 2000);
//       }}
//       className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
//         isDark
//           ? "border-white/[0.08] text-white/40 hover:text-white hover:border-white/20"
//           : "border-gray-200 text-gray-500 hover:text-gray-900"
//       }`}
//     >
//       {copied ? (
//         <><span>✓</span> Copied</>
//       ) : (
//         <><span>⧉</span> Copy</>
//       )}
//     </button>
//   );
// }

// export default function SDKIntegration() {
//   const { theme } = useTheme();
//   const isDark = theme === "dark";
//   const [experiments, setExperiments] = useState([]);
//   const [selectedExp, setSelectedExp] = useState(null);
//   const [framework, setFramework] = useState("react");

//   useEffect(() => {
//     api.get("/experiments/").then((r) => {
//       setExperiments(r.data);
//       if (r.data.length > 0) setSelectedExp(r.data[0]);
//     });
//   }, []);

//   const apiKey = `xp_live_${selectedExp?.id?.slice(0, 8) || "xxxxxxxx"}_sk`;
//   const expId = selectedExp?.id || "your-experiment-id";
//   const code = CODE[framework]?.(apiKey, expId) || "";

//   const cardCls = `rounded-2xl border transition-colors ${
//     isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"
//   }`;

//   const steps = [
//     {
//       n: "01", title: "Create experiment", desc: "Define your experiment, variants, and goal in the Experiments tab.",
//       done: experiments.length > 0,
//     },
//     {
//       n: "02", title: "Copy your API key", desc: "Use the key below to authenticate SDK calls from your app.",
//       done: true,
//     },
//     {
//       n: "03", title: "Install the SDK", desc: "One package install — works with React, Next.js, Vue, Node, Python, and plain JS.",
//       done: false,
//     },
//     {
//       n: "04", title: "Assign variants", desc: "Call getVariant() with your experiment ID to get A or B for each visitor.",
//       done: false,
//     },
//     {
//       n: "05", title: "Track events", desc: "Call track() on button clicks, purchases, and signups to feed your analytics.",
//       done: false,
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className={`text-xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
//           SDK Integration
//         </h1>
//         <p className={`text-sm mt-0.5 ${isDark ? "text-white/35" : "text-gray-500"}`}>
//           Connect ExperimentX to your app in under 5 minutes
//         </p>
//       </div>

//       {/* Progress steps */}
//       <div className={`${cardCls} p-5`}>
//         <p className={`text-sm font-medium mb-4 ${isDark ? "text-white/70" : "text-gray-700"}`}>
//           Integration checklist
//         </p>
//         <div className="space-y-3">
//           {steps.map((s, i) => (
//             <motion.div
//               key={s.n}
//               initial={{ opacity: 0, x: -8 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: i * 0.06 }}
//               className={`flex items-start gap-3 p-3 rounded-xl ${
//                 s.done
//                   ? isDark ? "bg-emerald-500/5 border border-emerald-500/15" : "bg-emerald-50 border border-emerald-200"
//                   : isDark ? "bg-white/[0.02] border border-white/[0.05]" : "bg-gray-50 border border-gray-100"
//               }`}
//             >
//               <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
//                 s.done ? "bg-emerald-500 text-white" : isDark ? "bg-white/[0.07] text-white/30" : "bg-gray-200 text-gray-500"
//               }`}>
//                 {s.done ? "✓" : s.n}
//               </div>
//               <div>
//                 <p className={`text-sm font-medium ${isDark ? "text-white/80" : "text-gray-800"}`}>{s.title}</p>
//                 <p className={`text-xs mt-0.5 ${isDark ? "text-white/30" : "text-gray-400"}`}>{s.desc}</p>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>

//       {/* Keys */}
//       <div className={`${cardCls} p-5`}>
//         <p className={`text-sm font-medium mb-4 ${isDark ? "text-white/70" : "text-gray-700"}`}>
//           Your keys
//         </p>
//         <div className="space-y-3">
//           {[
//             { label: "API Key", value: apiKey, desc: "Use this to initialize the SDK" },
//             { label: "Experiment ID", value: expId, desc: "Pass this to getVariant() and track()" },
//           ].map((k) => (
//             <div key={k.label}>
//               <div className="flex items-center justify-between mb-1.5">
//                 <div>
//                   <span className={`text-xs font-medium ${isDark ? "text-white/50" : "text-gray-600"}`}>{k.label}</span>
//                   <span className={`text-xs ml-2 ${isDark ? "text-white/20" : "text-gray-400"}`}>— {k.desc}</span>
//                 </div>
//                 <CopyButton text={k.value} isDark={isDark} />
//               </div>
//               <div className={`px-3 py-2.5 rounded-xl font-mono text-xs break-all ${
//                 isDark ? "bg-white/[0.03] text-white/50 border border-white/[0.06]" : "bg-gray-50 text-gray-500 border border-gray-200"
//               }`}>
//                 {k.value}
//               </div>
//             </div>
//           ))}

//           {experiments.length > 0 && (
//             <div>
//               <label className={`text-xs font-medium mb-1.5 block ${isDark ? "text-white/50" : "text-gray-600"}`}>
//                 Active experiment
//               </label>
//               <select
//                 value={selectedExp?.id || ""}
//                 onChange={(e) => setSelectedExp(experiments.find((x) => x.id === e.target.value))}
//                 className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-brand-violet/25 ${
//                   isDark ? "bg-white/[0.04] border-white/[0.08] text-white" : "bg-white border-gray-200 text-gray-900"
//                 }`}
//               >
//                 {experiments.map((e) => (
//                   <option key={e.id} value={e.id}>{e.name}</option>
//                 ))}
//               </select>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Code snippet */}
//       <div className={`${cardCls} overflow-hidden`}>
//         <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? "border-white/[0.06]" : "border-gray-100"}`}>
//           <p className={`text-sm font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}>
//             Integration code
//           </p>
//           <CopyButton text={code} isDark={isDark} />
//         </div>

//         {/* Framework tabs */}
//         <div className={`flex items-center gap-1 px-5 py-2 border-b overflow-x-auto ${isDark ? "border-white/[0.05]" : "border-gray-100"}`}>
//           {FRAMEWORKS.map((f) => (
//             <button
//               key={f.id}
//               onClick={() => setFramework(f.id)}
//               className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
//                 framework === f.id
//                   ? isDark ? "bg-brand-violet/15 text-brand-violet" : "bg-brand-violet/8 text-brand-violet"
//                   : isDark ? "text-white/35 hover:text-white" : "text-gray-400 hover:text-gray-700"
//               }`}
//             >
//               <span>{f.icon}</span>
//               {f.label}
//             </button>
//           ))}
//         </div>

//         {/* Code block */}
//         <div className={`relative ${isDark ? "bg-[#080912]" : "bg-gray-950"}`}>
//           <pre className="p-5 text-xs leading-relaxed overflow-x-auto text-emerald-400 max-h-96">
//             <code>{code}</code>
//           </pre>
//         </div>
//       </div>

//       {/* How it works flow */}
//       <div className={`${cardCls} p-5`}>
//         <p className={`text-sm font-medium mb-5 ${isDark ? "text-white/70" : "text-gray-700"}`}>
//           How it works end-to-end
//         </p>
//         <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
//           {[
//             { icon: "👤", label: "Visitor arrives", sub: "Any page in your app" },
//             { icon: "🔀", label: "SDK calls ExperimentX", sub: "getVariant(experimentId)" },
//             { icon: "🎯", label: "Variant assigned", sub: "Deterministic — always consistent" },
//             { icon: "📊", label: "Events tracked", sub: "clicks, purchases, signups" },
//             { icon: "🏆", label: "Winner declared", sub: "When significance reached" },
//           ].map((step, i) => (
//             <div key={step.label} className="flex md:flex-col items-center gap-3 md:gap-1 flex-1">
//               <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
//                 isDark ? "bg-white/[0.05]" : "bg-gray-50"
//               }`}>
//                 {step.icon}
//               </div>
//               <div className="md:text-center">
//                 <p className={`text-xs font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}>{step.label}</p>
//                 <p className={`text-[10px] mt-0.5 ${isDark ? "text-white/25" : "text-gray-400"}`}>{step.sub}</p>
//               </div>
//               {i < 4 && (
//                 <div className={`hidden md:block text-lg mt-0 ${isDark ? "text-white/15" : "text-gray-300"}`}>→</div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }














































































import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import api from "../../services/api";
import {
  Copy,
  Check,
  User,
  GitBranch,
  Target,
  BarChart3,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";
import {
  SiReact,
  SiNextdotjs,
  SiVuedotjs,
  SiJavascript,
  SiNodedotjs,
  SiPython,
} from "react-icons/si";

const FRAMEWORKS = [
  { id: "react", label: "React", icon: <SiReact /> },
  { id: "nextjs", label: "Next.js", icon: <SiNextdotjs /> },
  { id: "vue", label: "Vue", icon: <SiVuedotjs /> },
  { id: "vanilla", label: "JavaScript", icon: <SiJavascript /> },
  { id: "node", label: "Node.js", icon: <SiNodedotjs /> },
  { id: "python", label: "Python", icon: <SiPython /> },
];

const CODE = {
  react: (key, expId) => `// 1. Install
npm install experimentx-sdk

// 2. Initialize (App.jsx or index.jsx)
import { ExperimentXProvider } from 'experimentx-sdk';

function App() {
  return (
    <ExperimentXProvider apiKey="${key}">
      <YourApp />
    </ExperimentXProvider>
  );
}

// 3. Use in any component
import { useVariant, useTrack } from 'experimentx-sdk';

function HeroSection() {
  const variant = useVariant('${expId}');
  const track = useTrack();

  if (variant === 'B') {
    return (
      <div>
        <h1>New headline for Variant B</h1>
        <button onClick={() => track('button_click', '${expId}')}>
          Buy Now
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Original headline — Variant A</h1>
      <button onClick={() => track('button_click', '${expId}')}>
        Get Started
      </button>
    </div>
  );
}`,

  nextjs: (key, expId) => `// 1. Install
npm install experimentx-sdk

// 2. Initialize (app/layout.tsx)
import { ExperimentXProvider } from 'experimentx-sdk';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ExperimentXProvider apiKey="${key}">
          {children}
        </ExperimentXProvider>
      </body>
    </html>
  );
}

// 3. Use in a page or component (client-side)
'use client';
import { useVariant, useTrack } from 'experimentx-sdk';

export default function PricingPage() {
  const variant = useVariant('${expId}');
  const track = useTrack();

  return (
    <section>
      {variant === 'B' ? (
        <h2>Special offer — save 30%</h2>
      ) : (
        <h2>Flexible pricing for every team</h2>
      )}
      <button onClick={() => track('signup', '${expId}')}>
        Start free trial
      </button>
    </section>
  );
}`,

  vue: (key, expId) => `// 1. Install
npm install experimentx-sdk

// 2. Initialize (main.js)
import { createApp } from 'vue';
import { ExperimentXPlugin } from 'experimentx-sdk/vue';
import App from './App.vue';

createApp(App)
  .use(ExperimentXPlugin, { apiKey: '${key}' })
  .mount('#app');

// 3. Use in a component (SFC)
<template>
  <div>
    <h1 v-if="variant === 'B'">
      New headline for Variant B
    </h1>
    <h1 v-else>
      Original headline — Variant A
    </h1>
    <button @click="track('click', '${expId}')">
      Get Started
    </button>
  </div>
</template>

<script setup>
import { useVariant, useTrack } from 'experimentx-sdk/vue';

const variant = useVariant('${expId}');
const track = useTrack();
</script>`,

  vanilla: (key, expId) => `<!-- 1. Add the script to your HTML -->
<script src="https://cdn.experimentx.io/sdk/v1/experimentx.min.js"></script>

<script>
  // 2. Initialize
  ExperimentX.init({ apiKey: '${key}' });

  // 3. Assign visitor to variant
  const variant = await ExperimentX.getVariant('${expId}');

  if (variant === 'B') {
    document.querySelector('#headline').textContent = 'New headline';
    document.querySelector('#cta').textContent = 'Buy Now';
  }

  // 4. Track events
  document.querySelector('#cta').addEventListener('click', () => {
    ExperimentX.track('button_click', '${expId}');
  });

  // 5. Track conversions
  ExperimentX.trackConversion('purchase', '${expId}');
</script>`,

  node: (key, expId) => `// 1. Install
npm install experimentx-sdk

// 2. Server-side variant assignment
import { ExperimentXClient } from 'experimentx-sdk/node';

const client = new ExperimentXClient({ apiKey: '${key}' });

// Express.js example
app.get('/pricing', async (req, res) => {
  const userId = req.user?.id || req.cookies.visitorId;

  const variant = await client.getVariant('${expId}', {
    userId,
    attributes: {
      country: req.headers['cf-ipcountry'],
      device: req.device.type,
    }
  });

  res.render('pricing', { variant });
});

// Track conversions from backend
app.post('/purchase', async (req, res) => {
  await client.trackConversion('purchase', '${expId}', {
    userId: req.user.id,
    value: req.body.amount,
  });
});`,

  python: (key, expId) => `# 1. Install
pip install experimentx-sdk

# 2. Initialize
from experimentx import ExperimentXClient

client = ExperimentXClient(api_key="${key}")

# 3. Flask / Django example
@app.route('/pricing')
def pricing():
    user_id = session.get('user_id') or request.cookies.get('visitor_id')

    variant = client.get_variant(
        experiment_id="${expId}",
        user_id=user_id,
        attributes={
            "country": request.headers.get("CF-IPCountry"),
            "device": "mobile" if request.user_agent.is_mobile else "desktop",
        }
    )

    return render_template('pricing.html', variant=variant)

# 4. Track conversion
@app.route('/purchase', methods=['POST'])
def purchase():
    client.track_conversion(
        event="purchase",
        experiment_id="${expId}",
        user_id=session['user_id'],
        value=request.json['amount']
    )`,
};

function CopyButton({ text, isDark }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
        isDark
          ? "border-white/[0.08] text-white/40 hover:text-white hover:border-white/20"
          : "border-gray-200 text-gray-500 hover:text-gray-900"
      }`}
    >
      {copied ? (
        <><span>✓</span> Copied</>
      ) : (
        <><span>⧉</span> Copy</>
      )}
    </button>
  );
}

export default function SDKIntegration() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [experiments, setExperiments] = useState([]);
  const [selectedExp, setSelectedExp] = useState(null);
  const [framework, setFramework] = useState("react");

  useEffect(() => {
    api.get("/experiments/").then((r) => {
      setExperiments(r.data);
      if (r.data.length > 0) setSelectedExp(r.data[0]);
    });
  }, []);

  const apiKey = `xp_live_${selectedExp?.id?.slice(0, 8) || "xxxxxxxx"}_sk`;
  const expId = selectedExp?.id || "your-experiment-id";
  const code = CODE[framework]?.(apiKey, expId) || "";

  const cardCls = `rounded-2xl border transition-colors ${
    isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"
  }`;

  const steps = [
    {
      n: "01", title: "Create experiment", desc: "Define your experiment, variants, and goal in the Experiments tab.",
      done: experiments.length > 0,
    },
    {
      n: "02", title: "Copy your API key", desc: "Use the key below to authenticate SDK calls from your app.",
      done: true,
    },
    {
      n: "03", title: "Install the SDK", desc: "One package install — works with React, Next.js, Vue, Node, Python, and plain JS.",
      done: false,
    },
    {
      n: "04", title: "Assign variants", desc: "Call getVariant() with your experiment ID to get A or B for each visitor.",
      done: false,
    },
    {
      n: "05", title: "Track events", desc: "Call track() on button clicks, purchases, and signups to feed your analytics.",
      done: false,
    },
  ];

  const flowSteps = [
    {
      icon: User,
      label: "Visitor arrives",
      sub: "Any page in your application",
    },
    {
      icon: GitBranch,
      label: "SDK requests variant",
      sub: "getVariant(experimentId)",
    },
    {
      icon: Target,
      label: "Variant assigned",
      sub: "Deterministic assignment",
    },
    {
      icon: BarChart3,
      label: "Events tracked",
      sub: "Clicks, signups, purchases",
    },
    {
      icon: BadgeCheck,
      label: "Results calculated",
      sub: "Statistical significance",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          SDK Integration
        </h1>
        <p className={`text-sm mt-0.5 ${isDark ? "text-white/35" : "text-gray-500"}`}>
          Connect ExperimentX to your app in under 5 minutes
        </p>
      </div>

      {/* Progress steps */}
      <div className={`${cardCls} p-5`}>
        <p className={`text-sm font-medium mb-4 ${isDark ? "text-white/70" : "text-gray-700"}`}>
          Integration checklist
        </p>
        <div className="space-y-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`flex items-start gap-3 p-3 rounded-xl ${
                s.done
                  ? isDark ? "bg-emerald-500/5 border border-emerald-500/15" : "bg-emerald-50 border border-emerald-200"
                  : isDark ? "bg-white/[0.02] border border-white/[0.05]" : "bg-gray-50 border border-gray-100"
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                s.done ? "bg-emerald-500 text-white" : isDark ? "bg-white/[0.07] text-white/30" : "bg-gray-200 text-gray-500"
              }`}>
                {s.done ? "✓" : s.n}
              </div>
              <div>
                <p className={`text-sm font-medium ${isDark ? "text-white/80" : "text-gray-800"}`}>{s.title}</p>
                <p className={`text-xs mt-0.5 ${isDark ? "text-white/30" : "text-gray-400"}`}>{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Keys */}
      <div className={`${cardCls} p-5`}>
        <p className={`text-sm font-medium mb-4 ${isDark ? "text-white/70" : "text-gray-700"}`}>
          Your keys
        </p>
        <div className="space-y-3">
          {[
            { label: "API Key", value: apiKey, desc: "Use this to initialize the SDK" },
            { label: "Experiment ID", value: expId, desc: "Pass this to getVariant() and track()" },
          ].map((k) => (
            <div key={k.label}>
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <span className={`text-xs font-medium ${isDark ? "text-white/50" : "text-gray-600"}`}>{k.label}</span>
                  <span className={`text-xs ml-2 ${isDark ? "text-white/20" : "text-gray-400"}`}>— {k.desc}</span>
                </div>
                <CopyButton text={k.value} isDark={isDark} />
              </div>
              <div className={`px-3 py-2.5 rounded-xl font-mono text-xs break-all ${
                isDark ? "bg-white/[0.03] text-white/50 border border-white/[0.06]" : "bg-gray-50 text-gray-500 border border-gray-200"
              }`}>
                {k.value}
              </div>
            </div>
          ))}

          {experiments.length > 0 && (
            <div>
              <label className={`text-xs font-medium mb-1.5 block ${isDark ? "text-white/50" : "text-gray-600"}`}>
                Active experiment
              </label>
              <select
                value={selectedExp?.id || ""}
                onChange={(e) => setSelectedExp(experiments.find((x) => x.id === e.target.value))}
                className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-brand-violet/25 ${
                  isDark ? "bg-white/[0.04] border-white/[0.08] text-white" : "bg-white border-gray-200 text-gray-900"
                }`}
              >
                {experiments.map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Code snippet */}
      <div className={`${cardCls} overflow-hidden`}>
        <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? "border-white/[0.06]" : "border-gray-100"}`}>
          <p className={`text-sm font-medium ${isDark ? "text-white/70" : "text-gray-700"}`}>
            Integration code
          </p>
          <CopyButton text={code} isDark={isDark} />
        </div>

        {/* Framework tabs */}
        <div className={`flex items-center gap-1 px-5 py-2 border-b overflow-x-auto ${isDark ? "border-white/[0.05]" : "border-gray-100"}`}>
          {FRAMEWORKS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFramework(f.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                framework === f.id
                  ? isDark ? "bg-brand-violet/15 text-brand-violet" : "bg-brand-violet/8 text-brand-violet"
                  : isDark ? "text-white/35 hover:text-white" : "text-gray-400 hover:text-gray-700"
              }`}
            >
              <span>{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>

        {/* Code block */}
        <div className={`relative ${isDark ? "bg-[#080912]" : "bg-gray-950"}`}>
          <pre className="p-5 text-xs leading-relaxed overflow-x-auto text-emerald-400 max-h-96">
            <code>{code}</code>
          </pre>
        </div>
      </div>

      {/* How it works flow – with explicit colors for visibility */}
      <div className={`${cardCls} p-5`}>
        <p
          className={`text-sm font-medium mb-5 ${
            isDark ? "text-white/70" : "text-gray-700"
          }`}
        >
          Integration Flow
        </p>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          {flowSteps.map((step, i) => {
            const Icon = step.icon;

            return (
              <div
                key={step.label}
                className="flex md:flex-col items-center gap-3 md:gap-1 flex-1"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isDark ? "bg-white/[0.05]" : "bg-gray-50"
                  }`}
                >
                  <Icon
                    size={20}
                    className={isDark ? "text-white" : "text-gray-700"}
                  />
                </div>

                <div className="md:text-center">
                  <p
                    className={`text-xs font-medium ${
                      isDark ? "text-white/70" : "text-gray-700"
                    }`}
                  >
                    {step.label}
                  </p>

                  <p
                    className={`text-[10px] mt-0.5 ${
                      isDark ? "text-white/25" : "text-gray-400"
                    }`}
                  >
                    {step.sub}
                  </p>
                </div>

                {i < flowSteps.length - 1 && (
                  <ArrowRight
                    size={16}
                    className={`hidden md:block ${
                      isDark ? "text-white/20" : "text-gray-400"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}