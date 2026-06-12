# Quickstart: Initial Page Setup Validation

**Date**: June 12, 2026

**Status**: ✅ Complete

**Purpose**: End-to-end validation scenarios to prove feature completeness and correctness.

---

## Prerequisites

✅ Project setup complete:
- Tailwind CSS installed and configured with pastel color palette
- Mock data files created (`src/data/teams.json`, `src/data/matches.json`)
- TypeScript types defined (`src/types/index.ts`)
- Custom hooks implemented (`usePredictions`, `useMatches`)
- React components built (MatchCard, PredictionInput, PredictionModal, MainPage)
- App.tsx updated to render MainPage
- `npm run dev` running successfully

---

## Scenario 1: Page Load & Display Today's Matches

**Objective**: Verify main page loads with today's matches displayed within 2 seconds, using correct colors and team representations.

**Setup**:
- Start dev server: `npm run dev`
- Browser open to `http://localhost:5173`

**Steps**:

1. **Measure page load time**:
   - Open browser DevTools (F12) → Network tab
   - Refresh page (Ctrl+R)
   - Note DOMContentLoaded and load times
   - ✅ **Expected**: Both < 2 seconds

2. **Verify page renders**:
   - Page shows main dashboard with title (e.g., "World Cup 2026 Predictions")
   - Two buttons visible at top: "Load Predictions" and "Refresh"

3. **Check matches display**:
   - If today has matches:
     - ✅ **Expected**: List of matches with format: `[FLAG] INITIALS vs [FLAG] INITIALS`
     - ✅ Example: `🇺🇸 USA vs 🇲🇽 MEX`
   - If today has no matches:
     - ✅ **Expected**: Message "No matches today" with link to view all predictions

