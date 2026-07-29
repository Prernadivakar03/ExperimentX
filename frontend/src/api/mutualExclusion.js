// frontend/src/api/mutualExclusion.js
import api from "../services/api";

export const listMutualExclusionGroups = () => api.get("/mutual-exclusion-groups/");

export const createMutualExclusionGroup = (data) =>
  api.post("/mutual-exclusion-groups/", data);

export const deleteMutualExclusionGroup = (groupId) =>
  api.delete(`/mutual-exclusion-groups/${groupId}`);