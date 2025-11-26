'use client';

import Link from 'next/link';

const navigation = [
  { name: 'Чаты', href: '/chats', icon: '💬' },
  { name: 'Друзья', href: '/friends', icon: '👥' },
  { name: 'Звонки', href: '/calls', icon: '📞' },
  { name: 'VR', href: '/vr', icon: '🎮' },
  { name: 'Избранное', href: '/favorites', icon: '⭐' },
];

export default function MobileNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-blue-500 text-white border-t border-blue-400 flex justify-around py-2 shadow-lg">
      {navigation.map((item) => (
        <Link key={item.name} href={item.href} className="flex flex-col items-center text-xs hover:bg-blue-600 px-2 py-1 rounded transition-colors">
          <span className="text-lg mb-1">{item.icon}</span>
          <span>{item.name}</span>
        </Link>
      ))}
    </div>
  );
}