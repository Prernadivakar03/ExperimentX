// // experimentx-sdk.js
// /**
//  * ExperimentX client SDK — vanilla JS, no dependencies.
//  *
//  * Usage:
//  *   ExperimentX.init({ apiUrl: "https://api.your-domain.com" });
//  *   const variant = await ExperimentX.getVariant("experiment-uuid");
//  *   if (variant.label === "B") { ...show variant B... }
//  *   ExperimentX.trackConversion("experiment-uuid", "purchase", 49.99);
//  *
//  * All network calls fail silently (never throw into your app) — a broken
//  * or slow tracking call should never break the page it's embedded in.
//  */
// (function (global) {
//   const STORAGE_FINGERPRINT_KEY = "ex_fingerprint";
//   const STORAGE_VISITED_KEY = "ex_has_visited";
//   const STORAGE_ASSIGNMENT_PREFIX = "ex_assignment_";

//   let config = { apiUrl: "http://localhost:8000" };

//   function getFingerprint() {
//     let fp = localStorage.getItem(STORAGE_FINGERPRINT_KEY);
//     if (!fp) {
//       fp = "fp_" + crypto.randomUUID();
//       localStorage.setItem(STORAGE_FINGERPRINT_KEY, fp);
//     }
//     return fp;
//   }

//   function checkAndMarkReturning() {
//     const isReturning = localStorage.getItem(STORAGE_VISITED_KEY) === "true";
//     localStorage.setItem(STORAGE_VISITED_KEY, "true");
//     return isReturning;
//   }

//   function detectDevice() {
//     const ua = navigator.userAgent;
//     if (/tablet|ipad/i.test(ua)) return "tablet";
//     if (/mobile|android|iphone/i.test(ua)) return "mobile";
//     return "desktop";
//   }

//   function detectBrowser() {
//     const ua = navigator.userAgent;
//     if (ua.includes("Edg/")) return "edge";
//     if (ua.includes("Chrome/") && !ua.includes("Edg/")) return "chrome";
//     if (ua.includes("Firefox/")) return "firefox";
//     if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "safari";
//     return "other";
//   }

//   function detectTrafficSource() {
//     const params = new URLSearchParams(location.search);
//     const utmSource = params.get("utm_source");
//     const utmMedium = params.get("utm_medium");

//     if (utmMedium === "cpc" || utmMedium === "paid") return "paid";
//     if (utmSource) return "social".includes(utmSource.toLowerCase()) ? "social" : "referral";

//     const ref = document.referrer;
//     if (!ref) return "direct";
//     if (/google|bing|duckduckgo|yahoo/i.test(ref)) return "organic";
//     if (/facebook|twitter|x\.com|instagram|linkedin|reddit/i.test(ref)) return "social";
//     return "referral";
//   }

//   async function safeFetch(url, options) {
//     try {
//       const res = await fetch(url, options);
//       if (!res.ok) return null;
//       return await res.json();
//     } catch (e) {
//       console.warn("[ExperimentX] request failed:", e.message);
//       return null;
//     }
//   }

//   const ExperimentX = {
//     init(options = {}) {
//       config = { ...config, ...options };
//     },

//     async getVariant(experimentId) {
//       const cacheKey = STORAGE_ASSIGNMENT_PREFIX + experimentId;
//       const cached = localStorage.getItem(cacheKey);
//       if (cached) {
//         try {
//           return JSON.parse(cached);
//         } catch {
//           localStorage.removeItem(cacheKey);
//         }
//       }

//       const fingerprint = getFingerprint();
//       const isReturning = checkAndMarkReturning();

//       const data = await safeFetch(`${config.apiUrl}/assign`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           experiment_id: experimentId,
//           fingerprint,
//           device: detectDevice(),
//           browser: detectBrowser(),
//           traffic_source: detectTrafficSource(),
//           is_returning: isReturning,
//         }),
//       });

//       if (!data || !data.eligible) return null;

//       const result = {
//         visitorId: data.visitor_id,
//         variantId: data.variant_id,
//         label: data.variant_label,
//         name: data.variant_name,
//       };
//       localStorage.setItem(cacheKey, JSON.stringify(result));
//       return result;
//     },

//     async trackEvent(experimentId, eventType, value = null) {
//       const cacheKey = STORAGE_ASSIGNMENT_PREFIX + experimentId;
//       const cached = localStorage.getItem(cacheKey);
//       if (!cached) return;

