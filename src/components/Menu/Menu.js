import React from 'react';
import Logo from '../Logo/Logo.js';
import './Menu.css';


const Menu = ({ onRouteChange, isSignIn }) => {
  if(isSignIn){//show menu after login
    return(
      <section id="menu">
        <div className="wrapper">
          <Logo />

          <div className="links">
            <a href='#'>Menu</a>
            <i class="fa-solid fa-user" onClick={() => onRouteChange('signin')}></i> 
          </div>

        </div>
      </section>
    )
  } else {// show this menu if not logged yet
    return(
      <section id="menu">
        <div className="wrapper">
          <Logo />

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

