'use client';

import ServiceManager from '@/components/microservices/ServiceManager';

export default function MicroservicesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Микросервисы</h1>
        <p className="text-gray-600">Управление микросервисной архитектурой платформы</p>
      </div>

      <ServiceManager />
    </div>
  );
}