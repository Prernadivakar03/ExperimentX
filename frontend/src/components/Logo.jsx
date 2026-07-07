export default function Logo({ size = 32, showText = true }) {
  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6C5CE7" />
            <stop offset="100%" stopColor="#4F8CFF" />
          </linearGradient>
        </defs>
        {/* Refined X — two clean crossing strokes, rounded caps, single gradient */}
        <path
          d="M6 6 L34 34 M34 6 L6 34"
          stroke="url(#logoGradient)"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
      {showText && (
        <span className="font-display font-bold text-lg text-gray-900 dark:text-white">
          Experiment<span className="text-brand-violet">X</span>
        </span>
      )}
    </div>
  );
}