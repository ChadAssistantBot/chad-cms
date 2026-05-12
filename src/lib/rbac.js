/**
 * RBAC (Role-Based Access Control) utilities
 * 
 * User Roles:
 * - Admin: Full access to all features
 * - Manager: Can view and edit, but limited delete permissions
 * - Agent: Read-only access, no delete or critical edit permissions
 */

export const USER_ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  AGENT: 'Agent',
}

// Mock user data - In production, this would come from authentication context
export const getCurrentUser = () => {
  // For demo purposes, default to Admin. 
  // In real implementation, fetch from auth context or localStorage
  const storedRole = localStorage.getItem('userRole')
  return {
    id: '1',
    name: 'Chad',
    role: storedRole || USER_ROLES.ADMIN,
  }
}

export const setUserRole = (role) => {
  localStorage.setItem('userRole', role)
}

// Permission checks
export const canDelete = (userRole) => {
  return userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.MANAGER
}

export const canEdit = (userRole) => {
  return userRole !== USER_ROLES.AGENT
}

export const canCreate = (userRole) => {
  return userRole !== USER_ROLES.AGENT
}

export const isAdmin = (userRole) => {
  return userRole === USER_ROLES.ADMIN
}
