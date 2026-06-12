# Feature Specification: Initial Page Setup

**Feature Branch**: `002-initial-page-setup`

**Created**: June 11, 2026

**Status**: Draft

**Input**: User description: "initial page setup: esta aplicacion debe poder realizar predicciones de resultados partidos de futbol del mundial USA 2026. En esta pagina principal el usuario debera ver el listado de los partidos del dia con los resultados. Si el partido aun no tiene resultados final, apracere vacio. Si el partido ya lo tiene mostrara el mismo. Y abajo debera ver la prediccion realizada. Se deberan usar colores pasteles, tiene que ser simple. Si el usaurio quore realizar prediciones debera haber un boton "Cargar predicciones" y al apretar el mismo se mostrara un popup con todos los partidos del mundia dobde podra poner el resultados con los goles. Siempre los equipos se representaran con bandera y las iniciales."

## Clarifications

### Session 2026-06-11

- Q: What user types and roles should the system support? → A: Single user type (predictors only); all users can view matches/results and make predictions. Existing authentication system manages user identity.
- Q: What language(s) should the UI display? → A: English only - all UI text in English.
- Q: How frequently should match results refresh? → A: Manual refresh only - users click a button to fetch the latest results.
- Q: Can users edit predictions after a match has started? → A: Hard cutoff - predictions are locked once a match starts; editing is disabled.
- Q: Should specific pastel colors be defined now? → A: Yes - define a specific 3-color pastel palette: soft blue (for upcoming matches), soft green (for completed matches), soft pink (for user predictions).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Daily Matches with Results (Priority: P1)

The user (predictor/authenticated) opens the main page and sees all matches scheduled for today. Each match displays the two competing teams (represented by flag and initials), and either:
- Empty result area if the match hasn't been played yet (shown in soft blue background)
- Final score if the match is already finished (shown in soft green background)
- Below each match, their previous prediction is displayed in soft pink (if one exists)

A "Refresh" button allows the user to manually fetch the latest match results and scores from the data source.

**Why this priority**: This is the core functionality - the dashboard must display the day's matches and results immediately upon page load. This is essential for users to understand the current state of the tournament and see their existing predictions.

**Independent Test**: Can be fully tested by loading the page on a day with matches. Delivers value by showing match schedules, results, and existing predictions at a glance.

**Acceptance Scenarios**:

1. **Given** the application is loaded on a day with scheduled matches, **When** the page displays, **Then** the user sees a list of all matches for that day with team names (flag + initials), empty result areas for future matches, and completed scores for finished matches
2. **Given** a user has previously made a prediction for a match, **When** that match appears in the list, **Then** the user's prediction is displayed below the match
3. **Given** a match that hasn't started yet, **When** the user views the page, **Then** the result area appears empty/blank
4. **Given** a match that has finished, **When** the user views the page, **Then** the final score is displayed

---

### User Story 2 - Load and Edit Predictions via Modal (Priority: P1)

