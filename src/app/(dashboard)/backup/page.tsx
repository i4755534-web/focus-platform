'use client';

import BackupManager from '@/components/backup/BackupManager';

export default function BackupPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Резервное копирование</h1>
        <p className="text-gray-600">Управление бэкапами и восстановлением системы</p>
      </div>

      <BackupManager />
    </div>
  );
}