const connection = require("../db/connection");

async function seedProduction() {
  try {
    console.log("Seeding Production database...");

    // // Query to check if there's any data in the "reviews" table
    // const result = await connection.query(
    //   "SELECT EXISTS(SELECT 1 FROM users LIMIT 1)"
    // );

    // if (result.rows[0].exists) {
    //   console.log("Data exists in the users table.");
    // } else {
    //   console.log("No data found in the users table.");
    // }

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
  ($1, $2), ($3, $4), ($5, $6),($7, $8), ($9, $10), ($11, $12), ($13, $14);
`;
    const valuesCategories = [
      "strategy",
      "Strategy-focused board games that prioritise limited-randomness",
      "hidden-roles",
      "One or more players around the table have a secret, and the rest of you need to figure out who! Players attempt to uncover each other's hidden role",
      "dexterity",
      "Games involving physical skill, something like Gladiators, for Board Games!",
      "push-your-luck",
      "Games that allow you to take bigger risks to achieve increasingly valuable rewards - or to decide to keep what you’ve got before you lose everything.",
      "roll-and-write",
      "Roll some dice and decide how to use the outcome, writing it into a personal scoring sheet.",
      "deck-building",
      "Games where players construct their own deck as a main element of the gameplay",
      "engine-building",
      "Games where players construct unique points-gaining engines as the main element of the gameplay",
    ];

    await connection.query(queryCategories, valuesCategories);

    const valuesUsersArr = [
      [
        "tickle122",
        "Tom Tickle",
        "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
      ],
      [
        "grumpy19",
        "Paul Grump",
        "https://vignette.wikia.nocookie.net/mrmen/images/7/78/Mr-Grumpy-3A.PNG/revision/latest?cb=20170707233013",
      ],
      [
        "happyamy2016",
        "Amy Happy",
        "https://vignette1.wikia.nocookie.net/mrmen/images/7/7f/Mr_Happy.jpg/revision/latest?cb=20140102171729",
      ],
      [
        "cooljmessy",
        "Peter Messy",
        "https://vignette.wikia.nocookie.net/mrmen/images/1/1a/MR_MESSY_4A.jpg/revision/latest/scale-to-width-down/250?cb=20170730171002",
      ],
      [
        "weegembump",
        "Gemma Bump",
        "https://vignette.wikia.nocookie.net/mrmen/images/7/7e/MrMen-Bump.png/revision/latest?cb=20180123225553",
      ],
      [
        "jessjelly",
        "Jess Jelly",
        "https://vignette.wikia.nocookie.net/mrmen/images/4/4f/MR_JELLY_4A.jpg/revision/latest?cb=20180104121141",
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
        "tickle122",
        "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
        "You could sum up Agricola with the simple phrase 'Farmyard Fun' but the mechanics and game play add so much more than that. You'll find yourself torn between breeding pigs, or sowing crops. Its joyeous and rewarding and it makes you think of time spent outside, which is much harder to do these days!",
        "strategy",
        new Date(1610964020514).toISOString(),
        1,
      ],
      [
        "JengARRGGGH!",
        "Leslie Scott",
        "grumpy19",
        "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700",
        "Few games are equipped to fill a player with such a defined sense of mild-peril, but a friendly game of Jenga will turn the mustn't-make-it-fall anxiety all the way up to 11! Fiddly fun for all the family, this game needs little explanation. Whether you're a player who chooses to play it safe, or one who lives life on the edge, eventually the removal of blocks will destabilise the tower and all your Jenga dreams come tumbling down.",
        "dexterity",
        new Date(1610964101251).toISOString(),
        5,
      ],
      [
        "Karma Chameleon",
        "Rikki Tahta",
        "happyamy2016",
        "https://images.pexels.com/photos/45868/chameleon-reptile-lizard-green-45868.jpeg?w=700&h=700",
        "Try to trick your friends. If you find yourself being dealt the Chameleon card then the aim of the game is simple; blend in... Meanwhile the other players aim to be as vague as they can to not give the game away.",
        "hidden-roles",
        new Date(1610964102151).toISOString(),
        5,
      ],
      [
        "Ultimate Werewolf",
        "Akihisa Okui",
        "happyamy2016",
        "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700",
        "We couldn't find the werewolf!",
        "hidden-roles",
        new Date(1610964101251).toISOString(),
        5,
      ],
      [
        "Quacks of Quedlinburg",
        "Wolfgang Warsch",
        "happyamy2016",
        "https://images.pexels.com/photos/279321/pexels-photo-279321.jpeg?w=700&h=700",
        "Ever wish you could try your hand at mixing potions? Quacks of Quedlinburg will have you mixing up a homebrew like no other. Each player buys different ingredients (chips) that are drawn at random to reach the most points, but watch out, you'd better not let your cauldron explode.",
        "push-your-luck",
        new Date(1610964101251).toISOString(),
        10,
      ],
      [
        "tour de Yorkshire",
        "Asger Harding Granerud",
        "cooljmessy",
        "https://images.pexels.com/photos/258045/pexels-photo-258045.jpeg?w=700&h=700",
        "Cold rain pours on the faces of your team of cyclists, you pulled to the front of the pack early and now you're taking on exhaustion cards like there is no tomorrow. You think there are about 2 hands left until you cross the finish line, will you draw enough from your deck to cross before the other team shoots past? Flamee Rouge is a Racing deck management game where you carefully manage your deck in order to cross the line before your opponents.",
        "deck-building",
        new Date(1610964101251).toISOString(),
        10,
      ],
      [
        "Evil person!",
        "Fiona Lohoar",
        "happyamy2016",
        "https://images.pexels.com/photos/220057/pexels-photo-220057.jpeg?w=700&h=700",
        "If you've ever wanted to accuse your siblings, cousins, or friends of being part of a plot to murder everyone whilst secretly choosing which one of them should get the chop next - this is the boardgame for you. Buyer beware: once you gain a reputation for being able to lie with a stone face about being the secret killer you may never lose it.",
        "hidden-roles",
        new Date(1610964101251).toISOString(),
        8,
      ],
      [
        "Scythe",
        "Jamey Stegmaier",
        "grumpy19",
        "https://images.pexels.com/photos/4200740/pexels-photo-4200740.jpeg?w=700&h=700",
        "Spend 30 minutes just setting up all of the boards (!) meeple and decks, just to forget how to play. Scythe can be a lengthy game but really packs a punch if you put the time in. With beautiful artwork, countless scenarios, and clever game mechanics, this board game is a must for any board game fanatic; just make sure you explain ALL the rules before you start playing with first timers or you may find they bring it up again and again.",
        "engine-building",
        new Date(1611311824839).toISOString(),
        100,
      ],
      [
        "Settlers of Catan",
        "Klaus Teuber",
        "tickle122",
        "https://images.pexels.com/photos/1153929/pexels-photo-1153929.jpeg?w=700&h=700",
        "You have stumbled across an uncharted island rich in natural resources, but you are not alone; other adventurers have come ashore too, and the race to settle the island of Catan has begun! Whether you exert military force, build a road to rival the Great Wall, trade goods with ships from the outside world, or some combination of all three, the aim is the same: to dominate the island. Will you prevail? Proceed strategically, trade wisely, and may the odds be in favour.",
        "strategy",
        new Date(788918400).toISOString(),
        16,
      ],
      [
        "Super Rhino",
        "Gamey McGameface",
        "jessjelly",
        "https://images.pexels.com/photos/4691579/pexels-photo-4691579.jpeg?w=700&h=700",
        "Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam.",
        "dexterity",
        new Date(1611315350936).toISOString(),
        7,
      ],
      [
        "Proident tempor",
        "Seymour Buttz",
        "grumpy19",
        "https://images.pexels.com/photos/6333891/pexels-photo-6333891.jpeg?w=700&h=700",
        "Labore occaecat sunt qui commodo anim anim aliqua adipisicing aliquip fugiat. Ad in ipsum incididunt esse amet deserunt aliqua exercitation occaecat nostrud irure labore ipsum. Culpa tempor non voluptate reprehenderit deserunt pariatur cupidatat aliqua adipisicing.",
        "engine-building",
        new Date(1610010368077).toISOString(),
        5,
      ],
      [
        "Occaecat commodo.",
        "Ollie Tabooger",
        "happyamy2016",
        "https://images.pexels.com/photos/6333934/pexels-photo-6333934.jpeg?w=700&h=700",
        "Fugiat fugiat enim officia laborum quis. Aliquip laboris non nulla nostrud magna exercitation in ullamco aute laborum cillum nisi sint. Culpa excepteur aute cillum minim magna fugiat culpa adipisicing eiusmod laborum ipsum fugiat quis.",
        "roll-and-write",
        new Date(1600010368077).toISOString(),
        8,
      ],
      [
        "Kerplunk",
        "Avery Wunzboogerz",
        "tickle122",
        "https://images.pexels.com/photos/411207/pexels-photo-411207.jpeg?w=700&h=700",
        "Don't underestimate the tension and suspense that can be brought on with a round of Kerplunk! You'll feel the rush and thrill of not disturbing the stack of marbles, and probably utter curse words when you draw the wrong straw. Family friendly, and not just for kids!",
        "dexterity",
        new Date(1611573414963).toISOString(),
        9,
      ],
      [
        "Velit tempor",
        "Don Keigh",
        "cooljmessy",
        "https://images.pexels.com/photos/8111357/pexels-photo-8111357.jpeg?w=700&h=700",
        "Nostrud anim cupidatat incididunt officia cupidatat magna. Cillum commodo voluptate laboris id incididunt esse elit ipsum consectetur non elit elit magna. Aliquip sint amet eiusmod magna. Fugiat non ut ex eiusmod elit. Esse anim irure laborum aute ut ad reprehenderit. Veniam laboris dolore mollit mollit in.",
        "hidden-roles",
        new Date(1612524446563).toISOString(),
        3,
      ],
      [
        "Scrobble",
        "Word Smith",
        "jessjelly",
        "https://images.pexels.com/photos/8205368/pexels-photo-8205368.jpeg?w=700&h=700",
        "You know; the one that looks a lot like Scrabble, and plays a lot like Scrabble, but you have to push the letter tiles out of cardboard because that makes it more \"fun\"... If you're a fan of words you'll love this game regardless, but if you're a hardcore word nerd you probably have the original anyway.",
        "strategy",
        new Date(1611315305936).toISOString(),
        1,
      ],
      [
        "Ticket Ride",
        "Alan R. Moon",
        "weegembump",
        "https://images.pexels.com/photos/4691567/pexels-photo-4691567.jpeg?w=700&h=700",
        "Choo-chooing onto game tables and zooming its way to becoming a modern classic. Ticket To Ride is rich with trains, tickets, and tactics. Players gather train cards to enable them to build routes across a North American map, joining big cities and trying not to get blocked by their opponent.",
        "deck-building",
        new Date(1611313505936).toISOString(),
        1,
      ],
      [
        "Nova Luna",
        "Uwe Rosenburg",
        "tickle122",
        "https://images.pexels.com/photos/279321/pexels-photo-279321.jpeg?w=700&h=700",
        "Loosely based around the phases of the moon, this tile placing game is rich in strategy and makes great use of non-standard turn taking. Nova Luna was one of my favourite nominations for the prestigious Kennerspiel des Jahres in 2020. Sadly it didn't take home the title, but its an intriguing abstract game, certainly one to add to your game shelf.",
        "strategy",
        new Date(788198400).toISOString(),
        6,
      ],
      [
        "Reef",
        "Emerson Matsuuchi",
        "tickle122",
        "https://images.pexels.com/photos/6333894/pexels-photo-6333894.jpeg?w=700&h=700",
        "This game reminds me of the stress-free environment described in a song sung by a crab in the famous film about a mermaid. Plenty of coral collecting, and reef building to keep you entertained.",
        "strategy",
        new Date(788198400).toISOString(),
        6,
      ],
      [
        "Twister",
        "Chuck Foley",
        "happyamy2016",
        "https://images.pexels.com/photos/6630813/pexels-photo-6630813.jpeg?w=700&h=700",
        "Fugiat fugiat enim officia laborum quis. Aliquip laboris non nulla nostrud magna exercitation in ullamco aute laborum cillum nisi sint. Culpa excepteur aute cillum minim magna fugiat culpa adipisicing eiusmod laborum ipsum fugiat quis. Mollit consectetur amet sunt ex amet tempor magna consequat dolore cillum adipisicing. Proident est sunt amet ipsum magna proident fugiat deserunt mollit officia magna ea pariatur.",
        "roll-and-write",
        new Date(1600010368077).toISOString(),
        8,
      ],
      [
        "Monopoly",
        "Uncredited",
        "grumpy19",
        "https://images.pexels.com/photos/4792379/pexels-photo-4792379.jpeg?w=700&h=700",
        "This household classic needs no introduction. Monopoly has been causing family fallouts for close to 90 years. With numerous special editions and no doubt more still to come almost everyone has played this game, but has anyone ever finished it?",
        "strategy",
        new Date(1600010060877).toISOString(),
        3,
      ],
      [
        "Ganz Schon",
        "Wolfgang Warsch",
        "happyamy2016",
        "https://images.pexels.com/photos/516114/pexels-photo-516114.jpeg?w=700&h=700",
        "The title translates to \"that's so clever\" and it won't take you long to realise why. Ganz Schon Clever is a really engaging roll-and-write where you'll try to collect score points from coloured dice. Sounds simple, but the real strategy of this game lies in how you collect the bonuses.",
        "roll-and-write",
        new Date(1600010368077).toISOString(),
        8,
      ],
      [
        "Yahtzee",
        "Edwin S. Lowe",
        "grumpy19",
        "https://images.pexels.com/photos/3956552/pexels-photo-3956552.jpeg?w=700&h=700",
        "Often thought of as the ultimate roll-and-write game, You'll find it hard to overlook Yahtzee's appeal. Yahtzee is quick to teach and quick to play. Think of it as an essential \"palate-cleanser\" game to have in your store cupboard for those times when chunkier games leave a bitter taste in players' mouths.",
        "roll-and-write",
        new Date(1600010360077).toISOString(),
        18,
      ],
      [
        "Dark Castle",
        "Alex Crispin",
        "jessjelly",
        "https://images.pexels.com/photos/5439508/pexels-photo-5439508.jpeg?w=700&h=700",
        "Escape the Dark Castle is a cooperative board game that will bring back feelings of eighties nostalgia. Released in 2017, it's already well on its way to being a cult classic. Filled with dark traps, dungeons and monstrous foes the aim of the game is simple, escape!",
        "push-your-luck",
        new Date(1610964545410).toISOString(),
        18,
      ],
      [
        "Dark Sector",
        "Alex Crispin",
        "jessjelly",
        "https://images.pexels.com/photos/3910141/pexels-photo-3910141.jpeg?w=700&h=700",
        "Arguably one of the best things to come out of 2020, and a new addition to what will hopefully become more than a two-part series. Escape the Dark Sector takes everything about Escape the Dark Castle that made it wonderful, and then adds guns! Thrust into the future by the immersive chapter cards, your mission remains the same, (that's right, escape!) but the challenges you'll face feel a whole lot more grown up. Cooperative and atmospheric, Escape the Dark Sector brings more variety and a bigger challenge to players. Don't underestimate the danger of running out of ammo.",
        "push-your-luck",
        new Date(1610964545610).toISOString(),
        11,
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
      console.error("Error seeding queryReviews table:", error);
    }

    const comments = [
      ["I loved this game too!", 16, "happyamy2016", 2, 1511354163389 / 1000],
      ["My dog loved this game too!", 3, "tickle122", 4, 1610964545410 / 1000],
      [
        "I didn't know dogs could play games",
        10,
        "weegembump",
        4,
        1610964588110 / 1000,
      ],
      ["EPIC board game!", 16, "tickle122", 2, 1511354163389 / 1000],
      [
        "Now this is a story all about how, board games turned my life upside down",
        13,
        "cooljmessy",
        20,
        1610965445410 / 1000,
      ],
      [
        "Not sure about dogs, but my cat likes to get involved with board games, the boxes are their particular favourite",
        10,
        "happyamy2016",
        4,
        1616874588110 / 1000,
      ],
      [
        "Quis duis mollit ad enim deserunt.",
        3,
        "jessjelly",
        8,
        1616874538110 / 1000,
      ],
      [
        "Laboris nostrud ea ex occaecat aute quis consectetur anim.",
        17,
        "cooljmessy",
        7,
        1616854538110 / 1000,
      ],
      [
        "Consequat nisi dolor nulla esse sunt eu ipsum laborum deserunt duis.",
        1,
        "weegembump",
        6,
        1616854536110 / 1000,
      ],
      [
        "Ex id ipsum dolore non cillum anim sint duis nisi anim deserunt nisi minim.",
        9,
        "grumpy19",
        2,
        1616854531110 / 1000,
      ],
      [
        "Commodo aliquip sunt commodo elit in esse velit laborum cupidatat anim.",
        10,
        "happyamy2016",
        4,
        1616854521110 / 1000,
      ],
      [
        "Aliquip aliqua ad fugiat anim ex elit consectetur ut fugiat ex qui.",
        8,
        "tickle122",
        5,
        1616854551110 / 1000,
      ],
      [
        "Sint elit ut ex aliquip laboris in elit Lorem elit incididunt cillum fugiat.",
        8,
        "weegembump",
        6,
        161684559110 / 1000,
      ],
      [
        "Commodo et non ut aute anim nisi occaecat ea veniam ut ad.",
        15,
        "jessjelly",
        7,
        1611313922734 / 1000,
      ],
      [
        "Ex aliqua irure elit aliqua in veniam ex ut pariatur nulla.",
        1,
        "tickle122",
        19,
        1630010368077 / 1000,
      ],
      [
        "Duis anim aliqua consequat mollit ullamco fugiat qui mollit minim proident.",
        2,
        "cooljmessy",
        9,
        1611316192508 / 1000,
      ],
      [
        "Nostrud adipisicing reprehenderit adipisicing velit do do quis do veniam ut adipisicing aliqua do reprehenderit.",
        10,
        "weegembump",
        9,
        1611316224771 / 1000,
      ],
      [
        "Reprehenderit ipsum eiusmod sint amet veniam ex veniam cillum quis et Lorem mollit dolor ipsum.",
        7,
        "grumpy19",
        12,
        1620010368077 / 1000,
      ],
      [
        "Quis duis mollit ad enim deserunt.",
        3,
        "jessjelly",
        3,
        1616874538110 / 1000,
      ],
      [
        "Laboris nostrud ea ex occaecat aute quis consectetur anim.",
        17,
        "cooljmessy",
        3,
        1616854538110 / 1000,
      ],
      [
        "Consequat nisi dolor nulla esse sunt eu ipsum laborum deserunt duis.",
        1,
        "weegembump",
        3,
        1616854536110 / 1000,
      ],
      [
        "Ex id ipsum dolore non cillum anim sint duis nisi anim deserunt nisi minim.",
        9,
        "jessjelly",
        3,
        1616854531110 / 1000,
      ],
      [
        "Commodo aliquip sunt commodo elit in esse velit laborum cupidatat anim.",
        10,
        "happyamy2016",
        3,
        1616854521110 / 1000,
      ],
      [
        "Ex id ipsum dolore non cillum anim sint duis nisi anim deserunt nisi minim.",
        9,
        "jessjelly",
        10,
        1616854531110 / 1000,
      ],
      [
        "Commodo aliquip sunt commodo elit in esse velit laborum cupidatat anim.",
        10,
        "happyamy2016",
        10,
        1616854521110 / 1000,
      ],
      [
        "Quis duis mollit ad enim deserunt.",
        3,
        "jessjelly",
        13,
        1616874538110 / 1000,
      ],
      [
        "Laboris nostrud ea ex occaecat aute quis consectetur anim.",
        17,
        "cooljmessy",
        13,
        1616854538110 / 1000,
      ],
      [
        "Consequat nisi dolor nulla esse sunt eu ipsum laborum deserunt duis.",
        1,
        "weegembump",
        13,
        1616854536110 / 1000,
      ],
      [
        "Ex id ipsum dolore non cillum anim sint duis nisi anim deserunt nisi minim.",
        9,
        "jessjelly",
        15,
        1616854531110 / 1000,
      ],
      [
        "Commodo aliquip sunt commodo elit in esse velit laborum cupidatat anim.",
        10,
        "happyamy2016",
        15,
        1616854521110 / 1000,
      ],
      [
        "Quis duis mollit ad enim deserunt.",
        3,
        "jessjelly",
        16,
        1616874538110 / 1000,
      ],
      [
        "Laboris nostrud ea ex occaecat aute quis consectetur anim.",
        17,
        "cooljmessy",
        16,
        1616854538110 / 1000,
      ],
      [
        "Consequat nisi dolor nulla esse sunt eu ipsum laborum deserunt duis. Ffugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat?",
        1,
        "weegembump",
        16,
        1616854536110 / 1000,
      ],
      [
        "Ex id ipsum dolore non cillum anim sint duis nisi anim deserunt nisi minim. Fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat.",
        9,
        "jessjelly",
        16,
        1616854531110 / 1000,
      ],
      [
        "Commodo aliquip sunt commodo elit in esse velit laborum cupidatat anim. Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur.",
        10,
        "happyamy2016",
        16,
        1616854521310 / 1000,
      ],
      [
        "Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Quis duis mollit ad enim deserunt.",
        3,
        "jessjelly",
        16,
        1616874538190 / 1000,
      ],
      [
        "Laboris nostrud ea ex occaecat aute quis consectetur anim. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip?",
        17,
        "cooljmessy",
        16,
        1616854538180 / 1000,
      ],
      [
        "Quis duis mollit ad enim deserunt.",
        3,
        "jessjelly",
        17,
        1616874538110 / 1000,
      ],
      [
        "Laboris nostrud ea ex occaecat aute quis consectetur anim.",
        17,
        "cooljmessy",
        17,
        1616854538110 / 1000,
      ],
      [
        "Consequat nisi dolor nulla esse sunt eu ipsum laborum deserunt duis. Ffugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat?",
        1,
        "weegembump",
        17,
        1616854536110 / 1000,
      ],
      [
        "Ex id ipsum dolore non cillum anim sint duis nisi anim deserunt nisi minim. Fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat.",
        9,
        "jessjelly",
        18,
        1616854531110 / 1000,
      ],
      [
        "Commodo aliquip sunt commodo elit in esse velit laborum cupidatat anim. Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur.",
        10,
        "happyamy2016",
        18,
        1616854521310 / 1000,
      ],
      [
        "Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Quis duis mollit ad enim deserunt.",
        3,
        "jessjelly",
        18,
        1616874538190 / 1000,
      ],
      [
        "Laboris nostrud ea ex occaecat aute quis consectetur anim. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip?",
        17,
        "cooljmessy",
        18,
        1616854538180 / 1000,
      ],
      [
        "Quis duis mollit ad enim deserunt.",
        3,
        "jessjelly",
        19,
        1616874538110 / 1000,
      ],
      [
        "Laboris nostrud ea ex occaecat aute quis consectetur anim.",
        17,
        "cooljmessy",
        20,
        1616854538110 / 1000,
      ],
      [
        "Consequat nisi dolor nulla esse sunt eu ipsum laborum deserunt duis. Ffugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat?",
        1,
        "weegembump",
        21,
        1616854536110 / 1000,
      ],
      [
        "Ex id ipsum dolore non cillum anim sint duis nisi anim deserunt nisi minim. Fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat.",
        9,
        "jessjelly",
        21,
        1616854531110 / 1000,
      ],
      [
        "Commodo aliquip sunt commodo elit in esse velit laborum cupidatat anim. Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur.",
        10,
        "happyamy2016",
        22,
        1616854521310 / 1000,
      ],
      [
        "Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Quis duis mollit ad enim deserunt.",
        3,
        "jessjelly",
        22,
        1616874538190 / 1000,
      ],
      [
        "Laboris nostrud ea ex occaecat aute quis consectetur anim. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip?",
        17,
        "cooljmessy",
        23,
        1616854538180 / 1000,
      ],
      [
        "Quis duis mollit ad enim deserunt.",
        3,
        "jessjelly",
        24,
        1616874538110 / 1000,
      ],
      [
        "Laboris nostrud ea ex occaecat aute quis consectetur anim.",
        17,
        "cooljmessy",
        24,
        1616854538110 / 1000,
      ],
      [
        "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.",
        4,
        "jessjelly",
        7,
        1616854538110 / 1000,
      ],
    ];
    const values = comments.flat();
    const placeholders = comments
      .map((_, i) => {
        const base = i * 5;
        return `($${base + 1}, $${base + 2}, $${base + 3}, $${
          base + 4
        }, TO_TIMESTAMP($${base + 5}))`;
      })
      .join(",\n");

    await connection.query(
      `
  INSERT INTO comments (body, votes, author, review_id, created_at)
  VALUES ${placeholders}
  `,
      values
    );

    console.log("Production database seeded successfully!");
  } catch (error) {
    console.error("Error seeding Production database:", error);
  }
}

// Run the function if the script is executed directly
if (require.main === module) {
  seedProduction();
}

module.exports = seedProduction;
