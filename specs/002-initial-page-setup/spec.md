# Feature Specification: Initial Page Setup

**Feature Branch**: `002-initial-page-setup`

**Created**: June 11, 2026

**Status**: Draft

**Input**: User description: "initial page setup: esta aplicacion debe poder realizar predicciones de resultados partidos de futbol del mundial USA 2026. En esta pagina principal el usuario debera ver el listado de los partidos del dia con los resultados. Si el partido aun no tiene resultados final, apracere vacio. Si el partido ya lo tiene mostrara el mismo. Y abajo debera ver la prediccion realizada. Se deberan usar colores pasteles, tiene que ser simple. Si el usaurio quore realizar prediciones debera haber un boton "Cargar predicciones" y al apretar el mismo se mostrara un popup con todos los partidos del mundia dobde podra poner el resultados con los goles. Siempre los equipos se representaran con bandera y las iniciales."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Daily Matches with Results (Priority: P1)

The user opens the main page and sees all matches scheduled for today. Each match displays the two competing teams (represented by flag and initials), and either:
- Empty result area if the match hasn't been played yet
- Final score if the match is already finished
- Below each match, their previous prediction is displayed (if one exists)

**Why this priority**: This is the core functionality - the dashboard must display the day's matches and results immediately upon page load. This is essential for users to understand the current state of the tournament and see their existing predictions.

**Independent Test**: Can be fully tested by loading the page on a day with matches. Delivers value by showing match schedules, results, and existing predictions at a glance.

**Acceptance Scenarios**:

1. **Given** the application is loaded on a day with scheduled matches, **When** the page displays, **Then** the user sees a list of all matches for that day with team names (flag + initials), empty result areas for future matches, and completed scores for finished matches
2. **Given** a user has previously made a prediction for a match, **When** that match appears in the list, **Then** the user's prediction is displayed below the match
3. **Given** a match that hasn't started yet, **When** the user views the page, **Then** the result area appears empty/blank
4. **Given** a match that has finished, **When** the user views the page, **Then** the final score is displayed

---

### User Story 2 - Load and Edit Predictions via Modal (Priority: P1)

The user clicks the "Cargar predicciones" (Load Predictions) button on the main page. A modal popup opens displaying all World Cup matches (not just today's). The user can view, create, or edit predictions for each match by entering the goal scores for both teams. Teams are consistently represented with flag and initials.

**Why this priority**: This is the core interaction for users who want to make predictions. It provides access to the full tournament schedule and allows bulk prediction entry/editing, making it essential for engaging users.

**Independent Test**: Can be fully tested by clicking the button, viewing the modal content, entering prediction data, and confirming it appears on the main page. Delivers value by enabling users to make predictions for any match in the tournament.

**Acceptance Scenarios**:

1. **Given** the user is on the main page, **When** they click the "Cargar predicciones" button, **Then** a modal popup appears
2. **Given** the modal is open, **When** the user views the content, **Then** they see all World Cup matches listed (from all tournament phases)
3. **Given** the modal is displaying matches, **When** the user views each match, **Then** teams are represented consistently with flag and initials
4. **Given** a match in the modal, **When** the user enters goal predictions for both teams, **Then** the input fields accept numeric values
5. **Given** the user has entered predictions, **When** they close/confirm the modal, **Then** the predictions are saved and displayed on the main page

---

### Edge Cases

- What happens when there are no matches scheduled for the current day?
- How does the system display predictions for matches from future dates?
- What happens if a match's result is updated after the user has already made their prediction?
- How does the system handle users accessing the page during a live match (result still being determined)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a list of all World Cup matches scheduled for the current day on the main page
- **FR-002**: System MUST display match results (final score) for completed matches
- **FR-003**: System MUST display empty/blank result areas for matches not yet played
- **FR-004**: System MUST show user predictions below each match on the main page
- **FR-005**: System MUST provide a "Cargar predicciones" button on the main page to access the prediction editor
- **FR-006**: System MUST display a modal popup when the prediction button is clicked
- **FR-007**: System MUST display all World Cup matches (complete tournament schedule) in the prediction modal
- **FR-008**: System MUST allow users to enter goal predictions for both teams in each match
- **FR-009**: System MUST represent all teams with a flag icon and team initials (2-3 letter abbreviation)
- **FR-010**: System MUST persist user predictions and display them on the main page after modal is closed
- **FR-011**: System MUST use pastel color scheme throughout the interface
- **FR-012**: System MUST implement a simple, uncluttered UI design

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
- User authentication is already handled by the application's existing authentication system
- The "current day" is determined by the application server's timezone
- Predictions are stored per user and must be persisted across sessions
- Pastel color palette will be defined during design phase (e.g., soft blues, greens, pinks, yellows)
- The complete World Cup tournament schedule is known and available (fixed, 64 matches total)
