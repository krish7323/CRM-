import { UserRole } from '../types';

export const ROLE_RANKS: Record<UserRole, number> = {
  'Admin': 1,
  'Counsellor': 2,
  'Teacher': 3,
  'Student': 4,
};

/**
 * Checks if the actor's role is strictly higher in hierarchy than the target role (Rank 1 is highest).
 */
export const canManageUser = (actorRole: UserRole, targetRole: UserRole): boolean => {
  const actorRank = ROLE_RANKS[actorRole] || 99;
  const targetRank = ROLE_RANKS[targetRole] || 99;
  return actorRank < targetRank;
};

/**
 * Returns a list of roles that the actor is allowed to create (strictly lower rank).
 */
export const getCreatableRoles = (actorRole: UserRole): UserRole[] => {
  const actorRank = ROLE_RANKS[actorRole] || 99;
  const allRoles: UserRole[] = ['Admin', 'Counsellor', 'Teacher', 'Student'];
  return allRoles.filter((r) => ROLE_RANKS[r] > actorRank);
};
