import React from 'react';
import FaceRecognition from '../FaceRecognition/FaceRecognition.js';
import './Main.css';

const Main = ({ user, onSearchClick, onInputChange, url, box }) => {
	return(
		<section id="main">
				<h1>Face identification</h1>
				<div className="wrapper input-container">
					<h2>{`${user.name}, `} you serched for #5 images</h2>
					<input className="input" type="search" onChange={onInputChange}></input>
					<button type="button" className="btn btn-primary" onClick={onSearchClick}><i className="fas fa-search"></i></button>           
				</div>
        <FaceRecognition url={url} box={box}/>
		</section>
	)
}

export default Main;