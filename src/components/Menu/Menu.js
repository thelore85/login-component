import React from 'react';
import './Menu.css';


const Menu = () => {

    return(
        <section id="menu">
            <div className="wrapper">
                <div className="logo">
                    <i className="fa-solid fa-robot"></i>
                    BIOMETRICS 
                </div>
                <div className="links">
                    <a>Menu</a>
                    <a>Log-in</a>   
                </div>
            </div>
        </section>
    )
}

export default Menu;

