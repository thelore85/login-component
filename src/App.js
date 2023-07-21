import React, { Component } from 'react';
import Menu from './components/Menu/Menu.js';
import Main from './components/Main/Main.js';
import Footer from './components/Footer/Footer.js';
import Background from './components/Background/Background.js'
import Clarifai from 'clarifai';

// css
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';


// //API clraify: configuration
const app = new Clarifai.App({
	apiKey: '87a0584c90e64c87869205181c5b18a7',
});

class App extends Component{

onSearchClick = () => {
	console.log('click', app)
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