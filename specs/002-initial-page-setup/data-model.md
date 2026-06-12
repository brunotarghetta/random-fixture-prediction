# Data Model: Initial Page Setup

**Date**: June 12, 2026

**Status**: ✅ Complete

**Derived from**: [research.md](research.md) (Phase 0) and [plan.md](plan.md) (Phase 1 Design)

---

## Core Entities & Relationships

### Entity 1: Team

**Description**: Represents a national football team competing in the World Cup 2026.

**Fields**:
```typescript
interface Team {
  id: string;           // ISO 2-letter country code (e.g., "us", "mx")
  name: string;         // Full country name (e.g., "United States")
  flag: string;         // Unicode flag emoji (e.g., "🇺🇸")
  initials: string;     // 3-letter abbreviation (e.g., "USA")
}
```

**Examples**:
```json
{
  "id": "us",
  "name": "United States",
  "flag": "🇺🇸",
  "initials": "USA"
},
{
  "id": "mx",
  "name": "Mexico",
  "flag": "🇲🇽",
  "initials": "MEX"
}
```

**Constraints**:
- `id` must be unique and immutable
- `flag` must be a single Unicode emoji (0-1 characters after normalization)
- `initials` must be 2-3 uppercase letters
- `name` must be non-empty

**Data Source**: `src/data/teams.json` (32 total teams)

---

### Entity 2: Match

**Description**: Represents a single World Cup match with teams, schedule, and optional result.

**Fields**:
```typescript
interface Match {
  id: string;                    // Unique identifier (e.g., "match_001", "group_a_1")
  teamA_id: string;              // Foreign key → Team.id (home/first team)
  teamB_id: string;              // Foreign key → Team.id (away/second team)
  scheduledDateTime: string;     // ISO 8601 datetime (e.g., "2026-06-21T18:00:00Z")
  finalScore?: {                 // Optional; populated only after match completion
    teamA_goals: number;         // Goals scored by Team A
    teamB_goals: number;         // Goals scored by Team B
  } | null;
  group?: string;                // Optional; tournament phase (e.g., "Group A", "Quarterfinal")
  round?: string;                // Optional; stage name (e.g., "Group Stage", "Knockout")
}
```

**Computed Properties** (derived at render time, not stored):
```typescript
interface ComputedMatch extends Match {
  status: 'upcoming' | 'live' | 'completed';  // Computed from now vs scheduledDateTime
  teamA: Team;                                 // Resolved from teamA_id
  teamB: Team;                                 // Resolved from teamB_id
  isLocked: boolean;                          // Computed: now >= scheduledDateTime
}
```

**Examples**:
```json
{
  "id": "match_001",
  "teamA_id": "us",
  "teamB_id": "mx",
  "scheduledDateTime": "2026-06-21T18:00:00Z",
  "finalScore": null,
  "group": "Group C",
  "round": "Group Stage"
},
{
  "id": "match_049",
  "teamA_id": "br",
  "teamB_id": "ar",
  "scheduledDateTime": "2026-07-19T18:00:00Z",
  "finalScore": {
    "teamA_goals": 2,
    "teamB_goals": 1
  },
  "group": "Final",
  "round": "Knockout Stage"
}
```

**Constraints**:
- `id` must be unique and immutable
- `teamA_id` ≠ `teamB_id` (teams cannot play themselves)
- `scheduledDateTime` must be a valid ISO 8601 string
- `finalScore` is `null` until match completion; once populated, it is immutable
- If `finalScore` is not null, both `teamA_goals` and `teamB_goals` must be non-negative integers
- `scheduledDateTime` must fall within tournament dates: June 21 – July 19, 2026

**Data Source**: `src/data/matches.json` (64 total matches)

**Tournament Structure**:
- **Group Stage**: 48 matches (8 groups × 6 matches per group)
  - Each group has 4 teams
  - Each team plays 3 matches (round-robin)
  - Matches occur June 21 – July 1
  
- **Knockout Stage**: 16 matches
  - Round of 16: 8 matches (July 3-4)
  - Quarterfinals: 4 matches (July 5-6)
  - Semifinals: 2 matches (July 9-10)
  - Final: 1 match (July 19)

---

### Entity 3: Prediction

**Description**: Represents a user's goal prediction for a specific match.

**Fields**:
```typescript
interface Prediction {
  matchId: string;       // Foreign key → Match.id
  teamA_goals: number;   // Predicted goals for Team A (0+)
  teamB_goals: number;   // Predicted goals for Team B (0+)
  createdAt: string;     // ISO 8601 timestamp of prediction creation
}
```

