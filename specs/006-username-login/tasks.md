# Tasks: Username Login

**Feature**: `006-username-login` | **Date**: June 12, 2026

**Input**: Design documents from `/specs/006-username-login/`

**References**:
- [plan.md](plan.md) — tech stack, project structure, files to create/modify
- [spec.md](spec.md) — 3 user stories (US1 P1, US2 P1, US3 P2)
- [data-model.md](data-model.md) — User, UserSession, UserRegistry entities + storage keys
- [research.md](research.md) — key decisions (normalization, namespacing, session strategy)
- [contracts/ui-contracts.md](contracts/ui-contracts.md) — hook/component interfaces

**Format**: `- [ ] [ID] [P?] [Story?] Description with file path`
- **[P]** = can run in parallel (touches a different file, no blocking dependency)
- **[US#]** = maps to user story

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm environment and understand the existing codebase before touching any files.

- [X] T001 Review existing src/types/index.ts, src/utils/storage.ts, src/hooks/usePredictions.ts, src/App.tsx, and src/components/MainPage.tsx to confirm baseline before any changes

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core type definitions and storage helpers that ALL user stories depend on. Must be complete before any user story work begins.

**⚠️ CRITICAL**: No user story implementation can start until this phase is complete.

- [X] T002 Add `User`, `UserSession`, and `UserRegistry` types to `src/types/index.ts`
- [X] T003 Add auth storage helpers (`getSession`, `saveSession`, `clearSession`, `getUsers`, `saveUser`) and `userPredictionsKey` per-user key helper to `src/utils/storage.ts` (depends on T002 for types)

**Checkpoint**: Types and storage utilities are ready. All user story work can now begin.

---

## Phase 3: User Story 1 — Access With Username (Priority: P1) 🎯 MVP

**Goal**: Show a login screen to unauthenticated users; allow them to enter a username to log in or auto-create an account; display their username in the main screen header after login.

**Independent Test**: Open the app in a fresh private window → login screen with "Random Predictions" appears → enter `Alice` → main screen loads → `alice` is visible in the top corner. (See quickstart.md Scenarios 1–3, 6, 7, 8.)

- [X] T004 [P] [US1] Create `useAuth` hook that reads/restores `session_v1` on mount, exposes `username`, `login(rawUsername)`, and `logout()` in `src/hooks/useAuth.ts` (depends on T003)
- [X] T005 [P] [US1] Create `LoginPage` component showing "Random Predictions" heading, username text input, submit button, and inline validation error in `src/components/LoginPage.tsx` (depends on T002)
- [X] T006 [US1] Update `src/App.tsx` to import and call `useAuth`; render `<LoginPage onLogin={login} />` when `username` is null, otherwise render `<MainPage username={username} onLogout={logout} />` (depends on T004, T005)
- [X] T007 [US1] Add `username` prop and `onLogout` prop signature to `MainPage`, and display the `username` value as a chip in the top-right corner of the header in `src/components/MainPage.tsx` (depends on T006)

**Checkpoint**: User Story 1 is fully functional — login, display, and app gate all work independently.

---

## Phase 4: User Story 2 — Save Predictions Per User (Priority: P1)

**Goal**: Predictions are stored and loaded under the currently logged-in user's namespace (`predictions_v1_{username}`), so each user sees only their own saved predictions.

**Independent Test**: Log in as `alice`, save a prediction, log out, log in as `bob` → bob sees no predictions → bob saves a different score → log out, log in as `alice` → alice's original prediction is unchanged. (See quickstart.md Scenario 4.)

- [X] T008 [P] [US2] Update `usePredictions` hook to accept a `username: string` parameter and use `predictions_v1_{username}` as the localStorage key for all reads and writes in `src/hooks/usePredictions.ts` (depends on T003)
- [X] T009 [US2] Update `MainPage` to call `usePredictions(username)` using the `username` prop (not a hardcoded key); remove any reference to the old global `predictions_v1` key in `src/components/MainPage.tsx` (depends on T007, T008)

**Checkpoint**: User Story 2 is fully functional — saving a prediction as one user does not appear for another user.

---

## Phase 5: User Story 3 — Logout At Any Time (Priority: P2)

**Goal**: A logged-in user can log out at any moment; if the prediction modal is open a confirmation prompt warns of potential unsaved edits before completing the logout.

**Independent Test**: Log in → open prediction modal → click logout → confirm dialog appears → confirm → login screen shown. Log in again → click logout without modal open → instant logout, no dialog. (See quickstart.md Scenarios 5, 9.)

- [X] T010 [US3] Add a "Logout" button to the `MainPage` header that calls `onLogout` (or a local wrapper) in `src/components/MainPage.tsx`; the button MUST be visible at all times while logged in, including during the prediction list loading state (depends on T009)
- [X] T011 [US3] Implement logout guard in `MainPage`: use `isModalOpen` state as the proxy for "unsaved edits in progress" — if the modal is open (regardless of whether edits were actually made), call `window.confirm()` with an unsaved-edits warning before invoking `onLogout`; if the user cancels, keep the modal open and stay logged in; if the modal is closed, call `onLogout` immediately without a prompt in `src/components/MainPage.tsx` (depends on T010)

**Checkpoint**: User Story 3 is fully functional — logout works at any time; the confirmation guard fires only when the modal is open.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Manual validation across all scenarios, edge case verification, and cleanup.

- [X] T012 [P] Run all 9 quickstart.md validation scenarios manually and confirm each expected outcome (see `specs/006-username-login/quickstart.md`)
- [X] T013 Verify that the orphaned `predictions_v1` global key (from feature 002) is silently ignored and does not interfere with the new per-user keys (check DevTools → Application → Local Storage)

---

## Dependencies & Execution Order

### Phase Dependencies

| Phase | Depends On | Can Start |
|-------|-----------|-----------|
| Phase 1 — Setup | None | Immediately |
| Phase 2 — Foundational | Phase 1 | After T001 |
| Phase 3 — US1 | Phase 2 | After T003 |
| Phase 4 — US2 | Phase 2 | After T003 (in parallel with US1 once T003 is done) |
| Phase 5 — US3 | Phase 4 complete | After T009 |
| Phase 6 — Polish | Phases 3–5 | After all stories done |

### User Story Dependencies

- **US1 (P1)**: Requires foundational types + storage (T002–T003). Independent of US2/US3.
- **US2 (P1)**: Requires foundational storage helper (T003). T008 is independent of US1 tasks. T009 requires T007 (MainPage props) and T008 (updated hook).
- **US3 (P2)**: Requires US2 complete (T009) — logout button + modal guard go into MainPage after predictions are wired.

### Within Each Phase

- Core types before storage helpers (T002 → T003)
- Hook + component in parallel (T004 ‖ T005), then App.tsx wires them (T006)
- MainPage header update after App.tsx is wired (T007)
- `usePredictions` update is independent of US1 component work (T008 [P] starts when T003 is done)
- MainPage predictions wiring after both MainPage props (T007) and hook update (T008) are done

---

## Parallel Execution Examples

### After T003 (Foundational complete) — start these simultaneously:

```
T004 [P] [US1]  src/hooks/useAuth.ts          (new file)
T005 [P] [US1]  src/components/LoginPage.tsx  (new file)
T008 [P] [US2]  src/hooks/usePredictions.ts   (update existing)
```

### After T004 + T005 complete:

```
T006 [US1]  src/App.tsx  (wires useAuth + conditional render)
```

### After T006 + T008 complete:

```
T007 [US1]  src/components/MainPage.tsx  (username chip + props)
  — then T009 [US2] (wire usePredictions(username) in MainPage)
  — then T010–T011 [US3] (logout button + guard)
```

---

## Implementation Strategy

### MVP First (US1 + US2 — both P1)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002–T003) — **CRITICAL**
3. Complete Phase 3: US1 — Login (T004–T007)
4. Complete Phase 4: US2 — Per-user Predictions (T008–T009)
5. **STOP and VALIDATE**: Run quickstart.md Scenarios 1–8
6. Deploy/demo as MVP

### Incremental Delivery

1. Setup + Foundational → types and storage ready
2. US1 → Login works, username visible → **Demo: login gate and identity display**
3. US2 → Predictions are user-scoped → **Demo: per-user isolation**
4. US3 → Logout with guard → **Demo: full session lifecycle**
5. Polish → All 9 scenarios pass → **Release**

---

## Notes

- No automated tests — manual validation per constitution (`no unit tests… unless explicitly requested`)
- [P] tasks touch different files with no blocking inter-dependency
- Username normalization (trim + lowercase) lives in `useAuth.login()` — **not** in `LoginPage`
- The global `predictions_v1` key is intentionally orphaned; no migration code needed
- `window.confirm()` for the logout warning requires no new dependency
