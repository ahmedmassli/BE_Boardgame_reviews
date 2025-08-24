const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

const resetTestDatabase = require("../seeders/seedTestDatabase.js");

beforeEach(() => {
  return resetTestDatabase();
});

afterAll(async () => {
  await connection.end();
  if (app.server) {
    await app.server.close();
  }
});

describe("app", () => {
  describe("get/api", () => {
    test("200: GET /api responds with message all ok here", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          expect(response.body.msg).toBe("all ok here");
        });
    });
  });

  describe("get /api/categories", () => {
    test("200: GET /api/categories responds with categories data", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          expect(body.catogData.length).toBe(4);
          console.log(body.catogData.length);
        });
    });

    test("200: GET /api/categories responds with correct category structure", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          expect(body.catogData[0]).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
    });
  });
});

describe("get /api/reviews", () => {
  test("200: GET /api/reviews responds with reviews data", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.revData.length).toBe(13);
      });
  });
  test("200: GET /api/reviews responds with reviews data", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        body.revData.length > 0;
      });
  });
  describe("get /api/reviews", () => {
    test("200: GET /api/reviews responds with reviews data", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          expect(body.revData[0]).toEqual(
            expect.objectContaining({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              category: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              designer: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
        });
    });

    test("200: GET /api/reviews responds with reviews data", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          body.revData.forEach((element) =>
            expect(element).toEqual(
              expect.objectContaining({
                owner: expect.any(String),
                title: expect.any(String),
                review_id: expect.any(Number),
                category: expect.any(String),
                review_img_url: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                designer: expect.any(String),
                comment_count: expect.any(Number),
              })
            )
          );
        });
    });

    test("200: GET /api/reviews sorts date by descending order.", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          const copyBody = [...body.revData];
          const sortedReviews = copyBody.sort((reviewA, reviewB) => {
            return reviewB.date - reviewA.date;
          });
          expect(body.revData).toEqual(sortedReviews);
        });
    });
  });
});

describe("get /api/reviews/4", () => {
  test("200: /api/reviews/4 responds with review data of id=4", () => {
    return request(app)
      .get("/api/reviews/4")
      .expect(200)
      .then(({ body }) => {
        expect(body.revData.length).toBe(1);
        expect(body.revData[0].review_id).toBe(4);
      });
  });
  test("200: GET /api/reviews responds with reviews data", () => {
    return request(app)
      .get("/api/reviews/4")
      .expect(200)
      .then(({ body }) => {
        expect(body.revData[0]).toEqual(
          expect.objectContaining({
            review_id: expect.any(Number),
            title: expect.any(String),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            votes: expect.any(Number),
            category: expect.any(String),
            owner: expect.any(String),
            created_at: expect.any(String),
            comment_count: expect.any(Number),
          })
        );
      });
  });
  test("404: /api/reviews/999 responds with err since it does not exist", () => {
    return request(app)
      .get("/api/reviews/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review_id not found");
      });
  });
  test("400: /api/reviews/banana responds with err since it does not exist", () => {
    return request(app)
      .get("/api/reviews/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty("msg", "Bad Request");
      });
  });
});

describe("get /api/reviews/2/comments", () => {
  test("200: /api/reviews/2/comments responds with an array of comments data of id=2", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(3);
        expect(body.comments[0].review_id).toBe(2);
      });
  });
  test("200: /api/reviews/2/comments responds with an array of comments data of id=2", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        body.comments.forEach((element) =>
          expect(element).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: expect.any(Number),
            })
          )
        );
      });
  });
  test("200: GET /api/reviews/2/comments sorts date by ascending order.", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        const copyBody = [...body.comments];
        const sortedComments = copyBody.sort((commentA, commentB) => {
          return commentA.date - commentB.date;
        });
        expect(body.comments).toEqual(sortedComments);
      });
  });

  test("200: /api/reviews/2/comments responds with an array of comments data of id=2", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([
          {
            body: "Now this is a story all about how, board games turned my life upside down",
            votes: 13,
            author: "mallionaire",
            review_id: 2,
            created_at: "2021-01-18T10:24:05.410Z",
            comment_id: 5,
          },
          {
            body: "I loved this game too!",
            votes: 16,
            author: "bainesface",
            review_id: 2,
            created_at: "2017-11-22T12:43:33.389Z",
            comment_id: 1,
          },
          {
            body: "EPIC board game!",
            votes: 16,
            author: "bainesface",
            review_id: 2,
            created_at: "2017-11-22T12:36:03.389Z",
            comment_id: 4,
          },
        ]);
      });
  });
  test("200: /api/reviews/4/comments responds with an empty array of comments data of id=4", () => {
    return request(app)
      .get("/api/reviews/4/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(0);
      });
  });
  test("404: /api/reviews/999 responds with err since it does not exist", () => {
    return request(app)
      .get("/api/reviews/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review_id not found");
      });
  });
  test("400: /api/reviews/banana responds with err since it does not exist", () => {
    return request(app)
      .get("/api/reviews/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty("msg", "Bad Request");
      });
  });
});

