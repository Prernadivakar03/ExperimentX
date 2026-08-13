import api from "../services/api";

export const getWebhookSettings = (orgId) => api.get(`/organizations/${orgId}/webhook`);

export const updateWebhookSettings = (orgId, webhook_url, webhook_events) =>
  api.put(`/organizations/${orgId}/webhook`, { webhook_url, webhook_events });

export const testWebhook = (orgId) => api.post(`/organizations/${orgId}/webhook/test`);