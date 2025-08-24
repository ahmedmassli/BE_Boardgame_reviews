const connection = require("../db/connection");

async function resetTestDatabase() {
  try {
    // Drop tables if they exist
    await connection.query("DROP TABLE IF EXISTS comments");
    await connection.query("DROP TABLE IF EXISTS reviews");
    await connection.query("DROP TABLE IF EXISTS users");
    await connection.query("DROP TABLE IF EXISTS categories");

    // Recreate categories table
    await connection.query(`
			CREATE TABLE categories (
				slug VARCHAR PRIMARY KEY,
				description VARCHAR
			);
    `);

    // Recreate users table
    await connection.query(`
			CREATE TABLE users (
				username VARCHAR PRIMARY KEY,
				name VARCHAR NOT NULL,
				avatar_url VARCHAR
			);`);

    // Recreate reviews table
    await connection.query(`
CREATE TABLE reviews (
				review_id SERIAL PRIMARY KEY,
				title VARCHAR NOT NULL,
				category VARCHAR NOT NULL REFERENCES categories(slug),
				designer VARCHAR,
				owner VARCHAR NOT NULL REFERENCES users(username),
				review_body VARCHAR NOT NULL,
				review_img_url VARCHAR DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?w=700&h=700',
				created_at TIMESTAMP DEFAULT NOW(),
				votes INT DEFAULT 0 NOT NULL
)`);

    // Recreate comments table
    await connection.query(`
			CREATE TABLE comments (
				comment_id SERIAL PRIMARY KEY,
				body VARCHAR NOT NULL,
				review_id INT REFERENCES reviews(review_id) NOT NULL,
				author VARCHAR REFERENCES users(username) NOT NULL,
				votes INT DEFAULT 0 NOT NULL,
				created_at TIMESTAMP DEFAULT NOW()
			);
    `);

    // Insert categories test
    const queryCategories = `
  INSERT INTO categories (slug, description) VALUES 
  ($1, $2), ($3, $4), ($5, $6), ($7, $8);
`;
    const valuesCategories = [
      "euro game",
      "Abstract games that involve little luck",
      "social deduction",
      "Players attempt to uncover each other's hidden role",
      "dexterity",
      "Games involving physical skill",
      "children's games",
      "Games suitable for children",
    ];

    await connection.query(queryCategories, valuesCategories);

    const valuesUsersArr = [
      [
        "mallionaire",
        "haz",
        "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      ],
      [
        "philippaclaire9",
        "philippa",
        "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      ],
      [
        "bainesface",
        "sarah",
        "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
      ],
      [
        "dav3rid",
        "dave",
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      ],
    ];

    const queryUsers = `
  INSERT INTO users (username, name, avatar_url) VALUES 
  ${valuesUsersArr
    .map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`)
    .join(", ")}
`;

    const valuesUsers = valuesUsersArr.flat();

    await connection.query(queryUsers, valuesUsers);

    // Insert reviews test
    const valuesReviewsArr = [
      [
        "Agricola",
        "Uwe Rosenberg",
        "mallionaire",
        "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
        "Farmyard fun!",
        "euro game",
        new Date(1610964020514).toISOString(),
        1,
      ],
      [
        "Jenga",
        "Leslie Scott",
        "philippaclaire9",
        "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700",
        "Fiddly fun for all the family",
        "dexterity",
        new Date(1610964101251).toISOString(),
        5,
      ],
      [
        "Ultimate Werewolf",
        "Akihisa Okui",
        "bainesface",
        "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700",
        "We couldn't find the werewolf!",
        "social deduction",
        new Date(1610964101251).toISOString(),
        5,
      ],
      [
        "Dolor reprehenderit",
        "Gamey McGameface",
        "mallionaire",
        "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?w=700&h=700",
        "Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod",
        "social deduction",
        new Date(1611315350936).toISOString(),
        7,
      ],
      [
        "Proident tempor et.",
        "Seymour Buttz",
        "mallionaire",
        "https://images.pexels.com/photos/209728/pexels-photo-209728.jpeg?w=700&h=700",
        "Labore occaecat sunt qui commodo...",
        "social deduction",
        new Date(1610010368077).toISOString(),
        5,
      ],
      [
        "Occaecat consequat officia in quis commodo.",
        "Ollie Tabooger",
        "mallionaire",
        "https://images.pexels.com/photos/207924/pexels-photo-207924.jpeg?w=700&h=700",
        "Fugiat fugiat enim officia laborum quis...",
        "social deduction",
        new Date(1600010368077).toISOString(),
        8,
      ],
      [
        "Mollit elit qui incididunt veniam occaecat cupidatat",
        "Avery Wunzboogerz",
        "mallionaire",
        "https://images.pexels.com/photos/776657/pexels-photo-776657.jpeg?w=700&h=700",
        "Consectetur incididunt aliquip sunt officia...",
        "social deduction",
        new Date(1611573414963).toISOString(),
        9,
      ],
      [
        "One Night Ultimate Werewolf",
        "Akihisa Okui",
        "mallionaire",
        "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700",
        "We couldn't find the werewolf!",
        "social deduction",
        new Date(1610964101251).toISOString(),
        5,
      ],
      [
        "A truly Quacking Game; Quacks of Quedlinburg",
        "Wolfgang Warsch",
        "mallionaire",
        "https://images.pexels.com/photos/279321/pexels-photo-279321.jpeg?w=700&h=700",
        "Ever wish you could try your hand at mixing potions?...",
        "social deduction",
        new Date(1610964101251).toISOString(),
        10,
      ],
      [
        "Build you own tour de Yorkshire",
        "Asger Harding Granerud",
        "mallionaire",
        "https://images.pexels.com/photos/258045/pexels-photo-258045.jpeg?w=700&h=700",
        "Cold rain pours on the faces of your team of cyclists...",
        "social deduction",
        new Date(1610964101251).toISOString(),
        10,
      ],
      [
        "That's just what an evil person would say!",
        "Fiona Lohoar",
        "mallionaire",
        "https://images.pexels.com/photos/220057/pexels-photo-220057.jpeg?w=700&h=700",
        "If you've ever wanted to accuse your siblings...",
        "social deduction",
        new Date(1610964101251).toISOString(),
        8,
      ],
      [
        "Scythe; you're gonna need a bigger table!",
        "Jamey Stegmaier",
        "mallionaire",
        "https://images.pexels.com/photos/4200740/pexels-photo-4200740.jpeg?w=700&h=700",
        "Spend 30 minutes just setting up all of the boards...",
        "social deduction",
        new Date(1611311824839).toISOString(),
        100,
      ],
      [
        "Settlers of Catan: Don't Settle For Less",
        "Klaus Teuber",
        "mallionaire",
        "https://images.pexels.com/photos/1153929/pexels-photo-1153929.jpeg?w=700&h=700",
        "You have stumbled across an uncharted island...",
        "social deduction",
        new Date(788918400).toISOString(),
        16,
      ],
    ];

    const queryReviews = `
  INSERT INTO reviews (title, designer, owner, review_img_url, review_body, category, created_at, votes)
  VALUES 
  ${valuesReviewsArr
    .map((_, i) => {
      const offset = i * 8;
      return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${
        offset + 4
      }, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8})`;
    })
    .join(", ")}
`;

    const valuesReviews = valuesReviewsArr.flat(); // Flatten the 2D array into a 1D array
    try {
      await connection.query(queryReviews, valuesReviews);
    } catch (error) {
      console.error("Error seeding test database:", error);
    }

    // Insert comments test
    await connection.query(
      `INSERT INTO comments (body, votes, author, review_id, created_at) 
   VALUES 
   ($1, $2, $3, $4, TO_TIMESTAMP($5 )),
   ($6, $7, $8, $9, TO_TIMESTAMP($10 )),
   ($11, $12, $13, $14, TO_TIMESTAMP($15 )),
   ($16, $17, $18, $19, TO_TIMESTAMP($20 )),
   ($21, $22, $23, $24, TO_TIMESTAMP($25 )),
   ($26, $27, $28, $29, TO_TIMESTAMP($30 ))`,
      [
        "I loved this game too!",
        16,
        "bainesface",
        2,
        1511354613389 / 1000,
        "My dog loved this game too!",
        13,
        "mallionaire",
        3,
        1610964545410 / 1000,
        "I didn't know dogs could play games",
        10,
        "philippaclaire9",
        3,
        1610964588110 / 1000,
        "EPIC board game!",
        16,
        "bainesface",
        2,
        1511354163389 / 1000,
        "Now this is a story all about how, board games turned my life upside down",
        13,
        "mallionaire",
        2,
        1610965445410 / 1000,
        "Not sure about dogs, but my cat likes to get involved with board games, the boxes are their particular favourite",
        10,
        "philippaclaire9",
        3,
        1616874588110 / 1000,
      ]
    );
  } catch (error) {
    console.error("Error seeding test database:", error);
  }
}

// Run the function if the script is executed directly
if (require.main === module) {
  resetTestDatabase();
}

module.exports = resetTestDatabase;