//       const assignment = JSON.parse(cached);
//       await safeFetch(`${config.apiUrl}/track-event`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           experiment_id: experimentId,
//           variant_id: assignment.variantId,
//           visitor_id: assignment.visitorId,
//           event_type: eventType,
//           value,
//         }),
//       });
//     },

//     async trackConversion(experimentId, goal, value = null) {
//       const cacheKey = STORAGE_ASSIGNMENT_PREFIX + experimentId;
//       const cached = localStorage.getItem(cacheKey);
//       if (!cached) return;

//       const assignment = JSON.parse(cached);
//       await safeFetch(`${config.apiUrl}/track-conversion`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           experiment_id: experimentId,
//           variant_id: assignment.variantId,
//           visitor_id: assignment.visitorId,
//           goal,
//           value,
//         }),
//       });
//     },

//     async isFeatureEnabled(flagKey, ownerId) {
//       const fingerprint = getFingerprint();
//       const data = await safeFetch(
//         `${config.apiUrl}/flags/${encodeURIComponent(flagKey)}/evaluate` +
//           `?fingerprint=${encodeURIComponent(fingerprint)}&owner_id=${encodeURIComponent(ownerId)}`,
//       );
//       return data ? data.enabled : false;
//     },
//   };

//   global.ExperimentX = ExperimentX;
// })(typeof window !== "undefined" ? window : globalThis);




















// // experimentx-sdk.js
// /**
//  * ExperimentX client SDK — vanilla JS, no dependencies.
//  *
//  * Usage:
//  *   ExperimentX.init({ apiUrl: "https://api.your-domain.com", apiKey: "expx_live_..." });
//  *   const variant = await ExperimentX.getVariant("experiment-uuid");
//  *   if (variant.label === "B") { ...show variant B... }
//  *   ExperimentX.trackConversion("experiment-uuid", "purchase", 49.99);
//  *
//  * All network calls fail silently (never throw into your app) — a broken
//  * or slow tracking call should never break the page it's embedded in.
//  */
// (function (global) {
//   const STORAGE_FINGERPRINT_KEY = "ex_fingerprint";
//   const STORAGE_VISITED_KEY = "ex_has_visited";
//   const STORAGE_ASSIGNMENT_PREFIX = "ex_assignment_";

//   let config = { apiUrl: "http://localhost:8000", apiKey: null };

//   function authHeaders() {
//     return config.apiKey ? { "X-API-Key": config.apiKey } : {};
//   }

//   function getFingerprint() {
//     let fp = localStorage.getItem(STORAGE_FINGERPRINT_KEY);
//     if (!fp) {
//       fp = "fp_" + crypto.randomUUID();
//       localStorage.setItem(STORAGE_FINGERPRINT_KEY, fp);
//     }
//     return fp;
//   }

//   function checkAndMarkReturning() {
//     const isReturning = localStorage.getItem(STORAGE_VISITED_KEY) === "true";
//     localStorage.setItem(STORAGE_VISITED_KEY, "true");
//     return isReturning;
//   }

//   function detectDevice() {
//     const ua = navigator.userAgent;
//     if (/tablet|ipad/i.test(ua)) return "tablet";
//     if (/mobile|android|iphone/i.test(ua)) return "mobile";
//     return "desktop";
//   }

//   function detectBrowser() {
//     const ua = navigator.userAgent;
//     if (ua.includes("Edg/")) return "edge";
//     if (ua.includes("Chrome/") && !ua.includes("Edg/")) return "chrome";
//     if (ua.includes("Firefox/")) return "firefox";
//     if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "safari";
//     return "other";
//   }

//   function detectTrafficSource() {
//     const params = new URLSearchParams(location.search);
//     const utmSource = params.get("utm_source");
//     const utmMedium = params.get("utm_medium");

//     if (utmMedium === "cpc" || utmMedium === "paid") return "paid";
//     if (utmSource) return "social".includes(utmSource.toLowerCase()) ? "social" : "referral";

//     const ref = document.referrer;
//     if (!ref) return "direct";
//     if (/google|bing|duckduckgo|yahoo/i.test(ref)) return "organic";
//     if (/facebook|twitter|x\.com|instagram|linkedin|reddit/i.test(ref)) return "social";
//     return "referral";
//   }

