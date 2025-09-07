const db = require("./db/connection");

function fetchCategories() {
  return db
    .query(
      `
        SELECT * FROM categories
        `
    )
    .then((fetchCategories) => {
      return fetchCategories.rows;
    });
}

function fetchReviews() {
  return db
    .query(
      `
        SELECT reviews.owner, reviews.title, reviews.review_id, reviews.review_img_url, reviews.category, reviews.created_at,reviews.votes,reviews.designer,CAST(COUNT(comments.review_id) AS int) AS comment_count
        FROM reviews
        LEFT JOIN comments ON comments.review_id = reviews.review_id
        GROUP BY reviews.review_id
        ORDER BY reviews.created_at DESC        ;
        `
    )
    .then((fetchCategories) => {
      return fetchCategories.rows;
    });
}

function fetchReviewId(review_id) {
  let queryString = `
        SELECT reviews.owner, reviews.title, reviews.review_id, reviews.review_img_url, reviews.category, reviews.created_at, reviews.votes, reviews.designer,
        reviews.review_body, CAST(COUNT(comments.review_id) AS INT) AS comment_count
        FROM reviews
        LEFT JOIN comments ON comments.review_id = reviews.review_id 
        `;
  const queryParams = [];

  if (review_id !== undefined) {
    queryString += `WHERE reviews.review_id=$1 
              GROUP BY reviews.review_id;`;
    queryParams.push(review_id);
  }
  return db.query(queryString, queryParams).then((result) => {
    const revs = result.rows;
    if (result.rowCount === 0) {
      return Promise.reject("review_id not found");
    }
    return revs;
  });
  // } else {
  //   let queryString = `
  //         SELECT reviews.owner, reviews.title, reviews.review_id, reviews.review_img_url, reviews.category, reviews.created_at,reviews.votes,reviews.designer,reviews.review_body
  //         FROM reviews
  //         `;
  //   const queryParams = [];

  //   if (review_id !== undefined) {
  //     queryString += "WHERE review_id=$1;";
  //     queryParams.push(review_id);
  //   }
  //   return db.query(queryString, queryParams).then((result) => {
  //     const revs = result.rows;
  //     if (result.rowCount === 0) {
  //       return Promise.reject("review_id not found");
  //     }
  //     return revs;
  //   });
  // }
}

function fetchCommentsByReviewId(review_id) {
  const queryParams = [];
  queryParams.push(review_id);

  return db
    .query(
      `
        SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.review_id
        FROM comments
        WHERE review_id=$1 ORDER BY comments.created_at DESC;
        `,
      queryParams
    )
    .then((result) => {
      return result.rows;
    });
}

function addCommentsByUsername(review_id, author, body) {
  const queryParams = [];
  queryParams.push(body, review_id, author);

  return db
    .query(
      `
        INSERT INTO comments ( body, review_id, author)
        VALUES ($1, $2, $3)
        RETURNING *
        ;
        `,
      queryParams
    )
    .then((result) => {
      const rowCount = result.rowCount;
      if (rowCount === 0) {
        return Promise.reject("review_id not found");
      } else {
        return result.rows[0];
      }
    });
}

function changeVotes(review_id, inc_vot) {
  const queryParams = [];
  queryParams.push(review_id, inc_vot);

  return db
    .query(
      ` 
        UPDATE reviews
        SET votes = votes+$2
        WHERE review_id=$1
        RETURNING * 
        ;
        `,
      queryParams
    )
    .then((result) => {
      const rowCount = result.rowCount;
      if (rowCount === 0) {
        return Promise.reject("review_id not found");
      } else {
        return result.rows[0];
      }
    });
}

function fetchUsers() {
  return db
    .query(
      `
        SELECT * FROM users
        `
    )
    .then((Users) => {
      return Users.rows;
    });
}

