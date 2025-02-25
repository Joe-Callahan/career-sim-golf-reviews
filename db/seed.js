const client = require('./client.js');
const { createUser } = require('./users.js');

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
        password VARCHAR (60) NOT NULL
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
  await createUser('joecallahan', 'password123');
  await createUser('mrcallahan', 'mcpassword3');
  await createUser('californialove', 'ilovecali916');
  await createUser('billybob49', 'bobbillyissilly7');
  await createUser('jackblack', 'kungfupanda3');
  await client.end();
}
syncAndSeed();