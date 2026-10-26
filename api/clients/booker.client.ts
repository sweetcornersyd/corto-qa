import { type APIRequestContext } from "@playwright/test";
import { type Booking } from "../models/booking";

export class BookerClient {
  constructor(private readonly request: APIRequestContext) {}

  createToken(username: string, password: string) {
    return this.request.post("/auth", {
      data: {
        username,
        password,
      },
    });
  }
  createBooking(booking: Booking) {
    return this.request.post("/booking", {
      headers: {
        Accept: "application/json",
      },
      data: booking,
    });
  }
  getBooking(bookingId: number) {
    return this.request.get(`/booking/${bookingId}`, {
      headers: {
        Accept: "application/json",
      },
    });
  }
  getBookingIds() {
    return this.request.get("/booking", {
      headers: {
        Accept: "application/json",
      },
    });
  }
  updateBooking(bookingId: number, booking: Booking, token: string) {
    return this.request.put(`/booking/${bookingId}`, {
      headers: {
        Accept: "application/json",
        Cookie: `token=${token}`,
      },
      data: booking,
    });
  }
  partialUpdateBooking(
    bookingId: number,
    changes: Partial<Booking>,
    token: string,
  ) {
    return this.request.patch(`/booking/${bookingId}`, {
      headers: {
        Accept: "application/json",
        Cookie: `token=${token}`,
      },
      data: changes,
    });
  }
  deleteBooking(bookingId: number, token: string) {
    return this.request.delete(`/booking/${bookingId}`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });
  }
}
