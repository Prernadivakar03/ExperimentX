
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import { login } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function MailIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  );
}

function LockIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

const LOADING_STAGES = ["Authenticating…", "Syncing workspace…", "Loading AI…"];

export default function Login() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: null }));
    setServerError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;
//     setLoading(true);
//     setLoadingStage(0);

//     const t1 = setTimeout(() => setLoadingStage(1), 300);
//     const t2 = setTimeout(() => setLoadingStage(2), 600);

//     try {
//       } catch (err) {
//   clearTimeout(t1);
//   clearTimeout(t2);
//   const detail = err.response?.data?.detail;
//   // FastAPI validation errors return an array of objects — extract the message
//   if (Array.isArray(detail)) {
//     setServerError(detail.map((d) => d.msg).join(", "));
//   } else {
//     setServerError(detail || "Something went wrong. Please try again.");
//   }
//   setLoading(false);
// }
//   };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setLoading(true);
  setLoadingStage(0);

  const t1 = setTimeout(() => setLoadingStage(1), 300);
  const t2 = setTimeout(() => setLoadingStage(2), 600);

  try {
    // Call the login API
    const response = await login(form.email, form.password);
    
    // Store session (adjust according to your auth context)
    setSession(response);
    
    // Navigate to the main page
    navigate('/dashboard');
  } catch (err) {
    // Clear loading stage timeouts
    clearTimeout(t1);
    clearTimeout(t2);

    // Extract and display server error
    const detail = err.response?.data?.detail;
    if (Array.isArray(detail)) {
      setServerError(detail.map((d) => d.msg).join(", "));
    } else {
      setServerError(detail || "Something went wrong. Please try again.");
    }
  } finally {
    // Always stop the loading state
    setLoading(false);
  }
};

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to ExperimentX"
      footer={
        <span className={isDark ? "text-white/40" : "text-gray-500"}>
          Don't have an account?{" "}
          <Link to="/register" className="text-brand-violet font-medium hover:underline">
            Create one free
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <FormField
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange("email")}
          error={errors.email}
          placeholder="you@company.com"
          autoComplete="email"
          icon={MailIcon}
        />
        <FormField
          label="Password"
          type="password"
          value={form.password}
          onChange={handleChange("password")}
          error={errors.password}
          placeholder="••••••••"
          autoComplete="current-password"
          icon={LockIcon}
        />

        <div className="flex justify-end mb-5">
          <Link to="/forgot-password" className="text-xs text-brand-violet hover:underline">
            Forgot password?
          </Link>
        </div>

        <AnimatePresence>
          {serverError && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-red-400 bg-red-400/10 border border-red-400/20
                         rounded-lg px-3 py-2.5 mb-4"
            >
              {serverError}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="relative w-full py-3 rounded-lg text-white font-medium text-sm overflow-hidden
                     bg-gradient-to-r from-brand-violet to-brand-blue
                     disabled:opacity-70 transition-opacity"
          style={{ boxShadow: "0 0 30px rgba(108,92,231,0.45)" }}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.span
                key={loadingStage}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center justify-center gap-2"
              >
                <motion.span
                  className="w-3.5 h-3.5 rounded-full bg-white/30 border border-white/60 inline-block"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
                {LOADING_STAGES[loadingStage]}
              </motion.span>
            ) : (
              <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Sign In
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </form>
    </AuthLayout>
  );
}