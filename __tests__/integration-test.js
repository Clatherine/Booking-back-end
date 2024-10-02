const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => {
  return seed(testData).then(() => {
    return db.query("BEGIN;"); // Start transaction
  });
});

afterEach(() => {
  return db.query("ROLLBACK;"); // Rollback transaction
});

afterAll(() => db.end());

describe("Invalid paths", () => {
  test("status 404: returns 'Route not found' when path contains invalid path", () => {
    return request(app)
      .get("/api/invalid_path")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});

describe("GET /api/tables", () => {
  test("200 status code: returns array of all tables", () => {
    return request(app)
      .get("/api/tables")
      .expect(200)
      .then(({ body }) => {
        expect(body.tables.length).toBe(4);
        body.tables.forEach((table) => {
          expect(table).toMatchObject({
            table_id: expect.any(Number),
            capacity: expect.any(Number),
            notes: expect.toSatisfy(
              (val) => typeof val === "string" || val === null
            ),
          });
        });
      });
  });
});

describe("GET /api/bookings", () => {
  test("200 status code: returns array of all bookings", () => {
    return request(app)
      .get("/api/bookings")
      .expect(200)
      .then(({ body }) => {
        expect(body.bookings.length).toBe(6);
        body.bookings.forEach((booking) => {
          expect(booking).toMatchObject({
            booking_id: expect.any(Number),
            name: expect.any(String),
            number_of_guests: expect.any(Number),
            start_time: expect.any(String),
            end_time: expect.any(String),
            status: expect.any(String),
            table_id: expect.toSatisfy(
              (val) => typeof val === "number" || val === null
            ),
            notes: expect.toSatisfy(
              (val) => typeof val === "string" || val === null
            ),
          });
        });
      });
  });
});

describe("POST /api/bookings", () => {
    test("201 status code: responds with the posted booking, no changes (has table_id, status already confirmed)", () => {
      return request(app)
        .post("/api/bookings")
        .send({
          name: "Pam",
          number_of_guests: 3,
          start_time: "2024-01-23 11:30:00",
          end_time: "2024-01-23 13:30:00",
          status: "confirmed",
          table_id: 3,
          notes: "dairy allergy",
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.addedBooking).toMatchObject({
            name: "Pam",
            number_of_guests: 3,
            start_time: "2024-01-23 11:30:00",
            end_time: "2024-01-23 13:30:00",
            status: "confirmed",
            table_id: 3,
            notes: "dairy allergy",
          });
        });
    });
  test("201 status code: responds with the posted booking, rejected due to capacity", () => {
    return request(app)
      .post("/api/bookings")
      .send({
        name: "Pam",
        number_of_guests: 8,
        start_time: "2024-01-23 11:30:00",
        end_time: "2024-01-23 13:30:00",
        status: "submitted",
        notes: "dairy allergy",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.addedBooking).toMatchObject({
          name: "Pam",
          number_of_guests: 8,
          start_time: "2024-01-23 11:30:00",
          end_time: "2024-01-23 13:30:00",
          status: "rejected",
          notes: "dairy allergy",
        });
      });
  });
    test("201 status code: responds with the posted booking, confirmed and table added", () => {
      return request(app)
        .post("/api/bookings")
        .send({
          name: "Pam",
          number_of_guests: 2,
          start_time: "2024-01-23 11:30:00",
          end_time: "2024-01-23 13:30:00",
          status: "submitted",
          notes: "dairy allergy",
        })
        .expect(201)
        .then(({ body }) => {
          expect(body.addedBooking).toMatchObject({
            name: "Pam",
            number_of_guests: 2,
            start_time: "2024-01-23 11:30:00",
            end_time: "2024-01-23 13:30:00",
            status: "confirmed",
            notes: "dairy allergy",
            table_id: 4
          });
        });
    });
     test("201 status code: responds with the posted booking, rejected as no tables available", () => {
       return request(app)
         .post("/api/bookings")
         .send({
           name: "Pam",
           number_of_guests: 7,
           start_time: "2024-01-23 11:30:00",
           end_time: "2024-01-23 13:30:00",
           status: "submitted",
           notes: "dairy allergy",
         })
         .expect(201)
         .then(({ body }) => {
           expect(body.addedBooking).toMatchObject({
             name: "Pam",
             number_of_guests: 7,
             start_time: "2024-01-23 11:30:00",
             end_time: "2024-01-23 13:30:00",
             status: "rejected",
             notes: "dairy allergy",
           });
         });
     });
     test("201 status code: responds with the posted booking, confirmed with smallest available table", () => {
       return request(app)
         .post("/api/bookings")
         .send({
           name: "Pam",
           number_of_guests: 1,
           start_time: "2024-01-24 11:30:00",
           end_time: "2024-01-24 13:30:00",
           status: "submitted",
           notes: "dairy allergy",
         })
         .expect(201)
         .then(({ body }) => {
           expect(body.addedBooking).toMatchObject({
             name: "Pam",
             number_of_guests: 1,
             start_time: "2024-01-24 11:30:00",
             end_time: "2024-01-24 13:30:00",
             status: "confirmed",
             table_id: 3,
             notes: "dairy allergy",
           });
         });
     });

  test('400 status code: "Incomplete POST request: one or more required fields missing data" when sent a post request lacking a required key', () => {
    return request(app)
      .post("/api/bookings")
      .send({
        name: "Pam",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Incomplete POST request: one or more required fields missing data"
        );
      });
  });
  test("201 status code: responds with the posted booking and adds an end time if sent a post request with start-time but no end time", () => {
    return request(app)
      .post("/api/bookings")
      .send({
        name: "Pam",
        start_time: "2024-01-23 14:30:00",
        number_of_guests: 8,
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.addedBooking).toMatchObject({
          name: "Pam",
          number_of_guests: 8,
          start_time: "2024-01-23 14:30:00",
          end_time: "2024-01-23 16:30:00",
          status: "rejected",
        });
      });
  });
});

