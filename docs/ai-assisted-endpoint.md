# AI-assisted endpoint: GET /ping

## Tool

Cursor

## Prompt

Generate a Playwright TypeScript API test for GET /ping on
https://restful-booker.herokuapp.com.

Use the request fixture from @playwright/test.
The existing Playwright API project already defines baseURL.
Check the endpoint's documented success status and explain its source.
Use a clear assertion description.
Do not change existing files yet; show the proposed code for
api/health.spec.ts.

## Original AI response

`GET /ping` is documented as **HTTP 201 Created**. Proposed `api/health.spec.ts` (not written to disk):

```typescript
import { test, expect } from "@playwright/test";

test("reports that the API is up", async ({ request }) => {
  const response = await request.get("/ping");

  expect(
    response.status(),
    "Health check returns the documented HTTP 201 Created response",
  ).toBe(201);
});
```

The `api` project in `playwright.config.ts` already sets `baseURL` to `https://restful-booker.herokuapp.com`, so the test uses the `request` fixture and the relative path `/ping`.

That status comes from the HealthCheck block in [`routes/index.js`](https://github.com/mwinteringham/restful-booker/blob/master/routes/index.js) of `mwinteringham/restful-booker`, which is what the published docs at `https://restful-booker.herokuapp.com/apidoc` are generated from:

```javascript
 * @apiSuccess {String} OK Default HTTP 201 response
 *
 * @apiSuccessExample {json} Response:
 * HTTP/1.1 201 Created
```

The generated `api_data.json` keeps that example as `HTTP/1.1 201 Created` and the field description `Default HTTP 201 response`. The same block is grouped under the label `Success 200` because `@apiSuccess` with no explicit status is filed that way by apidoc. The example and the description are the documented success response, so the assertion expects 201.

## My review and corrections

- Checked that the test sends GET /ping using the request fixture.
- Confirmed that baseURL comes from the existing API project.
- Compared the expected status with the API documentation:
  its response example specifies HTTP 201 Created.
- Checked that the assertion has a clear failure description.
- No code corrections were needed.

## Validation

Ran:
pnpm exec playwright test --project=api -g "reports that the API is up"

Result: 1 test passed.
