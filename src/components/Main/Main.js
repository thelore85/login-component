import React from 'react';
import './Main.css';

const Main = ({ onSearchClick, onInputChange }) => {
	return(
		<section id="main">
				<h1>Face identification</h1>
				<div className="wrapper">
					<h2>Faces detecred on image: #5</h2>
					<input className="input" type="search" onChange={onInputChange}></input>
					<button type="button" className="btn btn-primary" onClick={onSearchClick}><i className="fas fa-search"></i></button>           
				</div>
		</section>
	)
}

export default Main;