import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

function CustomTooltip({ active, payload, isDark, control }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const lift =
    control && d.raw.label !== control.label && control.conversion_rate > 0
      ? ((d.raw.conversion_rate - control.conversion_rate) / control.conversion_rate) * 100
      : null;

  return (
    <div className={`rounded-xl border px-3.5 py-3 text-xs backdrop-blur-xl ${isDark ? "bg-[#0D0E1A]/95 border-white/10 text-white" : "bg-white/95 border-gray-200 text-gray-900"}`} style={{ minWidth: 170 }}>
      <p className="font-display font-semibold mb-1.5">{d.name}</p>
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="opacity-50">Conversion rate</span>
          <span className="font-semibold">{d.raw.conversion_rate}%</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="opacity-50">Conversions</span>
          <span className="font-semibold">{d.raw.conversions?.toLocaleString() ?? "—"}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="opacity-50">Visitors</span>
          <span className="font-semibold">{d.raw.visitors?.toLocaleString() ?? "—"}</span>
        </div>
        {lift !== null && (
          <div className="flex justify-between gap-4">
            <span className="opacity-50">Lift</span>
            <span className={`font-semibold ${lift >= 0 ? "text-emerald-500" : "text-red-400"}`}>
              {lift >= 0 ? "+" : ""}
              {lift.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Custom label renderer replaces recharts' <LabelList>, which is what was
// silently breaking under your installed Recharts v3 — this version just
// draws SVG <text> directly above each bar via Bar's `label` prop.
function TopLabel({ x, y, width, value, isDark }) {
  return (
    <text x={x + width / 2} y={y - 10} textAnchor="middle" fontSize={13} fontWeight={700} fill={isDark ? "#fff" : "#111"}>
      {value}%
    </text>
  );
}

export default function ConversionChart({ variants, winnerLabel, isDark }) {
  const safeVariants = Array.isArray(variants) ? variants.filter((v) => v && v.label != null) : [];

  if (safeVariants.length === 0) {
    return (
      <div className={`flex items-center justify-center h-[220px] rounded-xl border border-dashed text-sm ${isDark ? "border-white/10 text-white/30" : "border-gray-200 text-gray-400"}`}>
        No variant data yet
      </div>
    );
  }

  const control = safeVariants.find((v) => v.label === "A") || safeVariants[0];
  const data = safeVariants.map((v) => ({ name: `Variant ${v.label}`, rate: Number(v.conversion_rate) || 0, raw: v }));
  const gc = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const tc = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)";

  const gradientFor = (label) => (label === winnerLabel ? "gradWinner" : label === "A" ? "gradControl" : "gradChallenger");

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} barSize={72} margin={{ top: 28, right: 8, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="gradWinner" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34F5B0" />
            <stop offset="100%" stopColor="#0FAE7A" />
          </linearGradient>
          <linearGradient id="gradControl" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9C8CFF" />
            <stop offset="100%" stopColor="#6C5CE7" />
          </linearGradient>
          <linearGradient id="gradChallenger" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7CB0FF" />
            <stop offset="100%" stopColor="#4F8CFF" />
          </linearGradient>
          <filter id="barGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gc} vertical={false} />
        <XAxis dataKey="name" tick={{ fill: tc, fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: tc, fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
        <Tooltip content={<CustomTooltip isDark={isDark} control={control} />} cursor={{ fill: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }} />
        <Bar
          dataKey="rate"
          radius={[10, 10, 0, 0]}
          animationDuration={900}
          animationEasing="ease-out"
          filter="url(#barGlow)"
          label={(props) => <TopLabel {...props} isDark={isDark} />}
        >
          {data.map((d) => (
            <Cell key={d.raw.variant_id ?? d.raw.label} fill={`url(#${gradientFor(d.raw.label)})`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}