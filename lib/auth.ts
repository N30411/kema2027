import type { UserRole } from "@/types"

/**
 * Check if a user has permission to perform an action
 * @param userRole - The user's role
 * @param action - The action to perform (create, read, update, delete)
 * @param resource - The resource being accessed (supporters, agents, wards, etc.)
 */
export function hasPermission(
  userRole: UserRole,
  action: "create" | "read" | "update" | "delete",
  resource: string
): boolean {
  const permissions: Record<UserRole, Record<string, string[]>> = {
    admin: {
      supporters: ["create", "read", "update", "delete"],
      agents: ["create", "read", "update", "delete"],
      wards: ["create", "read", "update", "delete"],
      llgs: ["create", "read", "update", "delete"],
      events: ["create", "read", "update", "delete"],
      users: ["create", "read", "update", "delete"],
    },
    campaign_manager: {
      supporters: ["create", "read", "update"],
      agents: ["create", "read", "update"],
      wards: ["read"],
      llgs: ["read"],
      events: ["create", "read", "update"],
      users: ["read"],
    },
    agent: {
      supporters: ["create", "read", "update"],
      agents: ["read"],
      wards: ["read"],
      llgs: ["read"],
      events: ["read"],
      users: [],
    },
  }

  const resourcePermissions = permissions[userRole]?.[resource] || []
  return resourcePermissions.includes(action)
}

/**
 * Check if user can manage a specific supporter
 * (agents can only manage their own, managers/admins can manage all)
 */
export function canManageSupporter(
  userRole: UserRole,
  supporterRegisteredBy: string,
  currentUserId: string
): boolean {
  if (userRole === "admin" || userRole === "campaign_manager") {
    return true
  }

  if (userRole === "agent") {
    return supporterRegisteredBy === currentUserId
  }

  return false
}

/**
 * Get allowed filters based on user role
 */
export function getAllowedFilters(userRole: UserRole) {
  const filters: Record<UserRole, string[]> = {
    admin: ["llg", "support_level", "gender", "registered_by"],
    campaign_manager: ["llg", "support_level", "gender", "registered_by"],
    agent: ["llg", "support_level", "gender"],
  }

  return filters[userRole] || []
}

/**
 * Check if user can delete a supporter
 */
export function canDeleteSupporter(userRole: UserRole): boolean {
  return userRole === "admin"
}

/**
 * Check if user can delete/manage users
 */
export function canManageUsers(userRole: UserRole): boolean {
  return userRole === "admin"
}

/**
 * Get user display role name
 */
export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    admin: "Administrator",
    campaign_manager: "Campaign Manager",
    agent: "Campaign Agent",
  }
  return roleNames[role] || role
}
