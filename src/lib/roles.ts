export enum Role {
  GUEST = 'guest',
  MEMBER = 'member',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
}

export enum Permission {
  // Message permissions
  SEND_MESSAGE = 'send_message',
  DELETE_MESSAGE = 'delete_message',
  EDIT_MESSAGE = 'edit_message',

  // User management
  KICK_USER = 'kick_user',
  BAN_USER = 'ban_user',
  MUTE_USER = 'mute_user',

  // Channel management
  CREATE_CHANNEL = 'create_channel',
  DELETE_CHANNEL = 'delete_channel',
  MANAGE_CHANNEL = 'manage_channel',

  // Role management
  MANAGE_ROLES = 'manage_roles',
  ASSIGN_ROLES = 'assign_roles',

  // Server management
  MANAGE_SERVER = 'manage_server',
  VIEW_AUDIT_LOG = 'view_audit_log',

  // Administrative
  ADMINISTRATE = 'administrate',
}

export const rolePermissions: Record<Role, Permission[]> = {
  [Role.GUEST]: [
    Permission.SEND_MESSAGE,
  ],
  [Role.MEMBER]: [
    Permission.SEND_MESSAGE,
    Permission.EDIT_MESSAGE,
    Permission.CREATE_CHANNEL,
  ],
  [Role.MODERATOR]: [
    Permission.SEND_MESSAGE,
    Permission.EDIT_MESSAGE,
    Permission.DELETE_MESSAGE,
    Permission.KICK_USER,
    Permission.MUTE_USER,
    Permission.CREATE_CHANNEL,
    Permission.MANAGE_CHANNEL,
    Permission.ASSIGN_ROLES,
  ],
  [Role.ADMIN]: [
    Permission.SEND_MESSAGE,
    Permission.EDIT_MESSAGE,
    Permission.DELETE_MESSAGE,
    Permission.KICK_USER,
    Permission.BAN_USER,
    Permission.MUTE_USER,
    Permission.CREATE_CHANNEL,
    Permission.DELETE_CHANNEL,
    Permission.MANAGE_CHANNEL,
    Permission.MANAGE_ROLES,
    Permission.ASSIGN_ROLES,
    Permission.MANAGE_SERVER,
    Permission.VIEW_AUDIT_LOG,
    Permission.ADMINISTRATE,
  ],
};

export const roleHierarchy: Record<Role, number> = {
  [Role.GUEST]: 0,
  [Role.MEMBER]: 1,
  [Role.MODERATOR]: 2,
  [Role.ADMIN]: 3,
};

export function getRoleLevel(role: Role): number {
  return roleHierarchy[role];
}

export function hasHigherOrEqualRole(userRole: Role, targetRole: Role): boolean {
  return getRoleLevel(userRole) >= getRoleLevel(targetRole);
}