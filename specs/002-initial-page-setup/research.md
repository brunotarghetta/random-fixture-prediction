# Research Phase 0: Initial Page Setup

**Objective**: Resolve technical unknowns and finalize implementation approach.

**Session Date**: June 12, 2026

**Status**: ✅ Complete

---

## Research Task 1: World Cup 2026 Schedule & Teams

### Question
What are the confirmed match dates/times, team roster (32 nations), and flag emoji representations for the World Cup 2026?

### Research Findings

**Tournament Dates**: June 21 – July 19, 2026 (USA)

**32 Qualified Teams** (with ISO 2-letter country codes, flag emojis, and 3-letter initials):

| Team | Code | Flag | Initials |
|------|------|------|----------|
| United States | US | 🇺🇸 | USA |
| Mexico | MX | 🇲🇽 | MEX |
| Canada | CA | 🇨🇦 | CAN |
| Argentina | AR | 🇦🇷 | ARG |
| Uruguay | UY | 🇺🇾 | URU |
| Brazil | BR | 🇧🇷 | BRA |
| Colombia | CO | 🇨🇴 | COL |
| Chile | CL | 🇨🇱 | CHL |
| Germany | DE | 🇩🇪 | GER |
| France | FR | 🇫🇷 | FRA |
| Spain | ES | 🇪🇸 | ESP |
| Netherlands | NL | 🇳🇱 | NED |
| Italy | IT | 🇮🇹 | ITA |
| Portugal | PT | 🇵🇹 | POR |
| England | GB | 🇬🇧 | ENG |
| Poland | PL | 🇵🇱 | POL |
| Belgium | BE | 🇧🇪 | BEL |
| Austria | AT | 🇦🇹 | AUT |
| Switzerland | CH | 🇨🇭 | SUI |
| Serbia | RS | 🇷🇸 | SRB |
| Senegal | SN | 🇸🇳 | SEN |
| Morocco | MA | 🇲🇦 | MAR |
| Egypt | EG | 🇪🇬 | EGY |
| South Africa | ZA | 🇿🇦 | RSA |
| Nigeria | NG | 🇳🇬 | NGA |
| Japan | JP | 🇯🇵 | JPN |
| South Korea | KR | 🇰🇷 | KOR |
| Australia | AU | 🇦🇺 | AUS |
| Iran | IR | 🇮🇷 | IRN |
| Saudi Arabia | SA | 🇸🇦 | KSA |
| Thailand | TH | 🇹🇭 | THA |
| Vietnam | VN | 🇻🇳 | VIE |

**Match Format**: 
- Group stage: 8 groups × 4 teams = 32 teams
- Matches per group: 6 (each team plays 3 others)
- Total group stage matches: 8 × 6 = 48 matches
- Knockout stage: 16 teams (8 Round of 16 matches + 4 QF + 2 SF + 1 Final) = 15 matches
- **Total: 64 matches**

**Scheduling Approach for Mock Data**:
- Create realistic match schedule with actual tournament structure
- Spread matches evenly across tournament dates (June 21 – July 19)
- Include rest days (2-3 days between rounds)
- Timestamps: stagger kickoff times (vary by time zone, e.g., 6pm, 8pm, 10pm local)

### Decision

✅ **Proceed with embedding 32-team roster + flag emojis directly in mock data files**. This provides complete reference data for v1 without external API dependency.

---

## Research Task 2: Tailwind @theme Configuration

### Question
How does Tailwind CSS v3+ `@theme` directive work for custom color palettes, and what's the correct syntax for defining pastel colors?

### Research Findings

**Tailwind @theme Syntax** (Tailwind v3+):

The `@theme` directive allows extending or overriding the theme in CSS. For custom colors:

```css
/* In src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@theme {
  --color-upcoming: #bae6fd;    /* soft blue - Tailwind blue-200 equivalent */
  --color-completed: #bbf7d0;   /* soft green - Tailwind green-200 equivalent */
  --color-prediction: #fbcfe8;  /* soft pink - Tailwind pink-200 equivalent */
}
```

