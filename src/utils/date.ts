import type { Match } from '../types/index';

/**
 * Get today's matches from a list of all matches
 */
export const getTodayMatches = (matches: Match[], today: Date = new Date()): Match[] => {
  const todayString = today.toLocaleDateString('en-US');

  return matches.filter(match => {
    const matchDate = new Date(match.scheduledDateTime);
    const matchDateString = matchDate.toLocaleDateString('en-US');
    return matchDateString === todayString;
  });
};

/**
 * Get tomorrow's matches
 */
export const getTomorrowMatches = (matches: Match[]): Match[] => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getTodayMatches(matches, tomorrow);
};

/**
 * Get matches for a specific date range
 */
export const getMatchesByDateRange = (
  matches: Match[],
  startDate: Date,
  endDate: Date
): Match[] => {
  return matches.filter(match => {
    const matchDate = new Date(match.scheduledDateTime);
    return matchDate >= startDate && matchDate <= endDate;
  });
};

/**
 * Format a date for display
 */
export const formatMatchDate = (isoDateTime: string): string => {
  const date = new Date(isoDateTime);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get time until match starts (in minutes)
 */
export const getMinutesUntilMatch = (isoDateTime: string, now: Date = new Date()): number => {
  const matchDate = new Date(isoDateTime);
  const diff = matchDate.getTime() - now.getTime();
  return Math.ceil(diff / 1000 / 60); // Convert to minutes
};

/**
 * Check if match is happening today
 */
export const isMatchToday = (match: Match, today: Date = new Date()): boolean => {
  const todayString = today.toLocaleDateString('en-US');
  const matchDate = new Date(match.scheduledDateTime);
  const matchDateString = matchDate.toLocaleDateString('en-US');
  return matchDateString === todayString;
};
