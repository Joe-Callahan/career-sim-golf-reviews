const client = require('./client.js');
const { createUser } = require('./users.js');
const { createCourse } = require('./courses.js');

const dropTables = async() => {
  try {
    await client.query(`
      DROP TABLE IF EXISTS users;
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
        handicap INT NOT NULL
      );

      CREATE TABLE courses (
        id SERIAL PRIMARY KEY,
        name VARCHAR (30) NOT NULL UNIQUE,
        location VARCHAR (30) NOT NULL
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
  await client.end();
}
syncAndSeed();