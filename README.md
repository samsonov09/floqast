# Fintech Quality Automation POC

## Overview

This repository is a time-boxed Playwright/TypeScript proof of concept for testing user and transaction workflows through both API and UI layers. The assessment described endpoints and example payloads but supplied no runnable APIs, so a deliberately small in-memory Express backend and mock frontend are included to make the automation executable and reviewable.

## Architecture

The mock application exposes the described user and transaction endpoints and serves one functional HTML page. Playwright drives both layers. `ApiClient` owns authorization and report attachments; domain service objects own endpoint knowledge; factories own unique data; tests own scenarios and business assertions. `ApplicationPage` provides a compact UI vocabulary.

## Why Service Object Model

Service Object Model keeps HTTP mechanics and route details out of scenarios while retaining domain-oriented operations such as `users.create()` and `transactions.getByUser()`. It is useful here because API setup supports both API and UI testing and the services could later point to real environments. The layer is intentionally thin: assertions and orchestration remain visible in tests, avoiding a generic framework that would be disproportionate to a two-hour exercise.

## Test strategy

The suite prioritizes behavior with high defect and interview signal:

- Users: create/retrieve, missing name, missing email, malformed email, nonexistent user, and unauthorized access.
- Transactions: create/retrieve by user, non-positive amount, nonexistent user, and unauthorized access.
- UI: successful and invalid registration; successful and invalid transaction creation.

Unique emails and IDs prevent test collisions. Tests are parallel-safe within this in-memory POC. API exchanges are attached to Playwright results. UI failures retain screenshots and traces.

## Project structure

```text
src/server.ts                 Minimal mock API and frontend
tests/api/                    API scenarios
tests/ui/                     Browser scenarios
tests/services/               API transport and domain service objects
tests/pages/                  UI page object
tests/support/                Test-data factories
playwright.config.ts          Environments, projects, artifacts, reports
.github/workflows/tests.yml   CI example
.agents/skills/               Reusable assessment agent skill
AI_USAGE.md                   AI assistance disclosure
```

## Install

Prerequisites: Node.js 22+ and npm.

```bash
npm ci
npx playwright install chromium
```

Use `npm install` only when intentionally updating dependencies; CI and clean checkouts should use the committed lockfile with `npm ci`.

## Run tests

```bash
npm test
```

Run layers independently:

```bash
npm run test:api
npm run test:ui
```

Static TypeScript verification:

```bash
npm run typecheck
```

## Reports and diagnostics

Each run produces a Playwright HTML report in `playwright-report/` and JSON results in `reports/results.json`.

```bash
npm run report
```

API response status/body details appear as test attachments. Failed UI tests retain screenshots and traces in `test-results/`; open a trace with `npx playwright show-trace <trace.zip>`.

## Environment configuration

Defaults work locally. Override them through environment variables described in `.env.example`:

- `BASE_URL`: target application URL.
- `API_TOKEN`: bearer token shared by the mock server and tests.
- `PORT`: mock server port (keep it aligned with `BASE_URL`).

For a real environment, set `BASE_URL` and `API_TOKEN` in the shell or CI secret store and disable/replace the local `webServer` command.

## CI/CD

The GitHub Actions workflow performs a lockfile install, installs Chromium, type-checks, runs the complete suite, and uploads failure diagnostics and the HTML report even when tests fail. In a production pipeline, API tests would run as a fast pull-request gate and a targeted browser matrix would run after deployment.

## Assumptions

- All `/api` routes require one bearer token because no authentication contract was supplied.
- `accountType`, `type`, and transaction-recipient rules are minimal because allowed values and domain constraints were not specified.
- “CRUD operations” is interpreted against the four supplied create/read endpoints; update/delete contracts were not invented.
- State need only persist for a single test run.

## Tradeoffs

The mock backend exists because no real APIs or deployable services were supplied. Real MongoDB and Redis were intentionally excluded: provisioning and validating that infrastructure would exceed the assessment’s two-hour scope and would add little evidence about the requested automation architecture. The frontend is intentionally plain and shares a process with the API. In-memory state optimizes determinism and setup speed but does not model persistence or distributed behavior.

## Production extensions

A production implementation would add contract/schema validation, real identity-provider flows, secret management, database/queue integration tests, service virtualization for third parties, idempotency and concurrency coverage, money/currency boundary testing, observability assertions, accessibility checks, risk-based browser coverage, test-data cleanup APIs, performance tests, and environment health gates. Service objects would gain typed request/response contracts only as real API schemas justify them.

## AI transparency

See [AI_USAGE.md](AI_USAGE.md) for the model/agent information available in the session and the scope of assistance.
