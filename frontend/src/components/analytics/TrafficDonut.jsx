import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const PALETTE = ["#6C5CE7", "#4F8CFF", "#10B981", "#F59E0B", "#F472B6"];

function CustomTooltip({ active, payload, isDark }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      className={`rounded-xl border px-3 py-2 text-xs backdrop-blur-xl ${
        isDark ? "bg-[#0D0E1A]/95 border-white/10 text-white" : "bg-white/95 border-gray-200 text-gray-900"
      }`}
    >
      <p className="font-semibold">{d.name}</p>
      <p className="opacity-60">{d.value}% of traffic</p>
    </div>
  );
}

export default function TrafficDonut({ variants, isDark }) {
  const safeVariants = Array.isArray(variants) ? variants : [];
  if (safeVariants.length === 0) return null;

  const data = safeVariants.map((v) => ({
    name: `Variant ${v.label}`,
    value: Math.round((Number(v.traffic_split) || 0) * 100),
  }));

  return (
    <div className="flex items-center gap-6">
      <div className="w-40 h-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={52}
              outerRadius={72}
              paddingAngle={3}
              startAngle={90}
              endAngle={-270}
              animationDuration={900}
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip isDark={isDark} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 space-y-2.5">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              {/* square swatch, not a dot */}
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: PALETTE[i % PALETTE.length] }} />
              <span className={`text-xs font-medium truncate ${isDark ? "text-white/60" : "text-gray-600"}`}>{d.name}</span>
            </div>
            <span className={`text-xs font-display font-bold tabular-nums ${isDark ? "text-white" : "text-gray-900"}`}>
              {d.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}