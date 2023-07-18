import React, { Component } from 'react';
import Menu from './components/Menu/Menu.js';
import Main from './components/Main/Main.js';
import Footer from './components/Footer/Footer.js';
import Background from './components/Background/Background.js'

// css
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

class App extends Component{
	render(){
		return(
			<div className='app-container'>
				<Menu />
				<Background />
				<Main />
				<Footer />
			</div>
		)
	}
}

export default App