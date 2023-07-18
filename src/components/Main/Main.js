import React from 'react';
import './Main.css';

const Main = () => {
	return(
		<section id="main">
				<h1>Face identification</h1>
				<div className="wrapper">
					<h2>Faces detecred on image: #5</h2>
					<input className="input" type="search"></input>
					<button type="button" className="btn btn-primary"><i className="fas fa-search"></i></button>           
				</div>
		</section>
	)
}

export default Main;