The user clicks the "Load Predictions" button on the main page. A modal popup opens displaying all World Cup matches (not just today's). The user can view, create, or edit predictions for each match by entering the goal scores for both teams. Teams are consistently represented with flag and initials. Predictions can only be edited for matches that have not yet started; once a match begins, the prediction fields are locked and disabled.

**Why this priority**: This is the core interaction for users who want to make predictions. It provides access to the full tournament schedule and allows bulk prediction entry/editing, making it essential for engaging users.

**Independent Test**: Can be fully tested by clicking the button, viewing the modal content, entering prediction data for upcoming matches, and confirming it appears on the main page. Delivers value by enabling users to make predictions for any match in the tournament before it starts.

**Acceptance Scenarios**:

1. **Given** the user is on the main page, **When** they click the "Load Predictions" button, **Then** a modal popup appears
2. **Given** the modal is open, **When** the user views the content, **Then** they see all World Cup matches listed (from all tournament phases)
3. **Given** the modal is displaying matches, **When** the user views each match, **Then** teams are represented consistently with flag and initials
4. **Given** a match that has not started, **When** the user enters goal predictions for both teams, **Then** the input fields accept numeric values and are enabled
5. **Given** a match that has started or finished, **When** the user views that match in the modal, **Then** the prediction input fields are disabled and locked
6. **Given** the user has entered predictions, **When** they close/confirm the modal, **Then** the predictions are saved and displayed on the main page

---

### Edge Cases

- What happens when there are no matches scheduled for the current day? System displays a message "No matches today" with a prompt to view predictions for future matches.
- How does the system display predictions for matches from future dates? Via the "Load Predictions" modal, predictions are visible for all matches regardless of date.
- What happens if a match's result is updated after the user has already made their prediction? User can manually refresh to see updated results. Their previous prediction remains visible for comparison.
- How does the system handle users accessing the page during a live match (result still being determined)? Prediction input fields are disabled (hard cutoff at match start). Users can view the live result area as it updates via manual refresh.
- What if a user tries to edit a prediction for a match that has already started? The modal prevents editing by disabling input fields for matches in progress or completed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a list of all World Cup matches scheduled for the current day on the main page
- **FR-002**: System MUST display match results (final score) for completed matches with soft green background
- **FR-003**: System MUST display empty/blank result areas for matches not yet played with soft blue background
- **FR-004**: System MUST show user predictions below each match on the main page with soft pink background
- **FR-005**: System MUST provide a "Load Predictions" button on the main page to access the prediction editor
- **FR-006**: System MUST provide a "Refresh" button on the main page to manually fetch latest match results
- **FR-007**: System MUST display a modal popup when the prediction button is clicked
- **FR-008**: System MUST display all World Cup matches (complete tournament schedule) in the prediction modal
- **FR-009**: System MUST allow users to enter goal predictions for both teams in each match
- **FR-010**: System MUST prevent prediction editing for matches that have started or finished (hard cutoff - disable input fields)
- **FR-011**: System MUST represent all teams with a flag icon and team initials (2-3 letter abbreviation)
- **FR-012**: System MUST persist user predictions and display them on the main page after modal is closed
- **FR-013**: System MUST use the defined pastel color palette: soft blue (upcoming), soft green (completed), soft pink (predictions)
- **FR-014**: System MUST implement a simple, uncluttered UI design in English language
- **FR-015**: System MUST support only predictor user type; all authenticated users have equal prediction and viewing privileges

### Key Entities

- **Match**: Represents a World Cup game with two teams, scheduled date/time, and optional final score
  - Attributes: Team A, Team B, scheduled datetime, final score (null if not played)
  
- **Team**: Represents a national football team
  - Attributes: Flag emoji/icon, 2-3 letter initials, full name
  
- **Prediction**: Represents a user's prediction for a specific match
  - Attributes: Predicted goals for Team A, Predicted goals for Team B, prediction timestamp

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view the day's matches and their predictions within 2 seconds of page load
- **SC-002**: Users can open the prediction modal and view all tournament matches within 1 second
- **SC-003**: Users can enter a prediction for a match in under 10 seconds
- **SC-004**: 95% of users successfully navigate from viewing matches to entering a prediction on first attempt
- **SC-005**: The interface is visually simple with no more than 3 colors (plus white/neutral) to maintain clarity
- **SC-006**: All matches display consistently with flag icons and initials for every team

## Assumptions

- Users have access to current match schedules and results data from an external source (API or database)
- The application will run primarily on desktop/web browsers (mobile optimization out of scope for v1)
- User authentication is already handled by the application's existing authentication system; all authenticated users are predictors
- The "current day" is determined by the application server's timezone
- Predictions are stored per user and must be persisted across sessions
- Pastel color palette is defined as: soft blue for upcoming matches, soft green for completed matches, soft pink for user predictions (can use Tailwind's blue-100/200, green-100/200, pink-100/200 or equivalent)
- The complete World Cup tournament schedule is known and available (fixed, 64 matches total)
- All UI text is in English language
- Manual refresh is triggered by explicit user action (button click); no auto-polling
- Predictions are locked (uneditable) the moment a match's scheduled start time is reached
