<!--
Sync Impact Report
Version change: none -> 1.0.0
Modified principles: none (initial constitution)
Added sections: Technology Requirements, Development Workflow
Removed sections: none
Templates reviewed: ✅ .specify/templates/plan-template.md, ✅ .specify/templates/spec-template.md, ✅ .specify/templates/tasks-template.md
Follow-up TODOs: none
-->
# random-fixture-prediction Constitution

## Core Principles

### Clean Code
Every code element must be readable, predictable, and deliberately simple. React components, hooks, and helpers MUST be small, clearly named, and free of hidden side effects. Avoid clever abstractions, duplicated logic, and overly complex state relationships.

### Simple UX
The user interface MUST minimize friction and make the primary task obvious. Interactions should be intuitive, labels should be clear, and the UI flow should expose only necessary choices. Prefer directness and usability over feature density.

### Responsive Design
The application MUST adapt seamlessly across screen sizes and input types. Layout, typography, spacing, and touch targets MUST remain functional on mobile, tablet, and desktop. Use responsive Tailwind patterns so the UI stays reliable in real-world device contexts.

### Minimal Dependencies
Dependencies MUST be limited to essential React and Tailwind capabilities. Every added library is a maintenance and bundle-cost decision that must be justified by real project value. Prefer built-in React patterns and native browser APIs over extra packages.

## Technology Requirements

- The project MUST use React as the UI framework and Tailwind CSS for styling.
- Build tooling may use Vite or an equivalent modern frontend toolchain, but the dependency footprint MUST remain minimal.
- No unit tests, integration tests, or end-to-end tests are to be introduced unless explicitly requested by stakeholders. Manual validation, design review, and exploratory verification are the default quality controls.

## Development Workflow

- Implement features incrementally with small, reusable React components and clear Tailwind utility usage.
- Code reviews MUST verify adherence to Clean Code, Simple UX, Responsive Design, and Minimal Dependencies.
- Feature acceptance is based on manual review and user-observable quality rather than mandatory automated test suites.
- Document key design decisions, dependency choices, and any usability trade-offs in PR descriptions.

## Governance

This constitution supersedes informal habits and local preferences for this repository. Any amendment to the principles, technology constraints, or workflow MUST be documented and reviewed.

- Amendments require clear rationale, a summary of the change, and team review before adoption.
- Constitution versioning follows semantic versioning for governance updates.
- Compliance reviews MUST confirm that proposed changes do not violate the declared principles.
- If a dependency or UI decision conflicts with the constitution, the change MUST include an explicit justification.

**Version**: 1.0.0 | **Ratified**: 2026-06-11 | **Last Amended**: 2026-06-11