//   async function safeFetch(url, options) {
//     try {
//       const res = await fetch(url, options);
//       if (!res.ok) return null;
//       return await res.json();
//     } catch (e) {
//       console.warn("[ExperimentX] request failed:", e.message);
//       return null;
//     }
//   }

//   const ExperimentX = {
//     init(options = {}) {
//       config = { ...config, ...options };
//       if (!config.apiKey) {
//         console.warn(
//           "[ExperimentX] No apiKey passed to init() — /assign and tracking " +
//           "calls will be rejected with 401. Get a key from " +
//           "Dashboard → Settings → API Keys."
//         );
//       }
//     },

//     async getVariant(experimentId) {
//       const cacheKey = STORAGE_ASSIGNMENT_PREFIX + experimentId;
//       const cached = localStorage.getItem(cacheKey);
//       if (cached) {
//         try {
//           return JSON.parse(cached);
//         } catch {
//           localStorage.removeItem(cacheKey);
//         }
//       }

//       const fingerprint = getFingerprint();
//       const isReturning = checkAndMarkReturning();

//       const data = await safeFetch(`${config.apiUrl}/assign`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...authHeaders() },
//         body: JSON.stringify({
//           experiment_id: experimentId,
//           fingerprint,
//           device: detectDevice(),
//           browser: detectBrowser(),
//           traffic_source: detectTrafficSource(),
//           is_returning: isReturning,
//         }),
//       });

//       if (!data || !data.eligible) return null;

//       const result = {
//         visitorId: data.visitor_id,
//         variantId: data.variant_id,
//         label: data.variant_label,
//         name: data.variant_name,
//       };
//       localStorage.setItem(cacheKey, JSON.stringify(result));
//       return result;
//     },

//     async trackEvent(experimentId, eventType, value = null) {
//       const cacheKey = STORAGE_ASSIGNMENT_PREFIX + experimentId;
//       const cached = localStorage.getItem(cacheKey);
//       if (!cached) return;

//       const assignment = JSON.parse(cached);
//       await safeFetch(`${config.apiUrl}/track-event`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...authHeaders() },
//         body: JSON.stringify({
//           experiment_id: experimentId,
//           variant_id: assignment.variantId,
//           visitor_id: assignment.visitorId,
//           event_type: eventType,
//           value,
//         }),
//       });
//     },

//     async trackConversion(experimentId, goal, value = null) {
//       const cacheKey = STORAGE_ASSIGNMENT_PREFIX + experimentId;
//       const cached = localStorage.getItem(cacheKey);
//       if (!cached) return;

//       const assignment = JSON.parse(cached);
//       await safeFetch(`${config.apiUrl}/track-conversion`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", ...authHeaders() },
//         body: JSON.stringify({
//           experiment_id: experimentId,
//           variant_id: assignment.variantId,
//           visitor_id: assignment.visitorId,
//           goal,
//           value,
//         }),
//       });
//     },

//   //   async isFeatureEnabled(flagKey, ownerId) {
//   //     const fingerprint = getFingerprint();
//   //     const data = await safeFetch(
//   //       `${config.apiUrl}/flags/${encodeURIComponent(flagKey)}/evaluate` +
//   //         `?fingerprint=${encodeURIComponent(fingerprint)}&owner_id=${encodeURIComponent(ownerId)}`,
//   //     );
//   //     return data ? data.enabled : false;
//   //   },
//   // };

//   async isFeatureEnabled(flagKey) {
//   const fingerprint = getFingerprint();
//   const data = await safeFetch(
//     `${config.apiUrl}/flags/${encodeURIComponent(flagKey)}/evaluate` +
//       `?fingerprint=${encodeURIComponent(fingerprint)}`,
//     { headers: authHeaders() },
//   );
//   return data ? data.enabled : false;
// },
//   };

//   global.ExperimentX = ExperimentX;
// })(typeof window !== "undefined" ? window : globalThis);









































// experimentx-sdk.js
/**
 * ExperimentX client SDK — vanilla JS, no dependencies.
 *
 * Usage:
 *   ExperimentX.init({ apiUrl: "https://api.your-domain.com", apiKey: "expx_live_..." });
 *   const variant = await ExperimentX.getVariant("experiment-uuid");
 *   if (variant.label === "B") { ...show variant B... }
 *   ExperimentX.trackConversion("experiment-uuid", "purchase", 49.99);
 *
 * Anti-flicker: pair this SDK with the ex-antiflicker <script> snippet in
 * <head> (hides <body> via opacity:0 synchronously, before this file even
 * loads). getVariant() reveals the page automatically once it resolves —
 * see the `autoReveal` option below if you need to apply DOM changes
 * before revealing.
 *
 * All network calls fail silently (never throw into your app) — a broken
 * or slow tracking call should never break the page it's embedded in.
 */
