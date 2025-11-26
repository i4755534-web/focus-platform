'use client';

import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Администрирование</h1>
        <p className="text-gray-600">Центр управления платформой FOCUS</p>
      </div>

      <AdminDashboard />
    </div>
  );
}