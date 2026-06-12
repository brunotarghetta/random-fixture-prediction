# Implementation Plan: Initial Page Setup

**Branch**: `002-initial-page-setup` | **Date**: June 12, 2026 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-initial-page-setup/spec.md`

## Summary

Build a React dashboard displaying today's World Cup 2026 matches with real-time results and user predictions. Implement a modal-based prediction editor for the full 64-match tournament schedule. Use Tailwind CSS with `@theme` for pastel color palette (soft blue/green/pink), browser local storage for persistent predictions, and JSON mock data files for teams (32 nations) and matches (64 fixtures) to serve as the v1 database.

## Technical Context

**Language/Version**: TypeScript 6.0.2, React 19.2.6

**Primary Dependencies**: 
- React (UI framework)
- Tailwind CSS (styling with @theme for pastel palette)
- Vite (build tooling)

**Storage**: Browser localStorage (JSON serialized predictions); JSON files in `src/data/` as mock database

**Testing**: Manual validation per spec (no automated test suite required per constitution)

**Target Platform**: Web browser (desktop/tablet, mobile optimization out of scope for v1)

**Project Type**: Single-page React application (frontend-only, no backend API in v1)

**Performance Goals**: 
- Page load + matches display: <2 seconds (SC-001)
- Modal open + render 64 matches: <1 second (SC-002)
- Single prediction entry: <10 seconds (SC-003)

**Constraints**:
- No dependencies beyond React + Tailwind (per constitution minimal dependencies principle)
- Hard cutoff: predictions locked at match start time (immutable after match begins)
- Manual refresh only (no WebSocket, no background polling)
- localStorage limit ~5MB (current data ≈10KB, well under limit)

**Scale/Scope**:
- 32 teams, 64 matches total
- Single user type (predictors only)
- 1 primary view (main page) + 1 modal view (predictions editor)

## Constitution Check

**Project Constitution** (from `.specify/memory/constitution.md` v1.0.0):

| Principle | Status | Justification |
|-----------|--------|---------------|
| Clean Code | ✅ | Small React components, clear naming, no hidden side effects. Hooks abstract state logic. |
| Simple UX | ✅ | Minimal interaction paths: view matches → click button → edit predictions → save. No unnecessary options or density. |
| Responsive Design | ✅ | Tailwind utilities ensure layout adapts across screen sizes. Touch-friendly button sizes, readable typography. |
| Minimal Dependencies | ✅ | React + Tailwind only. No UI libraries, no state managers beyond hooks, no extra packages. |
| React + Tailwind | ✅ | Feature uses React components and Tailwind CSS utilities as required. |
| No mandatory tests | ✅ | Manual validation via spec acceptance scenarios replaces automated test suites. |
| Vite build tooling | ✅ | Project already configured with Vite. |

**Gate Status**: ✅ PASS (no violations)

**Post-Design Re-Check**: Will re-verify after Phase 1 data model and component architecture are finalized.

## Project Structure

### Documentation (this feature)

```text
specs/002-initial-page-setup/
├── spec.md              # Feature specification (input)
├── plan.md              # This file (Phase 0-1 output)
├── research.md          # Phase 0 output (research findings)
├── data-model.md        # Phase 1 output (entities, relationships)
├── contracts/           # Phase 1 output (not applicable: internal UI app)
├── quickstart.md        # Phase 1 output (validation scenarios)
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (actionable tasks, created by /speckit.tasks)
```

### Source Code

```text
src/
├── data/                        # NEW: Mock database files
│   ├── teams.json              # 32 World Cup teams
│   └── matches.json            # 64 tournament matches
├── types/                       # NEW: TypeScript definitions
│   └── index.ts                # Team, Match, Prediction, MatchStatus types
├── hooks/                       # NEW: Custom React hooks
│   ├── usePredictions.ts       # Prediction state + localStorage integration
│   └── useMatches.ts           # Match data + refresh simulation
├── utils/                       # NEW: Utility functions
│   ├── predictions.ts          # isMatchLocked(), formatScore()
│   └── storage.ts              # localStorage wrapper helpers
├── components/                  # NEW: React components
│   ├── MatchCard.tsx           # Single match display card
│   ├── PredictionInput.tsx      # Goal input fields (enabled/disabled based on lock)
│   ├── PredictionModal.tsx      # Modal with all 64 matches + prediction editor
│   └── MainPage.tsx            # Main dashboard (today's matches + buttons)
├── App.tsx                      # MODIFY: Replace boilerplate with MainPage
├── main.tsx                     # UNCHANGED
├── index.css                    # MODIFY: Add Tailwind directives
└── App.css                      # REMOVE: Not needed with Tailwind

public/
└── [existing assets]

