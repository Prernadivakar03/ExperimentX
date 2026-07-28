// frontend/src/api/holdout.js
import api from "../services/api";

export const listHoldoutGroups = () => api.get("/holdout-groups/");

export const createHoldoutGroup = (data) => api.post("/holdout-groups/", data);

export const updateHoldoutGroup = (groupId, data) =>
  api.patch(`/holdout-groups/${groupId}`, data);

export const getHoldoutImpact = (groupId) =>
  api.get(`/holdout-groups/${groupId}/impact`);