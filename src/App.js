import React, { Component } from 'react';
import Menu from './components/Menu/Menu.js';
import Main from './components/Main/Main.js';
import Footer from './components/Footer/Footer.js';
import Background from './components/Background/Background.js'

// css
import './App.css';

let searchInput = '';
let searchUrl = '';

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
  constructor(){
    super();
    this.state = {
      url: '',
    }
  }

  onSearchClick = () => {
    console.log('click')
    // searchUrl = searchInput;

    this.setState({
      url: searchInput,
    })

    // fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
    // .then(response => {return response.text()})
    // .then(result => console.log('result:', result))
    // .catch(error => console.log('error', error)); // returning the prediction and the sqaure details
  
    
  }

  onInputChange = (event) => {
    searchInput = event.target.value;
    console.log('input change:', searchInput);
  }

	render(){
		return(
			<div className='app-container'>
				<Menu />
				<Background />
				<Main onSearchClick={this.onSearchClick} onInputChange={this.onInputChange} url={this.state.url}/>
				<Footer />
			</div>
		)
	}
}

export default App