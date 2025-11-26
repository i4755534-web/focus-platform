'use client';

import TenantManager from '@/components/tenant/TenantManager';

export default function TenantsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Управление тенантами</h1>
        <p className="text-gray-600">Мульти-тенантная архитектура и управление организациями</p>
      </div>

      <TenantManager isAdmin={true} />
    </div>
  );
}