**Examples**:
```json
{
  "match_001": {
    "teamA_goals": 2,
    "teamB_goals": 1,
    "createdAt": "2026-06-20T14:00:00Z"
  },
  "match_002": {
    "teamA_goals": 0,
    "teamB_goals": 0,
    "createdAt": "2026-06-20T15:30:00Z"
  }
}
```

**Storage Format** (in localStorage):
```typescript
// Key: "predictions_v1"
// Value: JSON object mapping matchId → prediction

{
  "match_001": { "teamA_goals": 2, "teamB_goals": 1, "createdAt": "2026-06-20T14:00:00Z" },
  "match_002": { "teamA_goals": 0, "teamB_goals": 0, "createdAt": "2026-06-20T15:30:00Z" },
  ...
}
```

**Constraints**:
- `matchId` must be a valid reference to an existing Match
- `teamA_goals` and `teamB_goals` must be non-negative integers (≥ 0)
- `createdAt` must be a valid ISO 8601 string and ≤ current time
- Predictions can only be created/updated if `now < match.scheduledDateTime` (hard cutoff)
- No duplicate predictions per match per user (in v1, single user; in future multi-user, add `userId`)

**Lifecycle**:
1. **Creation**: User enters prediction in PredictionModal for an upcoming match
2. **Storage**: Prediction saved to localStorage (JSON serialized)
3. **Update**: User can edit prediction if `now < match.scheduledDateTime`
4. **Lock**: Once match starts (`now >= scheduledDateTime`), prediction becomes immutable
5. **Display**: Prediction displayed on MainPage below the match card (soft pink background)
6. **Persistence**: Prediction survives page reload (loaded from localStorage on mount)

---

## Relationships

### Match ← Team (Many-to-One, Denormalized)

**Relationship**: Each Match references exactly two Teams (teamA_id, teamB_id).

**Integrity**:
- Both `teamA_id` and `teamB_id` must exist in Teams collection
- Teams are resolved at render time (not stored directly in Match)

**Example Flow**:
```
Match { id: "match_001", teamA_id: "us", teamB_id: "mx", ... }
  → Resolve teamA_id → Team { id: "us", name: "United States", flag: "🇺🇸", initials: "USA" }
  → Resolve teamB_id → Team { id: "mx", name: "Mexico", flag: "🇲🇽", initials: "MEX" }
  → Display: "🇺🇸 USA vs 🇲🇽 MEX"
```

---

### Prediction ← Match (Many-to-One, Immutable)

**Relationship**: Each Prediction references exactly one Match (matchId).

**Integrity**:
- `matchId` must exist in Matches collection
- Prediction is immutable once match starts (`now >= match.scheduledDateTime`)
- Only one Prediction per match per user (v1 single-user constraint)

**Example Flow**:
```
User enters prediction for match_001
  → Prediction { matchId: "match_001", teamA_goals: 2, teamB_goals: 1, createdAt: "..." }
  → Saved to localStorage under key "match_001"
  → On MainPage load, Prediction retrieved and displayed below Match card
  → If now >= match.scheduledDateTime, Prediction input fields disabled in modal
```

---

### User ← Prediction (One-to-Many, Single-User v1)

**Relationship**: In v1, single user has multiple predictions (one per match, max 64).

**Storage Model**: Flat JSON object in localStorage (no explicit user table).

**Future Multi-User Model** (v2):
```typescript
interface Prediction {
  userId: string;        // Add user identifier
  matchId: string;       // Foreign key → Match.id
  teamA_goals: number;
  teamB_goals: number;
  createdAt: string;
}

// Storage: localStorage[`predictions_${userId}`] or server-based database
```

---

## Data Validation Rules

### Team Validation
- ✅ `id` is non-empty, lowercase, 2-3 characters (ISO country code format)
- ✅ `name` is non-empty string (1-50 characters)
- ✅ `flag` is a single Unicode emoji
- ✅ `initials` is 2-3 uppercase ASCII letters (A-Z)

### Match Validation
- ✅ `id` is unique across all matches
- ✅ `teamA_id` ≠ `teamB_id` (cannot play itself)
- ✅ `teamA_id` and `teamB_id` exist in Teams collection
- ✅ `scheduledDateTime` is valid ISO 8601 string within tournament date range (June 21 – July 19, 2026)
- ✅ `finalScore` is either null (match pending) or an object with two non-negative integers
- ✅ `finalScore` is immutable once set (no updates after match completion)
- ✅ If `finalScore` is set, match is considered "completed" (no edits to prediction allowed)

### Prediction Validation
- ✅ `matchId` exists in Matches collection
- ✅ `teamA_goals` and `teamB_goals` are non-negative integers (≥ 0)
- ✅ Prediction can only be created if `now < match.scheduledDateTime` (hard cutoff)
- ✅ Prediction can only be updated if `now < match.scheduledDateTime` (hard cutoff)
- ✅ Once `now >= match.scheduledDateTime`, prediction becomes immutable (no edits, no deletes)
- ✅ `createdAt` timestamp is set at creation time and immutable

