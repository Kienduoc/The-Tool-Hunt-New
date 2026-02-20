---
description: End-to-end workflow to scope, build, test, and ship a SaaS MVP quickly.
---

# Ship a SaaS MVP

1. **Plan the scope**
   - **Goal**: Convert the idea into a clear implementation plan and milestones.
   - **Skills**: `@brainstorming`, `@concise-planning`, `@writing-plans`
   - **Notes**: Define problem, user persona, MVP boundaries, and acceptance criteria before coding.

2. **Build backend and API**
   - **Goal**: Implement the core data model, API contracts, and auth baseline.
   - **Skills**: `@backend-dev-guidelines`, `@api-patterns`, `@database-design`, `@auth-implementation-patterns`
   - **Notes**: Prefer small vertical slices; keep API contracts explicit and testable.

3. **Build frontend**
   - **Goal**: Deliver the primary user flows with production-grade UX patterns.
   - **Skills**: `@frontend-developer`, `@react-patterns`, `@frontend-design`
   - **Notes**: Prioritize onboarding, empty states, and one complete happy-path flow.

4. **Test and validate**
   - **Goal**: Catch regressions and ensure key flows work before release.
   - **Skills**: `@test-driven-development`, `@systematic-debugging`, `@browser-automation`, `@go-playwright`
   - **Notes**: Use go-playwright when the product stack or QA tooling is Go-based.

5. **Ship safely**
   - **Goal**: Release with basic observability and rollback readiness.
   - **Skills**: `@deployment-procedures`, `@observability-engineer`, `@postmortem-writing`
   - **Notes**: Define release checklist, minimum telemetry, and rollback triggers.

