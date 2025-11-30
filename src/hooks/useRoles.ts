import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { Role, Permission } from '../lib/roles';
import * as permissions from '../lib/permissions';

export function useRoles() {
  const { user, isAuthenticated } = useAuth();

  const currentRole = useMemo((): Role => {
    if (!isAuthenticated || !user) {
      return Role.GUEST;
    }

    switch (user.role) {
      case 'admin':
        return Role.ADMIN;
      case 'moderator':
        return Role.MODERATOR;
      case 'user':
      default:
        return Role.MEMBER;
    }
  }, [user, isAuthenticated]);

  const hasPermission = (permission: Permission): boolean => {
    return permissions.hasPermission(currentRole, permission);
  };

  const canSendMessage = (): boolean => {
    return permissions.canSendMessage(currentRole);
  };

  const canDeleteMessage = (): boolean => {
    return permissions.canDeleteMessage(currentRole);
  };

  const canEditMessage = (): boolean => {
    return permissions.canEditMessage(currentRole);
  };

  const canKickUser = (): boolean => {
    return permissions.canKickUser(currentRole);
  };

  const canBanUser = (): boolean => {
    return permissions.canBanUser(currentRole);
  };

  const canMuteUser = (): boolean => {
    return permissions.canMuteUser(currentRole);
  };

  const canCreateChannel = (): boolean => {
    return permissions.canCreateChannel(currentRole);
  };

  const canDeleteChannel = (): boolean => {
    return permissions.canDeleteChannel(currentRole);
  };

  const canManageChannel = (): boolean => {
    return permissions.canManageChannel(currentRole);
  };

  const canManageRoles = (): boolean => {
    return permissions.canManageRoles(currentRole);
  };

  const canAssignRoles = (): boolean => {
    return permissions.canAssignRoles(currentRole);
  };

  const canManageServer = (): boolean => {
    return permissions.canManageServer(currentRole);
  };

  const canViewAuditLog = (): boolean => {
    return permissions.canViewAuditLog(currentRole);
  };

  const canAdministrate = (): boolean => {
    return permissions.canAdministrate(currentRole);
  };

  const canManageUser = (targetRole: Role): boolean => {
    return permissions.canManageUser(currentRole, targetRole);
  };

  const canKickSpecificUser = (targetRole: Role): boolean => {
    return permissions.canKickSpecificUser(currentRole, targetRole);
  };

  const canBanSpecificUser = (targetRole: Role): boolean => {
    return permissions.canBanSpecificUser(currentRole, targetRole);
  };

  const canMuteSpecificUser = (targetRole: Role): boolean => {
    return permissions.canMuteSpecificUser(currentRole, targetRole);
  };

  return {
    currentRole,
    hasPermission,
    canSendMessage,
    canDeleteMessage,
    canEditMessage,
    canKickUser,
    canBanUser,
    canMuteUser,
    canCreateChannel,
    canDeleteChannel,
    canManageChannel,
    canManageRoles,
    canAssignRoles,
    canManageServer,
    canViewAuditLog,
    canAdministrate,
    canManageUser,
    canKickSpecificUser,
    canBanSpecificUser,
    canMuteSpecificUser,
  };
}