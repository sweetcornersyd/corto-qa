# CORTO Quality Engineering Technical Test

Automated UI tests for the DemoQA Book Store and API tests for
Restful Booker, using Playwright and TypeScript.

## Framework choice

I chose Playwright because it supports browser automation and HTTP API
testing within one test runner. This lets both tasks share reporting,
configuration, and CI execution.

The UI suite runs in Chromium, Firefox, and WebKit. API tests use a
separate project and run once, independently of browser projects.

## Scope

### Book Store UI

- Catalogue contents.
- Search by title, author, and publisher.
- Empty results and clearing a search.
- Title sorting in both directions.
- Book details and catalogue navigation.
- Direct book links and search state after returning from details.

Login, registration, and Profile are outside this suite's scope.

### Restful Booker API

- Authentication with valid and invalid credentials.
- Data-driven booking creation.
- Reading bookings and listing booking IDs.
- Full and partial updates, including persistence checks.
- Rejection of an update with an invalid token, with unchanged data verified.
- Deletion and confirmation that the booking is no longer available.
- Health check.

Each booking journey creates its own booking and attempts cleanup
in a finally block.

## Known issues

See [KNOWN_ISSUES.md](KNOWN_ISSUES.md).

Selected UI defects have expected-failure tests. These retain assertions
for the intended behaviour. An unexpected pass requires investigation;
an expected failure does not mean the defect is fixed.

## Installation

Prerequisites:

- Node.js 24.21.0 and pnpm 12.15.0 were used for local validation.
- Internet access to the public DemoQA and Restful Booker services.

From the repository root:

```bash
pnpm install --frozen-lockfile
pnpm exec playwright install --with-deps
```

## Running tests

Run the complete UI and API suite:

```bash
pnpm exec playwright test
```

Run UI tests across all three browsers:

```bash
pnpm exec playwright test --project=chromium --project=firefox --project=webkit
```

Run API tests only:

```bash
pnpm exec playwright test --project=api
```

Run UI tests in Chromium with a visible browser:

```bash
pnpm exec playwright test --project=chromium --headed
```

Open the HTML report after a run:

```bash
pnpm exec playwright show-report
```

Failure screenshots are captured for browser tests. Traces are captured
on the first retry. Retries are enabled in CI and disabled locally.

## Environment limitations

Both applications are shared public demonstration services.
Availability and changes made by other users can affect test results.

API tests use booking IDs returned during their own execution rather
than relying on pre-existing booking IDs. Cleanup is attempted in a
finally block, but cannot be guaranteed if execution is interrupted
or the service becomes unavailable.

## AI assistance

I used ChatGPT and Cursor while developing this submission to discuss
test coverage, understand Playwright and TypeScript concepts, generate
code examples, refactor request handling, and draft documentation.

I reviewed and adapted the suggested code, checked locators against the
application, compared API expectations with documentation and observed
responses, and ran tests after changes. For expected-failure tests,
I checked that failures corresponded to the documented defects.

My quality checks included meaningful assertions, independent test data,
cleanup of created bookings, reusable page objects and an API client,
and execution across the configured projects.

For Task 2 Part B, Cursor generated the GET /ping test. The original
prompt, output, review notes, and execution result are preserved in
[AI-assisted endpoint](docs/ai-assisted-endpoint.md).

## Design choices

- Page objects hold UI locators and actions. Assertions remain in the
  tests so each scenario's expectations are visible.
- A custom booksPage fixture prepares the catalogue for tests that
  start there. Direct-link tests use the standard page fixture.
- BookerClient holds API paths, headers, and request construction.
  It returns responses so tests can assert both successful and
  rejected requests.
- Search cases and booking examples are stored separately from test
  logic. Booking journeys run against multiple JSON records.
- The Booking TypeScript type checks request structure during
  development. Runtime assertions check actual API responses.
- Booking journeys reuse returned IDs and authentication tokens.
  They verify persistence after updates and attempt cleanup in finally.

The API journey intentionally exercises several endpoints together to
demonstrate data flow. A failure stops later checks in that journey,
except for cleanup. A larger suite would also use independent tests
to provide more targeted failure reporting.

## Continuous integration

The GitHub Actions workflow runs on pushes and pull requests targeting
main or master.

It installs Node.js 24.21.0, pnpm 12.15.0, locked dependencies, and
Playwright browsers before running the complete suite.

The HTML report is uploaded as the playwright-report artifact, with
30-day retention. Download it from the workflow run to inspect results.

An actual CI run must be checked separately from local execution.