4. **Verify color coding**:
   - Upcoming matches: Soft blue background (#bae6fd or equivalent)
   - Completed matches: Soft green background (#bbf7d0 or equivalent)
   - Prediction displays: Soft pink background (#fbcfe8 or equivalent)
   - ✅ **Expected**: Colors match spec (subtle pastels, readable text contrast)

5. **Check team representation**:
   - Every team shown with flag emoji + 3-letter initials
   - ✅ **Example**: 🇺🇸 USA, 🇬🇧 ENG, 🇧🇷 BRA
   - ✅ No missing flags or broken initials

6. **Verify existing predictions (if any)**:
   - Previously saved predictions appear below their matches
   - Format: `Prediction: 2 - 1` (or similar)
   - Displayed in soft pink background
   - ✅ **Expected**: Only predictions for today's matches visible on main page

**Pass Criteria**:
- ✅ Page loads in < 2 seconds
- ✅ All today's matches displayed with correct colors
- ✅ Teams shown with flags and initials
- ✅ Previous predictions visible below matches
- ✅ Soft pastel colors applied correctly
- ✅ Text is readable (good contrast)

---

## Scenario 2: Refresh Button & Manual Result Update

**Objective**: Verify "Refresh" button fetches updated match results with simulated API delay.

**Setup**:
- From Scenario 1, page already loaded with today's matches

**Steps**:

1. **Locate Refresh button**:
   - Top right of header
   - Text: "Refresh" or similar
   - ✅ Clickable and responsive

2. **Click Refresh button**:
   - Click button
   - ✅ **Expected**: Loading indicator appears (spinner, "Loading...", or visual feedback)
   - ✅ **Expected**: Delay of 1-2 seconds (simulates API call)

3. **Check results update**:
   - After delay, loading indicator disappears
   - Match results update if any matches completed
   - Soft green background appears for newly completed matches
   - ✅ **Expected**: No errors in browser console

4. **Verify predictions persist**:
   - Previous predictions still visible
   - Not affected by refresh
   - ✅ Same soft pink backgrounds as before

5. **Repeat refresh**:
   - Click Refresh again
   - ✅ **Expected**: Same behavior (1-2 second delay, no errors)

**Pass Criteria**:
- ✅ Refresh button visible and clickable
- ✅ Loading indicator shown during API delay (1-2 seconds)
- ✅ Results update without page reload
- ✅ Predictions persist after refresh
- ✅ No console errors

---

## Scenario 3: Open Predictions Modal

**Objective**: Verify modal opens with all 64 matches displayed, teams consistently represented, and inputs enabled/disabled based on lock status.

**Setup**:
- From Scenario 1, page loaded

**Steps**:

1. **Locate "Load Predictions" button**:
   - Top left of header
   - Text: "Load Predictions" or "Load Predictions"
   - ✅ Clickable

2. **Click "Load Predictions" button**:
   - Click button
   - ✅ **Expected**: Modal popup appears
   - ✅ **Expected**: Modal opens in < 1 second
   - ✅ Modal has semi-transparent dark overlay behind it (visual separation from main page)

3. **Verify modal header & footer**:
   - Modal title: "Tournament Predictions" or "All Matches"
   - Two buttons at bottom: "Save" and "Cancel"
   - Close button (X) in top-right corner
   - ✅ All buttons clickable

4. **Check match list in modal**:
   - Scroll through modal content
   - ✅ **Expected**: All 64 matches visible (Group Stage 48 + Knockout 16)
   - ✅ Matches organized by round/group (optional grouping)
   - ✅ Each match shows: `[FLAG] INITIALS vs [FLAG] INITIALS`

5. **Verify team representation**:
   - Sample matches:
     - 🇺🇸 USA vs 🇲🇽 MEX
     - 🇩🇪 GER vs 🇫🇷 FRA
     - 🇧🇷 BRA vs 🇦🇷 ARG
   - ✅ All flags render correctly
   - ✅ All initials are 3 uppercase letters

6. **Check input field state for upcoming matches**:
   - Find a match with future start time (e.g., next week)
   - Two input fields visible: one for Team A goals, one for Team B goals
   - ✅ Input fields are enabled (white background, cursor changes to text)
   - ✅ Input fields accept numeric input (try typing "2", "0", etc.)

7. **Check input field state for locked matches**:
   - Find a match with past start time
   - Two input fields visible but disabled
   - ✅ Input fields have grayed-out or disabled appearance (e.g., gray background, opacity reduced)
   - ✅ Cannot click or type in disabled fields (cursor shows "not-allowed")

8. **Verify color consistency**:
   - All team representations use same flag + initials format
   - Consistent across all 64 matches
   - ✅ No missing flags, no broken initials

**Pass Criteria**:
- ✅ Modal opens within 1 second
- ✅ All 64 matches listed in modal
- ✅ Teams shown with flags + initials consistently
- ✅ Input fields enabled for upcoming matches
- ✅ Input fields disabled for locked (started) matches
- ✅ Modal responsive (scrollable if needed)

---

## Scenario 4: Enter & Save Predictions

**Objective**: Verify user can enter predictions, save them, and see them on main page with persistence across page reload.

**Setup**:
- Modal open from Scenario 3

**Steps**:

1. **Find upcoming match in modal**:
   - Example: 🇺🇸 USA vs 🇲🇽 MEX (not yet started)
   - Input fields are enabled

2. **Enter predictions**:
   - Team A goals field: Type "2"
   - Team B goals field: Type "1"
   - ✅ **Expected**: Values accepted, displayed in fields

3. **Enter predictions for 2-3 more matches**:
   - Repeat step 2 for different matches
   - Example predictions:
     - 🇩🇪 GER vs 🇫🇷 FRA: 1-1
     - 🇧🇷 BRA vs 🇦🇷 ARG: 3-2
   - ✅ **Expected**: All values entered and retained

4. **Click "Save" button**:
   - Click "Save" button at bottom of modal
   - ✅ **Expected**: Modal closes immediately (no delay)
   - ✅ **Expected**: No error messages

5. **Verify predictions visible on main page**:
   - Return to main page
   - Find the matches you just predicted
   - ✅ **Expected**: Predictions displayed below each match in soft pink background
   - ✅ **Format**: "Prediction: 2 - 1" or similar
   - ✅ For today's matches only (if predictions were for today)

6. **Close and reopen browser**:
   - Close the browser tab or reload page (Ctrl+R)
   - Page reloads and shows main page
   - ✅ **Expected**: Previously entered predictions still visible
   - ✅ **Expected**: Predictions loaded from localStorage (no API call needed)

7. **Click "Load Predictions" again**:
   - Open modal again
   - Scroll to previously edited matches
   - ✅ **Expected**: Predictions retained in input fields
   - ✅ **Expected**: Same values you entered (2, 1, etc.)

**Pass Criteria**:
- ✅ Predictions accepted and stored
- ✅ Save button closes modal
- ✅ Predictions visible on main page (for today's matches)
- ✅ Predictions persist after page reload (localStorage)
- ✅ Predictions appear in modal when reopened
- ✅ No console errors

---

## Scenario 5: Hard Cutoff - Locked Predictions

**Objective**: Verify predictions are locked (uneditable) once a match has started, and UI reflects this clearly.

**Setup**:
- Modal open from Scenario 3

**Steps**:

1. **Find a locked match (already started)**:
   - Look for a match with start time in the past
   - Example: Yesterday's match, or match that started earlier today
   - Input fields are disabled (grayed out)

2. **Verify disabled input appearance**:
   - Input fields have reduced opacity (e.g., 50% opacity)
   - Background color lighter or grayed out
   - Cursor changes to "not-allowed" when hovering
   - ✅ **Expected**: Clear visual indication field is disabled

3. **Try to click on disabled field**:
   - Click on Team A or Team B input field
   - ✅ **Expected**: Field does not receive focus
   - ✅ **Expected**: Cannot type or edit

4. **Try to type in disabled field**:
   - Click field and try typing "5"
   - ✅ **Expected**: No input appears
   - ✅ **Expected**: Field remains empty/unchanged

5. **Check placeholder or label**:
   - Disabled fields may show placeholder like "Locked" or similar
   - Or just appear disabled without placeholder
   - ✅ **Expected**: UI makes it clear field is not editable

6. **Click "Save" button**:
   - Even with disabled fields, click Save
   - ✅ **Expected**: Modal closes without error
   - ✅ **Expected**: No changes to locked predictions

7. **Verify locked match on main page**:
   - Return to main page
   - Find the locked match (if it's today's match)
   - If previous prediction exists: Display it (but user cannot edit)
   - If no previous prediction: Show result only (soft green background)
   - ✅ **Expected**: Prediction area has reduced interactivity (no edit button, for example)

**Pass Criteria**:
- ✅ Locked match input fields are visibly disabled
- ✅ Cannot type or focus on disabled fields
- ✅ Locked state prevents accidental edits
- ✅ Save button handles locked matches gracefully (no errors)
- ✅ Main page reflects locked state (no edit option)

---

## Scenario 6: Edge Case - No Matches Today

**Objective**: Verify system handles days with no scheduled matches gracefully.

**Setup**:
- Mock data contains a date with no matches
- Or manually adjust system date to non-match day (advanced)

**Steps**:

1. **Simulate no matches today**:
   - If possible, set system clock to a non-match day
   - Or adjust mock data to remove today's matches temporarily
   - Reload page: `npm run dev` and refresh browser

2. **Check main page display**:
   - ✅ **Expected**: Message "No matches today" appears
   - ✅ **Expected**: Link or prompt to "View all predictions" or "Load Predictions"
   - ✅ No empty list, no confusion

3. **Click "Load Predictions" link/button**:
   - Click the link to view all predictions
   - ✅ **Expected**: Modal opens with all 64 matches
   - ✅ Matches from other dates visible

4. **Verify modal works normally**:
   - Can view predictions for future/past matches
   - Can edit predictions for upcoming matches
   - Locked matches are disabled as expected
   - ✅ No errors or broken state

5. **Save predictions for future date**:
   - Enter prediction for match on another date (e.g., next week)
   - Save
   - Return to main page
   - ✅ **Expected**: No predictions shown on main page (since none are for today)
   - ✅ **Expected**: Can re-open modal to verify prediction saved

**Pass Criteria**:
- ✅ "No matches today" message displayed
- ✅ Link to view all predictions available
- ✅ Modal opens and works normally
- ✅ Can edit predictions for future matches
- ✅ Saved predictions don't appear on main page (only for today's matches)

---

## Scenario 7: UI & Accessibility Checks

**Objective**: Verify UI is simple, uncluttered, and accessible.

**Setup**:
- Page loaded, modal open/closed

**Steps**:

1. **Color palette verification**:
   - Identify all colors on page
   - ✅ **Expected**: Max 3-4 colors (blue, green, pink) + white/neutral
   - ✅ No color overload or visual clutter
   - ✅ Pastel colors are soothing (not bright or harsh)

2. **Contrast & readability**:
   - Text on soft blue background: readable with good contrast
   - Text on soft green background: readable
   - Text on soft pink background: readable
   - ✅ Use browser's accessibility inspector (Chrome DevTools → Accessibility) to verify contrast ratios (≥ 4.5:1 for AA standard)

3. **Button accessibility**:
   - All buttons have clear labels (not just icons)
   - Buttons are properly sized (minimum 48×48 px for touch)
   - Tab order is logical (can navigate with Tab key)
   - ✅ **Expected**: Tab key cycles through buttons in sensible order

4. **Keyboard navigation**:
   - Press Tab to cycle through all interactive elements
   - ✅ Buttons, input fields, modal receive focus
   - Press Enter on buttons to activate them
   - ✅ Buttons respond to Enter key
   - Press Escape in modal to close
   - ✅ **Expected**: Modal closes (if implemented)

5. **Responsive layout** (if desktop available):
   - Resize browser window to various widths (800px, 600px, 400px)
   - ✅ **Expected**: Layout adapts (no horizontal scrollbar)
   - Matches still visible, readable
   - Buttons still clickable
   - Modal still functional

6. **Font & spacing**:
   - Text is legible (minimum 16px or equivalent)
   - Spacing between elements is adequate (not cramped)
   - ✅ **Expected**: Clean, airy layout (supports "simple UX" principle)

**Pass Criteria**:
- ✅ Max 3-4 colors used (pastel palette)
- ✅ Text contrast meets AA standard
- ✅ Keyboard navigation works (Tab, Enter, Escape)
- ✅ Buttons properly sized and labeled
- ✅ Responsive layout (no horizontal scrollbar)
- ✅ Overall UI feels simple and uncluttered

---

## Scenario 8: Performance & Load Testing

**Objective**: Verify performance meets spec (< 2 sec page load, < 1 sec modal open).

**Setup**:
- Browser DevTools Network tab open

**Steps**:

1. **Measure initial page load**:
   - Open DevTools Network tab (F12 → Network)
   - Refresh page
   - ✅ **Expected**: DOMContentLoaded < 2 seconds
   - ✅ **Expected**: Page fully loaded < 2.5 seconds
   - Note the largest resource (usually bundle.js)

2. **Check bundle size**:
   - React bundle + component code should be reasonable
   - ✅ **Expected**: No massive dependencies
   - ✅ Per constitution: only React + Tailwind, no extra libraries

3. **Measure modal open time**:
   - Main page loaded
   - Click "Load Predictions" button
   - Measure time until modal is fully rendered with all 64 matches
   - ✅ **Expected**: < 1 second (modal opens immediately, matches rendered from local JSON)

4. **Measure Refresh button performance**:
   - Click Refresh button
   - Measure time for simulated API call + re-render
   - ✅ **Expected**: 1-2 second delay (as designed)
   - ✅ **Expected**: Smooth re-render (no stutters or freezes)

5. **Memory inspection**:
   - Open DevTools Memory tab
   - Take heap snapshot before and after modal open
   - ✅ **Expected**: Reasonable memory usage (no memory leaks)
   - ✅ If you open/close modal 5 times, memory should not grow unbounded

**Pass Criteria**:
- ✅ Page load < 2 seconds
- ✅ Modal open < 1 second
- ✅ Refresh button 1-2 second delay (as designed)
- ✅ Reasonable bundle size (no extra dependencies)
- ✅ No memory leaks (heap stable across multiple interactions)

---

## Summary Checklist

Before marking feature as complete, verify all scenarios pass:

- [ ] Scenario 1: Page load & matches display
- [ ] Scenario 2: Refresh button & result update
- [ ] Scenario 3: Modal opens with all matches
- [ ] Scenario 4: Enter & save predictions (persists)
- [ ] Scenario 5: Hard cutoff (locked predictions)
- [ ] Scenario 6: No matches today edge case
- [ ] Scenario 7: UI & accessibility
- [ ] Scenario 8: Performance metrics

---

**Status**: ✅ Quickstart Complete | **Next**: Execute Phase 2 Tasks (implementation)

**Validation Date**: ________________ | **Tester**: ________________ | **Pass/Fail**: ___________
