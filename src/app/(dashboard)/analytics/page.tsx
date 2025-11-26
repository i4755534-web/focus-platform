'use client';

import AdvancedAnalytics from '@/components/analytics/AdvancedAnalytics';

export default function AnalyticsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Аналитика</h1>
        <p className="text-gray-600">Комплексный анализ данных и бизнес-метрики платформы FOCUS</p>
      </div>

      <AdvancedAnalytics />
    </div>
  );
}