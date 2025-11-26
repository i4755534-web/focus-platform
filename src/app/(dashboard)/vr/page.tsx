'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function VRPage() {
  const [inVR, setInVR] = useState(false);

  const enterVR = () => {
    setInVR(true);
    // Simulate VR experience
    setTimeout(() => {
      setInVR(false);
      alert('VR сессия завершена');
    }, 5000);
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">VR Комнаты</h2>
      {inVR ? (
        <div className="text-center">
          <h3 className="text-xl mb-4">Добро пожаловать в VR комнату!</h3>
          <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-8 rounded-lg mb-4">
            <p className="text-white text-lg">🌐 Виртуальная реальность активирована</p>
            <p className="text-white">Исследуйте 3D пространство</p>
          </div>
          <p className="text-sm text-gray-500">Симуляция VR опыта...</p>
        </div>
      ) : (
        <div>
          <p className="mb-4">Создавайте и присоединяйтесь к виртуальным комнатам для иммерсивного общения.</p>
          <div className="space-y-4">
            <div className="border p-4 rounded">
              <h3 className="font-semibold">Комната 1</h3>
              <p>Общая комната для встреч</p>
              <Button onClick={enterVR} className="mt-2">Войти в VR</Button>
            </div>
            <div className="border p-4 rounded">
              <h3 className="font-semibold">Комната 2</h3>
              <p>Творческая студия</p>
              <Button onClick={enterVR} className="mt-2">Войти в VR</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}