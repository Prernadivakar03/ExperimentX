import { useAuth } from "../context/AuthContext";

const ROLE_RANK = { viewer: 0, editor: 1, admin: 2 };

/**
 * usePermission("editor") -> true if the current user's role is editor
 * or higher (editor or admin). Mirrors the backend's _ROLE_RANK check in
 * rbac.py exactly, so frontend and backend never disagree about who can
 * do what.
 */
export function usePermission(minimumRole) {
  const { user } = useAuth();
  if (!user?.role) return false;
  return ROLE_RANK[user.role] >= ROLE_RANK[minimumRole];
}