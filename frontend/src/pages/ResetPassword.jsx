import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import { resetPassword } from "../services/auth";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: "" }));
    setFormError("");
  };

  const validate = () => {
    const next = {};
    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 8) next.password = "At least 8 characters";
    if (form.confirmPassword !== form.password) next.confirmPassword = "Passwords don't match";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setFormError("This reset link is missing its token. Request a new one.");
      return;
    }
    if (!validate()) return;

    setLoading(true);
    setFormError("");
    try {
      await resetPassword(token, form.password);
      setDone(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setFormError(detail || "This reset link is invalid or has expired. Please request a new one.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Choose a new password for your account"
      footer={
        <Link to="/login" className="text-brand-ember font-medium hover:underline">
          Back to sign in
        </Link>
      }
    >
      {done ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-4"
        >
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Password updated. Redirecting you to sign in…
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="New password"
            type="password"
            value={form.password}
            onChange={handleChange("password")}
            error={errors.password}
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />
          <FormField
            label="Confirm new password"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
            error={errors.confirmPassword}
            placeholder="Re-enter your new password"
            autoComplete="new-password"
          />

          {formError && (
            <p className="text-xs text-red-400 mb-3">{formError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-white font-medium text-sm
                       bg-gradient-to-r from-brand-ember to-brand-gold
                       hover:opacity-90 disabled:opacity-60 transition-opacity
                       shadow-[0_0_25px_rgba(108,92,231,0.35)]"
          >
            {loading ? "Updating…" : "Update Password"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}