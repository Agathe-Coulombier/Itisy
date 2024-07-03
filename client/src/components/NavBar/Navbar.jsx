import React, { useState } from 'react';
import logoTab from "../../Resources/logoTab.png";
import "./navbar.css";

const NavBar = (props) => {
    const [hambActive, setHambActive] = useState(false);

    // Toggle hamburger menu visibility
    const handleHamburgerClick = () => {
        setHambActive(!hambActive);
    };

    return (
        <nav id="navbar">
            <div className="items">
                {/* Left side of the navbar */}
                <div className="left subItems">
                    <img src={logoTab} alt="Chef hat logo" />
                    <h1 className="text">itisy</h1>
                </div>

                {/* Right side of the navbar */}
                <div className="right subItems">
                    {/* Navigation menu links */}
                    <ul className={`nav-menu ${hambActive ? 'active' : ''}`}>
                        <li><h2 
                            id="register" 
                            className="text register" 
                            onClick={() => {
                                props.toggleClick("register");
                                hambActive && handleHamburgerClick() ;
                                }}
                                >register</h2></li>
                        <li><h2 
                            id="login" 
                            className="text login"
                            onClick={() => {
                                props.toggleClick("login");
                                hambActive && handleHamburgerClick();
                                }}
                                >login</h2></li>
                        <li><h2 
                            id="contact" 
                            className="text contact"
                            onClick={() => {
                                props.toggleClick("contact");
                                hambActive && handleHamburgerClick();
                                }}
                                >contact</h2></li>
                    </ul>

                    {/* Hamburger menu icon */}
                    <div className="hamburger" onClick={handleHamburgerClick}>
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                </div>
            </div>

            {/* Horizontal line separator */}
            <hr />
        </nav>
    );
}

export default NavBar;