describe("post /api/reviews/id/comments", () => {
  test("201: /api/reviews/3/comments responds with review data of id=3", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .send({
        username: "philippaclaire9",
        body: "My kitty loved this game too!",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          body: "My kitty loved this game too!",
          votes: 0,
          author: "philippaclaire9",
          review_id: 3,
          created_at: expect.any(String),
          comment_id: 7,
        });
      });
  });

  test("400: /api/reviews/3/comments responds with err since its missing body input", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .send({
        username: "philippaclaire9",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("missing input");
      });
  });
  test("400: /api/reviews/3/comments responds with err  since its missing username input", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .send({
        body: "My kitty loved this game too!",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("missing input");
      });
  });
  test("404: /api/reviews/999/comments responds with err since it does not exist", () => {
    return request(app)
      .post("/api/reviews/999/comments")
      .send({
        username: "philippaclaire9",
        body: "My kitty loved this game too!",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("400: /api/reviews/banana/comments responds with err since it does not exist", () => {
    return request(app)
      .post("/api/reviews/banana/comments")
      .send({
        username: "philippaclaire9",
        body: "My kitty loved this game too!",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("404: /api/reviews/3/comments responds with err since username not in database", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .send({
        username: "ahmed",
        body: "My kitty loved this game too!",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});

describe("patch /api/reviews/4", () => {
  test("201: /api/reviews/4 responds with updated review data of id=4", () => {
    return request(app)
      .patch("/api/reviews/4")
      .send({ inc_votes: -1 })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          review_id: 4,
          title: "Dolor reprehenderit",
          designer: "Gamey McGameface",
          owner: "mallionaire",
          review_img_url:
            "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?w=700&h=700",
          review_body:
            "Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod",
          category: "social deduction",
          created_at: expect.any(String),
          votes: 6,
        });
      });
  });
  test("201: /api/reviews/4 responds with updated review data of id=4", () => {
    return request(app)
      .patch("/api/reviews/4")
      .send({ inc_votes: 3 })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          review_id: 4,
          title: "Dolor reprehenderit",
          designer: "Gamey McGameface",
          owner: "mallionaire",
          review_img_url:
            "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?w=700&h=700",
          review_body:
            "Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod",
          category: "social deduction",
          created_at: expect.any(String),
          votes: 10,
        });
      });
  });
  test("400: /api/reviews/4 responds with eror for type of input", () => {
    return request(app)
      .patch("/api/reviews/4")
      .send({ inc_votes: "ahmed" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: /api/reviews/4 responds with eror", () => {
    return request(app)
      .patch("/api/reviews/4")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("missing input");
      });
  });
  test("400: /api/reviews/banana responds with eror ", () => {
    return request(app)
      .patch("/api/reviews/banana")
      .send({ inc_votes: 4 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("404: /api/reviews/999 responds with eror ", () => {
    return request(app)
      .patch("/api/reviews/999")
      .send({ inc_votes: 2 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review_id not found");
      });
  });
});

describe("get /api/users", () => {
  test("200: /api/users responds with an array of USERS", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual([
          {
            username: "mallionaire",
            name: "haz",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          },
          {
            username: "philippaclaire9",
            name: "philippa",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
          },
          {
            username: "bainesface",
            name: "sarah",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
          },
          {
            username: "dav3rid",
            name: "dave",
            avatar_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          },
        ]);
      });
  });
});

describe("get /api/reviews for query", () => {
  test("200: /api/reviews responds with reviews with category given in the query", () => {
    return request(app)
      .get("/api/reviews/?category=social deduction")
      .expect(200)
      .then(({ body }) => {
        body.revData.forEach((element) =>
          expect(element).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              review_body: expect.any(String),
              designer: expect.any(String),
              review_img_url: expect.any(String),
              votes: expect.any(Number),
              category: "social deduction",
              owner: expect.any(String),
              created_at: expect.any(String),
            })
          )
        );
      });
  });
  test("200: /api/reviews responds with reviews sorted by column given in the query", () => {
    return request(app)
      .get("/api/reviews/?category=social deduction&sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        const copyBody = [...body.revData];
        const sortedReviews = copyBody.sort((reviewA, reviewB) => {
          return reviewB.date - reviewA.date;
        });

        expect(body.revData).toEqual(sortedReviews);
      });
  });
  test("200: /api/reviews responds with reviews sorted by column given in the query", () => {
    return request(app)
      .get("/api/reviews/?category=social deduction&sort_by=votes&order=DESC")
      .expect(200)
      .then(({ body }) => {
        const copyBody = [...body.revData];
        const sortedReviews = copyBody.sort((reviewA, reviewB) => {
          return reviewA.date - reviewB.date;
        });
        expect(body.revData).toEqual(sortedReviews);
      });
  });

  test("200: /api/reviews responds with reviews with category given in the query", () => {
    return request(app)
      .get(
        "/api/reviews/?category=social deduction&sort_by=comment_count&order=ASC"
      )
      .expect(200)
      .then(({ body }) => {
        const copyBody = [...body.revData];

        const sortedReviews = copyBody.sort((reviewA, reviewB) => {
          return reviewA.comment_count - reviewB.comment_count;
        });

        expect(body.revData).toEqual(sortedReviews);

        body.revData.forEach((element) =>
          expect(element).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              review_body: expect.any(String),
              designer: expect.any(String),
              review_img_url: expect.any(String),
              votes: expect.any(Number),
              category: "social deduction",
              owner: expect.any(String),
              created_at: expect.any(String),
            })
          )
        );
      });
  });
});

describe("get /api/reviews/:review_id for query", () => {
  test("200: /api/reviews/:review_id responds with reviews with category given in the query", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.revData[0]).toEqual(
          expect.objectContaining({
            review_id: expect.any(Number),
            title: expect.any(String),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            votes: expect.any(Number),
            category: expect.any(String),
            owner: expect.any(String),
            created_at: expect.any(String),
            comment_count: 3,
          })
        );
      });
  });
});
// PATCH /api/reviews/:review_id no comments test review_id=4 has no comments adjust the test for ittt
