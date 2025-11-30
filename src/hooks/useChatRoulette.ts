'use client';

import { useState, useCallback } from 'react';
import { findBestMatches } from '@/components/chat-roulette/MatchAlgorithm';
import type { User } from '@/lib/database';

interface Preferences {
  gender: string;
  ageRange: [number, number];
  interests: string[];
  hobbies: string[];
  games: string[];
  location?: {
    lat: number;
    lng: number;
    radius: number;
  };
}

interface MatchResult {
  user: User;
  compatibilityScore: number;
}

interface UseChatRouletteReturn {
  preferences: Preferences;
  setPreferences: (preferences: Preferences) => void;
  currentMatch: MatchResult | null;
  isSearching: boolean;
  error: string | null;
  findMatch: () => Promise<void>;
  skipMatch: () => void;
  startChat: (match: MatchResult) => void;
  chatId: string | null;
}

const defaultPreferences: Preferences = {
  gender: 'any',
  ageRange: [18, 99],
  interests: [],
  hobbies: [],
  games: [],
};

export function useChatRoulette(currentUserId: string): UseChatRouletteReturn {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [currentMatch, setCurrentMatch] = useState<MatchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);

  const findMatch = useCallback(async () => {
    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch('/api/chat-roulette', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, preferences }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to find match');
      }

      if (data.match) {
        // Calculate compatibility score
        const currentUser = await getCurrentUser();
        const compatibilityScore = currentUser ? calculateCompatibility(currentUser, data.match) : 0;

        setCurrentMatch({
          user: data.match,
          compatibilityScore
        });
      } else {
        setError('No matches found with current preferences');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSearching(false);
    }
  }, [currentUserId, preferences]);

  const skipMatch = useCallback(() => {
    setCurrentMatch(null);
    setError(null);
  }, []);

  const startChat = useCallback((match: MatchResult) => {
    const newChatId = `roulette-${currentUserId}-${match.user.id}-${Date.now()}`;
    setChatId(newChatId);
  }, [currentUserId]);

  // Helper function to get current user (mock implementation)
  const getCurrentUser = async (): Promise<User | null> => {
    try {
      const response = await fetch(`/api/users/${currentUserId}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.error('Failed to get current user:', err);
    }
    return null;
  };

  // Simple compatibility calculation (fallback)
  const calculateCompatibility = (user1: User, user2: User): number => {
    let score = 0;
    let total = 0;

    // Interests
    const commonInterests = user1.interests.filter(i => user2.interests.includes(i)).length;
    if (user1.interests.length > 0 || user2.interests.length > 0) {
      score += (commonInterests / Math.max(user1.interests.length, user2.interests.length)) * 30;
      total += 30;
    }

    // Hobbies
    const commonHobbies = user1.hobbies.filter(h => user2.hobbies.includes(h)).length;
    if (user1.hobbies.length > 0 || user2.hobbies.length > 0) {
      score += (commonHobbies / Math.max(user1.hobbies.length, user2.hobbies.length)) * 25;
      total += 25;
    }

    // Games
    const commonGames = user1.games.filter(g => user2.games.includes(g)).length;
    if (user1.games.length > 0 || user2.games.length > 0) {
      score += (commonGames / Math.max(user1.games.length, user2.games.length)) * 20;
      total += 20;
    }

    // Age
    if (user1.age && user2.age) {
      const ageDiff = Math.abs(user1.age - user2.age);
      score += Math.max(0, 100 - ageDiff * 2) * 0.15;
      total += 15;
    }

    // Location
    if (user1.location && user2.location) {
      const distance = calculateDistance(
        user1.location.lat, user1.location.lng,
        user2.location.lat, user2.location.lng
      );
      score += Math.max(0, 100 - distance / 5) * 0.05;
      total += 5;
    }

    return total > 0 ? Math.round(score / (total / 100)) : 50;
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return {
    preferences,
    setPreferences,
    currentMatch,
    isSearching,
    error,
    findMatch,
    skipMatch,
    startChat,
    chatId,
  };
}