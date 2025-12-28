'use client';

import { useState, useRef, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const navigation = [
  { name: 'Чаты', href: '/chats', icon: '💬' },
  { name: 'Друзья', href: '/friends', icon: '👥' },
  { name: 'Звонки', href: '/calls', icon: '📞' },
  { name: 'VR', href: '/vr', icon: '🎮' },
  { name: 'Избранное', href: '/favorites', icon: '⭐' },
];

export default function MobileNav() {
  const router = useRouter();
  const pathname = usePathname();
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const activeIndex = useMemo(() => {
    const currentIndex = navigation.findIndex(item => item.href === pathname);
    return currentIndex !== -1 ? currentIndex : 0;
  }, [pathname]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current || !touchStartY.current) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchStartX.current - touchEndX;
    const deltaY = touchStartY.current - touchEndY;

    // Проверяем, что свайп горизонтальный и достаточно длинный
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0 && activeIndex < navigation.length - 1) {
        // Свайп влево - следующий раздел
        const nextIndex = activeIndex + 1;
        setActiveIndex(nextIndex);
        router.push(navigation[nextIndex].href);
      } else if (deltaX < 0 && activeIndex > 0) {
        // Свайп вправо - предыдущий раздел
        const prevIndex = activeIndex - 1;
        setActiveIndex(prevIndex);
        router.push(navigation[prevIndex].href);
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div
      ref={navRef}
      className="md:hidden fixed bottom-0 left-0 right-0 bg-blue-500 text-white border-t border-blue-400 flex justify-around py-2 shadow-lg"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {navigation.map((item, index) => (
        <Link
          key={item.name}
          href={item.href}
          className={`flex flex-col items-center text-xs px-2 py-1 rounded transition-all duration-300 ${
            index === activeIndex
              ? 'bg-blue-600 scale-110 shadow-md'
              : 'hover:bg-blue-600'
          }`}
        >
          <span className="text-lg mb-1">{item.icon}</span>
          <span>{item.name}</span>
        </Link>
      ))}
      {/* Индикатор активного раздела */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-1">
        <div className="flex space-x-1">
          {navigation.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'bg-white' : 'bg-blue-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}