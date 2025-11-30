'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChatClient from '@/components/chat/ChatClient';
import UserSwitcher from '@/components/UserSwitcher';
import AdvancedFilters from '@/components/chat-roulette/AdvancedFilters';
import ProfilePreview from '@/components/chat-roulette/ProfilePreview';
import { useChatRoulette } from '@/hooks/useChatRoulette';

export default function ChatRoulettePage() {
  const [currentUserId, setCurrentUserId] = useState('user-1');
  const {
    preferences,
    setPreferences,
    currentMatch,
    isSearching,
    error,
    findMatch,
    skipMatch,
    startChat,
    chatId,
  } = useChatRoulette(currentUserId);

  if (chatId) {
    return <ChatClient chatId={chatId} />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Чат-рулетка</h1>
        <UserSwitcher currentUserId={currentUserId} onUserChange={setCurrentUserId} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <AdvancedFilters
            preferences={preferences}
            onPreferencesChange={setPreferences}
          />

          <Card>
            <CardContent className="pt-6">
              <Button
                onClick={findMatch}
                disabled={isSearching}
                className="w-full"
                size="lg"
              >
                {isSearching ? 'Поиск собеседника...' : 'Найти собеседника'}
              </Button>
              {error && (
                <p className="text-sm text-destructive mt-2 text-center">{error}</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {currentMatch ? (
            <div className="space-y-4">
              <ProfilePreview
                user={currentMatch.user}
                compatibilityScore={currentMatch.compatibilityScore}
                currentUserLocation={preferences.location ? {
                  lat: preferences.location.lat,
                  lng: preferences.location.lng
                } : undefined}
              />

              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-2">
                    <Button
                      onClick={() => startChat(currentMatch)}
                      className="flex-1"
                      size="lg"
                    >
                      Начать чат
                    </Button>
                    <Button
                      onClick={skipMatch}
                      variant="outline"
                      size="lg"
                    >
                      Пропустить
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  <p>Нажмите «Найти собеседника» чтобы начать поиск</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}