---

## Computed Properties & Functions

### Match Status Computation

```typescript
// Derived at render time, not stored
type MatchStatus = 'upcoming' | 'live' | 'completed';

function computeMatchStatus(match: Match, now: Date = new Date()): MatchStatus {
  const matchTime = new Date(match.scheduledDateTime);
  
  if (now < matchTime) {
    return 'upcoming';  // Match has not started yet
  }
  
  if (match.finalScore !== null && match.finalScore !== undefined) {
    return 'completed';  // Match finished and result recorded
  }
  
  return 'live';  // Match in progress (started but no final score yet)
}
```

### Match Lock Detection

```typescript
// Check if prediction is editable
function isMatchLocked(match: Match, now: Date = new Date()): boolean {
  const matchTime = new Date(match.scheduledDateTime);
  return now >= matchTime;  // Locked if match has started or begun
}
```

### Today's Matches Filter

```typescript
function getTodayMatches(matches: Match[], today: Date = new Date()): Match[] {
  const todayString = today.toLocaleDateString('en-US');
  
  return matches.filter(match => {
    const matchDate = new Date(match.scheduledDateTime);
    const matchDateString = matchDate.toLocaleDateString('en-US');
    return matchDateString === todayString;
  });
}
```

---

## Data Access Patterns

### Read Operations

1. **Get all matches**: Load from `src/data/matches.json`
2. **Get today's matches**: Filter by `scheduledDateTime` (current date)
3. **Get all predictions**: Load from `localStorage["predictions_v1"]`
4. **Get prediction for match**: `predictions[matchId]`
5. **Resolve match teams**: Look up `teamA_id` and `teamB_id` in teams collection

### Write Operations

1. **Create prediction**: Save to `localStorage["predictions_v1"]` (immutable after match starts)
2. **Update prediction**: Overwrite in localStorage if `now < match.scheduledDateTime`
3. **Delete prediction**: Remove from localStorage (only before match starts)

### Performance Considerations

- **Matches data**: ~30 KB JSON file, loaded once on app mount
- **Predictions data**: ~10 KB max in localStorage, read/write on each interaction
- **Team lookups**: O(n) linear search in 32-team array (negligible for small dataset)
- **Match filtering**: O(n) for "today's matches" filter (64 matches)
- **No pagination needed**: 64 matches fit on screen with scrolling

---

## Schema Summary (TypeScript)

```typescript
// src/types/index.ts

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
```

---

## Edge Cases & Special Handling

### Edge Case 1: No Matches Today
- **Scenario**: User opens app on non-match day
- **Handling**: Display message "No matches today" with link to modal
- **Modal**: Shows full tournament schedule so user can view/edit predictions for other days

### Edge Case 2: Match Status Changes During Session
- **Scenario**: User has modal open, match start time arrives
- **Handling**: Prediction input fields are already disabled (check `isMatchLocked()` at render time)
- **Update**: On next re-render (after modal closes), inputs will be locked
- **No error**: Silent disable, no notification needed (clear visual state)

### Edge Case 3: Result Updated After Prediction
- **Scenario**: User predicted 2-1, actual result 2-0
- **Handling**: 
  - Prediction remains immutable (not editable)
  - Both prediction (2-1) and result (2-0) visible on MainPage for comparison
  - Future feature: Calculate prediction accuracy for scoring/leaderboards

### Edge Case 4: Prediction for Match in Past (Future Refresh)
- **Scenario**: User opens app days later, old prediction for completed match exists
- **Handling**: Display prediction and result side-by-side, inputs disabled
- **localStorage**: Prediction persists indefinitely (no auto-cleanup)

### Edge Case 5: localStorage Full (Hypothetical)
- **Scenario**: Browser localStorage quota exceeded
- **Handling**: Unlikely (<10 KB vs 5 MB limit), but if occurs:
  - Catch localStorage errors in hook
  - Alert user to clear browser cache
  - Fallback: Predictions lost for current session only (not permanent)

---

## Future Extensions (v2+)

1. **Multi-user support**: Add `userId` field to Prediction, move to server DB
2. **Prediction accuracy scoring**: Calculate accuracy, show leaderboard
3. **User profiles**: Track user prediction history, stats
4. **Groups/leagues**: Allow users to join friend groups and compare predictions
5. **Real match data API**: Replace JSON mock with live API calls
6. **Admin features**: Allow admins to manually set match results

---

**Status**: ✅ Data Model Complete | **Ready for Phase 1c**: Component Implementation
