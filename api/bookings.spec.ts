import { test, expect } from "@playwright/test";
import bookingData from "./testData/bookings.json" with { type: "json" };
import { BookerClient } from "./clients/booker.client";

for (const [caseName, booking] of Object.entries(bookingData)) {
  test(`creates, retrieves and updates a booking: ${caseName}`, async ({
    request,
  }) => {
    const bookerClient = new BookerClient(request);

    const authBody =
      await test.step("POST /auth: authenticate for the booking journey", async () => {
        const authResponse = await bookerClient.createToken(
          "admin",
          "password123",
        );

        expect(authResponse.status(), "Authentication returns HTTP 200").toBe(
          200,
        );

        const credentials = await authResponse.json();

        expect(credentials.token, "Authentication returns a token").toEqual(
          expect.any(String),
        );

        expect(
          credentials.token.trim(),
          "Authentication token is not blank",
        ).not.toBe("");

        return credentials;
      });

    const body =
      await test.step("POST /booking: create a booking and obtain its ID", async () => {
        const response = await bookerClient.createBooking(booking);

        expect(response.status(), "Create booking returns HTTP 200").toBe(200);

        const createdBooking = await response.json();

        expect(
          createdBooking.bookingid,
          "Created booking has a numeric ID",
        ).toEqual(expect.any(Number));

        return createdBooking;
      });

    try {
      expect(
        body.booking,
        "Created booking matches the supplied details",
      ).toEqual(booking);

      await test.step("GET /booking/{id}: verify the saved booking", async () => {
        const getResponse = await bookerClient.getBooking(body.bookingid);

        expect(
          getResponse.status(),
          "Read created booking returns HTTP 200",
        ).toBe(200);

        const savedBooking = await getResponse.json();

        expect(
          savedBooking,
          "Stored booking matches the supplied details",
        ).toEqual(booking);
      });

      await test.step("GET /booking: find the created booking in the list", async () => {
        const listResponse = await bookerClient.getBookingIds();

        expect(listResponse.status(), "List bookings returns HTTP 200").toBe(
          200,
        );

        const bookingIds = await listResponse.json();

        expect(
          bookingIds,
          "Booking list contains the booking created by this test",
        ).toEqual(expect.arrayContaining([{ bookingid: body.bookingid }]));
      });

      const updatedBooking = {
        ...booking,
        lastname: "Updated",
        totalprice: 250,
        depositpaid: !booking.depositpaid,
      };

      await test.step("PUT /booking/{id}: reject an invalid token without changing data", async () => {
        const rejectedUpdateResponse = await bookerClient.updateBooking(
          body.bookingid,
          updatedBooking,
          "invalid-token",
        );

        expect(
          rejectedUpdateResponse.status(),
          "Update with an invalid token is forbidden",
        ).toBe(403);

        const unchangedResponse = await bookerClient.getBooking(body.bookingid);

        expect(
          unchangedResponse.status(),
          "Booking remains readable after the rejected update",
        ).toBe(200);

        expect(
          await unchangedResponse.json(),
          "Rejected update leaves the original booking unchanged",
        ).toEqual(booking);
      });

      await test.step("PUT /booking/{id}: update and verify persistence", async () => {
        const updateResponse = await bookerClient.updateBooking(
          body.bookingid,
          updatedBooking,
          authBody.token,
        );

        expect(updateResponse.status(), "Update booking returns HTTP 200").toBe(
          200,
        );

        const updateBody = await updateResponse.json();

        expect(
          updateBody,
          "Update response contains the updated details",
        ).toEqual(updatedBooking);

        const updatedGetResponse = await bookerClient.getBooking(
          body.bookingid,
        );

        expect(
          updatedGetResponse.status(),
          "Read updated booking returns HTTP 200",
        ).toBe(200);

        expect(
          await updatedGetResponse.json(),
          "Stored booking contains the updated details",
        ).toEqual(updatedBooking);
      });

      await test.step("PATCH /booking/{id}: change one field and preserve the others", async () => {
        const patch = {
          additionalneeds: "Extra pillows",
        };

        const patchResponse = await bookerClient.partialUpdateBooking(
          body.bookingid,
          patch,
          authBody.token,
        );

        expect(patchResponse.status(), "Partial update returns HTTP 200").toBe(
          200,
        );

        const expectedAfterPatch = {
          ...updatedBooking,
          ...patch,
        };

        expect(
          await patchResponse.json(),
          "Partial update changes additional needs and preserves other fields",
        ).toEqual(expectedAfterPatch);

        const patchedGetResponse = await bookerClient.getBooking(
          body.bookingid,
        );

        expect(
          patchedGetResponse.status(),
          "Read partially updated booking returns HTTP 200",
        ).toBe(200);

        expect(
          await patchedGetResponse.json(),
          "Stored booking preserves the partial update and all other fields",
        ).toEqual(expectedAfterPatch);
      });
    } finally {
      await test.step("DELETE /booking/{id}: delete and confirm it is absent", async () => {
        const deleteResponse = await bookerClient.deleteBooking(
          body.bookingid,
          authBody.token,
        );

        expect(
          deleteResponse.status(),
          "Cleanup deletes the created booking",
        ).toBe(201);

        const deletedBookingResponse = await bookerClient.getBooking(
          body.bookingid,
        );

        expect(
          deletedBookingResponse.status(),
          "Deleted booking can no longer be retrieved",
        ).toBe(404);
      });
    }
  });
}
