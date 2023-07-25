import React from 'react';
import './Menu.css';


const Menu = ({ onRouteChange, isSignIn }) => {
  if(isSignIn){//show menu after login
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
  } else {// show this menu if not logged yet
    return(
      <section id="menu">
      <div className="wrapper">

        <div className="logo">
          <i className="fa-solid fa-robot"></i>
          BIOMETRICS 
        </div>

        <div className="links">
          <a href='#' onClick={() => onRouteChange('signin')} >Log-in</a>
          <a href='#' onClick={() => onRouteChange('register')} >Register</a>
        </div>
      </div>
    </section>
    )
  }
    
    




}

export default Menu;

