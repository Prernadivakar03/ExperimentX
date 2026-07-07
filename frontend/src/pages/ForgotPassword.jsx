import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import { forgotPassword } from "../services/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch {
      // Backend always returns 200, this only fires on network failure
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll send you a link to reset it"
      footer={
        <Link to="/login" className="text-brand-violet font-medium hover:underline">
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-4"
        >
          <p className="text-sm text-gray-600 dark:text-gray-300">
            If an account exists for <span className="font-medium">{email}</span>, a reset link is on its way.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            error={error}
            placeholder="you@company.com"
            autoComplete="email"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-white font-medium text-sm
                       bg-gradient-to-r from-brand-violet to-brand-blue
                       hover:opacity-90 disabled:opacity-60 transition-opacity
                       shadow-[0_0_25px_rgba(108,92,231,0.35)]"
          >
            {loading ? "Sending…" : "Send Reset Link"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}