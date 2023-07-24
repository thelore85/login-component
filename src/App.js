import React, { Component } from 'react';
import Menu from './components/Menu/Menu.js';
import Main from './components/Main/Main.js';
import Footer from './components/Footer/Footer.js';
import Background from './components/Background/Background.js'

// css
import './App.css';

//global variables


// CLRAIFAI API NEW 
const PAT = '87a0584c90e64c87869205181c5b18a7';
const USER_ID = 'thelore_85';       
const APP_ID = 'biometrics';
const MODEL_ID = 'face-detection';
let IMAGE_URL = '';
 
class App extends Component{
  constructor(){
    super();
    this.state = {
      url: '',
      boxCoordinates: {},
    }
  }

  onSearchClick = () => {
    // CLRAIFAI API NEW 
    IMAGE_URL = this.state.url;

    const raw = JSON.stringify({
      "user_app_id": { "user_id": USER_ID, "app_id": APP_ID},
      "inputs": [{ "data": { "image": {"url": IMAGE_URL}}}]
    });

    const requestOptions = {  
      method: 'POST', 
      headers: { 'Accept': 'application/json','Authorization': 'Key ' + PAT },
      body: raw
    };

     fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
      .then(response => {return response.text()})
      .then(result => this.faceDetection((this.calculateFaceBox(JSON.parse(result)))))
      .catch(error => console.log('error', error)); // returning the prediction and the sqaure details
   
  }

  faceDetection = (box) => {
    console.log('faceDetStyle:', box)

    this.setState({
      boxCoordinates: box,
    })
  }

  calculateFaceBox = (predictionObj) => {

    const coordinates = predictionObj.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('input-image');
    const width = Number(image.width);
    const height = Number(image.height);
    const left = coordinates.left_col * width;
    const right = coordinates.right_col * width;
    const top = coordinates.top_row * height;
    const bottom = coordinates.bottom_row * height;
    const boxWidth = (right-left); 
    const boxHeight = (bottom-top);


    console.log('image width:', image.width);
    console.log('image height:', image.height);
    console.log('box width:', boxWidth);
    console.log('box height:', boxHeight);
  

    return { //return 'box' for 'faceDEtection' function;

      left: coordinates.left_col * (width),
      right: width - (coordinates.right_col * width),
      top: (coordinates.top_row * height),
      bottom: height - (coordinates.bottom_row * height),
      
    //pass face coordinates
      // left: coordinates.left_col * width,
      // right: coordinates.right_col * width,
      // top: coordinates.top_row * height,
      // bottom: coordinates.bottom_row * height,
      
      // calculate box dimention
      width: right-left,       // in %, right-left  = (60%-30%) = 30% 
      height: bottom-top,      // in %, bottom-top  = (80%-60%) = 20%

    }
  }

  onInputChange = (event) => {
    this.setState({
      url: event.target.value,
    })
  }

	render(){
		return(
			<div className='app-container'>
				<Menu />
				<Background />
				<Main onSearchClick={this.onSearchClick} onInputChange={this.onInputChange} url={this.state.url} box={this.state.boxCoordinates}/>
				<Footer />
			</div>
		)
	}
}

export default App