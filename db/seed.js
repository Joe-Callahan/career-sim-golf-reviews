const client = require('./client.js');
const { createUser } = require('./users.js');
const createCourse = require('./courses.js');
const { createReview } = require('./reviews.js');

const dropTables = async() => {
  try {
    await client.query(`
      DROP TABLE IF EXISTS reviews;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS courses;
    `);
  } catch(err) {
    console.log(err);
  }
}

const createTables = async() => {
  try {
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR (30) NOT NULL UNIQUE,
        password VARCHAR (60) NOT NULL,
        handicap INTEGER NOT NULL
      );

      CREATE TABLE courses (
        id SERIAL PRIMARY KEY,
        name VARCHAR (30) NOT NULL UNIQUE,
        location VARCHAR (30) NOT NULL
      );

      CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        title VARCHAR (30) NOT NULL,
        description VARCHAR (250) NOT NULL,
        rating INTEGER NOT NULL,
        course_id INTEGER REFERENCES courses(id),
        user_id INTEGER REFERENCES users(id)
      );
    `);
  } catch(err) {
    console.log(err);
  }
}

const syncAndSeed = async() => {
  await client.connect();
  await dropTables();
  await createTables();
  await createUser('joecallahan', 'password123', 7);
  await createUser('mrcallahan', 'mcpassword3', 44);
  await createUser('californialove', 'ilovecali916', 2);
  await createUser('billybob49', 'bobbillyissilly7', 15);
  await createUser('jackblack', 'kungfupanda3', 22);
  await createCourse('Yocha Dehe', 'Brooks, CA');
  await createCourse('Turkey Creek', 'Lincoln, CA');
  await createCourse('Emerald Lakes', 'Elk Grove, CA');
  await createCourse('Pebble Beach', 'Pebble Beach, CA');
  await createCourse('Edgewood', 'Stateline, NV');
  await createReview('Awesome', 'great course, great time, great everything!', 10, 1, 1);
  await createReview('Great', 'challenging yet gettable!', 9, 2, 1);
  await createReview('Average', 'meh', 6, 2, 3);
  await createReview('Poor', 'greens were stamped and nobody told us!', 1, 2, 3);
  await createReview('Average', 'hoping for better next time', 5, 4, 2);
  await createReview('Poor', 'slow pop time', 1, 5, 5);
  await createReview('Awesome', 'super duper time!', 10, 3, 5);
  await createReview('Great', 'drinks were awesome!', 9, 1, 4);
  await client.end();
}
syncAndSeed();