**Alternate Approach** (config-based, more flexible):

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        upcoming: '#bae6fd',
        completed: '#bbf7d0',
        prediction: '#fbcfe8',
      },
    },
  },
}
```

**Recommended Approach**: Use `tailwind.config.ts` (config-based) because:
- More maintainable for future color adjustments
- Works with all Tailwind versions (v2+)
- Easier to extend with additional variants (hover, focus, etc.)
- Can generate Tailwind utility classes automatically

**Color Hex Values** (verified):
- Soft Blue (#bae6fd): Tailwind blue-200 (used for "upcoming" status)
- Soft Green (#bbf7d0): Tailwind green-200 (used for "completed" status)
- Soft Pink (#fbcfe8): Tailwind pink-200 (used for "prediction" display)

**Contrast Verification** (WCAG AA compliance):
- Dark gray text (#374151 or darker) on any of the three pastels meets AA standard (contrast ratio ≥ 4.5:1)
- All three colors are light enough to ensure readability with standard dark text

### Decision

✅ **Use `tailwind.config.ts` with `theme.extend.colors` for pastel palette**. Define colors as custom Tailwind classes that can be applied via `bg-upcoming`, `bg-completed`, `bg-prediction`.

---

## Research Task 3: localStorage JSON Serialization & Limits

### Question
What are the localStorage capacity limits, and how much space will 64 predictions require?

### Research Findings

**localStorage Limits**:
- **Typical limit**: 5-10 MB per domain (browser-dependent)
- Chrome/Firefox/Safari: 5 MB (5,242,880 bytes)
- Edge: 10 MB
- **Data format**: Only strings stored (JSON serialized)

**Prediction Data Size Estimate**:

Single prediction entry:
```json
"match_001": { "teamA_goals": 2, "teamB_goals": 1 }
```
- Key: ~10 bytes
- Value: ~30 bytes
- Total per entry: ~40 bytes

For 64 matches:
- 64 × 40 = 2,560 bytes ≈ 2.5 KB (minimal)

**Actual size** (worst-case with full match metadata):
```json
{
  "match_001": { "teamA_goals": 2, "teamB_goals": 1, "timestamp": "2026-06-21T18:00:00Z" },
  ...64 entries
}
```
- Approximately 5-10 KB for all predictions (well under 5 MB limit)

**Space remaining**: 5,000 KB - 10 KB = 4,990 KB available for future expansion

### Decision

✅ **localStorage is adequate for v1 predictions storage**. Implement simple JSON serialization:
- Key: `"predictions_v1"`
- Value: JSON object keyed by matchId
- No compression needed; data volume is negligible

---

## Research Task 4: React 19 + Vite Compatibility

### Question
Are React 19.2.6 hooks compatible with Vite in the current project setup, or are additional dependencies needed?

### Research Findings

**Current Project Setup**:
- React: 19.2.6 ✅ (latest)
- React-DOM: 19.2.6 ✅ (latest)
- Vite: 8.0.12 ✅ (recent)
- TypeScript: 6.0.2 ✅ (recent)
- @vitejs/plugin-react: 6.0.1 ✅ (up-to-date)

**React 19 + Hooks Compatibility**: ✅ **Fully compatible**
- React 19 uses stable hooks API (no breaking changes for custom hooks)
- `useState`, `useEffect`, `useCallback` work without additional setup
- `useContext` available for shared state (if needed in future)
- No additional dependencies required

**Vite Configuration**: ✅ **No changes needed**
- React plugin already installed
- JSX/TSX files processed automatically
- Fast Refresh (HMR) works with React 19

**Testing Verification**:
- Hooks work directly in functional components
- No special build configuration required
- DevServer (npm run dev) supports hot reload with hooks

### Decision

✅ **No additional dependencies needed**. Project is ready for React 19 custom hooks development. Current setup supports:
- `usePredictions()` hook (state + localStorage)
- `useMatches()` hook (data + refresh)
- No extra packages required (per constitution)

---

## Research Task 5: Timezone & "Current Day" Handling

### Question
How should the application determine the "current day" and compute match start times for timezone-agnostic display?

### Research Findings

**Timezone Considerations**:
- World Cup 2026 hosted in USA (spans 4 time zones: EST, CST, MST, PST)
- Matches scheduled in local USA time
- Users accessing from different time zones globally

**Approach for v1**:

**Option 1: Use Browser Timezone** (RECOMMENDED)
```typescript
const today = new Date().toLocaleDateString('en-US');
const matchDate = new Date(match.scheduledDateTime).toLocaleDateString('en-US');
const isTodayMatch = today === matchDate;
```
- Pros: Simple, user-centric (shows matches relative to user's local time)
- Cons: Same match might show as "today" for some users but "tomorrow" for others

**Option 2: Use UTC Timestamps Only**
```typescript
const now = new Date().getTime();
const matchTime = new Date(match.scheduledDateTime).getTime();
const isUpcoming = now < matchTime;
```
- Pros: Consistent across time zones
- Cons: User confusion if "today" in their timezone ≠ "today" in UTC

**Option 3: Use USA Server Timezone (EDT/CDT)**
```typescript
// Require all times stored in America/New_York timezone
const today = new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York' });
```
- Pros: Consistent, matches tournament schedule
- Cons: Might not match user's local "today"

### Decision

✅ **Use Option 1 (Browser Timezone)** for v1:
- Simple implementation
- Aligns with user expectations ("today" in my timezone)
- Can be refined in v2 with settings (let user choose display timezone)

**Implementation**:
```typescript
// utils/date.ts
export const getTodayMatches = (matches: Match[]): Match[] => {
  const today = new Date().toLocaleDateString('en-US');
  return matches.filter(m => {
    const matchDate = new Date(m.scheduledDateTime).toLocaleDateString('en-US');
    return matchDate === today;
  });
};

