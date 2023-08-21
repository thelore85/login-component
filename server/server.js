//////////////////////////////////////////////
//////////////////////////////////////////////
/////// ------ NODE.JS SERVER ------- ////////
//////////////////////////////////////////////
//////////////////////////////////////////////


//////////////////////////////////////
// SERVER SETTING

//set-up the server
const express = require('express'); // server framework
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');  // db framework

// activate plug-ins
const app = express();
app.use(bodyParser.json());
app.use(cors());

const host = 'dpg-cjhj3vc1ja0c73dh7610-a.frankfurt-postgres.render.com'

// server launch
app.listen(host, ()=>{ console.log('app is running on: ', host) })


///////////////////////////////
// DATABASE CONNECTION 

// PostgreSql connection
const db = knex({
  client: 'pg',
  connection: {
    host : 'dpg-cjhj3vc1ja0c73dh7610-a.frankfurt-postgres.render.com',
    port : 5432, //default port psql
    user : ' thelore85',
    password : 'N2zm1sEqRlk9OQZctjwWsJlqdxTHGXR6',
    database : 'image_recognition_um7l' // db name 
  }
});




//////////////////////////////////////////////////////
//////// ---------   END POINTS  --------------------
//////////////////////////////////////////////////////


/////////////////////////////////
//signin: check user data --> return user to front end
app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  var hash = bcrypt.hashSync(password);


  db.select('*')
    .from('users')
    .where({ email })
    .andWhere(
      bcrypt.compareSync( password , hash)
    )
    .then(user => {
      if (user.length > 0) {
        res.json(user[0]); // Restituisci il primo utente trovato
      } else {
        res.json({}); // res empty obj: to preserve front-end error (if undefined the fetch in signin compo. run error)
      }
    })
    .catch(err => res.status(400).json('ERROR: server /signin'));
});


/////////////////////////////////
//register: add a user record -> return new user object
app.post('/register', (req,res) => {
  
  const { name, email, password } = req.body;

  var hash = bcrypt.hashSync( password );

  db('users')
  .returning('*') //this method give a response from db
  .insert({
    email: email,
    name: name,
    password: hash,
    data_creation: new Date().toLocaleString(),
  })
  .then(user => res.json(user[0]))
  .catch(err => res.status(400).json('impossibile to register:', err))

})


/////////////////////////////////////
//Session Post: create a new sessin record (only during registration) --> return session
app.post('/session-post', (req,res) =>{

  //retrive user input from fornt end
  const { email, img_search, entries, sessions } = req.body;

  // create a new login record for new user 
  db('login')
  .returning('*')
  .insert({
    email: email,
    last_login: new Date(),
    img_search: img_search,
    entries: entries,
    sessions: sessions
  })
  .then(session => 
    {
      return res.json(session[0])
    }
  )
  .catch(err => res.status(400).json('impossibile to register:', err))

})


/////////////////////////////////////////// 
// session load: load session after login -> send back session information to front-end
app.put('/session-load', (req, res) =>{

  //retrive user input from fornt end
  const { email } = req.body;

  // check db if user exist -> return user
  db.select('*')
    .from('login')
    .where({ email })
    .increment('sessions', 1)
    .returning('*')
    .then( session => {
      if(session.length > 0){ 
        res.json(session[0])}
      else{ res.json({}) }
    })
    .catch(err => res.status(400).json('ERROR: server /session-load no user match'))
})


//////////////////////////////////// 
//session update: update login DB after img detection (search click)
app.put('/session-update', (req, res) => {
  const { email, last_login, img_search, entries } = req.body;
  
  db('login')
  .where({ email })
  .update({
    img_search: img_search,
    last_login: last_login,
    entries: entries
  })
  .returning('*')
  .then(session => res.json(session[0])) // we don't really need it, we can use state in front end
  .catch(err => res.status(400).json('ERROR: session-update /server'))  

  });

