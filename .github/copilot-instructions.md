<!-- SPECKIT START -->

## Feature: Username Login (006-username-login)

For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan:

**Plan**: [specs/006-username-login/plan.md](../specs/006-username-login/plan.md)

**Design Artifacts**:
- [Specification](../specs/006-username-login/spec.md)
- [Research Phase 0](../specs/006-username-login/research.md)
- [Data Model](../specs/006-username-login/data-model.md)
- [Quickstart Validation](../specs/006-username-login/quickstart.md)
- [UI Contracts](../specs/006-username-login/contracts/ui-contracts.md)

**Key Technical Decisions**:
- Username-only login (no password); auto-create account on first login
- Username normalization: trim + lowercase (consistent identity)
- Session persisted in localStorage under key `session_v1`
- User registry stored in localStorage under key `users_v1`
- Per-user predictions stored under `predictions_v1_{username}` (namespaced)
- `useAuth` hook encapsulates login/logout/session state in `App.tsx`
- `LoginPage` component gates access; `MainPage` receives `username` + `onLogout` props
- Logout warning via `window.confirm()` when prediction modal is open
- No new runtime dependencies (constitution: minimal dependencies)

**Implementation Status**: Phase 1 Complete (Design & Research) → Ready for Phase 2 (Development)

<!-- SPECKIT END -->
