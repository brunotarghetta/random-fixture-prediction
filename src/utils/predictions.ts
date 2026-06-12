import type { Match } from '../types/index';

/**
 * Check if a match is locked (match has started or passed)
 */
export const isMatchLocked = (match: Match, now: Date = new Date()): boolean => {
  const matchTime = new Date(match.scheduledDateTime);
  return now >= matchTime;
};

/**
 * Format a score for display
 */
export const formatScore = (teamA_goals: number, teamB_goals: number): string => {
  return `${teamA_goals} - ${teamB_goals}`;
};

/**
 * Compute match status based on current time and final score
 */
export const computeMatchStatus = (match: Match, now: Date = new Date()): 'upcoming' | 'live' | 'completed' => {
  const matchTime = new Date(match.scheduledDateTime);

  if (now < matchTime) {
    return 'upcoming';  // Match has not started yet
  }

  if (match.finalScore !== null && match.finalScore !== undefined) {
    return 'completed';  // Match finished and result recorded
  }

  return 'live';  // Match in progress (started but no final score yet)
};

/**
 * Get goal difference for a prediction
 */
export const getPredictionDifference = (teamA_goals: number, teamB_goals: number): number => {
  return Math.abs(teamA_goals - teamB_goals);
};

/**
 * Check if a prediction is correct
 */
export const isPredictionCorrect = (
  predictedA: number,
  predictedB: number,
  actualA: number,
  actualB: number
): boolean => {
  return predictedA === actualA && predictedB === actualB;
};
