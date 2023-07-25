import React from 'react';
import './Menu.css';


const Menu = ({ onRouteChange, isSignIn }) => {
  if(isSignIn === 'true'){
    return(
      <section id="menu">
      <div className="wrapper">
        <div className="logo">
          <i className="fa-solid fa-robot"></i>
          BIOMETRICS 
        </div>
        <div className="links">
          <a href='#'>Menu</a>
          <a href='#' onClick={() => onRouteChange('signin')}>Log-out</a>   
        </div>
      </div>
    </section>
    )
  } else {
    return(
      <section id="menu">
      <div className="wrapper">
        <div className="logo">
          <i className="fa-solid fa-robot"></i>
          BIOMETRICS 
        </div>
        <div className="links">
          <a href='#'>Menu</a>
        </div>
      </div>
    </section>
    )
  }
    
    




}

export default Menu;

