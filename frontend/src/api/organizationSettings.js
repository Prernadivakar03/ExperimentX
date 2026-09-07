import api from "../services/api";

export const getExperimentSettings = (orgId) =>
  api.get(`/organizations/${orgId}/settings`);

export const updateExperimentSettings = (orgId, updates) =>
  api.put(`/organizations/${orgId}/settings`, updates);