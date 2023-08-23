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
const cors = require('cors');

// activate plug-ins
const app = express();
app.use(bodyParser.json());
app.use(cors());


// server launch
const port = 9000;
app.listen(port, ()=>{ console.log('app is running on: ', port) })



//////////////////////////////////////////////////////
//////// ---------   END POINTS  --------------------
//////////////////////////////////////////////////////


/////////////////////////////////
//signin: check user data --> return user to front end
app.get('/signin', (req, res) => {

  res.status(200).json('server responding on /register')

});
