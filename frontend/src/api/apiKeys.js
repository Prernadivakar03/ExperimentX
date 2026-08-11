import api from "../services/api";

export const listApiKeys = (orgId) => api.get(`/organizations/${orgId}/api-keys/`);

export const createApiKey = (orgId, name) =>
  api.post(`/organizations/${orgId}/api-keys/`, { name });

export const revokeApiKey = (orgId, keyId) =>
  api.delete(`/organizations/${orgId}/api-keys/${keyId}`);