(function (global) {
  const STORAGE_FINGERPRINT_KEY = "ex_fingerprint";
  const STORAGE_VISITED_KEY = "ex_has_visited";
  const STORAGE_ASSIGNMENT_PREFIX = "ex_assignment_";
  const STORAGE_USER_ID_KEY = "ex_user_id";

  let config = { apiUrl: "http://localhost:8000", apiKey: null };

  function authHeaders() {
    return config.apiKey ? { "X-API-Key": config.apiKey } : {};
  }

  function getFingerprint() {
    let fp = localStorage.getItem(STORAGE_FINGERPRINT_KEY);
    if (!fp) {
      fp = "fp_" + crypto.randomUUID();
      localStorage.setItem(STORAGE_FINGERPRINT_KEY, fp);
    }
    return fp;
  }

  function getUserId() {
    return localStorage.getItem(STORAGE_USER_ID_KEY) || null;
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

  // Removes the ex-antiflicker <style> injected by the head snippet,
  // making the page visible again. Safe to call multiple times — a no-op
  // if the snippet's own 4s fail-safe already removed it, or if the
  // snippet was never included at all (no-op either way).
  function revealPage() {
    const el = document.getElementById("ex-antiflicker");
    if (el) el.remove();
  }

  const ExperimentX = {
    init(options = {}) {
      config = { ...config, ...options };
      if (!config.apiKey) {
        console.warn(
          "[ExperimentX] No apiKey passed to init() — /assign and tracking " +
          "calls will be rejected with 401. Get a key from " +
          "Dashboard → Settings → API Keys."
        );
      }
    },

    /**
     * Resolves this visitor's variant for an experiment.
     *
     * @param {string} experimentId
     * @param {object} [options]
     * @param {boolean} [options.autoReveal=true] - Reveal the page (undo
     *   the anti-flicker hide) as soon as this call resolves, success or
     *   failure. Set to false if you need to apply DOM changes for the
     *   variant first — call ExperimentX.revealPage() yourself right after,
     *   so there's no gap between "visible" and "variant applied".
     */
    async getVariant(experimentId, options = {}) {
      const { autoReveal = true } = options;
      try {
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
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({
            experiment_id: experimentId,
            fingerprint,
            device: detectDevice(),
            browser: detectBrowser(),
            traffic_source: detectTrafficSource(),
            is_returning: isReturning,
            user_id: getUserId(),
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
      } finally {
        // Reveal even on failure/early-return — a broken or slow /assign
        // call must never leave the page hidden past the snippet's own
        // 4s fail-safe.
        if (autoReveal) revealPage();
      }
    },

    // Manually undo the anti-flicker hide. Only needed when you called
    // getVariant(id, { autoReveal: false }) to apply DOM changes first.
    revealPage,

    async identify(userId) {
      if (!userId) return;
      localStorage.setItem(STORAGE_USER_ID_KEY, userId);

      const fingerprint = getFingerprint();
      const data = await safeFetch(`${config.apiUrl}/identify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ fingerprint, user_id: userId }),
      });
      return data; // { linked, conflicts } or null on failure
    },

    async trackEvent(experimentId, eventType, value = null) {
      const cacheKey = STORAGE_ASSIGNMENT_PREFIX + experimentId;
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return;

      const assignment = JSON.parse(cached);
      await safeFetch(`${config.apiUrl}/track-event`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
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
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          experiment_id: experimentId,
          variant_id: assignment.variantId,
          visitor_id: assignment.visitorId,
          goal,
          value,
        }),
      });
    },

    async isFeatureEnabled(flagKey, attributes = {}) {
      const fingerprint = getFingerprint();
      const params = new URLSearchParams({
        fingerprint,
        device: detectDevice(),
        url_path: window.location.pathname,
        ...attributes,
      });
      const data = await safeFetch(
        `${config.apiUrl}/flags/${encodeURIComponent(flagKey)}/evaluate?${params.toString()}`,
        { headers: authHeaders() }
      );
      return data ? data.enabled : false;
    },
  };

  global.ExperimentX = ExperimentX;
})(typeof window !== "undefined" ? window : globalThis);