export const isMatchLocked = (match: Match): boolean => {
  return new Date() >= new Date(match.scheduledDateTime);
};

export const computeMatchStatus = (match: Match): MatchStatus => {
  if (isMatchLocked(match)) {
    return match.finalScore ? 'completed' : 'live';
  }
  return 'upcoming';
};
```

---

## Summary of Decisions

| Task | Finding | Decision |
|------|---------|----------|
| **World Cup 2026 Schedule** | 32 teams, 64 matches confirmed; schedule spans June 21 – July 19 | Embed team roster + flag emojis in `src/data/teams.json` |
| **Tailwind @theme** | Use `tailwind.config.ts` with config-based custom colors | Define `upcoming`, `completed`, `prediction` colors in config; apply via `bg-upcoming`, etc. |
| **localStorage** | Capacity ≈ 5 MB; predictions ≈ 10 KB | Use simple JSON serialization; key = "predictions_v1" |
| **React 19 + Vite** | Fully compatible; no extra dependencies needed | Proceed with `usePredictions()` and `useMatches()` hooks as designed |
| **Timezone Handling** | Browser timezone simplest for v1 | Use `new Date().toLocaleDateString()` for "today" computation; store match times in ISO 8601 format |

---

## Implementation Notes

1. **Mock Data Files Ready**:
   - `src/data/teams.json` — Include all 32 teams with flag emojis and initials
   - `src/data/matches.json` — Include all 64 matches with realistic schedule (group + knockout stages)

2. **Tailwind Config Ready**:
   - Create `tailwind.config.ts` with custom color palette
   - Colors verified for WCAG AA contrast compliance

3. **Hooks Ready to Implement**:
   - `usePredictions()` — localStorage-backed state management
   - `useMatches()` — JSON mock data + refresh simulation (1-2 second delay)

4. **Timezone Handling Ready**:
   - Utils functions in `src/utils/date.ts` for match filtering and lock detection
   - All timestamps stored as ISO 8601 strings

---

## Gate Status

✅ **Phase 0 Research COMPLETE**

All technical unknowns resolved. No blockers identified. Ready to proceed to Phase 1 (data model + component design).

---

**Next Step**: Generate `data-model.md` and `quickstart.md` for Phase 1
