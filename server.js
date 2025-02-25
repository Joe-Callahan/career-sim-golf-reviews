const client = require('./db/client.js');
client.connect();
const { authentication, verifyToken, createUser } = require('./db/users.js');
const express = require('express');
const app = express();
app.use(express.json());

console.log(process.env.PORT);



app.get('/', (req, res) => {
  res.send(`Welcome to the golf course review page!`)
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


app.listen(process.env.PORT, () => {
  console.log(`listening on PORT ${process.env.PORT}`);
});