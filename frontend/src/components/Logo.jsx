// frontend/src/components/Logo.jsx
import logoMark from "../assets/experimentx-logo.png";

export function LogoMark({ size = 32, className = "" }) {
  return (
    <img
      src={logoMark}
      alt="ExperimentX"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

export default function Logo({ size = 32, showText = true, className = "" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      {showText && (
        <span className="font-display font-bold text-lg text-gray-900 dark:text-white tracking-tight">
          ExperimentX
        </span>
      )}
    </div>
  );
}