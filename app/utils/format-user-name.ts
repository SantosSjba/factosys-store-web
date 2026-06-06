import type { StaffUser } from '~/types/admin-users'

export function formatUserName(user: Pick<StaffUser, 'firstName' | 'lastName' | 'email'>) {
  const parts = [user.firstName, user.lastName].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : user.email
}
