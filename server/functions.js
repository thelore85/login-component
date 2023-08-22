const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

// Set up the server
const app = express();
app.use(bodyParser.json());
app.use(cors());

///////////////////////////////
// DATABASE CONNECTION 

//set environmental variables
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 5432;
const dbName = process.env.DB_NAME || 'image_recognition';
const dbUser = process.env.DB_USER || '';
const dbPassword = process.env.DB_PSW || '';
const dbConnection = process.env.DB_CONNECTION || '';
const dbSSL = process.env.DB_SSL || '';

//PostgreSql connection
const db = knex({
  client: 'pg',
  connection: {
    host: dbHost,
    port: dbPort,
    database: dbName,
    user: dbUser,
    password: dbPassword,
    connectionString: dbConnection,
    ssl: dbSSL,
  }
});



///////////////////////////////////////
// SERVERLESS FUNCTION

// Signin function
module.exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db
      .select('*')
      .from('users')
      .where({ email })
      .first();

    if (user && bcrypt.compareSync(password, user.password)) {
      res.json(user);
    } else {
      res.json({}); // Return an empty object to preserve front-end error handling
    }
  } catch (error) {
    res.status(400).json({ message: 'ERROR: server /signin', error: error.message });
  }
};

// Register function
module.exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hash = bcrypt.hashSync(password);
    const newUser = await db('users')
      .returning('*')
      .insert({
        email: email,
        name: name,
        password: hash,
        data_creation: new Date().toLocaleString(),
      });

    res.json(newUser[0]);
  } catch (error) {
    res.status(400).json({ message: 'ERROR: /register - impossibile to register', error: error.message });
  }
};

// Session Post function
module.exports.sessionPost = async (req, res) => {
  const { email, img_search, entries, sessions } = req.body;

  try {
    const newSession = await db('sessions')
      .returning('*')
      .insert({
        email: email,
        last_login: new Date(),
        img_search: img_search,
        entries: entries,
        sessions: sessions,
      });

    res.json(newSession[0]);
  } catch (error) {
    res.status(400).json({ message: 'ERROR: session-post', error: error.message });
  }
};

// Session Load function
module.exports.sessionLoad = async (req, res) => {
  const { email } = req.body;

  try {
    const updatedSession = await db('sessions')
      .where({ email })
      .increment('sessions', 1)
      .returning('*');

    if (updatedSession.length > 0) {
      res.json(updatedSession[0]);
    } else {
      res.json({});
    }
  } catch (error) {
    res.status(400).json({ message: 'ERROR: session-load', error: error.message });
  }
};

// Session Update function
module.exports.sessionUpdate = async (req, res) => {
  const { email, last_login, img_search, entries } = req.body;

  console.log('DEBUGGING: server - session-update ', img_search);

  try {
    const updatedSession = await db('sessions')
      .where({ email })
      .update({
        img_search: img_search,
        last_login: last_login,
        entries: entries
      })
      .returning('*');

    res.json(updatedSession[0]); // we don't really need it, we can use state in front end
  } catch (error) {
    res.status(400).json({ message: 'ERROR: session-update', error: error.message });
  }
};

