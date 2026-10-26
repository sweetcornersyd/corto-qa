import { test, expect } from "@playwright/test";

test("reports that the API is up", async ({ request }) => {
  const response = await request.get("/ping");

  expect(
    response.status(),
    "Health check returns the documented HTTP 201 Created response",
  ).toBe(201);
});