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


// server launch
const port = process.env.PORT || 9000;
app.listen(port, ()=>{ console.log('app is running on: ', port) })


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

// Log the environmental variables
console.log('DB_HOST:', dbHost);
console.log('DB_PORT:', dbPort);
console.log('DB_NAME:', dbName);
console.log('DB_USER:', dbUser);
console.log('DB_PASSWORD:', dbPassword);
console.log('DB_CONNECTION:', dbConnection);
console.log('DB_SSL:', dbSSL);

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



//////////////////////////////////////////////////////
//////// ---------   END POINTS  --------------------
//////////////////////////////////////////////////////


/////////////////////////////////
//signin: check user data --> return user to front end


app.get('/', (req, res) =>{
  // res.status(200).json(`server is up and running - live port: ${port};`)
  
  db.select('*')
  .from('users')
  .then(records => res.status(200).json(records))

})

/////////////////////////////////
//signin: check user data --> return user to front end
app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  // var hash = bcrypt.hashSync(password);
  // .andWhere( bcrypt.compareSync( password , hash))

  db.select('*')
    .from('users')
    .where({ email })
    .then(user => {
      if (user.length > 0) {
        res.json(user[0]); // Restituisci il primo utente trovato
      } else {
        res.json({}); // res empty obj: to preserve front-end error (if undefined the fetch in signin compo. run error)
      }
    })
    .catch(err => res.status(400).json('ERROR: server /signin'));
});
