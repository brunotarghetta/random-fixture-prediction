# Quickstart Validation Guide: Username Login

**Feature**: `006-username-login` | **Date**: June 12, 2026

## Prerequisites

- Node.js installed
- Repository cloned: `c:\Users\BTarghetta\source\repos\random-fixture-prediction`
- Feature branch checked out: `006-username-login`
- Dependencies installed: `npm install`

## Start the App

```powershell
cd c:\Users\BTarghetta\source\repos\random-fixture-prediction
npm run dev
```

Open `http://localhost:5173` in a browser.

---

## Validation Scenarios

All scenarios are manually verified. Open DevTools → Application → Local Storage to inspect stored values as needed.

---

### Scenario 1 — Login Screen Is the Entry Point (FR-001, FR-002, SC-001)

**Steps**:
1. Open the app in a private/incognito window (ensures no stored session).
2. Observe the first screen shown.

**Expected**:
- The login screen is displayed (not the match/prediction screen).
- The text **"Random Predictions"** is visible as the app name on the login screen.
- A username input field and a submit button are present.
- Screen loads in under 2 seconds.

---

### Scenario 2 — New User Creation and Login (FR-003, FR-004, FR-006, SC-002)

**Steps**:
1. On the login screen, enter a username: `Alice`
2. Submit the form.

**Expected**:
- The main prediction screen is shown.
- The username **"alice"** (normalized) is displayed in the top corner of the screen.
- In localStorage: `session_v1` = `{ "username": "alice" }` and `users_v1` contains an entry for `"alice"`.

---

### Scenario 3 — Returning User Login (FR-005)

**Steps**:
1. Log out (see Scenario 5 below).
2. On the login screen, enter the same username: `alice`
3. Submit the form.

**Expected**:
- The main prediction screen is shown again for the same user.
- In localStorage: `session_v1` = `{ "username": "alice" }`.
- No second entry for `"alice"` was added to `users_v1`.

---

### Scenario 4 — Predictions Are User-Scoped and Isolated (FR-009, FR-010, FR-011, SC-003)

**Steps**:
1. Log in as `alice`.
2. Save a prediction for any match.
3. Log out.
4. Log in as `bob`.
5. Observe the prediction screen.
6. Optionally save a prediction for the same match with a different score.
7. Log out.
8. Log in as `alice` again.

**Expected**:
- While logged in as `bob`: alice's prediction is **not** visible.
- While logged in as `alice` again: alice's original prediction is **still there**, unchanged.
- In localStorage: keys `predictions_v1_alice` and `predictions_v1_bob` exist independently.

---

### Scenario 5 — Logout (FR-007, FR-008, SC-004)

**Steps**:
1. Log in as `alice`.
2. Click the logout button (visible in the top area of the main screen).

**Expected**:
- The login screen is shown immediately.
- In localStorage: `session_v1` is **absent** (or null).
- The username chip in the header is no longer visible.

---

### Scenario 6 — Session Persists Across Page Reload

**Steps**:
1. Log in as `alice`.
2. Refresh the page (F5 or browser reload).

**Expected**:
- The main screen is shown immediately without requiring re-login.
- Username `alice` is still displayed in the top corner.
- In localStorage: `session_v1` still contains `{ "username": "alice" }`.

---

### Scenario 7 — Empty Username Rejected (FR-012, Edge Case)

**Steps**:
1. Open the login screen.
2. Submit the form with the username field empty.
3. Then try submitting with only spaces: `   `

**Expected**:
- Neither submission is accepted.
- A clear validation message is shown below the input (e.g., "Please enter a valid username").
- The user remains on the login screen.

---

### Scenario 8 — Case Normalization (Edge Case)

**Steps**:
1. Log in as `Alice`.
2. Log out.
3. Log in as `ALICE`.
4. Check localStorage.

**Expected**:
- Both logins succeed and resolve to the same identity: `alice`.
- Only one entry for `"alice"` in `users_v1`.
- `session_v1` = `{ "username": "alice" }` in both cases.

---

### Scenario 9 — Logout Warning When Modal Is Open (Edge Case)

**Steps**:
1. Log in as `alice`.
2. Open the prediction modal.
3. Click logout without saving.

**Expected**:
- A confirmation dialog appears warning that unsaved edits may be lost.
- If the user cancels: the modal stays open, the user remains logged in.
- If the user confirms: logout completes, login screen is shown.

---

## Artifacts Reference

- Data model (entities and storage keys): [data-model.md](data-model.md)
- Hook and component contracts: [contracts/ui-contracts.md](contracts/ui-contracts.md)
- Feature specification: [spec.md](spec.md)
