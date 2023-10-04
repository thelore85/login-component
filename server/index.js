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
    user:process.env.EMAIL_USER, // || "sra...@gmail.com",
    pass: process.env.EMAIL_PSW // || "hugr ...",
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
//// MESSAGES CHAT

// get chat messages from DB
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
    }
    catch (error) {
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
const YOUR_TOKEN = process.env.HUBSPOT_TOKEN // || 'pat-eu1...';
const apiUrl = 'https://api.hubapi.com/crm/v3/objects/contacts';



////////////////////////////////////////
// PUSH DATA TO API

app.post("/project-promo-code/new-lead", async (req, res) => {
  try {
    const { firstname, email, promo_code, company } = req.body;

    const response = await fetch(apiUrl, {
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
          company: company
        },
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data); // Stampa le informazioni sul nuovo lead da HubS API
      res.status(200).json({ message: 'Grazie per aver inviato i tuoi dati, controlla la tua email per il codice' });
    } else {
      throw new Error('Errore nella risposta del server');
    }
  } catch (error) {
    console.error('Errore API:', error);
    res.status(500).json({ error: 'Errore del server: Si è verificato un errore durante la richiesta API' });
  }
});


///////////////////////////////
// EMAIL - Coupon code

app.post( '/project-promo-code/email-code', async (req, res) => {

    const { firstname, email, promo_code, company } = req.body;
    const htmlBody = `<!DOCTYPE html> <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en"> <head> <title></title> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css"> <link href="https://fonts.googleapis.com/css?family=Lora" rel="stylesheet" type="text/css"> <style>*{box-sizing: border-box;}body{margin: 0; padding: 0;}a[x-apple-data-detectors]{color: inherit !important; text-decoration: inherit !important;}#MessageViewBody a{color: inherit; text-decoration: none;}p{line-height: inherit}.desktop_hide, .desktop_hide table{mso-hide: all; display: none; max-height: 0px; overflow: hidden;}.image_block img+div{display: none;}@media (max-width:620px){.desktop_hide table.icons-inner{display: inline-block !important;}.icons-inner{text-align: center;}.icons-inner td{margin: 0 auto;}.mobile_hide{display: none;}.row-content{width: 100% !important;}.stack .column{width: 100%; display: block;}.mobile_hide{min-height: 0; max-height: 0; max-width: 0; overflow: hidden; font-size: 0px;}.desktop_hide, .desktop_hide table{display: table !important; max-height: none !important;}}</style> </head> <body style="background-color: #fff; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;"> <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff;"> <tbody> <tr> <td> <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f7f6f5;"> <tbody> <tr> <td> <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #072b52; color: #000; width: 600px; margin: 0 auto;" width="600"> <tbody> <tr> <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"> <table class="heading_block block-1" width="100%" border="0" cellpadding="25" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tr> <td class="pad"> <h3 style="margin: 0; color: #ffffff; direction: ltr; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 24px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">${company}</span></h3> </td></tr></table> </td></tr></tbody> </table> </td></tr></tbody> </table> <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f7f6f5;"> <tbody> <tr> <td> <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000; width: 600px; margin: 0 auto;" width="600"> <tbody> <tr> <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"> <div class="spacer_block block-1" style="height:35px;line-height:35px;font-size:1px;">&#8202;</div><table class="heading_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tr> <td class="pad" style="text-align:center;width:100%;"> <h1 style="margin: 0; color: #072b52; direction: ltr; font-family: 'Lora', Georgia, serif; font-size: 40px; font-weight: 700; letter-spacing: 1px; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"><strong>Ecco il tuo sconto</strong></h1> </td></tr></table> </td></tr></tbody> </table> </td></tr></tbody> </table> <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f7f6f5;"> <tbody> <tr> <td> <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000; width: 600px; margin: 0 auto;" width="600"> <tbody> <tr> <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"> <div class="spacer_block block-1" style="height:30px;line-height:30px;font-size:1px;">&#8202;</div><table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"> <tr> <td class="pad" style="padding-bottom:10px;padding-left:15px;padding-right:15px;padding-top:10px;"> <div style="color:#222222;font-family:'Lato',Tahoma,Verdana,Segoe,sans-serif;font-size:15px;line-height:150%;text-align:center;mso-line-height-alt:22.5px;"> <p style="margin: 0; word-break: break-word;"><span><strong>Hey ${firstname},</strong></span></p><p style="margin: 0; word-break: break-word;">Grazie per aver sottoscritto la promo!</p><p style="margin: 0; word-break: break-word;">Qui sotto puoi trovare il codice sconto da applicare direttamente in cassa.</p></div></td></tr></table> <table class="divider_block block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tr> <td class="pad"> <div class="alignment" align="center"> <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tr> <td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #dddddd;"><span>&#8202;</span></td></tr></table> </div></td></tr></table> </td></tr></tbody> </table> </td></tr></tbody> </table> <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f7f6f5;"> <tbody> <tr> <td> <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000; width: 600px; margin: 0 auto;" width="600"> <tbody> <tr> <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"> <div class="spacer_block block-1" style="height:25px;line-height:25px;font-size:1px;">&#8202;</div><table class="paragraph_block block-2" width="100%" border="0" cellpadding="5" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"> <tr> <td class="pad"> <div style="color:#a9a9a9;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:12px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:14.399999999999999px;"> <p style="margin: 0;">codice sconto</p></div></td></tr></table> <table class="heading_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"> <tr> <td class="pad" style="text-align:center;width:100%;"> <h1 style="margin: 0; color: #2e387c; direction: ltr; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 38px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"><strong>${promo_code}</strong></h1> </td></tr></table> <div class="spacer_block block-4" style="height:30px;line-height:30px;font-size:1px;">&#8202;</div></td></tr></tbody> </table> </td></tr></tbody> </table> <table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f7f6f5;"> <tbody> <tr> <td> <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #072b52; color: #000; width: 600px; margin: 0 auto;" width="600"> <tbody> <tr> <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"> <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"> <tr> <td class="pad" style="padding-left:10px;padding-right:10px;padding-top:10px;"> <div style="color:#f7f6f5;font-family:'Lato',Tahoma,Verdana,Segoe,sans-serif;font-size:12px;line-height:120%;text-align:left;mso-line-height-alt:14.399999999999999px;"> <p style="margin: 0; word-break: break-word;">&nbsp;</p></div></td></tr></table> <table class="paragraph_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"> <tr> <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;"> <div style="color:#f7f6f5;font-family:'Lato',Tahoma,Verdana,Segoe,sans-serif;font-size:12px;line-height:120%;text-align:center;mso-line-height-alt:14.399999999999999px;"> <p style="margin: 0; word-break: break-word;"><a title="http://www.example.com/" href="http://www.example.com/" target="_blank" style="text-decoration: underline; color: #f7f6f5;" rel="noopener">Terms & Conditions</a></p><p style="margin: 0; word-break: break-word;">Integer eget nibh vel massa gravida ullamcorper. Sed a viverra ante. Nullam posuere pellentesque lectus, nec vehicula felis rutrum ac. Maecenas porta facilisis turpis, eget imperdiet purus.</p><p style="margin: 0; word-break: break-word;"><span style="color: #c0c0c0;"><br><br></span></p><p style="margin: 0; word-break: break-word;">© Copyright 2021. YourBrand All Rights Reserved.</p><p style="margin: 0; word-break: break-word;"><span style="color: #c0c0c0;">&nbsp;</span></p></div></td></tr></table> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></tbody> </table> </body> </html>`

    // text: `${firstname}, ora puoi mostrare il tuo codie sconto direttamente in cassa! ${promo_code}. Grazie per aver sottosctitto la promo, ${company}`,

    const mailOptions = {
      from: { name: 'Codie Sconto', address: email},
      to: [email],
      subject: `${firstname}, ecco il tuo codice sconto!`,
      html: htmlBody,
    };


    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent succesfully!");
      res.status(200).json({ message: "Email inviata con successo!" });
    }
    catch (error) {
      console.error("Errore: impossibile inviare l'email di conferma:", error);
      res.status(500).json({ error: "Errore: impossibile inviare l'email di conferma." });
    }


}

)