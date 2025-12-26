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
  options?: {
    excludeRecentMatches?: string[]; // User IDs to exclude
    behavioralData?: {
      successfulMatches: string[]; // Users with successful conversations
      failedMatches: string[]; // Users with short/failed conversations
      conversationLengths: Record<string, number>; // Average conversation length in minutes
    };
    timeBasedScoring?: boolean; // Consider time of day for matching
    limit?: number;
  }
): MatchWithScore[] {
  const limit = options?.limit || 10;

  // First, filter by preferences
  let filteredMatches = potentialMatches;

  // Exclude recent matches to avoid repetition
  if (options?.excludeRecentMatches?.length) {
    filteredMatches = filteredMatches.filter(user =>
      !options.excludeRecentMatches!.includes(user.id)
    );
  }

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

  // Calculate enhanced compatibility scores
  const matchesWithScores: MatchWithScore[] = filteredMatches.map(user => {
    const baseScore = calculateCompatibility(currentUser, user);
    let behavioralMultiplier = 1.0;

    // Apply behavioral scoring
    if (options?.behavioralData) {
      const { successfulMatches, failedMatches, conversationLengths } = options.behavioralData;

      // Boost score for users similar to successful matches
      if (successfulMatches.includes(user.id)) {
        behavioralMultiplier *= 1.2; // 20% boost
      }

      // Reduce score for users similar to failed matches
      if (failedMatches.includes(user.id)) {
        behavioralMultiplier *= 0.8; // 20% reduction
      }

      // Consider conversation length patterns
      const avgConversationLength = conversationLengths[user.id] || 0;
      if (avgConversationLength > 30) { // Long conversations are good
        behavioralMultiplier *= 1.1;
      } else if (avgConversationLength < 5) { // Very short conversations are bad
        behavioralMultiplier *= 0.9;
      }
    }

    // Apply time-based scoring
    if (options?.timeBasedScoring) {
      const currentHour = new Date().getHours();
      const timeMultiplier = calculateTimeCompatibility(currentUser, user, currentHour);
      behavioralMultiplier *= timeMultiplier;
    }

    const finalScore = Math.min(100, Math.max(0, baseScore * behavioralMultiplier));

    return {
      user,
      compatibilityScore: Math.round(finalScore)
    };
  });

  // Sort by compatibility score descending
  matchesWithScores.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  // Apply diversity scoring to avoid similar recommendations
  const diverseMatches = applyDiversityScoring(matchesWithScores, limit);

  // Return top matches
  return diverseMatches.slice(0, limit);
}

// Calculate time-based compatibility (people are more active at similar times)
function calculateTimeCompatibility(user1: User, user2: User, currentHour: number): number {
  // This is a simplified version. In production, you'd use actual activity data
  const user1TimePreference = getUserTimePreference(user1);
  const user2TimePreference = getUserTimePreference(user2);

  const timeDiff = Math.abs(user1TimePreference - user2TimePreference);
  const maxDiff = 12; // 12 hours difference max

  return 0.9 + (0.2 * (1 - timeDiff / maxDiff)); // 0.9 to 1.1 multiplier
}

// Simplified time preference calculation
function getUserTimePreference(user: User): number {
  // In production, this would be based on actual usage patterns
  // For now, return a random-ish value based on user ID
  const hash = user.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return (hash % 24); // 0-23 hours
}

// Apply diversity scoring to ensure varied recommendations
function applyDiversityScoring(matches: MatchWithScore[], limit: number): MatchWithScore[] {
  if (matches.length <= limit) return matches;

  const selected: MatchWithScore[] = [];
  const remaining = [...matches];

  // Always include the top match
  selected.push(remaining.shift()!);

  // For remaining slots, balance score with diversity
  while (selected.length < limit && remaining.length > 0) {
    let bestCandidate: MatchWithScore | null = null;
    let bestDiversityScore = -1;

    for (const candidate of remaining) {
      const diversityScore = calculateDiversityScore(candidate, selected);
      const combinedScore = candidate.compatibilityScore * 0.7 + diversityScore * 0.3;

      if (combinedScore > bestDiversityScore) {
        bestDiversityScore = combinedScore;
        bestCandidate = candidate;
      }
    }

    if (bestCandidate) {
      selected.push(bestCandidate);
      remaining.splice(remaining.indexOf(bestCandidate), 1);
    }
  }

  return selected;
}

// Calculate diversity score based on differences from already selected users
function calculateDiversityScore(candidate: MatchWithScore, selected: MatchWithScore[]): number {
  if (selected.length === 0) return 100;

  let totalDifference = 0;

  for (const selectedUser of selected) {
    const interestDiff = calculateArrayDifference(
      candidate.user.interests,
      selectedUser.user.interests
    );
    const hobbyDiff = calculateArrayDifference(
      candidate.user.hobbies,
      selectedUser.user.hobbies
    );
    const gameDiff = calculateArrayDifference(
      candidate.user.games,
      selectedUser.user.games
    );

    const ageDiff = candidate.user.age && selectedUser.user.age
      ? Math.abs(candidate.user.age - selectedUser.user.age) / 50 // Normalize to 0-1
      : 0.5;

    totalDifference += (interestDiff + hobbyDiff + gameDiff) / 3 + (1 - ageDiff);
  }

  return (totalDifference / selected.length) * 100;
}

// Calculate difference between two arrays (Jaccard distance)
function calculateArrayDifference(arr1: string[], arr2: string[]): number {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return union.size === 0 ? 0 : 1 - (intersection.size / union.size);
}

export default function MatchAlgorithm() {
  // This component doesn't render anything, it's just a utility
  return null;
}