const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => {
  return seed(testData);
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
            date: expect.toSatisfy(
              (val) => !isNaN(Date.parse(val)) 
            ),
            start_time: expect.toSatisfy((val) => {
              const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
              return timeRegex.test(val);
            }),
            end_time: expect.toSatisfy((val) => {
              const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
              return timeRegex.test(val);
            }),
            status: expect.any(String),
            // table_id: expect.any(Number||null),
            notes: expect.toSatisfy(
              (val) => typeof val === "string" || val === null
            ),
          });
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
        expect(Object.keys(response)).not.toInclude("body");
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

describe("POST /api/bookings", () => {
  test("201 status code: responds with the posted booking", () => {
    return request(app)
      .post("/api/bookings")
      .send({
    name: "Pam",
    number_of_guests: 8,
    date: "2024-01-23",
    start_time: "11:30:00",
    end_time: "13:30:00",
    status: 'submitted',
    notes: "dairy allergy",
  })
      .expect(201)
      .then(({ body }) => {
        expect(body.addedBooking).toMatchObject({
          name: "Pam",
          number_of_guests: 8,
          date: expect.toSatisfy((val) => !isNaN(Date.parse(val))),
          start_time: "11:30:00",
          end_time: "13:30:00",
          status: "submitted",
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
})

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

  // test("400 status: returns error if table_id is missing when status is not submitted", () => {
  //   return request(app)
  //     .patch("/api/bookings/1")
  //     .send({ status: "confirmed" }) // No table_id provided
  //     .expect(400)
  //     .then(({ body }) => {
  //       expect(body.msg).toBe(
  //         'A table_id must be provided when the status is not "submitted".'
  //       );
  //     });
  // });
});
