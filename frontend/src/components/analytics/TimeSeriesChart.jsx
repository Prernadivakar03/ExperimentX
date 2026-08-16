import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function CustomTooltip({ active, payload, label, isDark }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={`rounded-xl border px-3.5 py-2.5 text-xs backdrop-blur-xl ${isDark ? "bg-[#0D0E1A]/95 border-white/10 text-white" : "bg-white/95 border-gray-200 text-gray-900"}`}>
      <p className="opacity-50 mb-1">{label}</p>
      <p className="font-display font-semibold text-brand-violet">{payload[0].value}% conversion</p>
    </div>
  );
}

export default function TimeSeriesChart({ data, isDark }) {
  const gc = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const tc = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)";
  const safeData = Array.isArray(data) ? data : [];

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={safeData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="timeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6C5CE7" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6C5CE7" />
            <stop offset="100%" stopColor="#4F8CFF" />
          </linearGradient>
          <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gc} vertical={false} />
        <XAxis dataKey="date" tick={{ fill: tc, fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: tc, fontSize: 12 }} axisLine={false} tickLine={false} unit="%" domain={[0, "auto"]} />
        <Tooltip content={<CustomTooltip isDark={isDark} />} cursor={{ stroke: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)", strokeWidth: 1 }} />
        <Area type="monotone" dataKey="conversion_rate" stroke="url(#lineStroke)" fill="url(#timeGrad)" strokeWidth={3} dot={false} activeDot={false} filter="url(#lineGlow)" animationDuration={1000} />
      </AreaChart>
    </ResponsiveContainer>
  );
}