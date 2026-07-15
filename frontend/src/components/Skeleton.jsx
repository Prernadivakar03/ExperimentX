import { useTheme } from "../context/ThemeContext";

function SkeletonBox({ className }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div
      className={`rounded-xl animate-pulse ${className} ${
        isDark ? "bg-white/[0.06]" : "bg-gray-200"
      }`}
    />
  );
}

export function SkeletonKPIRow() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`p-5 rounded-2xl border ${
            document.documentElement.classList.contains("dark")
              ? "bg-[#0D0E1A] border-white/[0.07]"
              : "bg-white border-gray-200"
          }`}
        >
          <SkeletonBox className="h-3 w-20 mb-3" />
          <SkeletonBox className="h-7 w-28 mb-2" />
          <SkeletonBox className="h-8 w-full" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div
      className={`p-5 rounded-2xl border ${
        document.documentElement.classList.contains("dark")
          ? "bg-[#0D0E1A] border-white/[0.07]"
          : "bg-white border-gray-200"
      }`}
    >
      <SkeletonBox className="h-4 w-36 mb-5" />
      <div className="flex items-end gap-2 h-40">
        {[60, 80, 50, 90, 70, 85, 65].map((h, i) => (
          <SkeletonBox key={i} className="flex-1" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div
      className={`p-5 rounded-2xl border ${
        document.documentElement.classList.contains("dark")
          ? "bg-[#0D0E1A] border-white/[0.07]"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <SkeletonBox className="w-9 h-9 rounded-xl" />
        <div className="flex-1">
          <SkeletonBox className="h-3.5 w-32 mb-2" />
          <SkeletonBox className="h-3 w-20" />
        </div>
      </div>
      <SkeletonBox className="h-3 w-full mb-2" />
      <SkeletonBox className="h-3 w-3/4 mb-2" />
      <SkeletonBox className="h-3 w-1/2" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div
      className={`rounded-2xl border overflow-hidden ${
        document.documentElement.classList.contains("dark")
          ? "bg-[#0D0E1A] border-white/[0.07]"
          : "bg-white border-gray-200"
      }`}
    >
      <div className={`px-5 py-4 border-b ${
        document.documentElement.classList.contains("dark")
          ? "border-white/[0.06]"
          : "border-gray-100"
      }`}>
        <SkeletonBox className="h-4 w-36" />
      </div>
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className={`flex items-center gap-4 px-5 py-3.5 border-b last:border-0 ${
          document.documentElement.classList.contains("dark")
            ? "border-white/[0.04]"
            : "border-gray-50"
        }`}>
          <SkeletonBox className="h-3 flex-1" />
          <SkeletonBox className="h-3 w-16" />
          <SkeletonBox className="h-5 w-16 rounded-full" />
          <SkeletonBox className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}