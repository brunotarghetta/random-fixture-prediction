export type MatchStatus = 'upcoming' | 'live' | 'completed';

export interface Team {
  id: string;           // e.g., "us"
  name: string;         // e.g., "United States"
  flag: string;         // e.g., "🇺🇸"
  initials: string;     // e.g., "USA"
}

export interface Match {
  id: string;
  teamA_id: string;
  teamB_id: string;
  scheduledDateTime: string;  // ISO 8601
  finalScore?: {
    teamA_goals: number;
    teamB_goals: number;
  } | null;
  group?: string;
  round?: string;
}

export interface Prediction {
  matchId: string;
  teamA_goals: number;
  teamB_goals: number;
  createdAt: string;  // ISO 8601
}

export interface PredictionPayload {
  matchId: string;
  teamA_goals: number;
  teamB_goals: number;
}

// Stored in localStorage as:
// { "match_001": { teamA_goals: 2, teamB_goals: 1, createdAt: "..." }, ... }
export type PredictionStore = Record<string, Prediction>;
