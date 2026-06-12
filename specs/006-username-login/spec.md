# Feature Specification: Username Login

**Feature Branch**: `006-username-login`

**Created**: June 12, 2026

**Status**: Draft

**Input**: User description: "Quiero tener la posibilidad de poder loguearme con nombre de usuario. De esta manera cuando grabo mis predicciones quedan asociadas a mi usuario. El usuario si no existe se debe permitir crearlo. Solo se pedira nombre de usuario sin password. Cuando el usuario se loguea exitosamente se vera su nombre en la pantalla, en la esquina superior. En todo momento el usuario puede decidir desloguearse. De esta manera la pantalla principal de la aplicacion ahora es una que te pide el usuario. Se debera mostrar en esta el nombre de la app: \"Random Predictions\""

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Access With Username (Priority: P1)

As a user, I can enter a username on the initial screen to log in, so I can access the prediction experience as an identified user.

**Why this priority**: Without login, users cannot be identified and predictions cannot be tied to a person, which is the core business need.

**Independent Test**: Can be fully tested by opening the app, entering a username, and verifying that access is granted and the user identity is visible.

**Acceptance Scenarios**:

1. **Given** the app is opened and no user is logged in, **When** the user sees the initial screen, **Then** the app name "Random Predictions" is displayed and a username input is available
2. **Given** the user enters a valid username that does not exist yet, **When** they submit the form, **Then** the system creates that user and logs them in successfully
3. **Given** the user enters a valid username that already exists, **When** they submit the form, **Then** the system logs them in with that existing identity
4. **Given** a successful login, **When** the main screen is shown, **Then** the username is visible in the top corner

---

### User Story 2 - Save Predictions Per User (Priority: P1)

As a logged-in user, my saved predictions are associated with my username so that each user can keep independent prediction data.

**Why this priority**: The value of adding login is to keep prediction ownership separated by user identity.

**Independent Test**: Can be fully tested by saving predictions with one username, logging out, logging in with another username, and verifying each user sees only their own saved predictions.

**Acceptance Scenarios**:

1. **Given** user A is logged in, **When** user A saves or updates a prediction, **Then** the prediction is stored under user A's identity
2. **Given** user A has saved predictions and logs out, **When** user B logs in, **Then** user B does not see user A's predictions by default
3. **Given** user B saves predictions and logs out, **When** user A logs back in, **Then** user A's previous predictions are still available for user A

---

### User Story 3 - Logout At Any Time (Priority: P2)

As a logged-in user, I can log out whenever I choose, so I can end my session and return to the login screen.

**Why this priority**: Logout is required for account switching and basic control over the active identity.

**Independent Test**: Can be fully tested by logging in, using the app, selecting logout, and verifying return to the login entry screen.

**Acceptance Scenarios**:

1. **Given** a user is logged in, **When** they choose to log out, **Then** the active session ends and the login screen is shown again
2. **Given** the user has logged out, **When** they view the screen, **Then** no previous username is shown as currently authenticated

---

### Edge Cases

- What happens when the user submits an empty username? The system rejects the submission and shows a clear validation message.
- What happens when the user submits a username made only of spaces? The system trims input, rejects invalid values, and requests a non-empty username.
- What happens when two users pick usernames that differ only by uppercase/lowercase? The system applies a single consistency rule and treats equivalent names as the same identity.
- What happens when a user logs out while having unsaved prediction edits in progress? The system warns the user that unsaved edits may be lost before completing logout.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST show a dedicated initial screen for unauthenticated users.
- **FR-002**: System MUST display the application name "Random Predictions" on the initial screen.
- **FR-003**: System MUST allow users to enter a username and submit it to log in.
- **FR-004**: System MUST allow account creation automatically when the submitted username does not yet exist.
- **FR-005**: System MUST authenticate existing accounts using username only, with no password prompt.
- **FR-006**: System MUST display the logged-in username in the top corner of the main screen after successful login.
- **FR-007**: System MUST provide a logout action available at all times while a user is logged in.
- **FR-008**: System MUST return users to the login screen immediately after logout.
- **FR-009**: System MUST associate saved predictions with the currently logged-in username.
- **FR-010**: System MUST keep predictions isolated so one logged-in user cannot see another user's saved predictions as their own.
- **FR-011**: System MUST preserve each user's predictions across logout/login cycles for that same username.
- **FR-012**: System MUST validate username input and reject empty or invalid values with user-friendly feedback.

### Key Entities *(include if feature involves data)*

- **User**: Represents a person identified by a unique username used for login and ownership of predictions.
- **User Session**: Represents the currently authenticated user state in the app, including login and logout transitions.
- **User Prediction Set**: Represents the collection of predictions owned by one specific user identity.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of users can reach the login screen and see the app name within 2 seconds of opening the app.
- **SC-002**: 95% of users complete login with a username in under 20 seconds on first attempt.
- **SC-003**: 100% of saved predictions are retrievable only under the same username that created them during validation tests.
- **SC-004**: 100% of users can complete logout and return to the login screen in one action.
- **SC-005**: At least 90% of validation participants correctly identify the active logged-in username from the top-corner display.

## Assumptions

- Usernames are unique per application and can be used as the sole identity factor for this feature scope.
- Username-based access without password is acceptable for this product stage.
- Existing prediction functionality remains unchanged except for ownership being tied to username.
- The application already has a main prediction screen that is shown only after successful login.
- Username comparison follows a consistent normalization rule so users are not duplicated unexpectedly.
