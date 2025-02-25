const client = require('./db/client.js');
client.connect();
const { authentication, tokenLogIn, createUser } = require('./db/users.js');
const express = require('express');
const app = express();
app.use(express.json());

console.log(process.env.PORT);

app.get('/', (req, res) => {
  res.send(`Welcome to the golf course review page!`)
});

app.post('/api/auth/register', async(req, res) => {
  const { username, password } = req.body;
  try {
    await createUser(username, password);
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
    res.send(`Thank you, ${username}! Login successful. Your login token is displayed below: ${token}`);
  } catch(err) {
    res.send({message: err.message});
  }
});

app.get('/api/auth/login', async(req, res) => {
  try {
    const user = await tokenLogIn(req.headers.authorization);
    res.send({user});
  } catch(err) {
    res.send({message: err.message});
  }
});

app.listen(process.env.PORT, () => {
  console.log(`listening on PORT ${process.env.PORT}`);
});