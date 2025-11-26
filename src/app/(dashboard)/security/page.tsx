'use client';

import SecurityManager from '@/components/security/SecurityManager';

export default function SecurityPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Безопасность</h1>
        <p className="text-gray-600">Advanced security features, monitoring и защита от угроз</p>
      </div>

      <SecurityManager />
    </div>
  );
}