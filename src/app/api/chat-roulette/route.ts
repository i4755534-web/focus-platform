import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { findBestMatches } from '@/components/chat-roulette/MatchAlgorithm';
import type { User } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { userId, preferences } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const currentUser = await db.getUser(userId);
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all users except current
    const allUsers = (await db.getAllUsers()).filter(u => u.id !== userId);

    // Use advanced matching algorithm
    const bestMatches = findBestMatches(currentUser, allUsers, preferences, 10);

    if (bestMatches.length === 0) {
      return NextResponse.json({ error: 'No matches found with current preferences' }, { status: 404 });
    }

    // Select the best match
    const bestMatch = bestMatches[0];

    return NextResponse.json({
      match: {
        id: bestMatch.user.id,
        displayName: bestMatch.user.displayName,
        age: bestMatch.user.age,
        gender: bestMatch.user.gender,
        interests: bestMatch.user.interests,
        hobbies: bestMatch.user.hobbies,
        games: bestMatch.user.games,
        photos: bestMatch.user.photos,
        location: bestMatch.user.location,
        bio: bestMatch.user.bio,
      },
      compatibilityScore: bestMatch.compatibilityScore
    });

  } catch (error) {
    console.error('Chat roulette error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}