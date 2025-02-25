const client = require('./db/client.js');
client.connect();
const { authentication, tokenLogIn } = require('./db/users.js');
const express = require('express');
const app = express();
app.use(express.json());

console.log(process.env.PORT);

// app.get('/', (req, res) => {
//   console.log('hi');
// });

app.post('/api/login', async(req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  try {
    const token = await authentication(username, password);
    res.send({ token: token });
  } catch(err) {
    res.send({message: err.message});
  }
});

app.get('/api/login', async(req, res) => {
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