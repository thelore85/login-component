import React, { Component } from 'react';
import Menu from './components/Menu/Menu.js';
import Main from './components/Main/Main.js';
import Footer from './components/Footer/Footer.js';
import Background from './components/Background/Background.js'
// import Clarifai from 'clarifai';

// css
import './App.css';


// //API clraify: configuration
// const app = new Clarifai.App({
// 	apiKey: '87a0584c90e64c87869205181c5b18a7',
// });



///////////////////////////////////////////////////////////////////////////////////////////////////
// CLRAIFAI API NEW 
const PAT = '87a0584c90e64c87869205181c5b18a7';
const USER_ID = 'thelore_85';       
const APP_ID = 'biometrics';
const MODEL_ID = 'face-detection';
const IMAGE_URL = 'https://www.goodnet.org/photos/281x197/41740_hd.jpg';
	
const raw = JSON.stringify({
  "user_app_id": {
    "user_id": USER_ID,
    "app_id": APP_ID
  },
  "inputs": [{ "data": { "image": {"url": IMAGE_URL}}}]
});

const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
};
    
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////    
class App extends Component{
onSearchClick = () => {
  console.log('click')
  
  fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
  .then(response => {return response.text()})
  .then(result => console.log('result:', result))
  .catch(error => console.log('error', error)); // returning the prediction and the sqaure details
}

onInputChange = (event) => {
	console.log('input change:', event.target.value);
}

	render(){
		return(
			<div className='app-container'>
				<Menu />
				<Background />
				<Main onSearchClick={this.onSearchClick} onInputChange={this.onInputChange}/>
				<Footer />
			</div>
		)
	}
}

export default App