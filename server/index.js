//////////////////////////////////////////////
//////////////////////////////////////////////
/////// ------ NODE.JS SERVER ------- ////////
//////////////////////////////////////////////
//////////////////////////////////////////////

// HOW TO START THE SERVER
// -- open the server folder
// -- npm install
// -- npm start 
// -- check the console with the message !!!







//==============================================

//////////////////////////////////////
// SERVER SETTING

//set-up the server for deploy
const express = require('express'); // server framework
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');  // db framework
const nodemailer = require("nodemailer"); // Email provider

// activate plug-ins
const app = express();
app.use(bodyParser.json());

// CORS - domain white list
app.use(cors());


// server launch
const port = process.env.PORT || 9000;
app.listen(port, ()=>{ console.log('app is running on: ', port) })







//==============================================

//////////////////////////////////////
// MAIL  SERVER SET-UP

// Configura il middleware per il parsing del corpo della richiesta
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configura il trasportatore SMTP per l'invio dell'email
const transporter = nodemailer.createTransport({
  service: "Gmail", // Puoi utilizzare il servizio email di tua scelta
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user:process.env.EMAIL_USER, // || for local host use string "sra...@gmail.com"
    pass: process.env.EMAIL_PSW  // || for local host use string "d..."
  },
});







//==============================================

///////////////////////////////
// DATABASE CONNECTION 

// set environmental variables || local server
const dbHost = process.env.DB_HOST || 'localhost';
const dbName = process.env.DB_DATABASE || 'vercerlDb_local'; // remeber to set local name DB
const dbPort = process.env.DB_PORT || '5432';
const dbUser = process.env.DB_USER; // || for local host use string "postgres"
const dbPassword = process.env.DB_PASSWORD; // || for local host use string "d..."
const dbConnection = process.env.DB_URL || '';
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


/////////////////////////////////
//main root: check user data --> return user to front end
app.get('/', (req, res) =>{
  res.status(200).json(`SERVER START: up and running - live port: ${port};`)
})














////////////////////////////////////////////////////
// -------- COMPONENT-LOGIN -----------------------
///////////////////////////////////////////////////

