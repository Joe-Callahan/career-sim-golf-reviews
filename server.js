const client = require('./db/client.js');
client.connect();
const { createUser, authentication, verifyToken } = require('./db/users.js');
const { createReview, deleteReview } = require('./db/reviews.js');
const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send(`Welcome to the golf course review page!`);
});

app.post('/api/auth/register', async(req, res) => {
  const { username, password, handicap } = req.body;
  try {
    await createUser(username, password, handicap);
    const token = await authentication(username, password);
    res.send(`Thank you, ${username}! Account successfully created. Your login token is displayed below: ${token}`);
  } catch(err) {
    res.send({message: err.message});
  }
});

app.post('/api/auth/login', async(req, res) => {
  const { username, password } = req.body;
  try {
    const token = await authentication(username, password);
    res.send(`Thank you, ${username}! Authentication successful. Your login token is displayed below: ${token}`);
  } catch(err) {
    res.send({message: err.message});
  }
});

app.get('/api/auth/login', async(req, res) => {
  try {
    const user = await verifyToken(req.headers.authorization);
    res.send(`Thank you, ${user.username}. You are logged in!`);
  } catch(err) {
    res.send({message: err.message});
  }
});

app.get('/api/auth/me', async(req, res) => {
  const user = await verifyToken(req.headers.authorization);
  if(user) {
    res.send(`Your username is ${user.username}. Your current handicap is ${user.handicap}.`);
  } else {
    res.send(`You must be logged in to access this feature.`);
  }
});

app.get('/api/courses', async(req, res) => {
  const courses = await client.query(`SELECT * FROM courses;`);
  res.send(courses.rows);
});

app.get('/api/courses/:id', async(req, res) => {
  const courseId = req.params.id;
  const selectedCourse = await client.query(`SELECT * FROM courses WHERE id=${courseId};`);
  res.send(selectedCourse.rows[0]);
});

app.get('/api/courses/:id/reviews', async(req, res) => {
  const courseId = req.params.id;
  const selectedCourseReviews = await client.query(`SELECT * FROM reviews WHERE course_id=${courseId};`);
  res.send(selectedCourseReviews.rows);
});

app.post('/api/courses/:id/reviews', async(req, res) => {
  const user = await verifyToken(req.headers.authorization);
  if(user) {
    const courseId = req.params.id;
    const userId = user.id;
    const { title, description, rating } = req.body;
    try {
      await createReview(title, description, rating, courseId, userId);
      res.send(`Thank you, ${user.username}. Your review has been recorded.`);
    } catch(err) {
      res.send({message: err.message});
    }
  } else {
    res.send(`You must be logged in to write a review.`);
  }
});

app.get('/api/reviews/me', async(req, res) => {
  const user = await verifyToken(req.headers.authorization);
  if(user) {
    try {
      const userReviews = await client.query(`
        SELECT * FROM reviews WHERE user_id=${user.id};
      `);
      res.send(userReviews.rows);
    } catch(err) {
      res.send(err.message);
    }
  } else {
    res.send(`Please log in or register to use this feature.`);
  }
});

app.delete('/api/reviews/:reviewId', async(req,res) => {
  const reviewId = req.params.reviewId;
  const user = await verifyToken(req.headers.authorization);
  const reviewInQuestion = await client.query(`
    SELECT * FROM reviews WHERE id=${reviewId}
  `);
  if(user && (user.id === reviewInQuestion.user_id)) {
    try {
      await deleteReview(reviewId);
      res.send(`Deletion successful.`);
    } catch(err) {
      res.send(err.message);
    }
  } else {
    res.send(`Thou doth not delete which thou doth not write.`);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`listening on PORT ${process.env.PORT}`);
});