const client = require('./client.js');

const createReview = async(reviewTitle, reviewDescription, reviewRating, courseReviewed, reviewingUser) => {
  try {
    await client.query(`
      INSERT INTO reviews (title, description, rating, course_id, user_id)
      VALUES ('${reviewTitle}', '${reviewDescription}', ${reviewRating}, ${courseReviewed}, ${reviewingUser});
      `);
  } catch(err) {
    console.log(err);
  }
}

const deleteReview = async(reviewId) => {
  try {
    await client.query(`
      DELETE FROM reviews WHERE id=${reviewId};
    `);
  } catch(err) {
    console.log(err);
  }
}

module.exports = { createReview, deleteReview }