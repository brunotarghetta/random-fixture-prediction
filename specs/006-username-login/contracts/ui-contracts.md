# UI Contracts: Username Login

**Feature**: `006-username-login` | **Date**: June 12, 2026

---

## New Components

### `LoginPage`

**File**: `src/components/LoginPage.tsx`

**Purpose**: The initial screen shown to unauthenticated users. Displays the app name and collects the username to log in or auto-create an account.

**Props**:

```ts
interface LoginPageProps {
  onLogin: (username: string) => void;
}
```

| Prop | Type | Description |
|------|------|-------------|
| `onLogin` | `(username: string) => void` | Called with the **raw** (un-normalized) username string after the user submits a valid form. Normalization is performed inside the `useAuth` hook. |

**Behavior**:
- Renders the app name "Random Predictions" as a heading.
- Renders a text input bound to local component state.
- On submit: validates that the trimmed input is non-empty.
  - Invalid → shows inline error message; does not call `onLogin`.
  - Valid → calls `onLogin(rawInput)`.
- Clears the input field after a successful `onLogin` call is triggered.

**Responsive**: Full-screen centered layout; works on mobile and desktop.

---

## Modified Components

### `MainPage` (updated)

**File**: `src/components/MainPage.tsx`

**New props added**:

```ts
interface MainPageProps {
  username: string;
  onLogout: () => void;
}
```

| Prop | Type | Description |
|------|------|-------------|
| `username` | `string` | The normalized username of the currently logged-in user. Displayed in the top corner of the header. |
| `onLogout` | `() => void` | Called when the user clicks the logout action. `MainPage` is responsible for showing the unsaved-edits warning (via `window.confirm()`) if the prediction modal is open before calling this. |

**Behavior changes**:
- Header gains a username chip showing the logged-in `username` in the top-right corner.
- Header gains a "Logout" button (or icon) that invokes `onLogout`.
- `usePredictions` is called with the `username` prop to scope predictions to the current user.

---

## New Hooks

### `useAuth`

**File**: `src/hooks/useAuth.ts`

**Purpose**: Manages authentication state — session persistence, login, and logout.

**Signature**:

```ts
interface AuthState {
  username: string | null;
  login: (rawUsername: string) => void;
  logout: () => void;
}

export const useAuth = (): AuthState
```

**Behavior**:

| Member | Description |
|--------|-------------|
| `username` | The normalized username of the active session, or `null` if logged out. Initialized by reading `session_v1` from localStorage on mount. |
| `login(rawUsername)` | Normalizes `rawUsername` (trim + lowercase). Looks up `users_v1` to find or create the `User` record. Writes `session_v1`. Updates React state. |
| `logout()` | Removes `session_v1` from localStorage. Sets `username` to `null`. |

---

## Modified Hooks

### `usePredictions` (updated)

**File**: `src/hooks/usePredictions.ts`

**Change**: Accepts a `username: string` parameter to scope the localStorage key.

**Updated signature**:
```ts
export const usePredictions = (username: string) => { ... }
```

**Behavior change**: All reads and writes use `predictions_v1_{username}` as the localStorage key instead of the global `predictions_v1`.

---

## Storage Helpers

**File**: `src/utils/storage.ts` (additions)

```ts
// Key helpers
const SESSION_KEY = 'session_v1';
const USERS_KEY = 'users_v1';
const userPredictionsKey = (username: string): string =>
  `predictions_v1_${username}`;

// Auth helpers added to the storage object:
auth: {
  getSession(): UserSession | null
  saveSession(session: UserSession): void
  clearSession(): void
  getUsers(): UserRegistry
  saveUser(user: User): void
}
```

---

## App Composition

**File**: `src/App.tsx`

```ts
// Pseudocode — not the full implementation
const { username, login, logout } = useAuth();

if (username === null) {
  return <LoginPage onLogin={login} />;
}

return <MainPage username={username} onLogout={logout} />;
```

---

## Summary of Contracts

| Contract | Type | File |
|----------|------|------|
| `LoginPageProps` | Component props | `src/components/LoginPage.tsx` |
| `MainPageProps` (updated) | Component props | `src/components/MainPage.tsx` |
| `AuthState` / `useAuth` | Hook return type | `src/hooks/useAuth.ts` |
| `usePredictions(username)` | Hook signature | `src/hooks/usePredictions.ts` |
| Storage auth helpers | Utility methods | `src/utils/storage.ts` |
