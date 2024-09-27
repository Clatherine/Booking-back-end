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