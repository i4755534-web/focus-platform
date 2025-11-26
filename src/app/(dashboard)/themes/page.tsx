'use client';

import AdvancedThemingSystem from '@/components/theming/AdvancedThemingSystem';

export default function ThemesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Темы и оформление</h1>
        <p className="text-gray-600">Персонализируйте внешний вид FOCUS с помощью кастомных тем</p>
      </div>

      <AdvancedThemingSystem />
    </div>
  );
}