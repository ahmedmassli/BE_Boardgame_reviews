const express = require("express");
const cors = require("cors");
const app = express();
const {
  getCategories,
  getReviews,
  getReviewID,
  getReviewIDforComments,
  getRequestInfo,
  updateReview,
  getUsers,
  getReviewQuery,
} = require("./controllers");

const {
  handle404nonExistentPaths,
  handlePSQL400s,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors/index");

app.use(cors());
app.use(express.json());

app.get("/api", (request, response) => {
  response.status(200).send({ msg: "all ok here" });
});

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviewQuery);

app.get("/api/reviews/:review_id", getReviewID);

app.get("/api/reviews/:review_id/comments", getReviewIDforComments);

app.post("/api/reviews/:review_id/comments", getRequestInfo);

app.patch("/api/reviews/:review_id", updateReview);

app.get("/api/users", getUsers);

app.use(handle404nonExistentPaths);
app.use(handleCustomErrors);

app.use(handlePSQL400s);
app.use(handleServerErrors);

module.exports = app;
