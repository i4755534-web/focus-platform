'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ContextualTransition, useContextualTransition } from './ContextualTransition';

interface PageTransitionProviderProps {
  children: React.ReactNode;
}

const getTransitionDirection = (from: string, to: string): 'chat-to-call' | 'call-to-board' | 'board-to-chat' | 'default' => {
  // Define transition logic based on page relationships
  const chatPages = ['/chats', '/friends', '/search'];
  const callPages = ['/calls', '/vr'];
  const boardPages = ['/favorites', '/achievements', '/analytics'];

  const isFromChat = chatPages.some(page => from.startsWith(page));
  const isToCall = callPages.some(page => to.startsWith(page));
  const isFromCall = callPages.some(page => from.startsWith(page));
  const isToBoard = boardPages.some(page => to.startsWith(page));
  const isFromBoard = boardPages.some(page => from.startsWith(page));
  const isToChat = chatPages.some(page => to.startsWith(page));

  if (isFromChat && isToCall) return 'chat-to-call';
  if (isFromCall && isToBoard) return 'call-to-board';
  if (isFromBoard && isToChat) return 'board-to-chat';

  return 'default';
};

export function PageTransitionProvider({ children }: PageTransitionProviderProps) {
  const pathname = usePathname();
  const { currentTransition, startTransition, endTransition } = useContextualTransition();
  const [previousPath, setPreviousPath] = useState<string>(pathname);

  useEffect(() => {
    if (pathname !== previousPath) {
      const direction = getTransitionDirection(previousPath, pathname);
      startTransition(direction);

      // End transition after animation completes
      const timer = setTimeout(() => {
        endTransition();
        setPreviousPath(pathname);
      }, 600); // Match animation duration

      return () => clearTimeout(timer);
    }
  }, [pathname, previousPath, startTransition, endTransition]);

  return (
    <>
      <ContextualTransition
        isActive={currentTransition.isActive}
        direction={currentTransition.direction}
      >
        {children}
      </ContextualTransition>
      {!currentTransition.isActive && children}
    </>
  );
}