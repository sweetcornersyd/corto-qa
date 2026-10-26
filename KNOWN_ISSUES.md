# Known issues

## BUG-001: Browser Back updates the URL but leaves book details displayed

- **Status:** Open; reproduced manually and by an automated test.
- **Observed:** 26 October 2026.
- **Environment:** https://demoqa.com/books, Chromium/Firefox/WebKit.
- **Suggested severity:** Medium. Standard browser navigation does not restore the catalogue. The application's Back To Book Store button provides a workaround.

### Steps to reproduce

1. Open https://demoqa.com/books in a fresh browser tab.
2. Wait for the catalogue to appear.
3. Open **Git Pocket Guide**.
4. Press the browser **Back** button once.

### Expected result

The URL returns to `/books` and the book catalogue is displayed.

### Actual result

The URL returns to `/books`, but the previous book's details remain displayed. The catalogue is not restored.

### Automated evidence

- **Spec:** `e2e/books.spec.ts`
- **Test:** `returns to the catalogue using browser Back`
- The URL assertion succeeds after `page.goBack()`.
- The catalogue assertion fails after its five-second assertion timeout: eight expected book titles versus zero matching book links.
- A failure screenshot was captured using `screenshot: 'only-on-failure'`.

Reproduce in Chromium:

```bash
pnpm playwright test e2e/books.spec.ts -g "returns to the catalogue using browser Back" --project=chromium
```

Open the HTML report and select the test's screenshot attachment:

```bash
pnpm playwright show-report
```

Screenshot files are also written beneath `test-results/`. Generated evidence may be replaced by later runs; preserve relevant attachments separately when sharing the defect. No permanent screenshot is included in this note.

### Expected-failure handling

The test currently calls `test.fail(true, 'BUG-001: browser Back leaves book details displayed')` after the URL assertion and immediately before the catalogue assertion. The intended catalogue behaviour remains asserted.

An expected failure normally does not fail the overall run. If the test starts passing, Playwright reports an unexpected pass, prompting investigation and removal of the annotation after the fix is verified. The annotation does not verify why the test failed; inspect its report to confirm that the failure still corresponds to BUG-001.

The defect was reproduced in Chromium, Firefox, and WebKit. The current unconditional annotation applies to all three browser projects.

### Investigation boundary

The evidence shows a mismatch between the URL and rendered screen after browser-history navigation. The underlying application cause has not been confirmed.

## BUG-002: Back to Book Store does not return to the catalogue after direct entry

- **Status:** Open; reproduced manually and by an automated Chromium test.
- **Observed:** 26 October 2026.
- **Environment:** https://demoqa.com/books?search=9781449325862. Automated evidence confirmed in Chromium; manual browser not recorded. Firefox and WebKit verification pending.
- **Suggested severity:** Medium. Readers opening a shared or bookmarked book link cannot reliably return to the catalogue using the provided button.

### Steps to reproduce

1. Open a fresh browser tab.
2. Navigate directly to https://demoqa.com/books?search=9781449325862, without first visiting the catalogue.
3. Confirm that Git Pocket Guide is displayed.
4. Click **Back To Book Store**.

### Expected result

The application navigates to `/books` and displays all eight catalogue books. The button's label indicates a destination within the store, including for readers arriving through a direct link.

### Actual result

- **Manual observation:** The user reports that clicking the button closes the tab.
- **Automated Chromium observation:** The page navigates to `about:blank` instead of `/books`.

These are distinct observed outcomes; do not assume identical behaviour in every browser or launch context.

### Automated evidence

- **Spec:** `e2e/books.spec.ts`
- **Test:** `opens a book through a direct link and returns to the catalogue`
- The title and ISBN assertions succeed before clicking the button.
- After the click, the URL assertion fails: expected `https://demoqa.com/books`, received `about:blank`, after the five-second assertion timeout.
- Saved failure output: `test-results/books-opens-a-book-through-fc4ff-nd-returns-to-the-catalogue-chromium/error-context.md`.
- Generated evidence may be replaced by later test runs; preserve attachments separately if needed for review.

Reproduce in Chromium:

```bash
pnpm exec playwright test e2e/books.spec.ts -g "opens a book through a direct link" --project=chromium
```