describe("DELETE /api/bookings/:booking_id", () => {
  test("status 204, no response", () => {
    return request(app)
      .delete("/api/bookings/1")
      .expect(204)
      .then((response) => {
        expect(response.body).toEqual({});
      });
  });
  test('status 404, responds with "That booking does not exist!" if passed a booking_id that doesn\'t exist', () => {
    return request(app)
      .delete("/api/bookings/30")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("That booking does not exist!");
      });
  });
  test('status 400, responds with "Invalid input: expected a number" if passed a booking_id that is not a number', () => {
    return request(app)
      .delete("/api/bookings/three")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input: expected a number");
      });
  });
});

describe("PATCH /api/bookings/:booking_id", () => {
  test("200 status: updates booking status and requires table_id if status is not submitted", () => {
    return request(app)
      .patch("/api/bookings/1")
      .send({ status: "confirmed", table_id: 3 })
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedBooking).toMatchObject({
          booking_id: 1,
          status: "confirmed",
          table_id: 3,
        });
      });
  });

  test("400 status: returns error if table_id is missing when status is not submitted", () => {
    return request(app)
      .patch("/api/bookings/1")
      .send({ status: "confirmed" }) // No table_id provided
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          'A table_id must be provided when the status is not "submitted".'
        );
      });
  });

  test("200 status: updates the number of guests", () => {
    return request(app)
      .patch("/api/bookings/2")
      .send({ number_of_guests: 2 })
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedBooking).toMatchObject({
          number_of_guests: 2,
        });
      });
  });

  test("200 status: updates the start_time", () => {
    return request(app)
      .patch("/api/bookings/2")
      .send({ start_time: "2024-01-23 13:30:00" })
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedBooking).toMatchObject({
          start_time: "2024-01-23 13:30:00",
        });
      });
  });
});

describe("GET /api/bookings/date/:date", () => {
  test("200 status code: returns array of all bookings on a given table at a given date", () => {
    return request(app)
      .get("/api/bookings/date/2024-01-23")
      .expect(200)
      .then(({ body }) => {
        expect(body.bookings.length).toBe(6);
        body.bookings.forEach((booking) => {
          expect(booking.start_time).toSatisfy((startTime) =>
            startTime.startsWith("2024-01-23")
          );
        });
      });
  });
  test("200 status code: responds with empty array when no bookings for a given date'", () => {
    return request(app)
      .get("/api/bookings/date/2023-01-23")
      .expect(200)
      .then(({ body }) => {
         expect(body.bookings.length).toBe(0);
      });
  });
});

