---
description: Structured workflow for baseline AppSec review and risk triage.
---

# Security Audit for a Web App

1. **Define scope and threat model**
   - **Goal**: Identify critical assets, trust boundaries, and threat scenarios.
   - **Skills**: `@ethical-hacking-methodology`, `@threat-modeling-expert`, `@attack-tree-construction`
   - **Notes**: Document in-scope targets, assumptions, and out-of-scope constraints.

2. **Review authentication and authorization**
   - **Goal**: Find broken auth patterns and access-control weaknesses.
   - **Skills**: `@broken-authentication`, `@auth-implementation-patterns`, `@idor-testing`
   - **Notes**: Prioritize account takeover and privilege escalation paths.

3. **Assess API and input security**
   - **Goal**: Detect high-impact API and injection risks.
   - **Skills**: `@api-security-best-practices`, `@api-fuzzing-bug-bounty`, `@top-web-vulnerabilities`
   - **Notes**: Map findings to severity and exploitability, not only CVSS.

4. **Harden and verify**
   - **Goal**: Translate findings into concrete remediations and retest.
   - **Skills**: `@security-auditor`, `@sast-configuration`, `@verification-before-completion`
   - **Notes**: Track remediation owners and target dates; verify each fix with evidence.

