import React, { Component } from 'react';
import Menu from './components/Menu/Menu.js';
import Main from './components/Main/Main.js';
import Footer from './components/Footer/Footer.js';
import Background from './components/Background/Background.js'
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js';


// css
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

// CLRAIFAI API NEW 
const PAT = '87a0584c90e64c87869205181c5b18a7';
const USER_ID = 'thelore_85';       
const APP_ID = 'biometrics';
const MODEL_ID = 'face-detection';
let IMAGE_URL = '';
 

///////////////////////////////////////////////
// start component////////////////////////////

class App extends Component{
  constructor(){
    super();
    this.state = {
      url: '',
      boxCoordinates: {},
      route: 'signin',
      isSignIn: false,
    }
  }

  onSearchClick = () => {
   
    // set api variables
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

    //run api prediction
     fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
      .then(response => {return response.text()})
      .then(result => this.faceDetection((this.calculateFaceBox(JSON.parse(result)))))
      .catch(error => console.log('error', error)); // returning the prediction and the sqaure details
  }

  // set state with face box coordinates
  faceDetection = (box) => { 
    this.setState({
      boxCoordinates: box,
    })
  }

  // calculate face box coordinates
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
  
    //return 'box' for 'faceDEtection' function;
    return { 
      left: coordinates.left_col * (width),
      right: width - (coordinates.right_col * width),
      top: (coordinates.top_row * height),
      bottom: height - (coordinates.bottom_row * height),
      
      // calculate box dimention
      width: right-left,       // in %, right-left  = (60%-30%) = 30% 
      height: bottom-top,      // in %, bottom-top  = (80%-60%) = 20%
    }
  }

  onInputChange = (event) => {
    this.setState({
      url: event.target.value,
    })
  };

  onRouteChange = (route) => {
    if(route === 'signin' || route === 'register'){
      this.setState({
        isSignIn: false // do not show log out
      })
    }else{
      this.setState({
        isSignIn: true // show log out
      })
    }

    this.setState({ route: route})
  }

  // RENDER THE COMPONENT
	render(){
		return(
			<div className='app-container'>
				<Menu onRouteChange={this.onRouteChange} isSignIn={this.state.isSignIn} />
				<Background />
        { this.state.route === 'home'
          ? <Main onSearchClick={this.onSearchClick} onInputChange={this.onInputChange} url={this.state.url} box={this.state.boxCoordinates}/>
          : (
            this.state.route === 'signin'
            ?<Signin onRouteChange={this.onRouteChange}/>
            :<Register onRouteChange={this.onRouteChange} />
          )
        }
				  <Footer />
			</div>
		)
	}
}

export default App