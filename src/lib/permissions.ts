import { Role, Permission, rolePermissions, hasHigherOrEqualRole } from './roles';

export function hasPermission(userRole: Role, permission: Permission): boolean {
  return rolePermissions[userRole].includes(permission);
}

export function canSendMessage(userRole: Role): boolean {
  return hasPermission(userRole, Permission.SEND_MESSAGE);
}

export function canDeleteMessage(userRole: Role): boolean {
  return hasPermission(userRole, Permission.DELETE_MESSAGE);
}

export function canEditMessage(userRole: Role): boolean {
  return hasPermission(userRole, Permission.EDIT_MESSAGE);
}

export function canKickUser(userRole: Role): boolean {
  return hasPermission(userRole, Permission.KICK_USER);
}

export function canBanUser(userRole: Role): boolean {
  return hasPermission(userRole, Permission.BAN_USER);
}

export function canMuteUser(userRole: Role): boolean {
  return hasPermission(userRole, Permission.MUTE_USER);
}

export function canCreateChannel(userRole: Role): boolean {
  return hasPermission(userRole, Permission.CREATE_CHANNEL);
}

export function canDeleteChannel(userRole: Role): boolean {
  return hasPermission(userRole, Permission.DELETE_CHANNEL);
}

export function canManageChannel(userRole: Role): boolean {
  return hasPermission(userRole, Permission.MANAGE_CHANNEL);
}

export function canManageRoles(userRole: Role): boolean {
  return hasPermission(userRole, Permission.MANAGE_ROLES);
}

export function canAssignRoles(userRole: Role): boolean {
  return hasPermission(userRole, Permission.ASSIGN_ROLES);
}

export function canManageServer(userRole: Role): boolean {
  return hasPermission(userRole, Permission.MANAGE_SERVER);
}

export function canViewAuditLog(userRole: Role): boolean {
  return hasPermission(userRole, Permission.VIEW_AUDIT_LOG);
}

export function canAdministrate(userRole: Role): boolean {
  return hasPermission(userRole, Permission.ADMINISTRATE);
}

// Hierarchical checks
export function canManageUser(userRole: Role, targetUserRole: Role): boolean {
  return hasHigherOrEqualRole(userRole, targetUserRole) && canAssignRoles(userRole);
}

export function canKickSpecificUser(userRole: Role, targetUserRole: Role): boolean {
  return hasHigherOrEqualRole(userRole, targetUserRole) && canKickUser(userRole);
}

export function canBanSpecificUser(userRole: Role, targetUserRole: Role): boolean {
  return hasHigherOrEqualRole(userRole, targetUserRole) && canBanUser(userRole);
}

export function canMuteSpecificUser(userRole: Role, targetUserRole: Role): boolean {
  return hasHigherOrEqualRole(userRole, targetUserRole) && canMuteUser(userRole);
}