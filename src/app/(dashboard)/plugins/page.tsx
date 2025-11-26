'use client';

import PluginMarketplace from '@/components/marketplace/PluginMarketplace';

export default function PluginsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Marketplace плагинов</h1>
        <p className="text-gray-600">Расширьте возможности FOCUS с помощью сторонних плагинов и интеграций</p>
      </div>

      <PluginMarketplace />
    </div>
  );
}