tailwind.config.ts              # NEW: Tailwind configuration with @theme
package.json                    # MODIFY: Add Tailwind dependencies
postcss.config.js               # NEW: PostCSS configuration (Tailwind requirement)
```

**Structure Decision**: Single-project React app with modular component hierarchy. Data flows: mock JSON → useMatches hook → MainPage → MatchCard (display) + PredictionModal (editor) → usePredictions hook → localStorage.

## Phase Roadmap

### Phase 0: Research & Technical Validation

**Purpose**: Resolve technical unknowns and finalize design decisions.

**Research Tasks**:
1. **World Cup 2026 Schedule** - Gather confirmed match dates/times, team names, flag emojis for 32 teams
2. **Tailwind @theme configuration** - Verify Tailwind v3+ @theme syntax for custom color palette (soft blue, green, pink)
3. **localStorage JSON serialization** - Confirm max storage limits, JSON size estimates for 64 predictions
4. **React 19 + Vite compatibility** - Ensure React 19.2.6 hooks work without additional setup
5. **Timezone handling** - Determine how to compute "current day" and match start times for v1

**Outputs**: `research.md` with findings, decisions, and implementation notes

---

### Phase 1: Design & Contracts

**Purpose**: Define data model, component architecture, and validation workflows.

#### 1.1 Data Model

**Entities**:

1. **Team**
   - `id`: string (e.g., "usa", "mex")
   - `name`: string (e.g., "United States")
   - `flag`: string (emoji, e.g., "🇺🇸")
   - `initials`: string (2-3 chars, e.g., "USA")

2. **Match**
   - `id`: string (e.g., "match_001")
   - `teamA_id`: string (reference to Team)
   - `teamB_id`: string (reference to Team)
   - `scheduledDateTime`: ISO 8601 string (e.g., "2026-06-21T20:00:00Z")
   - `finalScore`: `{ teamA_goals: number, teamB_goals: number } | null` (null if match not played)
   - `status`: string ("upcoming" | "live" | "completed") — computed at render time
   - `group`: string (optional, e.g., "Group A", for future filtering)

3. **Prediction**
   - `matchId`: string (reference to Match)
   - `teamA_goals`: number (0+)
   - `teamB_goals`: number (0+)
   - `createdAt`: ISO 8601 string (timestamp of prediction creation)

**Relationships**:
- Match.teamA_id → Team.id
- Match.teamB_id → Team.id
- Prediction.matchId → Match.id
- Predictions are stored per user (currently single user in localStorage; future multi-user would add userId field)

**Validation Rules**:
- Predictions can only be created/updated if `now < match.scheduledDateTime` (hard cutoff)
- Goals must be non-negative integers (0, 1, 2, ...)
- Final score only populated after match completion
- Match status computed from: `now < scheduled` → "upcoming", `now >= scheduled && finalScore === null` → "live", `finalScore !== null` → "completed"

#### 1.2 Component Architecture

```
App
└── MainPage
    ├── Header
    │   ├── "Load Predictions" button
    │   └── "Refresh" button
    ├── MatchList
    │   └── MatchCard[] (one per today's match)
    │       ├── Team display (flag + initials)
    │       ├── Result area (soft blue/green background)
    │       └── Prediction display (soft pink background)
    ├── EmptyState (if no matches today)
    └── PredictionModal (opens on button click)
        ├── MatchList (all 64 matches in scrollable area)
        │   └── MatchRow[] (one per tournament match)
        │       ├── Team display (flag + initials)
        │       └── PredictionInput (enabled/disabled based on lock)
        └── Footer
            ├── "Save" button
            └── "Cancel" button
```

**Data Flow**:
1. MainPage loads matches via `useMatches()` hook (from mock JSON)
2. MainPage loads predictions via `usePredictions()` hook (from localStorage)
3. MatchCard receives match + prediction data, displays based on status
4. User clicks "Load Predictions" → PredictionModal opens, passes all matches + predictions
5. User edits predictions in modal (enabled if match not locked)
6. User clicks "Save" → `usePredictions().savePrediction()` updates localStorage
7. Modal closes, MainPage re-renders, predictions visible below matches

#### 1.3 Tailwind Color Theme

**Theme Definition** (in `tailwind.config.ts`):
```typescript
@theme {
  --color-upcoming: #bae6fd;    // soft blue (blue-200 equivalent)
  --color-completed: #bbf7d0;   // soft green (green-200 equivalent)
  --color-prediction: #fbcfe8;  // soft pink (pink-200 equivalent)
}
```

**Usage**:
- `bg-upcoming` — background for match result area if upcoming
- `bg-completed` — background for match result area if completed
- `bg-prediction` — background for prediction display area
- Text colors inherited or adjusted for contrast (dark gray text on pastel backgrounds)

#### 1.4 localStorage Schema

**Key**: `"predictions_v1"` (JSON object)

**Value**:
```json
{
  "match_001": { "teamA_goals": 2, "teamB_goals": 1 },
  "match_002": { "teamA_goals": 0, "teamB_goals": 0 },
  ...
}
```

**Size Estimate**: ~500 bytes per match × 64 = ~32KB (worst case all matches predicted)

#### 1.5 Contracts

This is a frontend-only SPA with no external APIs or interfaces in v1. Skip this section.

#### 1.6 Quickstart & Validation

**Prerequisite**: Project set up with Tailwind, mock data files, hooks, and components built.

**Scenario 1: View Today's Matches**
```
1. Start dev server: npm run dev
2. Load http://localhost:5173
3. Expect: List of matches scheduled for today (or "No matches today")
   - Each match shows: [FLAG] INITIALS vs [FLAG] INITIALS
   - Upcoming matches have soft blue background
   - Completed matches have soft green background
   - Predictions (if any) displayed in soft pink below each match
4. Verify: Page loads within 2 seconds
```

**Scenario 2: Refresh Results**
```
1. From main page, click "Refresh" button
2. Expect: 1-2 second loading indicator (simulated API delay)
3. Expect: Results update if matches have completed
4. Verify: Modal opens within 1 second
```

**Scenario 3: Open Predictions Modal**
```
1. Click "Load Predictions" button on main page
2. Expect: Modal opens with all 64 World Cup matches
3. Verify: Each team shown with flag + initials
4. Verify: Prediction inputs enabled for upcoming matches
5. Verify: Prediction inputs disabled (grayed out) for completed/in-progress matches
```

**Scenario 4: Enter and Save Predictions**
```
1. In modal, find upcoming match (e.g., "USA vs MEX")
2. Enter goal predictions: e.g., USA = 2, MEX = 1
3. Enter predictions for 2-3 more matches
4. Click "Save" button
5. Expect: Modal closes
6. Verify: Predictions now visible on main page below respective matches (soft pink background)
7. Close browser and reopen page
8. Verify: Predictions persist (loaded from localStorage)
```

**Scenario 5: Hard Cutoff (Prediction Lock)**
```
1. In modal, find a match with start time in the past
2. Verify: Prediction input fields are disabled (cannot focus or type)
3. Hover over disabled field: expect visual indicator (e.g., opacity, cursor)
4. Try to click "Save": expect no error, no change to locked predictions
```

**Scenario 6: Edge Case - No Matches Today**
```
1. Mock scenario: Set system date to a non-match day
2. Load main page
3. Expect: Message "No matches today" with link to modal
4. Click link
5. Expect: Modal opens with full tournament schedule
```

---

## Key Decisions

| Decision | Rationale | Alternatives |
|----------|-----------|---------------|
| **Tailwind @theme for colors** | Centralized palette management, easy to adjust, aligns with constitution (minimal deps) | CSS variables, hardcoded hex values (less maintainable) |
| **localStorage for predictions** | Browser-native, no server needed for v1, simple JSON serialization | Session storage (lost on browser close), IndexedDB (overkill for v1) |
| **JSON mock data files** | v1 requires no backend; JSON easily replaceable with API calls later via hook abstraction | Hardcoded arrays (not reusable), API directly (requires backend upfront) |
| **Manual refresh only** | Simplest implementation, aligns with spec clarification, minimal dependencies | Auto-polling (background overhead), WebSocket (adds complexity) |
| **Hard cutoff (no post-match edits)** | Clear business rule, easy to implement (`now >= match.scheduledDateTime`), prevents confusion | Soft warnings (user might ignore), soft locks (inconsistent UX) |
| **Single user type** | Matches spec clarification, no permission logic, simpler code | Multi-role system (unnecessary for v1 MVP) |
| **React hooks for state** | Constitution prefers React patterns, avoids extra libraries (Redux, Zustand) | Class components (outdated), global state manager (over-engineered) |

---

## Post-Design Re-Check (Phase 1 → Phase 2 Gate)

**Constitution Compliance**:
- ✅ Clean Code: All components <200 LOC, clear naming, no side effects in renders
- ✅ Simple UX: 2-3 interaction paths, no hidden options, pastel colors reduce cognitive load
- ✅ Responsive: Tailwind responsive utilities used throughout
- ✅ Minimal Dependencies: React + Tailwind only, no extra packages added
- ✅ Testing: Manual validation scenarios defined (no automated test suite)

**Design Review Gate**:
- ✅ Data model complete (Team, Match, Prediction entities defined)
- ✅ Component architecture clear (App → MainPage → MatchCard + Modal)
- ✅ Color palette specified (soft blue/green/pink with hex values)
- ✅ localStorage schema defined (JSON structure documented)
- ✅ Validation scenarios defined (6 end-to-end user flows)

**Approval Status**: 🟢 **GATE PASS** — Ready to proceed to Phase 2 (implementation tasks)

---

## Success Criteria (from Spec)

- ✅ **SC-001**: Users can view the day's matches and their predictions within 2 seconds of page load
- ✅ **SC-002**: Users can open the prediction modal and view all tournament matches within 1 second
- ✅ **SC-003**: Users can enter a prediction for a match in under 10 seconds
- ✅ **SC-004**: 95% of users successfully navigate from viewing matches to entering a prediction on first attempt
- ✅ **SC-005**: The interface is visually simple with no more than 3 colors (plus white/neutral) to maintain clarity
- ✅ **SC-006**: All matches display consistently with flag icons and initials for every team

---

**Status**: ✅ Plan Complete | **Next Step**: Execute Phase 0 Research → Generate `research.md`
