import api from "../services/api";

export const getMyOrganizations = () => api.get("/organizations/");

export const getMembers = (orgId) => api.get(`/organizations/${orgId}/members`);

export const inviteMember = (orgId, email, role) =>
  api.post(`/organizations/${orgId}/invite`, { email, role });

export const updateMemberRole = (orgId, membershipId, role) =>
  api.patch(`/organizations/${orgId}/members/${membershipId}/role`, { role });

export const removeMember = (orgId, membershipId) =>
  api.delete(`/organizations/${orgId}/members/${membershipId}`);