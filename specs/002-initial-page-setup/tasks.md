# Tasks: Initial Page Setup

**Input**: Design documents from `/specs/002-initial-page-setup/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create Tailwind configuration in `tailwind.config.ts` with pastel colors `upcoming`, `completed`, and `prediction`
- [X] T002 Add Tailwind, PostCSS, and autoprefixer dependencies to `package.json`
- [X] T003 Create `postcss.config.js` with Tailwind CSS plugin configuration
- [X] T004 Add Tailwind directives to `src/index.css` and define base typography styles
- [X] T005 Create `src/data/teams.json` with 32 World Cup teams, flags, and initials
- [X] T006 Create `src/data/matches.json` with 64 World Cup matches, ISO timestamps, group/round metadata, and optional final scores

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before user stories can be implemented

- [X] T007 Create `src/types/index.ts` with `Team`, `Match`, `Prediction`, and `PredictionStore` types
- [X] T008 Create `src/utils/storage.ts` with localStorage helpers for reading/writing `predictions_v1`
- [X] T009 Create `src/utils/predictions.ts` with `isMatchLocked()`, `formatScore()`, and prediction helper functions
- [X] T010 Create `src/utils/date.ts` with `getTodayMatches()`, `computeMatchStatus()`, and timezone-aware date helpers
- [X] T011 Create `src/hooks/usePredictions.ts` to load, save, and persist predictions in localStorage
- [X] T012 Create `src/hooks/useMatches.ts` to load mock match data from `src/data/matches.json` and refresh results manually

---

## Phase 3: User Story 1 - View Daily Matches with Results (Priority: P1)

**Goal**: Display today's World Cup matches with team flags, results, and existing predictions

**Independent Test**: Open the dashboard and verify daily matches display with soft blue and green backgrounds, and predictions appear below the match cards.

- [X] T013 [US1] Create `src/components/MatchCard.tsx` to render a single match with team flag+initials, result area, and prediction display
- [X] T014 [US1] Create `src/components/MainPage.tsx` to render today's matches, a "Refresh" button, and an empty state for no matches
- [X] T015 [US1] Update `src/App.tsx` to render `MainPage` instead of the default Vite/React boilerplate
- [X] T016 [US1] Implement daily match filtering in `src/components/MainPage.tsx` using `getTodayMatches()` from `src/utils/date.ts`
- [X] T017 [US1] Wire `useMatches()` and `usePredictions()` into `src/components/MainPage.tsx` so match cards display result status and saved prediction values

---

## Phase 4: User Story 2 - Load and Edit Predictions via Modal (Priority: P1)

**Goal**: Provide an all-matches modal editor that allows prediction input for upcoming matches and locks started matches

**Independent Test**: Click "Load Predictions", verify all 64 matches are listed, enter predictions for upcoming matches, save, and confirm values appear on the main page.

- [X] T018 [US2] Create `src/components/PredictionInput.tsx` with numeric goal inputs and disabled state when a match is locked
- [X] T019 [US2] Create `src/components/PredictionModal.tsx` to display all tournament matches, prediction inputs, and Save/Cancel controls
- [X] T020 [US2] Implement modal open/close state and button handlers in `src/components/MainPage.tsx`
- [X] T021 [US2] Add prediction save logic to `src/hooks/usePredictions.ts` and connect it to `src/components/PredictionModal.tsx`
- [X] T022 [US2] Ensure `src/components/PredictionModal.tsx` disables inputs for matches that have started using `isMatchLocked()` from `src/utils/predictions.ts`
- [X] T023 [US2] Implement manual refresh handling in `src/components/MainPage.tsx` using the refresh feature in `useMatches()`

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements, responsive UI, and validation

- [X] T024 [P] Refine responsive layout and accessibility for `src/components/MainPage.tsx`, `src/components/MatchCard.tsx`, and `src/components/PredictionModal.tsx`
- [X] T025 [P] Clean up `src/App.tsx` imports and remove unused boilerplate styles in `src/App.css`
- [X] T026 [P] Verify Tailwind pastel theme is applied correctly to `src/index.css` and component styling
- [X] T027 Run validation scenarios from `specs/002-initial-page-setup/quickstart.md` and fix any implementation gaps
- [X] T028 [P] Document feature behavior and mock data usage in `specs/002-initial-page-setup/quickstart.md`