/////////////////////////////////  - RUNNING
//signin: check user data --> return user to front end
app.post('/component-login/signin', (req, res) => {
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

/////////////////////////////////  - RUNNING
//register: add a user record -> return new user object
app.post('/component-login/register', (req,res) => {
  
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
  .catch(err => res.status(400).json({ message: 'ERROR: /register - impossibile to register', error: err }))

})

/////////////////////////////////////  - RUNNING
//Session Post: create a new sessin record (only during registration) --> return session
app.post('/component-login/session-post', (req,res) =>{

  //retrive user input from fornt end
  const { email, img_search, entries, sessions } = req.body;

  // create a new login record for new user 
  db('sessions')
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
  .catch(err => res.status(400).json({ message: 'ERROR: session-post', error: err }))

})

/////////////////////////////////////////// - RUNNING
// session load: load session after login -> send back session information to front-end
app.put('/component-login/session-load', (req, res) =>{

  //retrive user input from fornt end
  const { email } = req.body;

  // check db if user exist -> return user
  db.select('*')
    .from('sessions')
    .where({ email })
    .increment('sessions', 1)
    .returning('*')
    .then( session => {
      if(session.length > 0){ 
        res.json(session[0])}
      else{ res.json({}) }
    })
    .catch(err => res.status(400).json({ message: 'ERROR: session-load', error: err }))
})

//////////////////////////////////// - RUNNING
//session update: update login DB after img detection (search click)
app.put('/component-login/session-update', (req, res) => {
  const { email, last_login, img_search, entries } = req.body;
  
  db('sessions')
  .where({ email })
  .update({
    img_search: img_search,
    last_login: last_login,
    entries: entries
  })
  .returning('*')
  .then(session => res.json(session[0])) // we don't really need it, we can use state in front end
  .catch(err => res.status(400).json({ message: 'ERROR: session-update', error: err }))  

  });













// ------------------------------------------------

//////////////////////////////////////////////////////
// ----------- MARRIAGE PROJECT --------------------
//
// - Set the App with '/project-marriage-ste' url rout
///////////////////////////////////////////////////////

////////////////////////////////////////////////////////
// just a chec of the server
app.get('/project-marriage-ste/', (req, res) => {
  res.status(200).json(`server is up and running - live port: ${port};`)
});


///////////////////////////////////
//// MESSAGES - push the message to db and retrive the obj

app.post( '/project-marriage-ste/push-message', (req, res) => {

  // destructurin body
  const { testo, data, user_type } = req.body;
  
  console.log(testo, data, user_type)

  db('pj_marriage_mex')
    .returning('*')
    .insert({
      testo: testo,
      data: data,
      user_type: user_type
    })
    .then( response => res.json(response))
    .catch(err => res.status(400).json({ message: 'ERROR DB-CALL: /pushmessage ', error: err } ))  

});

///////////////////////////////////////////////////////////
//// send database 

// Aggiungi questa rotta GET al tuo server Express
app.get('/project-marriage-ste/get-messages', (req, res) => {

  db.select('*')
    .from('pj_marriage_mex')
    .then(data => {
      // Invia i dati come risposta JSON
      res.json(data);
    })
    .catch(err => {
      // Gestisci gli errori in caso di problemi nella query
      console.error('Errore nella richiesta GET:', err);
      res.status(500).json({ message: 'Errore nella richiesta GET' });
    });
});



////////////////////////////////////////////
//// CONTACT FORM - verification and send-out

app.post("/project-marriage-ste/send-email", async (req, res) => {
  const { name, email, guest, phone, note } = req.body;

  // Verifica che tutti i campi siano presenti e non vuoti o undefined 
  if (
    name.length >= 3 && 
    email.includes('@') && email.length >= 5 && 
    typeof phone === 'number') {  
      
    //if ok, send the email
    const mailOptions = {
      from: { name: `${name}`, address: email},
      to: ["ramona.stefano.sposi@gmail.com"],
      subject: `Conferma: ${guest + 1} partecipanti totali. Num: ${phone}`,
      text: `${name} parteciperà all'evento insieme a ${guest} ospiti (totale ${guest + 1}) Dati di contatto: ${email}, ${phone}; RICHIESTE SPECIALI: ${note}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent succesfully!");
      res.status(200).json({ message: "Email inviata con successo!" });
    } catch (error) {
      console.error("Errore: impossibile inviare l'email di conferma:", error);
      res.status(500).json({ error: "Errore: impossibile inviare l'email di conferma." });
    }

  // in case inputs value are not valid
  }else{ 
    console.error("Err: double check your input data pls");
    res.status(400).json({ error: "Ricontrolla i dati che hai inserito" });
  }
});










// ------------------------------------------------

//////////////////////////////////////////////////////
// ---------- PROMO CODE - NEW LEAD API --------------
//
// - CONNECT TO HUBSPOT API TO GENERATE THE LEAD 
///////////////////////////////////////////////////////



app.get('/project-promo-code/', (req, res) => {
  res.status(200).json(`server is up and running - live port: ${port};`)
});

/////////////////////////////////////////////
// SET HUBSPOT APP connection
const YOUR_TOKEN = process.env.HUBSPOT_TOKEN // || 'pat-eu1-a8e0e93a-5a87-458d-85e4-b9483366e03f';
const apiUrl = 'https://api.hubapi.com/crm/v3/objects/contacts';


////////////////////////////////////////
// PUSH DATA TO API

app.post("/project-promo-code/new-lead", async (req, res) => {
  const { firstname, email, promo_code } = req.body;

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${YOUR_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        email: email,
        firstname: firstname,
        promo_code: promo_code,
      },
    })
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('Errore nella risposta del server');
    }
    return response.json();
  })
  .then((data) => {
    console.log(data); // prind new lead info from HubS API
    res.status(200).json({message: 'Tks for submit your data, check your email for the code'});
  })
  .catch((error) => {
    
    console.error('Si è verificato un errore durante la richiesta API:', error);
    res.status(500).json({error: 'Si è verificato un errore durante la richiesta API'});
  });
});
