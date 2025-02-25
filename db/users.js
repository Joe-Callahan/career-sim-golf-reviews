const client = require('./client.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUser = async(createdUsername, createdPassword, createdHandicap) => {
  try {
    const encryptedPassword = await bcrypt.hash(createdPassword, 8);
    await client.query(`
      INSERT INTO users (username, password, handicap)
      VALUES ('${createdUsername}', '${encryptedPassword}', ${createdHandicap});
      `);
  } catch(err) {
    console.log(err);
  }
}

const authentication = async(username, password) => {
  try {
    const { rows } = await client.query(`
      SELECT * FROM users WHERE username='${username}';
    `);
    const user = rows[0];
    if(user) {
      const isPassword = await bcrypt.compare(password, user.password);
      if(isPassword) {
        const token = await jwt.sign({username:user.username}, process.env.JWT_SECRET);
        return token;
      } else {
        throw new Error('Incorrect password. Please try again.');
      }
    } else {
      throw new Error('Incorrect password. Please try again.');
    }
  } catch(err) {
    console.log(err.message);
  }
}

const verifyToken = async(token) => {
  try {
    const tokenVerification = await jwt.verify(token, process.env.JWT_SECRET);
    const { rows } = await client.query(`
      SELECT * FROM users WHERE username='${tokenVerification.username}';
    `);
    const user = rows[0];
    if(user) {
      return {username:user.username, handicap:user.handicap, id:user.id};
    } else {
      throw new Error('Token issues. Please try again.');
    }
  } catch(err) {
    console.log(err);
  }
}

module.exports = { createUser, authentication, verifyToken }