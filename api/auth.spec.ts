import { test, expect } from "@playwright/test";
import { BookerClient } from "./clients/booker.client";

test("does not issue a token for an incorrect password", async ({
  request,
}) => {
  await test.step("POST /auth: reject an incorrect password", async () => {
    const bookerClient = new BookerClient(request);
    const response = await bookerClient.createToken(
      "admin",
      "incorrect-password",
    );

    expect(
      response.status(),
      "Invalid credentials return the observed HTTP 200 response",
    ).toBe(200);

    const body = await response.json();

    expect(body.reason, "Authentication explains the rejection").toBe(
      "Bad credentials",
    );
    expect(
      body,
      "Rejected authentication does not return a token",
    ).not.toHaveProperty("token");
  });
});
