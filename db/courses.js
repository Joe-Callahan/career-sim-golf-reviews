const client = require('./client.js');

const createCourse = async(courseName, courseLocation) => {
  try {
    await client.query(`
      INSERT INTO courses (name, location)
      VALUES ('${courseName}', '${courseLocation}');
      `);
  } catch(err) {
    console.log(err);
  }
}

module.exports = createCourse;