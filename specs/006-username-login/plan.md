# Implementation Plan: Username Login

**Branch**: `006-username-login` | **Date**: June 12, 2026 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/006-username-login/spec.md`

## Summary

Add username-only login to the React SPA so predictions are persisted and isolated per user identity. A new login screen (showing "Random Predictions" app name) gates access to the existing prediction experience. Username lookup and creation are automatic — no password is required. Session state and per-user predictions are both stored in browser localStorage. The active username is displayed in the top corner of the main screen, and users can log out at any time to return to the login screen.

## Technical Context

**Language/Version**: TypeScript (React 19.2.6, Vite)

**Primary Dependencies**:
- React (UI framework — existing)
- Tailwind CSS (styling — existing)
- Browser localStorage (session + user registry + per-user predictions)

**Storage**:
- `session_v1` → `{ username: string }` — persists the active login across page loads
- `users_v1` → `Record<string, User>` — registry of all known usernames (keyed by normalized username)
- `predictions_v1_{username}` → `PredictionStore` — per-user prediction data (replaces global `predictions_v1`)

**Testing**: Manual validation per spec (no automated test suite per constitution)

**Target Platform**: Web browser (desktop + mobile, responsive layout via Tailwind)

**Project Type**: Single-page React application (frontend-only, no backend)

**Performance Goals**:
- Login screen renders in <2 seconds (SC-001)
- Login action completes in <1 second (localStorage read/write only)
- Logout action completes in <1 second

**Constraints**:
- No new runtime dependencies (constitution: minimal dependencies)
- Username normalization: lowercase + trim (consistent identity, no duplicates)
- Predictions locked at match start — existing hard cutoff logic unchanged
- localStorage migration: existing `predictions_v1` global key is not automatically migrated (v1 scope)

**Scale/Scope**:
- Multiple users per browser (independent localStorage namespaces per username)
- Single-page flow: Login → Main screen (existing)
- 2 new components: `LoginPage`, username display chip in `MainPage` header

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Justification |
|-----------|--------|---------------|
| Clean Code | ✅ | New `useAuth` hook encapsulates auth state. `LoginPage` and `storage.auth` are small, single-purpose units. |
| Simple UX | ✅ | Single text field + submit button on login. Username visible in header. Logout is one action. |
| Responsive Design | ✅ | LoginPage uses same Tailwind responsive patterns as existing MainPage. |
| Minimal Dependencies | ✅ | No new libraries. All state managed via React hooks + localStorage. |

**Post-design re-check**: ✅ — Design artifacts introduce no violations. Per-user localStorage namespacing is a plain string key strategy, no extra abstraction layers.

## Project Structure

### Documentation (this feature)

```text
specs/006-username-login/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── ui-contracts.md
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── LoginPage.tsx          # NEW — login screen with app name + username input
│   ├── MainPage.tsx           # MODIFY — add username chip to header + logout button
│   ├── MatchCard.tsx          # unchanged
│   ├── PredictionInput.tsx    # unchanged
│   └── PredictionModal.tsx    # unchanged
├── hooks/
│   ├── useAuth.ts             # NEW — manages login, logout, session persistence
│   ├── useMatches.ts          # unchanged
│   └── usePredictions.ts      # MODIFY — accept username param for storage key namespacing
├── types/
│   └── index.ts               # MODIFY — add User, UserSession types
└── utils/
    ├── storage.ts             # MODIFY — add auth storage helpers + per-user prediction key
    ├── date.ts                # unchanged
    └── predictions.ts         # unchanged

src/App.tsx                    # MODIFY — add auth gate (LoginPage vs MainPage)
```

**Structure Decision**: Single-project frontend layout. All new code lives in `src/` alongside existing components and hooks. No new top-level directories required.
