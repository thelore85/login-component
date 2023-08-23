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
const serverIP = process.env.VERCEL_IP || 'no variable';

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
  res.status(200).json(`server is up and running - port: ${port};`)
})


///////////////////////////////////////////////////////
// SIGNIN ROUTE
app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.select('*')
      .from('users')
      .where({ email })
      .first();

    if (user && bcrypt.compareSync(password, user.password)) {
      res.json(user);
    } else {
      res.json({});
    }
  } catch (error) {
    res.status(400).json({ message: 'ERROR: server /signin', error: error.message });
  }
});