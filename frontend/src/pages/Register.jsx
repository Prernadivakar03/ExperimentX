

import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import { register } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function UserIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}
function MailIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" />
    </svg>
  );
}
function BriefcaseIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}
function LockIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

const LOADING_STAGES = ["Creating account…", "Setting up workspace…", "Initializing AI…"];

export default function Register() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const { isDark } = useTheme(); // ✅ fix: get isDark from theme context

  const [form, setForm] = useState({ name: "", email: "", password: "", company: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);

  // Store timeouts to clean them up on unmount
  const timeoutsRef = useRef([]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: null }));
    setServerError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 8) newErrors.password = "At least 8 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setLoadingStage(0);

    const t1 = setTimeout(() => setLoadingStage(1), 300);
    const t2 = setTimeout(() => setLoadingStage(2), 600);
    timeoutsRef.current.push(t1, t2);

    try {
      const data = await register(form);
      setSession(data.user);

      const t3 = setTimeout(() => navigate("/dashboard"), 700);
      timeoutsRef.current.push(t3);
      // Note: we don't set loading to false here because the component will unmount
    }
     catch (err) {
  clearTimeout(t1);
  clearTimeout(t2);
  const detail = err.response?.data?.detail;
  if (Array.isArray(detail)) {
    setServerError(detail.map((d) => d.msg).join(", "));
  } else {
    setServerError(detail || "Something went wrong. Please try again.");
  }
  setLoading(false);
}
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start running experiments in minutes — free forever"
      footer={
        <span className={isDark ? "text-white/40" : "text-gray-500"}>
          Already have an account?{" "}
          <Link to="/login" className="text-brand-violet font-medium hover:underline">
            Sign in
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <FormField
          label="Full name"
          value={form.name}
          onChange={handleChange("name")}
          error={errors.name}
          placeholder="Jordan Lee"
          autoComplete="name"
          icon={UserIcon}
        />
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
          label="Company (optional)"
          value={form.company}
          onChange={handleChange("company")}
          placeholder="Acme Inc."
          autoComplete="organization"
          icon={BriefcaseIcon}
        />
        <FormField
          label="Password"
          type="password"
          value={form.password}
          onChange={handleChange("password")}
          error={errors.password}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          icon={LockIcon}
        />

        <AnimatePresence>
          {serverError && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2.5 mb-4"
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
                     bg-gradient-to-r from-brand-violet to-brand-blue disabled:opacity-70"
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
                Create Free Account
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <p className="text-[11px] text-white/25 text-center mt-4">
          By signing up, you agree to our Terms and Privacy Policy.
        </p>
      </form>
    </AuthLayout>
  );
}