describe("GET /api/bookings/date/:date/:table_id", () => {
  test("200 status code: returns array of all bookings on a given table at a given date", () => {
    return request(app)
      .get("/api/bookings/date/2024-01-23/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.bookings.length).toBe(1);
        body.bookings.forEach((booking) => {
          expect(booking).toMatchObject({
            table_id: 1,
          });
          expect(booking.start_time).toSatisfy((startTime) =>
            startTime.startsWith("2024-01-23")
          );
        });
      });
  });
  test("200 status code: responds with empty array with no bookings  for a table on a given date'", () => {
    return request(app)
      .get("/api/bookings/date/2023-01-23/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.bookings.length).toBe(0);
      });
  });
});

describe("GET /api/tables/:capacity", () => {
  test("200 status code: returns array of all tables at or above a given capacity", () => {
    return request(app)
      .get("/api/tables/5")
      .expect(200)
      .then(({ body }) => {
        expect(body.tables.length).toBe(3);
        body.tables.forEach((table) => {
          expect(table).toMatchObject({
            capacity: expect.any(Number),
          });

          expect(table.capacity).toBeGreaterThanOrEqual(5);
        });
      });
  });
  test("200 status code: returns empty array if no tables with capacity'", () => {
    return request(app)
      .get("/api/tables/20")
      .expect(200)
      .then(({ body }) => {
        expect(body.tables.length).toBe(0)
      });
  });
});

describe("GET /api/bookings/:booking_id", () => {
  test("200 status code: returns booking by booking_id", () => {
    return request(app)
      .get("/api/bookings/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.booking).toMatchObject({
          booking_id: 1,
          name: "Mark",
          number_of_guests: 5,
          start_time: "2024-01-23 15:30:00",
          status: "submitted",
          end_time: "2024-01-23 17:30:00",
        });
      });
  });
  test("404 status code: message of 'No booking of that id!", () => {
    return request(app)
      .get("/api/bookings/20")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No booking of that id!");
      });
  });
});

describe("GET /api/bookings/timeslot/:start_time/:end_time", () => {
  test("200 status code: returns bookings within a specific timeslot", () => {
    return request(app)
      .get("/api/bookings/timeslot/2024-01-23 12:30:00/2024-01-23 14:30:00")
      .expect(200)
      .then(({ body }) => {
        expect(body.bookings.length).toBe(4);
        body.bookings.forEach((booking) => {
          expect(booking).toMatchObject({
            booking_id: expect.any(Number),
            name: expect.any(String),
            number_of_guests: expect.any(Number),
            start_time: expect.any(String),
            end_time: expect.any(String),
            status: expect.any(String),
          });
        });
      });
  });

  test("200 status code: returns empty array when no bookings in timeslot", () => {
    return request(app)
      .get(
        "/api/bookings/timeslot/2025-01-23 12:30:00/2025-01-23 14:30:00"
      )
      .expect(200)
      .then(({ body }) => {
            expect(body.bookings.length).toBe(0);
      });
  });
    test("400 status code: End time must be after start time! if passed end time earlier than start time", () => {
      return request(app)
        .get("/api/bookings/timeslot/2026-01-23 12:30:00/2025-01-23 14:30:00")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("End time must be after start time!");
        });
    });
});

describe("GET /api", () => {
  test("200 status: returns object containing a key-value pair for all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const values = Object.values(body.endpoints);
        values.forEach((value) => {
          expect(value).toMatchObject({
            description: expect.any(String),
            queries: expect.any(Object),
            exampleResponse: expect.any(Object),
          });
        });
        const regEx = /\/api/;
        const keys = Object.keys(body.endpoints);
        keys.forEach((key) => {
          expect(regEx.test(key)).toBe(true);
        });
      });
  });
});