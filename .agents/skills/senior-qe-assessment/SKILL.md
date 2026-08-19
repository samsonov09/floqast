---
name: senior-qe-assessment
description: Build or review time-boxed Playwright API/UI take-home assessments that demonstrate senior quality-engineering architecture, especially Service Object Model frameworks with mock systems when no runnable product is supplied.
---

# Senior QE Assessment

Treat the assessment document as the source of binding requirements. Keep candidate preferences, implementation choices, and AI suggestions visibly separate. Inspect existing work before editing and preserve unrelated changes.

## Build mode

- Optimize for interview signal within the stated time box, not production completeness.
- When no runnable APIs are supplied, create the smallest deterministic mock backend and UI needed to exercise the required behavior. Document why it exists.
- Prefer TypeScript Playwright and a thin Service Object Model: service objects own transport and endpoints; tests own scenarios and assertions. Use page objects only where they improve readability.
- Cover representative happy paths, validation boundaries, not-found behavior, and authorization. Favor meaningful assertions over test volume.
- Isolate generated test data. Configure environments without requiring local secrets.
- Configure reports, API diagnostics, UI screenshots, and traces. Never claim verification without running it.
- Avoid databases, queues, containers, speculative abstractions, and styling unless explicitly required.
- Document architecture, strategy, setup, independent API/UI commands, reports, environments, CI, assumptions, tradeoffs, production extensions, and why mocks substitute for APIs described but not supplied.
- If requested, disclose AI use with only identifiers actually exposed by the session, supplied prompts, material assistance, human responsibilities, and verification evidence. Never invent hidden model versions or claim an unavailable transcript export.

## Completion gate

Run install reproducibility, TypeScript, API, UI, full-suite, and report checks as applicable. Fix failures and remove dead code or unjustified layers. Only claim clean-checkout verification when it was actually performed.

## Review mode

When asked to review as a hiring manager, do not modify code. Evaluate requirement fit, senior-level reasoning, whether the Service Object Model earns its complexity, test value, Staff/Principal concerns, and signs of generic or over-engineered AI output. Return a prioritized review and wait for authorization before edits.
