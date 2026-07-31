// experimentx-sdk.js
/**
 * ExperimentX client SDK — vanilla JS, no dependencies.
 *
 * Usage:
 *   ExperimentX.init({ apiUrl: "https://api.your-domain.com" });
 *   const variant = await ExperimentX.getVariant("experiment-uuid");
 *   if (variant.label === "B") { ...show variant B... }
 *   ExperimentX.trackConversion("experiment-uuid", "purchase", 49.99);
 *
 * All network calls fail silently (never throw into your app) — a broken
 * or slow tracking call should never break the page it's embedded in.
 */
(function (global) {
  const STORAGE_FINGERPRINT_KEY = "ex_fingerprint";
  const STORAGE_VISITED_KEY = "ex_has_visited";
  const STORAGE_ASSIGNMENT_PREFIX = "ex_assignment_";

  let config = { apiUrl: "http://localhost:8000" };

  function getFingerprint() {
    let fp = localStorage.getItem(STORAGE_FINGERPRINT_KEY);
    if (!fp) {
      fp = "fp_" + crypto.randomUUID();
      localStorage.setItem(STORAGE_FINGERPRINT_KEY, fp);
    }
    return fp;
  }

  function checkAndMarkReturning() {
    const isReturning = localStorage.getItem(STORAGE_VISITED_KEY) === "true";
    localStorage.setItem(STORAGE_VISITED_KEY, "true");
    return isReturning;
  }

  function detectDevice() {
    const ua = navigator.userAgent;
    if (/tablet|ipad/i.test(ua)) return "tablet";
    if (/mobile|android|iphone/i.test(ua)) return "mobile";
    return "desktop";
  }

  function detectBrowser() {
    const ua = navigator.userAgent;
    if (ua.includes("Edg/")) return "edge";
    if (ua.includes("Chrome/") && !ua.includes("Edg/")) return "chrome";
    if (ua.includes("Firefox/")) return "firefox";
    if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "safari";
    return "other";
  }

  function detectTrafficSource() {
    const params = new URLSearchParams(location.search);
    const utmSource = params.get("utm_source");
    const utmMedium = params.get("utm_medium");

    if (utmMedium === "cpc" || utmMedium === "paid") return "paid";
    if (utmSource) return "social".includes(utmSource.toLowerCase()) ? "social" : "referral";

    const ref = document.referrer;
    if (!ref) return "direct";
    if (/google|bing|duckduckgo|yahoo/i.test(ref)) return "organic";
    if (/facebook|twitter|x\.com|instagram|linkedin|reddit/i.test(ref)) return "social";
    return "referral";
  }

  async function safeFetch(url, options) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.warn("[ExperimentX] request failed:", e.message);
      return null;
    }
  }

  const ExperimentX = {
    init(options = {}) {
      config = { ...config, ...options };
    },

    async getVariant(experimentId) {
      const cacheKey = STORAGE_ASSIGNMENT_PREFIX + experimentId;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          localStorage.removeItem(cacheKey);
        }
      }

      const fingerprint = getFingerprint();
      const isReturning = checkAndMarkReturning();

      const data = await safeFetch(`${config.apiUrl}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experiment_id: experimentId,
          fingerprint,
          device: detectDevice(),
          browser: detectBrowser(),
          traffic_source: detectTrafficSource(),
          is_returning: isReturning,
        }),
      });

      if (!data || !data.eligible) return null;

      const result = {
        visitorId: data.visitor_id,
        variantId: data.variant_id,
        label: data.variant_label,
        name: data.variant_name,
      };
      localStorage.setItem(cacheKey, JSON.stringify(result));
      return result;
    },

    async trackEvent(experimentId, eventType, value = null) {
      const cacheKey = STORAGE_ASSIGNMENT_PREFIX + experimentId;
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return;

      const assignment = JSON.parse(cached);
      await safeFetch(`${config.apiUrl}/track-event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experiment_id: experimentId,
          variant_id: assignment.variantId,
          visitor_id: assignment.visitorId,
          event_type: eventType,
          value,
        }),
      });
    },

    async trackConversion(experimentId, goal, value = null) {
      const cacheKey = STORAGE_ASSIGNMENT_PREFIX + experimentId;
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return;

      const assignment = JSON.parse(cached);
      await safeFetch(`${config.apiUrl}/track-conversion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experiment_id: experimentId,
          variant_id: assignment.variantId,
          visitor_id: assignment.visitorId,
          goal,
          value,
        }),
      });
    },

    async isFeatureEnabled(flagKey, ownerId) {
      const fingerprint = getFingerprint();
      const data = await safeFetch(
        `${config.apiUrl}/flags/${encodeURIComponent(flagKey)}/evaluate` +
          `?fingerprint=${encodeURIComponent(fingerprint)}&owner_id=${encodeURIComponent(ownerId)}`,
      );
      return data ? data.enabled : false;
    },
  };

  global.ExperimentX = ExperimentX;
})(typeof window !== "undefined" ? window : globalThis);