# Research: Username Login

**Feature**: `006-username-login` | **Date**: June 12, 2026

## Decision Log

---

### 1. Username Normalization Strategy

**Decision**: Normalize usernames by trimming whitespace and converting to lowercase before storage and comparison.

**Rationale**: Prevents accidental duplicate accounts for users who type "Alice" vs "alice" or add leading/trailing spaces. Single-rule normalization is simple to reason about and consistent across login, storage key generation, and display.

**Alternatives considered**:
- Case-sensitive (rejected): Would allow "alice" and "Alice" as distinct identities, causing confusion in a username-only auth system.
- Trim only (rejected): Still allows case-duplicates.
- Full slug normalization (rejected): Overly complex for the v1 scope; trimmed lowercase is sufficient.

**Display note**: Store the normalized form; display the normalized form. No need to keep a "display name" separate from the login key in v1.

---

### 2. Per-User Prediction Storage Key Strategy

**Decision**: Namespace localStorage prediction keys by username: `predictions_v1_{username}` (e.g., `predictions_v1_alice`).

**Rationale**: The simplest approach to isolate prediction data per user. Requires no migration of the existing schema — the existing `PredictionStore` type is reused as-is. Each user's data lives independently with zero risk of cross-user data leakage.

**Alternatives considered**:
- Nested object under one key `predictions_v1` → `{ alice: {...}, bob: {...} }` (rejected): Requires reading and writing the entire store on each operation; more complex merge logic; one parse error corrupts all users' data.
- Separate `IndexedDB` store per user (rejected): Adds complexity, async overhead, and departs from the established localStorage pattern in the codebase.

**Migration note**: The global `predictions_v1` key (without username suffix) from feature 002 becomes orphaned. It is intentionally not migrated in v1 — its data is not attributed to any user and will simply be ignored by the new code.

---

### 3. Session Persistence Strategy

**Decision**: Store the active session in localStorage under key `session_v1` as `{ username: string }`. On app startup, read this key to auto-restore the logged-in user. On logout, remove the key.

**Rationale**: Matches the existing localStorage-first pattern. A simple JSON object is sufficient — no expiry logic needed for a username-only, no-password system. The user stays logged in until they explicitly log out.

**Alternatives considered**:
- sessionStorage (rejected): Would clear the session on tab close, creating friction for returning users.
- React Context + in-memory only (rejected): Session would be lost on page reload; not acceptable UX.
- Cookie (rejected): Adds complexity and requires handling SameSite/security attributes with no benefit in a purely client-side app.

---

### 4. User Registry Storage Strategy

**Decision**: Store all known usernames in localStorage under key `users_v1` as `Record<string, User>`, keyed by normalized username.

**Rationale**: Allows the login flow to check whether a username already exists (returning user) or needs to be created (new user) without any server round-trip. The registry is small (each entry is ~50 bytes) and grows linearly with real users of a single browser.

**Alternatives considered**:
- No registry — derive existence from presence of `predictions_v1_{username}` key (rejected): Semantically wrong; a user with no predictions yet would not be "found", implying re-creation on each login.
- Store users inside session_v1 (rejected): Conflates session state with identity registry; harder to evolve.

---

### 5. React Auth State Pattern

**Decision**: Implement a `useAuth` hook that encapsulates login, logout, and session read/write. `App.tsx` reads `{ username }` from `useAuth` and conditionally renders `<LoginPage>` (when `username` is null) or `<MainPage username={username}>` (when logged in).

**Rationale**: The hook pattern is already established in the codebase (`useMatches`, `usePredictions`). Centralizing auth logic in one hook keeps `App.tsx` and `LoginPage` thin. No need for React Context at this scope — `useAuth` is only consumed at the `App` level and props are passed down one level to `MainPage`.

**Alternatives considered**:
- React Context for auth (rejected): Adds boilerplate for a feature that only needs one level of prop passing. Constitution prefers minimal abstraction.
- Auth state in `App.tsx` directly (rejected): Duplicates storage logic in a component; harder to test or reuse.

---

### 6. Unsaved Edit Warning on Logout

**Decision**: Display a browser `confirm()` dialog before completing logout if the prediction modal is currently open (editor in progress). If the modal is not open, log out immediately without a prompt.

**Rationale**: The spec edge case requires warning the user about unsaved prediction edits. `window.confirm()` is the zero-dependency solution that satisfies the requirement without introducing a custom modal. Because `MainPage` already tracks modal open state, the logout handler in `MainPage` can check it before calling `logout()`.

**Alternatives considered**:
- Always show a confirmation (rejected): Unnecessary friction when no edits are in progress.
- Custom confirmation dialog component (rejected): Adds complexity for a one-off interaction; `confirm()` is sufficient for v1.

---

### Summary of Resolved Clarifications

| Question | Resolution |
|----------|------------|
| How should username casing be handled? | Trim + lowercase normalization |
| How to isolate predictions per user? | Per-user localStorage key (`predictions_v1_{username}`) |
| How does session survive a page reload? | `session_v1` localStorage key, restored on mount |
| What happens to the existing global `predictions_v1`? | Orphaned/ignored — no migration in v1 |
| Where does auth state live in React? | `useAuth` hook, consumed only in `App.tsx` |
| How to warn on logout with unsaved edits? | `window.confirm()` if modal is open |
