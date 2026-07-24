// frontend/src/components/experiment/MLInsightsPanel.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";

function Bar({ label, value, max, isDark }) {
  const pct = max > 0 ? Math.max(2, (value / max) * 100) : 0;
  const positive = value >= 0;
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className={`text-xs w-20 flex-shrink-0 ${isDark ? "text-white/50" : "text-gray-500"}`}>
        {label}
      </span>
      <div className={`flex-1 h-2 rounded-full overflow-hidden ${isDark ? "bg-white/[0.06]" : "bg-gray-100"}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`h-full rounded-full ${
            positive ? "bg-gradient-to-r from-brand-violet to-brand-blue" : "bg-red-400"
          }`}
        />
      </div>
      <span className={`text-xs font-mono w-14 text-right ${isDark ? "text-white/70" : "text-gray-700"}`}>
        {(value * 100).toFixed(1)}%
      </span>
    </div>
  );
}

export default function MLInsightsPanel({ experimentId, isDark }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!experimentId) return;
    setLoading(true);
    api
      .get(`/ml/${experimentId}/status`)
      .then((r) => setStatus(r.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [experimentId]);

  const cardCls = `rounded-2xl border p-5 ${
    isDark ? "bg-[#0D0E1A] border-white/[0.07]" : "bg-white border-gray-200 shadow-sm"
  }`;

  if (loading) {
    return (
      <div className={cardCls}>
        <div className={`h-4 w-40 rounded animate-pulse ${isDark ? "bg-white/10" : "bg-gray-200"}`} />
      </div>
    );
  }

  if (error || (!status?.conversion_model_trained && !status?.uplift_model_trained)) {
    return (
      <div className={cardCls}>
        <h3 className={`font-display font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
          ML Predictions
        </h3>
        <p className={`text-sm mt-2 ${isDark ? "text-white/40" : "text-gray-500"}`}>
          No trained models yet for this experiment. Run{" "}
          <code className={`px-1 py-0.5 rounded text-xs ${isDark ? "bg-white/10" : "bg-gray-100"}`}>
            python -m app.ml.train_conversion_model
          </code>{" "}
          and{" "}
          <code className={`px-1 py-0.5 rounded text-xs ${isDark ? "bg-white/10" : "bg-gray-100"}`}>
            train_uplift_model
          </code>{" "}
          against this experiment's id to populate this panel.
        </p>
      </div>
    );
  }

  const maxImportance = status.top_features?.length
    ? Math.max(...status.top_features.map((f) => f.importance))
    : 1;

  const upliftEntries = status.uplift_by_device
    ? Object.entries(status.uplift_by_device).sort((a, b) => b[1] - a[1])
    : [];
  const maxUplift = upliftEntries.length
    ? Math.max(...upliftEntries.map(([, v]) => Math.abs(v)))
    : 1;

  return (
    <div className={cardCls}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-display font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
          ML Predictions
        </h3>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-violet/15 text-brand-violet">
          ML
        </span>
      </div>

      {status.conversion_model_trained && (
        <div className="mb-6">
          <p className={`text-xs font-medium mb-2 ${isDark ? "text-white/60" : "text-gray-500"}`}>
            Conversion model — ROC-AUC
          </p>
          <div className="flex items-center gap-6">
            <div>
              <p className={`text-2xl font-display font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                {status.conversion_roc_auc?.toFixed(3)}
              </p>
              <p className={`text-[10px] ${isDark ? "text-white/30" : "text-gray-400"}`}>XGBoost</p>
            </div>
            <div>
              <p className={`text-lg font-mono ${isDark ? "text-white/40" : "text-gray-400"}`}>
                {status.conversion_baseline_roc_auc?.toFixed(3)}
              </p>
              <p className={`text-[10px] ${isDark ? "text-white/30" : "text-gray-400"}`}>Logistic baseline</p>
            </div>
          </div>

          {status.top_features?.length > 0 && (
            <div className="mt-4">
              <p className={`text-xs font-medium mb-2 ${isDark ? "text-white/60" : "text-gray-500"}`}>
                Top features (mean |SHAP value|)
              </p>
              {status.top_features.slice(0, 5).map((f) => (
                <Bar key={f.name} label={f.name.split("__").pop()} value={f.importance} max={maxImportance} isDark={isDark} />
              ))}
            </div>
          )}
        </div>
      )}

      {status.uplift_model_trained && upliftEntries.length > 0 && (
        <div>
          <p className={`text-xs font-medium mb-2 ${isDark ? "text-white/60" : "text-gray-500"}`}>
            Predicted uplift of Variant B, by device
          </p>
          {upliftEntries.map(([device, value]) => (
            <Bar key={device} label={device} value={value} max={maxUplift} isDark={isDark} />
          ))}
          <p className={`text-[11px] mt-3 ${isDark ? "text-white/30" : "text-gray-400"}`}>
            Positive = Variant B predicted to convert better for that segment than Variant A.
          </p>
        </div>
      )}
    </div>
  );
}