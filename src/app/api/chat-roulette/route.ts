import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
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

    // Filter by preferences
    let matches = allUsers;

    if (preferences?.gender && preferences.gender !== 'any') {
      matches = matches.filter((u: User) => u.gender === preferences.gender);
    }

    if (preferences?.ageRange) {
      const [min, max] = preferences.ageRange;
      matches = matches.filter((u: User) => u.age && u.age >= min && u.age <= max);
    }

    if (preferences?.interests?.length > 0) {
      matches = matches.filter((u: User) =>
        preferences.interests.some((interest: string) => u.interests.includes(interest))
      );
    }

    if (preferences?.hobbies?.length > 0) {
      matches = matches.filter((u: User) =>
        preferences.hobbies.some((hobby: string) => u.hobbies.includes(hobby))
      );
    }

    if (preferences?.games?.length > 0) {
      matches = matches.filter((u: User) =>
        preferences.games.some((game: string) => u.games.includes(game))
      );
    }

    // Randomly select one match
    const randomMatch = matches[Math.floor(Math.random() * matches.length)];

    if (!randomMatch) {
      return NextResponse.json({ error: 'No matches found' }, { status: 404 });
    }

    return NextResponse.json({
      match: {
        id: randomMatch.id,
        displayName: randomMatch.displayName,
        age: randomMatch.age,
        gender: randomMatch.gender,
        interests: randomMatch.interests,
        hobbies: randomMatch.hobbies,
        games: randomMatch.games,
      }
    });

  } catch (error) {
    console.error('Chat roulette error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}