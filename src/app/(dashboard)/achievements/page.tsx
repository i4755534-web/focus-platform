'use client';

import GamificationSystem from '@/components/gamification/GamificationSystem';

export default function AchievementsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Достижения и награды</h1>
        <p className="text-gray-600">Отслеживайте свой прогресс и получайте награды за активность</p>
      </div>

      <GamificationSystem />
    </div>
  );
}