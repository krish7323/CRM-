import { ALL_ROLES } from '../types/index.js';

export const ROLE_RANKS = {
  Owner: 0,
  Admin: 1,
  Counsellor: 2,
  Teacher: 3,
  Accountant: 4,
  Librarian: 4,
  'Transport Manager': 4,
  HR: 4,
  Parent: 5,
  Student: 6,
};

export const canManageUser = (actorRole, targetRole) => {
  const actorRank = ROLE_RANKS[actorRole] ?? 99;
  const targetRank = ROLE_RANKS[targetRole] ?? 99;
  return actorRank < targetRank;
};

export const getCreatableRoles = (actorRole) => {
  const actorRank = ROLE_RANKS[actorRole] ?? 99;
  return ALL_ROLES.filter((r) => (ROLE_RANKS[r] ?? 99) > actorRank);
};
