//set-up the server for deploy
const express = require('express'); // server framework
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');  // db framework

// activate plug-ins
const app = express();
app.use(bodyParser.json());
app.use(cors());



// Definisci le route per il sotto-dominio login-component
app.get('/ciao', (req, res) => {
  res.json('thaks for say hello on /component/ciao')
});

app.post('/request', (req, res) => {

  const { email, password } = req.body
  res.json('this is your request on /component/request:', email, password)
});