### Expected-failure handling

If marking this as an expected failure, place the BUG-002 `test.fail()` annotation after the title and ISBN assertions and immediately before the return action. Preserve the assertions for `/books` and the full catalogue. Inspect the report to confirm that the failure corresponds to this issue; the annotation alone does not establish the failure's cause. Check other browsers before extending the annotation to them.

### Investigation boundary

The observations establish that returning from direct entry fails. Browser-history navigation is a possible explanation, but the implementation and underlying cause have not been confirmed.

## BUG-003: Returning from book details clears the search input but retains filtered results

- **Status:** Open; reproduced manually and by an automated test.
- **Observed:** 26 October 2026.
- **Environment:** https://demoqa.com/books; reproduced by automated tests in Chromium, Firefox, and WebKit.
- **Suggested severity:** Low. The catalogue remains usable, but an invisible filter makes the displayed results misleading.

### Steps to reproduce

1. Open https://demoqa.com/books and wait for the full catalogue.
2. Enter `Git` in the search input.
3. Confirm that only **Git Pocket Guide** is displayed.
4. Open **Git Pocket Guide** using its title link.
5. Click **Back To Book Store**.
6. Inspect the search input and catalogue results.

### Expected result and assumption

The search input still contains `Git`, and only **Git Pocket Guide** is displayed.

Preserving both the query and its results is the chosen test expectation because the application already retains the filtered results. This is an assumption rather than a documented product requirement. Resetting both the input and the results to the full catalogue would also be consistent; showing filtered results with no visible query is the reported problem.

### Actual result

The catalogue returns with only **Git Pocket Guide** displayed, but the search input is empty. The active filter is no longer visible to the reader.

### User impact

Readers may believe that books are missing from the catalogue because the empty search input does not explain the restricted results.

### Automated coverage

- **Spec:** `e2e/books.spec.ts`
- **Test:** `preserves the search and its results after returning from book details`
- Establish that the input contains `Git` and the catalogue contains only the selected title before opening details.
- Confirm the selected book details and return using the application button.
- Confirm that the filtered catalogue returns, then assert that the search input still contains `Git`.
- If using a BUG-003 expected-failure annotation, place it immediately before the final input assertion. Inspect the report to confirm the failure corresponds to the empty input.
- The automated run was reviewed: the filtered catalogue returns,
  but the final assertion fails because the search input is empty
  instead of containing Git.

Run the regression test:

```bash
pnpm exec playwright test e2e/books.spec.ts -g "preserves the search and its results"
```

### Investigation boundary

The observation confirms inconsistent visible search state after returning from details. The underlying implementation cause has not been confirmed.

## BUG-004: Unknown ISBN displays empty book details without an error message

- **Status:** Open; reproduced manually.
- **Observed:** 26 October 2026.
- **Environment:** https://demoqa.com/books. Manual browser and version not recorded; cross-browser verification pending.
- **Suggested severity:** Low. Readers receive no explanation for the empty details, but recovery to the catalogue works when it is in the same tab's history.

### Steps to reproduce

1. Open https://demoqa.com/books in a browser tab and wait for the catalogue.
2. In that same tab, navigate to https://demoqa.com/books?search=9780000000000.
3. Inspect the book details area.
4. Click **Back To Book Store**.

### Expected result and assumption

For an ISBN that does not identify an available book, display a clear book-not-found state and a way to return to the catalogue. Exact wording and presentation are not prescribed by the assessment; clear error handling is a usability expectation.

### Actual result

The page displays empty book detail fields without explaining that the requested book could not be found.

### Recovery verified

When the catalogue was visited first in the same tab, clicking **Back To Book Store** returns to `/books` and displays the full catalogue. Recovery is not reported as broken in this scenario. Direct entry without a prior catalogue visit is covered separately by BUG-002.

### User impact

Readers following an invalid or outdated book link cannot tell whether the book is unavailable or the page failed to load.

### Coverage and evidence

- Manually reproduced and recovery confirmed by the tester.
- Kept as a manual finding for this submission; no automated regression test is claimed.
- Do not attribute the behaviour to a particular API response or implementation without further evidence.