function fetchReviewsByQuery(category, sort_by, order) {
  const queryValues = [];

  let queryString = `
  SELECT reviews.owner, reviews.title, reviews.review_body, reviews.review_id, reviews.review_img_url, reviews.category, reviews.created_at,reviews.votes,reviews.designer,CAST(COUNT(comments.review_id) AS int) AS comment_count
  FROM reviews
  LEFT JOIN comments ON comments.review_id = reviews.review_id
                `;

  if (category !== undefined) {
    queryValues.push(category);
    queryString += `WHERE category=$1 
    GROUP BY reviews.review_id`;
  } else {
    return db.query(
      `
        SELECT reviews.owner, reviews.title, reviews.review_body, reviews.review_id, reviews.review_img_url, reviews.category, reviews.created_at,reviews.votes,reviews.designer,CAST(COUNT(comments.review_id) AS int) AS comment_count
        FROM reviews
        LEFT JOIN comments ON comments.review_id = reviews.review_id
        GROUP BY reviews.review_id ;
        `
    );
  }

  if (sort_by !== undefined && order !== undefined) {
    queryString += ` 
    ORDER BY ${sort_by} ${order}`;
  } else if (sort_by !== undefined && order === undefined) {
    queryString += ` 
    ORDER BY ${sort_by} DESC`;
  } else if (category === undefined) {
    return db
      .query(
        `
        SELECT reviews.owner, reviews.title, reviews.review_body, reviews.review_id, reviews.review_img_url, reviews.category, reviews.created_at,reviews.votes,reviews.designer,CAST(COUNT(comments.review_id) AS int) AS comment_count
        FROM reviews
        LEFT JOIN comments ON comments.review_id = reviews.review_id
        GROUP BY reviews.review_id ;
        `
      )
      .then((fetchCategories) => {
        return fetchCategories.rows;
      });
  } else if (order !== undefined && sort_by === undefined) {
    return db
      .query(
        ""`
        SELECT reviews.owner, reviews.title, reviews.review_body, reviews.review_id, reviews.review_img_url, reviews.category, reviews.created_at,reviews.votes,reviews.designer,CAST(COUNT(comments.review_id) AS int) AS comment_count
        FROM reviews
        LEFT JOIN comments ON comments.review_id = reviews.review_id
        GROUP BY reviews.review_id 
        `
      )
      .then((fetchCategories) => {
        return fetchCategories.rows;
      });
  }

  queryString += `;`;

  return db.query(queryString, queryValues).then((result) => {
    const revs = result.rows;
    if (result.rowCount === 0) {
      return Promise.reject("not found");
    }
    return revs;
  });
}

function fetchReviewsByQueryReformed(category, sort_by, order) {
  const queryValues = [];

  let queryString = `
  SELECT reviews.owner, reviews.title, reviews.review_body, reviews.review_id, reviews.review_img_url, reviews.category, reviews.created_at,reviews.votes,reviews.designer,CAST(COUNT(comments.review_id) AS int) AS comment_count
  FROM reviews
  LEFT JOIN comments ON comments.review_id = reviews.review_id
                `;

  if (category !== undefined && category !== "") {
    queryValues.push(category);
    queryString += `WHERE category=$1`;
  }

  queryString += `
  GROUP BY reviews.review_id`;

  const validSortColumns = ["created_at", "votes", "comment_count"];
  const sortColumn = validSortColumns.includes(sort_by) ? sort_by : "votes";

  const sortOrder = order && order.toUpperCase() === "ASC" ? "ASC" : "DESC";

  queryString += ` ORDER BY ${sortColumn} ${sortOrder};`;

  return db.query(queryString, queryValues).then((result) => {
    const revs = result.rows;
    if (result.rowCount === 0) {
      return Promise.reject("not found");
    }
    return revs;
  });
}

module.exports = {
  fetchCategories,
  fetchReviews,
  fetchReviewId,
  fetchCommentsByReviewId,
  addCommentsByUsername,
  changeVotes,
  fetchUsers,
  fetchReviewsByQuery,
  fetchReviewsByQueryReformed,
};
