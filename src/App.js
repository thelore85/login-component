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
    console.log("box coordinates:", coordinates)

    const coordinates = predictionObj.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('input-image');
    const width = Number(image.width);
    const height = Number(image.height);

    console.log('width:', image.width)
    console.log('input height:', image.height)

    return { //return 'box' for 'faceDEtection' function;

      // left: coordinates.left_col * (width),
      // right: width - (coordinates.right_col * width),
      // top: (coordinates.top_row * height),
      // bottom: height - (coordinates.bottom_row * height),
      
    //fix top-left corner of the square  
      left: coordinates.left_col * width,
      right: coordinates.right_col * width,
      top: coordinates.top_row * height,
      bottom: coordinates.bottom_row * height,
      
      // in %, full width - left+right  = [100% - (20%+20%)] = 60%
      width: 100 - (left+right), 
      
      // in %, full height - top+bottom  = [100% - (40%+40%)] = 20%
      height: 100 - (top+bottom),

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