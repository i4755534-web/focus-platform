'use client';

import type { User } from '@/lib/database';

interface MatchWithScore {
  user: User;
  compatibilityScore: number;
}

export function calculateCompatibility(user1: User, user2: User): number {
  let score = 0;
  let totalWeight = 0;

  // Interests compatibility (weight: 30%)
  const interestWeight = 30;
  const commonInterests = user1.interests.filter(interest =>
    user2.interests.includes(interest)
  ).length;
  const maxInterests = Math.max(user1.interests.length, user2.interests.length);
  const interestScore = maxInterests > 0 ? (commonInterests / maxInterests) * 100 : 50;
  score += interestScore * (interestWeight / 100);
  totalWeight += interestWeight;

  // Hobbies compatibility (weight: 25%)
  const hobbyWeight = 25;
  const commonHobbies = user1.hobbies.filter(hobby =>
    user2.hobbies.includes(hobby)
  ).length;
  const maxHobbies = Math.max(user1.hobbies.length, user2.hobbies.length);
  const hobbyScore = maxHobbies > 0 ? (commonHobbies / maxHobbies) * 100 : 50;
  score += hobbyScore * (hobbyWeight / 100);
  totalWeight += hobbyWeight;

  // Games compatibility (weight: 20%)
  const gameWeight = 20;
  const commonGames = user1.games.filter(game =>
    user2.games.includes(game)
  ).length;
  const maxGames = Math.max(user1.games.length, user2.games.length);
  const gameScore = maxGames > 0 ? (commonGames / maxGames) * 100 : 50;
  score += gameScore * (gameWeight / 100);
  totalWeight += gameWeight;

  // Age compatibility (weight: 15%)
  const ageWeight = 15;
  if (user1.age && user2.age) {
    const ageDiff = Math.abs(user1.age - user2.age);
    const ageScore = Math.max(0, 100 - ageDiff * 2); // Max 50 years diff for 0 score
    score += ageScore * (ageWeight / 100);
  } else {
    score += 50 * (ageWeight / 100); // Neutral if age not specified
  }
  totalWeight += ageWeight;

  // Gender preference (weight: 5%)
  const genderWeight = 5;
  // For now, assume any gender is fine, but could be extended with preferences
  score += 100 * (genderWeight / 100);
  totalWeight += genderWeight;

  // Location compatibility (weight: 5%)
  const locationWeight = 5;
  if (user1.location && user2.location) {
    const distance = calculateDistance(
      user1.location.lat, user1.location.lng,
      user2.location.lat, user2.location.lng
    );
    // Closer is better, max 500km for full score
    const locationScore = Math.max(0, 100 - (distance / 5));
    score += locationScore * (locationWeight / 100);
  } else {
    score += 50 * (locationWeight / 100); // Neutral if location not specified
  }
  totalWeight += locationWeight;

  return Math.round(score / (totalWeight / 100));
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function findBestMatches(
  currentUser: User,
  potentialMatches: User[],
  preferences?: {
    gender?: string;
    ageRange?: [number, number];
    interests?: string[];
    hobbies?: string[];
    games?: string[];
    location?: {
      lat: number;
      lng: number;
      radius: number;
    };
  },
  limit = 10
): MatchWithScore[] {
  // First, filter by preferences
  let filteredMatches = potentialMatches;

  if (preferences?.gender && preferences.gender !== 'any') {
    filteredMatches = filteredMatches.filter(user => user.gender === preferences.gender);
  }

  if (preferences?.ageRange) {
    const [min, max] = preferences.ageRange;
    filteredMatches = filteredMatches.filter(user =>
      user.age && user.age >= min && user.age <= max
    );
  }

  if (preferences?.interests?.length) {
    filteredMatches = filteredMatches.filter(user =>
      preferences.interests!.some(interest => user.interests.includes(interest))
    );
  }

  if (preferences?.hobbies?.length) {
    filteredMatches = filteredMatches.filter(user =>
      preferences.hobbies!.some(hobby => user.hobbies.includes(hobby))
    );
  }

  if (preferences?.games?.length) {
    filteredMatches = filteredMatches.filter(user =>
      preferences.games!.some(game => user.games.includes(game))
    );
  }

  if (preferences?.location) {
    const { lat, lng, radius } = preferences.location;
    filteredMatches = filteredMatches.filter(user => {
      if (!user.location) return false;
      const distance = calculateDistance(lat, lng, user.location.lat, user.location.lng);
      return distance <= radius;
    });
  }

  // Calculate compatibility scores
  const matchesWithScores: MatchWithScore[] = filteredMatches.map(user => ({
    user,
    compatibilityScore: calculateCompatibility(currentUser, user)
  }));

  // Sort by compatibility score descending
  matchesWithScores.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  // Return top matches
  return matchesWithScores.slice(0, limit);
}

export default function MatchAlgorithm() {
  // This component doesn't render anything, it's just a utility
  return null;
}