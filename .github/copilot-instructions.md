<!-- SPECKIT START -->

## Feature: Initial Page Setup (002-initial-page-setup)

For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan:

**Plan**: [specs/002-initial-page-setup/plan.md](../specs/002-initial-page-setup/plan.md)

**Design Artifacts**:
- [Specification](../specs/002-initial-page-setup/spec.md)
- [Research Phase 0](../specs/002-initial-page-setup/research.md)
- [Data Model](../specs/002-initial-page-setup/data-model.md)
- [Quickstart Validation](../specs/002-initial-page-setup/quickstart.md)

**Key Technical Decisions**:
- Use Tailwind CSS with @theme for pastel colors (soft blue, green, pink)
- Store predictions in browser localStorage (JSON format)
- Mock World Cup data: 32 teams, 64 matches (JSON files in src/data/)
- React 19 hooks for state management (usePredictions, useMatches)
- Manual refresh only (no auto-polling)
- Hard cutoff: predictions locked when match starts

**Implementation Status**: Phase 1 Complete (Design & Research) → Ready for Phase 2 (Development)

<!-- SPECKIT END -->
