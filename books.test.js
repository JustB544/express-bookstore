process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("./app");
const Books = require("./models/book");
const db = require("./db");

beforeEach(async function () {
    await db.query("DELETE FROM books");

    let u1 = await Books.create({
        isbn: "0691161518",
        amazon_url: "http://a.co/eobPtX2",
        author: "Matthew Lane",
        language: "english",
        pages: 264,
        publisher: "Princeton University Press",
        title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        year: 2017
    });
});

describe("GET /books", function() {
    test("Gets all books", async function() {
      const resp = await request(app).get(`/books`);
      expect(resp.statusCode).toBe(200);

      expect(resp.body.books.length).toBe(1);
      expect(resp.body.books[0].isbn).toBe("0691161518");
    });

    test("Gets a book", async function() {
      const resp = await request(app).get(`/books/0691161518`);
      expect(resp.statusCode).toBe(200);
    
      expect(resp.body.book.pages).toEqual(264);
    });
});

describe("POST /books", function() {
  test("Adds a new book", async function() {
    const resp = await request(app)
    .post(`/books`)
    .send({
        isbn: "string",
        amazon_url: "oh wow I'm def a url",
        author: "me",
        language: "none",
        pages: 100,
        publisher: "also me",
        title: "title",
        year: -1
      });
    expect(resp.statusCode).toBe(201);
    expect(resp.body.book).toEqual({
        isbn: "string",
        amazon_url: "oh wow I'm def a url",
        author: "me",
        language: "none",
        pages: 100,
        publisher: "also me",
        title: "title",
        year: -1
      });
  });
});

describe("PUT /books/:isbn", function() {
  test("Updates a book", async function() {
    const resp = await request(app)
    .put(`/books/0691161518`)
    .send({
        isbn: "0691161518",
        amazon_url: "http://a.co/eobPtX2",
        author: "Matthew Lane",
        language: "english",
        pages: 264,
        publisher: "someone else",
        title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        year: 2017
      });
    expect(resp.statusCode).toBe(200);
    expect(resp.body.book).toEqual({
        isbn: "0691161518",
        amazon_url: "http://a.co/eobPtX2",
        author: "Matthew Lane",
        language: "english",
        pages: 264,
        publisher: "someone else",
        title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        year: 2017
      });
  });
});

describe("DELETE /books/isbn", function() {
  test("Deletes a book", async function() {
    const resp = await request(app).delete(`/books/0691161518`);
    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({message: "Book deleted"});
  });
});

afterAll(async function () {
    await db.end();
});