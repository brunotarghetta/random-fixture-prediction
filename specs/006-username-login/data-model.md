# Data Model: Username Login

**Feature**: `006-username-login` | **Date**: June 12, 2026

## Entities

---

### User

Represents a person identified by a unique, normalized username. Created automatically on first login.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `username` | `string` | Required, trimmed, lowercase, non-empty | Normalized username — used as the primary key |
| `createdAt` | `string` | ISO 8601, set on creation | Timestamp when the user was first created |

**Normalization rule**: `username = input.trim().toLowerCase()`

**Validation rules**:
- After normalization, `username.length > 0` — reject empty or whitespace-only input
- No maximum length enforced in v1 (kept simple per constitution)

**TypeScript type**:
```ts
export interface User {
  username: string;   // normalized (trimmed + lowercase)
  createdAt: string;  // ISO 8601
}
```

---

### UserSession

Represents the currently authenticated user state in the browser. There is at most one active session per browser at any time.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `username` | `string` | Normalized (matches a `User.username` in registry) | The currently logged-in user's normalized username |

**State transitions**:
```
null (no session)
  → [login with username] → { username: "alice" }  (session active)
  → [logout]              → null (session cleared)
```

**TypeScript type**:
```ts
export interface UserSession {
  username: string;
}
```

---

### UserPredictionSet

Represents the collection of predictions owned by one specific user. Not a new type — maps to the existing `PredictionStore` type, scoped to a user via the storage key.

| Field | Type | Description |
|-------|------|-------------|
| *(matchId)* | `string` | Key: match identifier |
| *(value)* | `Prediction` | Value: prediction details (existing `Prediction` type) |

**Relationship to User**: One `UserPredictionSet` per `User`, linked via the localStorage key convention.

---

## Storage Schema

All data is stored in browser `localStorage`. No schema migrations are performed automatically.

| Key | Type | Description |
|-----|------|-------------|
| `session_v1` | `UserSession \| null` | Active user session; absent means logged out |
| `users_v1` | `Record<string, User>` | Registry of all known users, keyed by normalized username |
| `predictions_v1_{username}` | `PredictionStore` | Predictions for user `{username}`, e.g. `predictions_v1_alice` |
| `predictions_v1` | *(orphaned)* | Legacy global key from feature 002; ignored by v006 code |

**localStorage footprint estimate**:
- `session_v1`: ~50 bytes
- `users_v1` with 10 users: ~1 KB
- `predictions_v1_{username}` per user with 64 predictions: ~5 KB
- Well within the ~5 MB localStorage limit.

---

## State Transitions

### Login Flow

```
User opens app
  → read session_v1
    ├── found → restore session → render MainPage
    └── not found → render LoginPage

User submits username on LoginPage
  → normalize input (trim + lowercase)
  → validate (non-empty after normalization)
    ├── invalid → show error message, stay on LoginPage
    └── valid →
        → read users_v1
          ├── username exists → returning user
          └── username absent → create User record, write to users_v1
        → write session_v1 = { username }
        → render MainPage
```

### Logout Flow

```
User clicks logout in MainPage
  → if prediction modal is open → window.confirm() warning
    ├── cancelled → stay on MainPage
    └── confirmed →
  → remove session_v1 from localStorage
  → set React auth state to null
  → render LoginPage
```

### Prediction Save Flow (updated for user scope)

```
User saves prediction
  → usePredictions reads/writes localStorage key: predictions_v1_{username}
  → prediction stored under current user's namespace
```

---

## Relationships Diagram

```
User (users_v1)
│
├── 1:1 → UserSession (session_v1)   [at most one active session]
│
└── 1:1 → UserPredictionSet (predictions_v1_{username})
              │
              └── 0..* → Prediction (existing type, unchanged)
```

---

## TypeScript Changes Summary

**`src/types/index.ts`** — add:
```ts
export interface User {
  username: string;
  createdAt: string;
}

export interface UserSession {
  username: string;
}

export type UserRegistry = Record<string, User>;
```

**`src/utils/storage.ts`** — add auth storage helpers:
```ts
// Keys
const SESSION_KEY = 'session_v1';
const USERS_KEY = 'users_v1';
const userPredictionsKey = (username: string) => `predictions_v1_${username}`;

// New helpers: getSession, saveSession, clearSession,
//              getUsers, saveUser,
//              getUserPredictions (username-scoped), saveUserPrediction (username-scoped)
```

**`src/hooks/usePredictions.ts`** — accept `username: string` parameter; use `predictions_v1_{username}` key instead of global key.

**`src/hooks/useAuth.ts`** — new hook (see contracts).
