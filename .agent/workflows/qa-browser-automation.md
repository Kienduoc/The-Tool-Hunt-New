---
description: Workflow for robust E2E and browser-driven validation across stacks.
---

# QA and Browser Automation

1. **Prepare test strategy**
   - **Goal**: Define critical user journeys, environments, and test data.
   - **Skills**: `@e2e-testing-patterns`, `@test-driven-development`, `@code-review-checklist`
   - **Notes**: Focus on business-critical flows and keep setup deterministic.

2. **Implement browser tests**
   - **Goal**: Automate key flows with resilient locators and stable waits.
   - **Skills**: `@browser-automation`, `@go-playwright`
   - **Notes**: Use go-playwright for Go-native automation projects and Playwright for JS/TS stacks.

3. **Triage failures and harden**
   - **Goal**: Stabilize flaky tests and establish repeatable CI execution.
   - **Skills**: `@systematic-debugging`, `@test-fixing`, `@verification-before-completion`
   - **Notes**: Classify failures by root cause: selector drift, timing, environment, data.

